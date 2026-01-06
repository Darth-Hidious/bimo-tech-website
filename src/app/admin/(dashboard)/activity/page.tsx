"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getActivityLogs } from '@/lib/auth/userService';
import { ActivityLogEntry } from '@/lib/auth/roles';
import styles from '../../admin.module.css';
import { Loader2, Activity, Shield, User, Package, Newspaper, Briefcase, Mail, Settings, LogIn, LogOut, Edit, Plus, Trash } from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
    login: LogIn,
    logout: LogOut,
    create: Plus,
    update: Edit,
    delete: Trash,
    view: Activity,
};

const resourceIcons: Record<string, React.ElementType> = {
    product: Package,
    service: Settings,
    news: Newspaper,
    career: Briefcase,
    contact: Mail,
    user: User,
    session: LogIn,
    settings: Settings,
    quote: Package,
};

export default function AdminActivityPage() {
    const { hasPermission } = useAuth();
    const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hasPermission('canViewActivityLog')) {
            loadLogs();
        } else {
            setLoading(false);
        }
    }, [hasPermission]);

    const loadLogs = async () => {
        try {
            const data = await getActivityLogs(100);
            setLogs(data);
        } catch (e) {
            console.error('Failed to load activity logs', e);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getActionLabel = (entry: ActivityLogEntry) => {
        const actions: Record<string, string> = {
            login: 'logged in',
            logout: 'logged out',
            create: 'created',
            update: 'updated',
            delete: 'deleted',
            view: 'viewed',
        };
        return actions[entry.action] || entry.action;
    };

    if (!hasPermission('canViewActivityLog')) {
        return (
            <div className={styles.reveal}>
                <header className={styles.headerSection}>
                    <span className={styles.sectionTitle}>Access Denied</span>
                    <h1 className={styles.pageTitle}>Activity Log</h1>
                </header>
                <div className={styles.panel} style={{ textAlign: 'center', padding: '48px' }}>
                    <Shield size={48} style={{ color: '#333', marginBottom: '16px' }} />
                    <p style={{ color: '#666' }}>You don&apos;t have permission to view activity logs.</p>
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
            <header className={styles.headerSection}>
                <span className={styles.sectionTitle}>Audit Trail</span>
                <h1 className={styles.pageTitle}>Activity Log</h1>
            </header>

            <div className={styles.panel}>
                {logs.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Activity size={48} style={{ color: '#333', marginBottom: '16px' }} />
                        <p>No activity recorded yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {logs.map((log) => {
                            const ActionIcon = actionIcons[log.action] || Activity;
                            const ResourceIcon = resourceIcons[log.resourceType] || Activity;

                            return (
                                <div
                                    key={log.id}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '16px 0',
                                        borderBottom: '1px solid #1a1a1a',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        backgroundColor: '#1a1a1a',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <ActionIcon size={16} style={{ color: '#666' }} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '4px' }}>
                                            <span style={{ color: '#fff' }}>{log.userEmail}</span>
                                            {' '}{getActionLabel(log)}{' '}
                                            {log.resourceName && (
                                                <span style={{ color: '#6b9fff' }}>{log.resourceName}</span>
                                            )}
                                            {!log.resourceName && log.resourceType !== 'session' && (
                                                <span style={{ color: '#888' }}>{log.resourceType}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '11px',
                                                color: '#555',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                <ResourceIcon size={12} />
                                                {log.resourceType}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#555' }}>
                                                {formatTime(log.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
