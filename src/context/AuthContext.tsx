"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, UserRole, rolePermissions } from '@/lib/auth/roles';
import { getUserProfile, setUserProfile, updateLastLogin, logActivity } from '@/lib/auth/userService';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    hasPermission: (permission: keyof typeof rolePermissions.admin) => boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Load user profile from Firestore
                const userProfile = await getUserProfile(firebaseUser.uid);

                if (userProfile) {
                    setProfile(userProfile);
                    await updateLastLogin(firebaseUser.uid);
                } else {
                    // First-time user - create profile with viewer role
                    // Admins can upgrade their role later
                    const newProfile: UserProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                        role: 'viewer',
                        status: 'pending',
                        createdAt: Date.now(),
                        lastLoginAt: Date.now(),
                    };
                    await setUserProfile(newProfile);
                    setProfile(newProfile);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!auth) throw new Error('Auth not initialized');
        const result = await signInWithEmailAndPassword(auth, email, password);

        // Log the login activity
        const userProfile = await getUserProfile(result.user.uid);
        if (userProfile) {
            await logActivity({
                userId: result.user.uid,
                userEmail: result.user.email || '',
                action: 'login',
                resourceType: 'session',
            });
        }
    };

    const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
        if (!auth) throw new Error('Auth not initialized');

        // Only admins can create users with elevated roles
        if (profile?.role !== 'admin' && role !== 'viewer') {
            throw new Error('Only admins can create users with elevated roles');
        }

        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile
        const newProfile: UserProfile = {
            uid: result.user.uid,
            email: email,
            displayName: displayName,
            role: role,
            status: 'approved', // Admin-created users are auto-approved
            createdAt: Date.now(),
            lastLoginAt: Date.now(),
            createdBy: profile?.uid,
        };
        await setUserProfile(newProfile);

        // Log the user creation
        await logActivity({
            userId: profile?.uid || result.user.uid,
            userEmail: profile?.email || email,
            action: 'create',
            resourceType: 'user',
            resourceId: result.user.uid,
            resourceName: displayName,
        });
    };

    const signOut = async () => {
        if (!auth) return;

        // Log the logout
        if (user) {
            await logActivity({
                userId: user.uid,
                userEmail: user.email || '',
                action: 'logout',
                resourceType: 'session',
            });
        }

        await firebaseSignOut(auth);
        setProfile(null);
    };

    const hasPermission = (permission: keyof typeof rolePermissions.admin): boolean => {
        if (!profile) return false;
        return rolePermissions[profile.role]?.[permission] ?? false;
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, hasPermission, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
