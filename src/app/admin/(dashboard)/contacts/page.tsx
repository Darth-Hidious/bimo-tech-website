"use client";

import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { ContactSubmission } from '@/lib/cms/types';
import styles from '../../admin.module.css';
import { Loader2, Trash2, Eye, X } from 'lucide-react';

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ContactSubmission | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await cms.getContacts();
            setContacts(data);
        } catch (e) {
            console.error('Failed to load contacts', e);
        } finally {
            setLoading(false);
        }
    };

    const openViewDialog = (item: ContactSubmission) => {
        setSelectedItem(item);
        setViewDialogOpen(true);
    };

    const openDeleteDialog = (item: ContactSubmission) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete?.id) return;
        setSaving(true);
        try {
            await cms.deleteContact(itemToDelete.id);
            await loadContacts();
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (e) {
            console.error('Failed to delete contact', e);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
                    <span className={styles.sectionTitle}>Inquiries</span>
                    <h1 className={styles.pageTitle}>Contact Submissions</h1>
                </div>
                <span style={{ color: '#666', fontSize: '14px' }}>{contacts.length} messages</span>
            </header>

            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontFamily: 'var(--font-mono)', color: '#666' }}>
                                    {item.createdAt ? formatDate(item.createdAt) : '—'}
                                </td>
                                <td style={{ color: '#fff' }}>{item.name}</td>
                                <td style={{ color: '#6b9fff' }}>{item.email}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.message}
                                </td>
                                <td>
                                    <button className={styles.btnIcon} onClick={() => openViewDialog(item)}>
                                        <Eye size={16} />
                                    </button>
                                    <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} onClick={() => openDeleteDialog(item)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>
                                    No contact submissions yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewDialogOpen && selectedItem && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', color: '#fff' }}>Message Details</h2>
                            <button onClick={() => setViewDialogOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <span className={styles.formLabel}>From</span>
                            <p style={{ color: '#fff', marginBottom: '4px' }}>{selectedItem.name}</p>
                            <p style={{ color: '#6b9fff', fontSize: '14px' }}>{selectedItem.email}</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <span className={styles.formLabel}>Received</span>
                            <p style={{ color: '#999' }}>{selectedItem.createdAt ? formatDate(selectedItem.createdAt) : '—'}</p>
                        </div>

                        <div>
                            <span className={styles.formLabel}>Message</span>
                            <div style={{
                                backgroundColor: '#0a0a0a', border: '1px solid #222', padding: '16px',
                                color: '#ccc', whiteSpace: 'pre-wrap', marginTop: '8px', fontSize: '14px', lineHeight: 1.6
                            }}>
                                {selectedItem.message}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button onClick={() => setViewDialogOpen(false)} className={styles.btnSecondary}>Close</button>
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
                        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>Delete Message</h2>
                        <p style={{ color: '#999', marginBottom: '24px' }}>
                            Delete message from &ldquo;{itemToDelete?.name}&rdquo;? This cannot be undone.
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
