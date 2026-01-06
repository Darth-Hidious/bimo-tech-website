"use client";

import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { NewsItem } from '@/lib/cms/types';
import styles from '../../admin.module.css';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<NewsItem | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        category: '',
        featured: false,
    });

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await cms.getNews();
            setNews(data);
        } catch (e) {
            console.error('Failed to load news', e);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({ title: '', date: '', description: '', category: '', featured: false });
        setDialogOpen(true);
    };

    const openEditDialog = (item: NewsItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            date: item.date,
            description: item.description,
            category: item.category,
            featured: item.featured || false,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (item: NewsItem) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editingItem?.id) {
                await cms.updateNews(editingItem.id, formData);
            } else {
                await cms.createNews(formData);
            }
            await loadNews();
            setDialogOpen(false);
        } catch (e) {
            console.error('Failed to save news', e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete?.id) return;
        setSaving(true);
        try {
            await cms.deleteNews(itemToDelete.id);
            await loadNews();
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (e) {
            console.error('Failed to delete news', e);
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
                    <h1 className={styles.pageTitle}>News & Updates</h1>
                </div>
                <button onClick={openCreateDialog} className={styles.btnPrimary}>
                    <Plus size={16} /> Add News
                </button>
            </header>

            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontFamily: 'var(--font-mono)', color: '#666' }}>{item.date}</td>
                                <td style={{ color: '#fff' }}>{item.title}</td>
                                <td>
                                    <span className={styles.statusPill}>{item.category}</span>
                                </td>
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
                        {news.length === 0 && (
                            <tr>
                                <td colSpan={4} className={styles.emptyState}>
                                    No news items. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            {dialogOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', color: '#fff' }}>{editingItem ? 'Edit News' : 'Add News'}</h2>
                            <button onClick={() => setDialogOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Title</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="News title"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Date</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    placeholder="December 2024"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Category</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Award, Research..."
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Description</label>
                            <textarea
                                className={styles.formTextarea}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description..."
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
                        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Delete News</h2>
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
