"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const pathname = usePathname();
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    // Skip protection for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setChecking(false);
            return;
        }

        if (!loading) {
            if (!user) {
                router.push('/admin/login');
            } else if (!profile) {
                // Profile still loading
                return;
            } else if (profile.status !== 'approved') {
                router.push('/admin/login');
            } else {
                setChecking(false);
            }
        }
    }, [user, profile, loading, router, isLoginPage]);

    // Login page bypasses protection
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (loading || checking) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Loader2 className="animate-spin" size={32} style={{ color: '#666' }} />
            </div>
        );
    }

    if (!user || !profile || profile.status !== 'approved') {
        return null;
    }

    return <>{children}</>;
}
