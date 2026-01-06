
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createMagicLink() {
    const trackingToken = crypto.randomUUID();
    const quoteData = {
        createdAt: Date.now(),
        status: 'pending',
        customerName: 'Demo User',
        customerEmail: 'demo@example.com',
        company: 'Magic Corp',
        serviceId: 'cnc-milling',
        materialId: 'alu-6061',
        quantity: 50,
        requestNda: true,
        trackingToken: trackingToken,
        updates: [
            {
                date: new Date().toISOString(),
                message: 'Welcome! This is your private tracking channel.',
                author: 'bimo'
            }
        ]
    };

    try {
        const docRef = await addDoc(collection(db, 'quotes'), quoteData);
        const link = `http://localhost:3000/en/track/${docRef.id}?token=${trackingToken}`;

        console.log('\n✨ MAGIC LINK GENERATED ✨');
        console.log('---------------------------------------------------');
        console.log(link);
        console.log('---------------------------------------------------');
        console.log('Click the link above to test the tracking page.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating quote:', error);
        process.exit(1);
    }
}

createMagicLink();
