
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import type { ManufacturingService } from "../src/lib/cms/types";
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
const db = getFirestore(app);

const services: Omit<ManufacturingService, 'id'>[] = [
    {
        name: 'CNC Milling',
        slug: 'cnc-milling',
        tagline: '3-, 4- & full 5-axis CNC milling',
        description: 'Our CNC milling service produces high-precision parts with complex geometries. We use advanced 3, 4, and 5-axis machines to mill parts from a wide range of metals and plastics.',
        icon: 'Hexagon', // Lucide icon
        features: [
            '3-, 4- & 5-axis machining',
            'Complex geometries & undercuts',
            'Thread milling & countersinking',
            'High-speed machining'
        ],
        materials: ['Aluminum', 'Steel', 'Stainless Steel', 'Brass', 'Copper', 'Titanium', 'Plastics'],
        toleranceMin: '±0.02mm',
        maxPartSize: '1100 x 600 x 500 mm',
        startingPrice: 25.00,
        minLeadTimeDays: 3,
        imageUrl: 'https://images.unsplash.com/photo-1565439396693-0176dfb6c6d7?auto=format&fit=crop&q=80&w=1000',
        order: 1
    },
    {
        name: 'CNC Turning',
        slug: 'cnc-turning',
        tagline: 'Precision turning & mill-turn capabilities',
        description: 'CNC turning for cylindrical parts with tight tolerances. Our mill-turn centers can complete complex parts in a single setup.',
        icon: 'CircleDot',
        features: [
            'Live tooling & mill-turn',
            'Precision cylindrical parts',
            'Axial & radial drilling',
            'Polished finishes'
        ],
        materials: ['Aluminum', 'Steel', 'Stainless Steel', 'Brass', 'Delrin', 'PEEK'],
        toleranceMin: '±0.01mm',
        maxPartSize: 'Ø450 x 800 mm',
        startingPrice: 20.00,
        minLeadTimeDays: 3,
        imageUrl: 'https://images.unsplash.com/photo-1622370830427-466d98d28124?auto=format&fit=crop&q=80&w=1000',
        order: 2
    },
    {
        name: 'Sheet Metal Fabrication',
        slug: 'sheet-metal',
        tagline: 'Laser cutting, bending & assembly',
        description: 'Rapid turnaround sheet metal fabrication. From laser cutting and bending to welding and finishing, we handle low to mid-volume production.',
        icon: 'Layers',
        features: [
            'Laser cutting & waterjet',
            'CNC bending & forming',
            'TIG/MIG welding',
            'Powder coating & anodizing'
        ],
        materials: ['Aluminum', 'Steel', 'Stainless Steel', 'Copper', 'Brass'],
        toleranceMin: '±0.1mm',
        maxPartSize: '3000 x 1500 mm',
        startingPrice: 55.00,
        minLeadTimeDays: 4,
        imageUrl: 'https://images.unsplash.com/photo-1533236054176-6556536b3df3?auto=format&fit=crop&q=80&w=1000',
        order: 3
    }
];

async function seedServices() {
    console.log('Clearing existing services...');
    const snapshot = await getDocs(collection(db, 'services'));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Deleted ${snapshot.size} existing services.`);

    console.log('Seeding new services...');
    for (const service of services) {
        await addDoc(collection(db, 'services'), service);
        console.log(`Added service: ${service.name}`);
    }
    console.log('Service seeding complete!');
    process.exit(0);
}

seedServices().catch(console.error);
