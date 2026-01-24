"use client";

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { cms } from '@/lib/cms/firestoreAdapter';
import { Package, Newspaper, Briefcase, Mail, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    products: number;
    services: number;
    news: number;
    careers: number;
    contacts: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ products: 0, services: 0, news: 0, careers: 0, contacts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [products, services, news, careers, contacts] = await Promise.all([
                    cms.getProducts(),
                    cms.getServices(),
                    cms.getNews(),
                    cms.getCareers(),
                    cms.getContacts(),
                ]);
                setStats({
                    products: products.length,
                    services: services.length,
                    news: news.length,
                    careers: careers.length,
                    contacts: contacts.length,
                });
            } catch (e) {
                console.error('Failed to load stats', e);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const statCards = [
        { label: 'Products', value: stats.products, icon: Package, href: '/admin/products' },
        { label: 'Services', value: stats.services, icon: Activity, href: '/admin/services' },
        { label: 'News', value: stats.news, icon: Newspaper, href: '/admin/news' },
        { label: 'Careers', value: stats.careers, icon: Briefcase, href: '/admin/careers' },
        { label: 'Contacts', value: stats.contacts, icon: Mail, href: '/admin/contacts' },
    ];

    return (
        <div className={styles.reveal}>
            <header className={styles.headerSection}>
                <span className={styles.sectionTitle}>Admin Dashboard</span>
                <h1 className={styles.pageTitle}>Content Management</h1>
            </header>

            <div className={styles.statsGrid}>
                {statCards.map((card) => (
                    <Link key={card.label} href={card.href} className={styles.statCard} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <card.icon size={20} style={{ color: 'var(--bimo-text-disabled)' }} />
                            <ArrowUpRight size={16} style={{ color: 'var(--bimo-text-disabled)' }} />
                        </div>
                        <div className={styles.statLabel}>{card.label}</div>
                        <div className={styles.statValue}>
                            {loading ? '—' : card.value}
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.panel}>
                <span className={styles.sectionTitle}>Quick Actions</span>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <Link href="/en" className={styles.btnPrimary} target="_blank">
                        View Website
                    </Link>
                    <Link href="/admin/products" className={styles.btnSecondary}>
                        Manage Products
                    </Link>
                    <Link href="/admin/contacts" className={styles.btnSecondary}>
                        View Inquiries
                    </Link>
                </div>
            </div>
        </div>
    );
}
