import Link from 'next/link';
import styles from '../admin.module.css';
import { Home, ShoppingCart, Package, Settings, Activity, Newspaper, Briefcase, Mail, LogOut, Users, History, Truck } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeader from './AdminHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className={styles.bgWrapper}>
                <AdminHeader />
                <div className={styles.dashboardContainer}>
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <div className={styles.brandLogo}>
                            <img src="/logo.png" alt="Bimo Tech" style={{ height: '28px' }} />
                        </div>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Link href="/admin" className={styles.navItem}>
                                <Home size={18} />
                                Dashboard
                            </Link>
                            <Link href="/admin/products" className={styles.navItem}>
                                <Package size={18} />
                                Products
                            </Link>
                            <Link href="/admin/services" className={styles.navItem}>
                                <Activity size={18} />
                                Services
                            </Link>
                            <Link href="/admin/news" className={styles.navItem}>
                                <Newspaper size={18} />
                                News
                            </Link>
                            <Link href="/admin/careers" className={styles.navItem}>
                                <Briefcase size={18} />
                                Careers
                            </Link>
                            <Link href="/admin/contacts" className={styles.navItem}>
                                <Mail size={18} />
                                Contacts
                            </Link>
                            <Link href="/admin/quotes" className={styles.navItem}>
                                <ShoppingCart size={18} />
                                Quotes
                            </Link>
                            <Link href="/admin/suppliers" className={styles.navItem}>
                                <Truck size={18} />
                                Suppliers
                            </Link>
                            <div style={{ height: '24px' }} />
                            <Link href="/admin/users" className={styles.navItem}>
                                <Users size={18} />
                                Users
                            </Link>
                            <Link href="/admin/activity" className={styles.navItem}>
                                <History size={18} />
                                Activity
                            </Link>
                            <Link href="/admin/settings" className={styles.navItem}>
                                <Settings size={18} />
                                Settings
                            </Link>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
