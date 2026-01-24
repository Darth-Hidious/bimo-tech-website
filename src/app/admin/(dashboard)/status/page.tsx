"use client";

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import styles from '../../admin.module.css';

interface ServiceStatus {
    name: string;
    status: 'connected' | 'error' | 'not-configured';
    message: string;
    details?: Record<string, any>;
}

interface SystemStatus {
    healthy: boolean;
    hasErrors: boolean;
    services: ServiceStatus[];
    timestamp: string;
}

export default function StatusPage() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/system-status');
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error('Failed to fetch status:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchStatus();
    };

    const getStatusIcon = (serviceStatus: ServiceStatus['status']) => {
        switch (serviceStatus) {
            case 'connected':
                return <CheckCircle size={20} style={{ color: '#22c55e' }} />;
            case 'error':
                return <XCircle size={20} style={{ color: '#ef4444' }} />;
            case 'not-configured':
                return <AlertCircle size={20} style={{ color: '#f59e0b' }} />;
        }
    };

    const getStatusColor = (serviceStatus: ServiceStatus['status']) => {
        switch (serviceStatus) {
            case 'connected':
                return '#22c55e';
            case 'error':
                return '#ef4444';
            case 'not-configured':
                return '#f59e0b';
        }
    };

    return (
        <div className={styles.reveal}>
            <header className={styles.headerSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <span className={styles.sectionTitle}>System Status</span>
                    <h1 className={styles.pageTitle}>Service Health</h1>
                </div>
                <button
                    onClick={handleRefresh}
                    className={styles.btnSecondary}
                    disabled={refreshing}
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </header>

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                    <Loader2 className="animate-spin" size={32} style={{ color: 'var(--bimo-text-disabled)' }} />
                </div>
            ) : status ? (
                <>
                    {/* Overall Status */}
                    <div className={styles.panel} style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {status.healthy ? (
                                <CheckCircle size={32} style={{ color: '#22c55e' }} />
                            ) : status.hasErrors ? (
                                <XCircle size={32} style={{ color: '#ef4444' }} />
                            ) : (
                                <AlertCircle size={32} style={{ color: '#f59e0b' }} />
                            )}
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--bimo-text-primary)', margin: 0 }}>
                                    {status.healthy ? 'All Systems Operational' : status.hasErrors ? 'System Issues Detected' : 'Configuration Required'}
                                </h2>
                                <p style={{ fontSize: '13px', color: 'var(--bimo-text-disabled)', marginTop: '4px' }}>
                                    Last checked: {new Date(status.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Service Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {status.services.map((service, index) => (
                            <div
                                key={service.name}
                                className={styles.panel}
                                style={{
                                    borderLeft: `3px solid ${getStatusColor(service.status)}`,
                                    marginBottom: 0
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    {getStatusIcon(service.status)}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            color: 'var(--bimo-text-primary)',
                                            margin: 0,
                                            marginBottom: '8px'
                                        }}>
                                            {service.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '13px',
                                            color: 'var(--bimo-text-secondary)',
                                            margin: 0,
                                            lineHeight: 1.5
                                        }}>
                                            {service.message}
                                        </p>

                                        {service.details && (
                                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--bimo-border)' }}>
                                                {Object.entries(service.details).map(([key, value]) => (
                                                    <div key={key} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: '12px',
                                                        marginBottom: '4px'
                                                    }}>
                                                        <span style={{ color: 'var(--bimo-text-disabled)', textTransform: 'capitalize' }}>
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </span>
                                                        <span style={{ color: 'var(--bimo-text-secondary)', fontFamily: 'monospace' }}>
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div style={{ marginTop: '16px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        border: `1px solid ${getStatusColor(service.status)}`,
                                        color: getStatusColor(service.status),
                                    }}>
                                        {service.status.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Environment Variables Info */}
                    <div className={styles.panel} style={{ marginTop: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--bimo-text-disabled)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Required Environment Variables
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                            {[
                                { name: 'NEXT_PUBLIC_FIREBASE_API_KEY', desc: 'Firebase Auth' },
                                { name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', desc: 'Firebase Project' },
                                { name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', desc: 'File Storage' },
                                { name: 'GOOGLE_GENAI_API_KEY', desc: 'Gemini AI' },
                            ].map((env) => (
                                <div key={env.name} style={{
                                    padding: '12px',
                                    background: 'var(--bimo-bg-secondary)',
                                    border: '1px solid var(--bimo-border)',
                                }}>
                                    <code style={{ fontSize: '11px', color: 'var(--bimo-text-primary)' }}>{env.name}</code>
                                    <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '4px' }}>{env.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.panel}>
                    <p style={{ color: 'var(--bimo-text-secondary)' }}>Failed to load system status.</p>
                </div>
            )}
        </div>
    );
}
