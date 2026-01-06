
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
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
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 's.kovid@bimotech.pl';
const ADMIN_PASSWORD = 'Fusion2024ITER';
const ADMIN_NAME = 'Sid Kovid';

async function seedAdmin() {
    console.log(`Seeding admin user: ${ADMIN_EMAIL}...`);

    let user;

    try {
        // Try to sign in first to see if user exists
        console.log('Checking if user exists...');
        const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        user = userCredential.user;
        console.log('User already exists, updating profile...');
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            // Create user if not found
            console.log('User not found, creating new user...');
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
                user = userCredential.user;
                console.log('User created successfully.');
            } catch (createError: any) {
                // Check if email already in use but diff password (generic auth/email-already-in-use)
                if (createError.code === 'auth/email-already-in-use') {
                    console.error('Email already in use. Please sign in with correct password or reset user manually.');
                    process.exit(1);
                }
                console.error('Failed to create user:', createError);
                process.exit(1);
            }
        } else {
            console.error('Error checking user:', error);
            process.exit(1);
        }
    }

    if (!user) {
        console.error('Failed to obtain user object.');
        process.exit(1);
    }

    // Update display name
    await updateProfile(user, { displayName: ADMIN_NAME });

    // Set admin profile in Firestore
    console.log('Setting admin profile in Firestore...');
    const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: ADMIN_NAME,
        role: 'admin',
        status: 'approved',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
    };

    await setDoc(doc(db, 'admin_users', user.uid), userProfile, { merge: true });

    console.log('Admin user seeded successfully!');
    console.log('Credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);

    process.exit(0);
}

seedAdmin().catch(console.error);
