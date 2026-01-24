"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, setUserProfile, updateLastLogin, logActivity } from '@/lib/auth/userService';
import { UserProfile } from '@/lib/auth/roles';
import styles from '../../admin.module.css';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Check if user is already logged in and approved
    useEffect(() => {
        if (!auth) {
            setChecking(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profile = await getUserProfile(user.uid);
                if (profile && profile.status === 'approved') {
                    // Already logged in and approved - redirect to admin
                    router.push('/admin');
                    return;
                }
            }
            setChecking(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!auth) throw new Error('Auth not initialized');
            const result = await signInWithEmailAndPassword(auth, email, password);

            // Check user profile
            const profile = await getUserProfile(result.user.uid);

            if (!profile) {
                setError('Account not found. Please sign up first.');
                setLoading(false);
                return;
            }

            if (profile.status === 'pending') {
                setError('Your account is pending approval. Please wait for an administrator to approve your access.');
                setLoading(false);
                return;
            }

            if (profile.status === 'rejected') {
                setError('Your account access has been denied. Contact an administrator.');
                setLoading(false);
                return;
            }

            // Log login activity
            await logActivity({
                userId: result.user.uid,
                userEmail: result.user.email || '',
                action: 'login',
                resourceType: 'session',
            });

            await updateLastLogin(result.user.uid);

            // Redirect to admin
            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (!auth) throw new Error('Auth not initialized');
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Create pending user profile
            const newProfile: UserProfile = {
                uid: result.user.uid,
                email: email,
                displayName: displayName || email.split('@')[0],
                role: 'viewer',
                status: 'pending', // Requires admin approval
                createdAt: Date.now(),
                lastLoginAt: Date.now(),
            };
            await setUserProfile(newProfile);

            // Log the signup
            await logActivity({
                userId: result.user.uid,
                userEmail: email,
                action: 'create',
                resourceType: 'user',
                resourceId: result.user.uid,
                resourceName: displayName,
            });

            setSuccess('Account created! Please wait for an administrator to approve your access.');
            setIsSignUp(false);
            setEmail('');
            setPassword('');
            setDisplayName('');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: 'var(--bimo-bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Loader2 className="animate-spin" size={32} style={{ color: 'var(--bimo-text-disabled)' }} />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bimo-bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--bimo-border)',
                padding: '48px 32px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Image
                        src="/logo.png"
                        alt="Bimo Tech"
                        width={120}
                        height={40}
                        style={{ marginBottom: '24px' }}
                    />
                    <h1 style={{ fontSize: '24px', color: 'var(--bimo-text-primary)', marginBottom: '8px' }}>
                        {isSignUp ? 'Request Access' : 'Admin Login'}
                    </h1>
                    <p style={{ color: 'var(--bimo-text-disabled)', fontSize: '14px' }}>
                        {isSignUp ? 'Create an account to request access' : 'Sign in to manage content'}
                    </p>
                </div>

                {success && (
                    <div style={{
                        backgroundColor: 'rgba(72, 187, 120, 0.1)',
                        border: '1px solid #48bb78',
                        padding: '12px 16px',
                        marginBottom: '24px',
                        color: '#48bb78',
                        fontSize: '13px'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                    {isSignUp && (
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Name</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@bimotech.pl"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            className={styles.formInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '16px' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className={styles.btnPrimary}
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (isSignUp ? 'Request Access' : 'Sign In')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--bimo-text-disabled)',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        {isSignUp ? 'Already have an account? Sign in' : 'Need access? Request an account'}
                    </button>
                </div>
            </div>
        </div>
    );
}
