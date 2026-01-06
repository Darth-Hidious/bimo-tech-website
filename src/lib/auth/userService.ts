import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
    addDoc,
    query,
    orderBy,
    limit,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, ActivityLogEntry, UserRole } from './roles';

const USERS_COLLECTION = 'admin_users';
const ACTIVITY_COLLECTION = 'activity_log';

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}

/**
 * Create or update user profile
 */
export async function setUserProfile(profile: UserProfile): Promise<void> {
    if (!db) return;
    const docRef = doc(db, USERS_COLLECTION, profile.uid);
    await setDoc(docRef, profile, { merge: true });
}

/**
 * Update user's last login time
 */
export async function updateLastLogin(uid: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, { lastLoginAt: Date.now() });
}

/**
 * Get all admin users
 */
export async function getAllUsers(): Promise<UserProfile[]> {
    if (!db) return [];
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
}

/**
 * Update user role
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
    if (!db) return;
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, { role });
}

/**
 * Approve a user
 */
export async function approveUser(uid: string, approvedByUid: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, {
        status: 'approved',
        approvedBy: approvedByUid,
        approvedAt: Date.now()
    });
}

/**
 * Reject a user
 */
export async function rejectUser(uid: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, { status: 'rejected' });
}

/**
 * Log an activity
 */
export async function logActivity(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): Promise<void> {
    if (!db) return;
    await addDoc(collection(db, ACTIVITY_COLLECTION), {
        ...entry,
        timestamp: Date.now(),
    });
}

/**
 * Get recent activity logs
 */
export async function getActivityLogs(limitCount: number = 50): Promise<ActivityLogEntry[]> {
    if (!db) return [];
    const q = query(
        collection(db, ACTIVITY_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLogEntry));
}

/**
 * Get activity logs for a specific user
 */
export async function getUserActivityLogs(userId: string, limitCount: number = 20): Promise<ActivityLogEntry[]> {
    if (!db) return [];
    const q = query(
        collection(db, ACTIVITY_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLogEntry));
}
