import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
    orderBy,
    getFirestore
} from 'firebase/firestore';
import { app } from '../firebase';
import { CMSAdapter, Product, NewsItem, JobOpening, ContactSubmission, ManufacturingService, QuoteRequest, Material, Supplier } from './types';

export class FirestoreCMS implements CMSAdapter {
    get db() {
        return getFirestore(app);
    }

    // PRODUCTS
    async getProducts(): Promise<Product[]> {
        const querySnapshot = await getDocs(collection(this.db, 'products'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }

    async getProduct(id: string): Promise<Product | null> {
        const docRef = doc(this.db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
        return null;
    }

    async createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<string> {
        if (product.id) {
            await setDoc(doc(this.db, 'products', product.id), product);
            return product.id;
        }
        const docRef = await addDoc(collection(this.db, 'products'), product);
        return docRef.id;
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<void> {
        await updateDoc(doc(this.db, 'products', id), data);
    }

    async deleteProduct(id: string): Promise<void> {
        await deleteDoc(doc(this.db, 'products', id));
    }

    // SERVICES
    async getServices(): Promise<ManufacturingService[]> {
        const q = query(collection(this.db, 'services'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManufacturingService));
    }

    async getService(id: string): Promise<ManufacturingService | null> {
        const docRef = doc(this.db, 'services', id);
        const snap = await getDoc(docRef);
        return snap.exists() ? { id: snap.id, ...snap.data() } as ManufacturingService : null;
    }

    async getServiceBySlug(slug: string): Promise<ManufacturingService | null> {
        const q = query(collection(this.db, 'services'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ManufacturingService;
        }
        return null;
    }

    async createService(service: Omit<ManufacturingService, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(this.db, 'services'), service);
        return docRef.id;
    }

    async updateService(id: string, data: Partial<ManufacturingService>): Promise<void> {
        await updateDoc(doc(this.db, 'services', id), data);
    }

    async deleteService(id: string): Promise<void> {
        await deleteDoc(doc(this.db, 'services', id));
    }

    // QUOTES
    async getQuotes(status?: QuoteRequest['status']): Promise<QuoteRequest[]> {
        let q;
        if (status) {
            q = query(collection(this.db, 'quotes'), where('status', '==', status), orderBy('createdAt', 'desc'));
        } else {
            q = query(collection(this.db, 'quotes'), orderBy('createdAt', 'desc'));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
    }

    async getQuote(id: string): Promise<QuoteRequest | null> {
        const docRef = doc(this.db, 'quotes', id);
        const snap = await getDoc(docRef);
        return snap.exists() ? { id: snap.id, ...snap.data() } as QuoteRequest : null;
    }

    async submitQuote(quote: Omit<QuoteRequest, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(this.db, 'quotes'), quote);
        return docRef.id;
    }

    async updateQuote(id: string, data: Partial<QuoteRequest>): Promise<void> {
        await updateDoc(doc(this.db, 'quotes', id), data);
    }

    async addQuoteUpdate(id: string, update: { message: string, author: 'user' | 'bimo' | 'admin' }): Promise<void> {
        const docRef = doc(this.db, 'quotes', id);
        const quote = await this.getQuote(id);
        if (!quote) throw new Error('Quote not found');

        const newUpdate = {
            date: new Date().toISOString(),
            ...update
        };

        await updateDoc(docRef, {
            updates: [...(quote.updates || []), newUpdate]
        });
    }

    // MATERIALS
    async getMaterials(): Promise<Material[]> {
        const snapshot = await getDocs(collection(this.db, 'materials'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
    }

    // NEWS
    async getNews(): Promise<NewsItem[]> {
        const q = query(collection(this.db, 'news'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
    }

    async getNewsItem(id: string): Promise<NewsItem | null> {
        const docRef = doc(this.db, 'news', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as NewsItem : null;
    }

    async createNews(news: Omit<NewsItem, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(this.db, 'news'), news);
        return docRef.id;
    }

    async updateNews(id: string, data: Partial<NewsItem>): Promise<void> {
        await updateDoc(doc(this.db, 'news', id), data);
    }

    async deleteNews(id: string): Promise<void> {
        await deleteDoc(doc(this.db, 'news', id));
    }

    // CAREERS
    async getCareers(): Promise<JobOpening[]> {
        const querySnapshot = await getDocs(collection(this.db, 'careers'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobOpening));
    }

    async getCareer(id: string): Promise<JobOpening | null> {
        const docRef = doc(this.db, 'careers', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as JobOpening : null;
    }

    async createCareer(job: Omit<JobOpening, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(this.db, 'careers'), job);
        return docRef.id;
    }

    async updateCareer(id: string, data: Partial<JobOpening>): Promise<void> {
        await updateDoc(doc(this.db, 'careers', id), data);
    }

    async deleteCareer(id: string): Promise<void> {
        await deleteDoc(doc(this.db, 'careers', id));
    }

    // CONTACT SUBMISSIONS
    async getContacts(): Promise<ContactSubmission[]> {
        const q = query(collection(this.db, 'contact_submissions'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission));
    }

    async submitContact(data: ContactSubmission): Promise<void> {
        await addDoc(collection(this.db, 'contact_submissions'), data);
    }

    async deleteContact(id: string): Promise<void> {
        await deleteDoc(doc(this.db, 'contact_submissions', id));
    }

    // SUPPLIERS
    async getSuppliers(): Promise<Supplier[]> {
        const q = query(collection(this.db, 'suppliers'), orderBy('trustScore', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
    }

    async getSupplier(id: string): Promise<Supplier | null> {
        const docRef = doc(this.db, 'suppliers', id);
        const snap = await getDoc(docRef);
        return snap.exists() ? { id: snap.id, ...snap.data() } as Supplier : null;
    }

    async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(this.db, 'suppliers'), supplier);
        return docRef.id;
    }

    async updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
        await updateDoc(doc(this.db, 'suppliers', id), data);
    }

    async deleteSupplier(id: string): Promise<void> {
        await deleteDoc(doc(this.db, 'suppliers', id));
    }
}

export const cms = new FirestoreCMS();
