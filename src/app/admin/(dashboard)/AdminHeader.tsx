"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export default function AdminHeader() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications } = useAdminNotifications();

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            backgroundColor: 'var(--bimo-bg-primary)',
            borderBottom: '1px solid var(--bimo-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            zIndex: 50,
            gap: '16px'
        }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--bimo-text-disabled)',
                        cursor: 'pointer',
                        padding: '8px',
                        position: 'relative'
                    }}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#e53e3e',
                            borderRadius: '50%'
                        }} />
                    )}
                </button>

                {showNotifications && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: '320px',
                        backgroundColor: 'var(--bimo-bg-secondary)',
                        border: '1px solid var(--bimo-border)',
                        marginTop: '8px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: '1px solid var(--bimo-border)'
                        }}>
                            <span style={{ color: 'var(--bimo-text-primary)', fontSize: '14px', fontWeight: 500 }}>Notifications</span>
                            <button
                                onClick={() => setShowNotifications(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--bimo-text-disabled)', cursor: 'pointer' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                            {notifications.length === 0 ? (
                                <p style={{ padding: '24px', textAlign: 'center', color: 'var(--bimo-text-disabled)', fontSize: '13px' }}>
                                    No notifications
                                </p>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => {
                                            setShowNotifications(false);
                                            if (n.link) router.push(n.link);
                                        }}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid var(--bimo-border)',
                                            backgroundColor: n.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(255,255,255,0.02)'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{
                                                color: n.type === 'rfq' ? '#60a5fa' :
                                                    n.type === 'signup' ? '#34d399' :
                                                        n.type === 'product' ? '#fbbf24' : 'var(--bimo-text-primary)',
                                                fontSize: '13px',
                                                fontWeight: 500
                                            }}>
                                                {n.title}
                                            </span>
                                            <span style={{ color: 'var(--bimo-text-disabled)', fontSize: '11px' }}>{formatTime(n.timestamp)}</span>
                                        </div>
                                        <p style={{ color: 'var(--bimo-text-secondary)', fontSize: '12px', margin: 0 }}>{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--bimo-text-secondary)', fontSize: '13px' }}>{user?.email}</span>
                <button
                    onClick={signOut}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--bimo-text-disabled)',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                    title="Sign out"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
