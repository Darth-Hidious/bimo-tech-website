"use client";

import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { JobOpening } from '@/lib/cms/types';
import styles from '../../admin.module.css';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';

export default function AdminCareersPage() {
    const [careers, setCareers] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<JobOpening | null>(null);
    const [itemToDelete, setItemToDelete] = useState<JobOpening | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: '',
        description: '',
    });

    useEffect(() => {
        loadCareers();
    }, []);

    const loadCareers = async () => {
        try {
            const data = await cms.getCareers();
            setCareers(data);
        } catch (e) {
            console.error('Failed to load careers', e);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({ title: '', department: '', location: '', type: '', description: '' });
        setDialogOpen(true);
    };

    const openEditDialog = (item: JobOpening) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            department: item.department,
            location: item.location,
            type: item.type,
            description: item.description,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (item: JobOpening) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editingItem?.id) {
                await cms.updateCareer(editingItem.id, formData);
            } else {
                await cms.createCareer(formData);
            }
            await loadCareers();
            setDialogOpen(false);
        } catch (e) {
            console.error('Failed to save career', e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete?.id) return;
        setSaving(true);
        try {
            await cms.deleteCareer(itemToDelete.id);
            await loadCareers();
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (e) {
            console.error('Failed to delete career', e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Loader2 className="animate-spin" size={32} style={{ color: '#666' }} />
            </div>
        );
    }

    return (
        <div className={styles.reveal}>
            <header className={styles.headerSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <span className={styles.sectionTitle}>Content Management</span>
                    <h1 className={styles.pageTitle}>Career Openings</h1>
                </div>
                <button onClick={openCreateDialog} className={styles.btnPrimary}>
                    <Plus size={16} /> Add Position
                </button>
            </header>

            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Department</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {careers.map((item) => (
                            <tr key={item.id}>
                                <td style={{ color: '#fff' }}>{item.title}</td>
                                <td><span className={styles.statusPill}>{item.department}</span></td>
                                <td>{item.location}</td>
                                <td><span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>{item.type}</span></td>
                                <td>
                                    <button className={styles.btnIcon} onClick={() => openEditDialog(item)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} onClick={() => openDeleteDialog(item)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {careers.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>
                                    No positions. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {dialogOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', color: '#fff' }}>{editingItem ? 'Edit Position' : 'Add Position'}</h2>
                            <button onClick={() => setDialogOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Job Title</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Materials Engineer"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Department</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="R&D"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Type</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    placeholder="Full-time"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Location</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Wrocław, Poland"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Description</label>
                            <textarea
                                className={styles.formTextarea}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Job description..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button onClick={() => setDialogOpen(false)} className={styles.btnSecondary}>Cancel</button>
                            <button onClick={handleSave} className={styles.btnPrimary} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteDialogOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Delete Position</h2>
                        <p style={{ color: '#999', marginBottom: '24px' }}>
                            Delete &ldquo;{itemToDelete?.title}&rdquo;? This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteDialogOpen(false)} className={styles.btnSecondary}>Cancel</button>
                            <button onClick={handleDelete} style={{
                                padding: '12px 24px', backgroundColor: '#dc2626', color: '#fff',
                                border: 'none', fontSize: '13px', cursor: 'pointer'
                            }} disabled={saving}>
                                {saving ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
