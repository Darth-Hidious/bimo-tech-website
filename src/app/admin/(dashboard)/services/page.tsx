"use client";

import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { ManufacturingService } from '@/lib/cms/types';
import styles from '../../admin.module.css';
import { uploadImage } from '@/lib/storageService';
import Image from 'next/image';
import { Loader2, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

export default function AdminServicesPage() {
    const [services, setServices] = useState<ManufacturingService[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ManufacturingService | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ManufacturingService | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        tagline: '',
        description: '',
        icon: '',
        features: '',
        materials: '',
        toleranceMin: '',
        maxPartSize: '',
        startingPrice: 0,
        minLeadTimeDays: 1,
        imageUrl: '',
        order: 0,
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await cms.getServices();
            setServices(data);
        } catch (e) {
            console.error('Failed to load services', e);
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({
            name: '', slug: '', tagline: '', description: '', icon: '',
            features: '', materials: '', toleranceMin: '', maxPartSize: '',
            startingPrice: 0, minLeadTimeDays: 1, imageUrl: '', order: services.length,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (item: ManufacturingService) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            slug: item.slug,
            tagline: item.tagline,
            description: item.description,
            icon: item.icon,
            features: item.features.join('\n'),
            materials: item.materials.join(', '),
            toleranceMin: item.toleranceMin,
            maxPartSize: item.maxPartSize,
            startingPrice: item.startingPrice,
            minLeadTimeDays: item.minLeadTimeDays,
            imageUrl: item.imageUrl || '',
            order: item.order,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (item: ManufacturingService) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const serviceData = {
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                tagline: formData.tagline,
                description: formData.description,
                icon: formData.icon,
                features: formData.features.split('\n').filter(f => f.trim()),
                materials: formData.materials.split(',').map(m => m.trim()).filter(m => m),
                toleranceMin: formData.toleranceMin,
                maxPartSize: formData.maxPartSize,
                startingPrice: formData.startingPrice,
                minLeadTimeDays: formData.minLeadTimeDays,
                imageUrl: formData.imageUrl,
                order: formData.order,
            };

            if (editingItem?.id) {
                await cms.updateService(editingItem.id, serviceData);
            } else {
                await cms.createService(serviceData);
            }
            await loadServices();
            setDialogOpen(false);
        } catch (e) {
            console.error('Failed to save service', e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete?.id) return;
        setSaving(true);
        try {
            await cms.deleteService(itemToDelete.id);
            await loadServices();
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (e) {
            console.error('Failed to delete service', e);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const path = `services/${Date.now()}_${file.name}`;
            const url = await uploadImage(file, path);
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Loader2 className="animate-spin" size={32} style={{ color: 'var(--bimo-text-disabled)' }} />
            </div>
        );
    }

    return (
        <div className={styles.reveal}>
            <header className={styles.headerSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <span className={styles.sectionTitle}>Service Management</span>
                    <h1 className={styles.pageTitle}>Manufacturing Services</h1>
                </div>
                <button onClick={openCreateDialog} className={styles.btnPrimary}>
                    <Plus size={16} /> Add Service
                </button>
            </header>

            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Image</th>
                            <th>Name</th>
                            <th>Tagline</th>
                            <th>Price From</th>
                            <th>Lead Time</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.imageUrl && (
                                        <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                                            <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </td>
                                <td style={{ color: 'var(--bimo-text-primary)' }}>{item.name}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.tagline}
                                </td>
                                <td><span className={styles.statusPill}>€{item.startingPrice}</span></td>
                                <td>{item.minLeadTimeDays} days</td>
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
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>
                                    No services. Add one to get started.
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflow: 'auto', padding: '24px'
                }}>
                    <div style={{ backgroundColor: 'var(--bimo-bg-secondary)', border: '1px solid var(--bimo-border)', padding: '32px', width: '100%', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', color: 'var(--bimo-text-primary)' }}>{editingItem ? 'Edit Service' : 'Add Service'}</h2>
                            <button onClick={() => setDialogOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Name</label>
                                <input type="text" className={styles.formInput} value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="CNC Machining" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>URL Slug</label>
                                <input type="text" className={styles.formInput} value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="cnc-machining" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Service Image</label>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {formData.imageUrl && (
                                    <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--bimo-border)' }}>
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <label className={styles.btnSecondary} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Tagline</label>
                            <input type="text" className={styles.formInput} value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="Short description" />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Description</label>
                            <textarea className={styles.formTextarea} value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Full service description..." />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Features (one per line)</label>
                            <textarea className={styles.formTextarea} value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="High precision&#10;Fast turnaround" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Starting Price (€)</label>
                                <input type="number" className={styles.formInput} value={formData.startingPrice}
                                    onChange={(e) => setFormData({ ...formData, startingPrice: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Min Lead Time (days)</label>
                                <input type="number" className={styles.formInput} value={formData.minLeadTimeDays}
                                    onChange={(e) => setFormData({ ...formData, minLeadTimeDays: parseInt(e.target.value) || 1 })} />
                            </div>
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
                    <div style={{ backgroundColor: 'var(--bimo-bg-secondary)', border: '1px solid var(--bimo-border)', padding: '32px', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '18px', color: 'var(--bimo-text-primary)', marginBottom: '16px' }}>Delete Service</h2>
                        <p style={{ color: 'var(--bimo-text-secondary)', marginBottom: '24px' }}>
                            Delete &ldquo;{itemToDelete?.name}&rdquo;? This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteDialogOpen(false)} className={styles.btnSecondary}>Cancel</button>
                            <button onClick={handleDelete} style={{
                                padding: '12px 24px', backgroundColor: '#dc2626', color: 'var(--bimo-text-primary)',
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
