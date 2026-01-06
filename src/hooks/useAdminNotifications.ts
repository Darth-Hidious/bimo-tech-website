import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, Unsubscribe, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QuoteRequest, Product } from '@/lib/cms/types';
import { UserProfile } from '@/lib/auth/roles';

export type NotificationType = 'rfq' | 'signup' | 'product' | 'system';

export interface AdminNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    link: string;
}

export function useAdminNotifications() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        const unsubs: Unsubscribe[] = [];

        // 1. New Signups (Pending Users)
        const usersQuery = query(
            collection(db, 'admin_users'),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );

        const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
            const userNotifs: AdminNotification[] = snapshot.docs.map(doc => {
                const data = doc.data() as UserProfile;
                return {
                    id: `user-${doc.id}`,
                    type: 'signup',
                    title: 'New Signup Request',
                    message: `${data.displayName} (${data.email}) requested access.`,
                    timestamp: data.createdAt,
                    read: false, // We can implement read status logic later
                    link: '/admin/users' // Assuming this page exists or will exist
                };
            });
            updateNotifications('signup', userNotifs);
        });
        unsubs.push(unsubUsers);

        // 2. New Quotes (RFQs)
        // Check for 'pending' (from types) or 'submitted' (from context)
        const quotesQuery = query(
            collection(db, 'quotes'),
            orderBy('createdAt', 'desc'),
            limit(10) // Limit to recent 10 to avoid overload
        );

        const unsubQuotes = onSnapshot(quotesQuery, (snapshot) => {
            const quoteNotifs: AdminNotification[] = snapshot.docs
                .map(doc => {
                    const data = doc.data() as QuoteRequest;
                    return { data, id: doc.id };
                })
                .filter(({ data }) => data.status === 'pending' || data.status === 'submitted') // Filter in memory if 'in' query issues arise
                .map(({ data, id }) => ({
                    id: `quote-${id}`,
                    type: 'rfq',
                    title: 'New RFQ Received',
                    message: `Request from ${data.customerName || 'Unknown'} for ${data.serviceId || 'Service'}`,
                    timestamp: data.createdAt,
                    read: false,
                    link: `/admin/quotes/${id}`
                }));
            updateNotifications('rfq', quoteNotifs);
        });
        unsubs.push(unsubQuotes);

        // 3. New Products
        const productsQuery = query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
            const productNotifs: AdminNotification[] = snapshot.docs.map(doc => {
                const data = doc.data() as Product;
                return {
                    id: `product-${doc.id}`,
                    type: 'product',
                    title: 'New Product Added',
                    message: `${data.name} was added to the catalog.`,
                    timestamp: data.createdAt || Date.now(), // Fallback if createdAt missing
                    read: false,
                    link: `/admin/products?id=${doc.id}`
                };
            });
            updateNotifications('product', productNotifs);
        });
        unsubs.push(unsubProducts);

        // Map to store notifications by type to avoid overwriting
        const notifMap: Record<string, AdminNotification[]> = {};

        const updateNotifications = (type: string, newNotifs: AdminNotification[]) => {
            notifMap[type] = newNotifs;
            const allNotifs = Object.values(notifMap).flat().sort((a, b) => b.timestamp - a.timestamp);
            setNotifications(allNotifs);
            setLoading(false);
        };

        return () => {
            unsubs.forEach(unsub => unsub());
        };
    }, []);

    return { notifications, loading };
}
