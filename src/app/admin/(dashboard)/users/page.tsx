"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers, updateUserRole, approveUser, rejectUser, logActivity } from '@/lib/auth/userService';
import { UserProfile, UserRole, getRoleLabel, UserStatus } from '@/lib/auth/roles';
import styles from '../../admin.module.css';
import { Loader2, Users, Shield, X, Check, XCircle, Clock } from 'lucide-react';

export default function AdminUsersPage() {
    const { profile, hasPermission, signUp } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        role: 'viewer' as UserRole,
    });

    useEffect(() => {
        if (hasPermission('canManageUsers')) {
            loadUsers();
        } else {
            setLoading(false);
        }
    }, [hasPermission]);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            // Sort: pending first, then by created date
            data.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return b.createdAt - a.createdAt;
            });
            setUsers(data);
        } catch (e) {
            console.error('Failed to load users', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (user: UserProfile) => {
        try {
            await approveUser(user.uid, profile?.uid || '');
            await logActivity({
                userId: profile?.uid || '',
                userEmail: profile?.email || '',
                action: 'update',
                resourceType: 'user',
                resourceId: user.uid,
                resourceName: user.displayName,
                metadata: { action: 'approved' },
            });
            await loadUsers();
        } catch (e) {
            console.error('Failed to approve user', e);
        }
    };

    const handleReject = async (user: UserProfile) => {
        try {
            await rejectUser(user.uid);
            await logActivity({
                userId: profile?.uid || '',
                userEmail: profile?.email || '',
                action: 'update',
                resourceType: 'user',
                resourceId: user.uid,
                resourceName: user.displayName,
                metadata: { action: 'rejected' },
            });
            await loadUsers();
        } catch (e) {
            console.error('Failed to reject user', e);
        }
    };

    const handleRoleChange = async (uid: string, newRole: UserRole) => {
        try {
            await updateUserRole(uid, newRole);

            const targetUser = users.find(u => u.uid === uid);
            await logActivity({
                userId: profile?.uid || '',
                userEmail: profile?.email || '',
                action: 'update',
                resourceType: 'user',
                resourceId: uid,
                resourceName: targetUser?.displayName,
                metadata: { newRole },
            });

            await loadUsers();
        } catch (e) {
            console.error('Failed to update role', e);
        }
    };

    const handleCreateUser = async () => {
        setSaving(true);
        setError('');
        try {
            await signUp(formData.email, formData.password, formData.displayName, formData.role);
            await loadUsers();
            setDialogOpen(false);
            setFormData({ email: '', password: '', displayName: '', role: 'viewer' });
        } catch (e: any) {
            setError(e.message || 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    const getStatusBadge = (status: UserStatus) => {
        switch (status) {
            case 'pending':
                return <span className={`${styles.statusPill} ${styles.statusPillWarning}`}><Clock size={12} style={{ marginRight: '4px' }} />Pending</span>;
            case 'approved':
                return <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>Approved</span>;
            case 'rejected':
                return <span className={`${styles.statusPill} ${styles.statusPillDanger}`}>Rejected</span>;
            default:
                return <span className={styles.statusPill}>{status}</span>;
        }
    };

    const pendingUsers = users.filter(u => u.status === 'pending');

    if (!hasPermission('canManageUsers')) {
        return (
            <div className={styles.reveal}>
                <header className={styles.headerSection}>
                    <span className={styles.sectionTitle}>Access Denied</span>
                    <h1 className={styles.pageTitle}>User Management</h1>
                </header>
                <div className={styles.panel} style={{ textAlign: 'center', padding: '48px' }}>
                    <Shield size={48} style={{ color: '#333', marginBottom: '16px' }} />
                    <p style={{ color: '#666' }}>You don&apos;t have permission to manage users.</p>
                </div>
            </div>
        );
    }

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
                    <span className={styles.sectionTitle}>Team Management</span>
                    <h1 className={styles.pageTitle}>Users & Roles</h1>
                </div>
                <button onClick={() => setDialogOpen(true)} className={styles.btnPrimary}>
                    <Users size={16} /> Add User
                </button>
            </header>

            {/* Pending Approvals */}
            {pendingUsers.length > 0 && (
                <div className={styles.panel} style={{ marginBottom: '24px', borderColor: '#ecc94b' }}>
                    <h3 style={{ color: '#ecc94b', fontSize: '14px', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} /> Pending Approvals ({pendingUsers.length})
                    </h3>
                    {pendingUsers.map((user) => (
                        <div key={user.uid} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: '1px solid #222'
                        }}>
                            <div>
                                <span style={{ color: '#fff' }}>{user.displayName}</span>
                                <span style={{ color: '#666', marginLeft: '8px', fontSize: '13px' }}>{user.email}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleApprove(user)}
                                    style={{
                                        background: '#48bb78',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '12px'
                                    }}
                                >
                                    <Check size={14} /> Approve
                                </button>
                                <button
                                    onClick={() => handleReject(user)}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid #e53e3e',
                                        color: '#e53e3e',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '12px'
                                    }}
                                >
                                    <XCircle size={14} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* All Users Table */}
            <div className={styles.panel}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(u => u.status !== 'pending').map((user) => (
                            <tr key={user.uid}>
                                <td style={{ color: '#fff' }}>{user.displayName}</td>
                                <td style={{ color: '#6b9fff' }}>{user.email}</td>
                                <td>{getStatusBadge(user.status)}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                                        disabled={user.uid === profile?.uid}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #333',
                                            color: '#fff',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            cursor: user.uid === profile?.uid ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        <option value="admin">Administrator</option>
                                        <option value="tech_manager">Technology Manager</option>
                                        <option value="writer">Content Writer</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                </td>
                                <td style={{ color: '#666', fontSize: '13px' }}>
                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {dialogOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', color: '#fff' }}>Add New User</h2>
                            <button onClick={() => setDialogOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Display Name</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input
                                type="email"
                                className={styles.formInput}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@bimotech.pl"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Password</label>
                            <input
                                type="password"
                                className={styles.formInput}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Role</label>
                            <select
                                className={styles.formInput}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            >
                                <option value="admin">Administrator</option>
                                <option value="tech_manager">Technology Manager</option>
                                <option value="writer">Content Writer</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>

                        {error && (
                            <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
                        )}

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button onClick={() => setDialogOpen(false)} className={styles.btnSecondary}>Cancel</button>
                            <button onClick={handleCreateUser} className={styles.btnPrimary} disabled={saving}>
                                {saving ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
