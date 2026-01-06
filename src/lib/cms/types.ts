export interface Product {
    id: string; // specialized id e.g. 'tungsten'
    name: string;
    symbol: string;
    description: string;
    properties: Record<string, string>;
    products: Array<{
        name: string;
        sizes: string;
        standard?: string
    }>;
    alloys: string[];
    applications: string[];
    standards: string[];

    // JLCCNC-inspired fields
    category?: 'metal' | 'plastic' | 'composite';
    basePrice?: number;  // Starting price in EUR
    leadTimeDays?: number;
    tolerances?: string;
    imageUrl?: string;
    featured?: boolean;
    createdAt?: number;
}


export interface ManufacturingService {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    icon: string; // Lucide icon name or image URL
    features: string[];
    materials: string[]; // IDs of materials or names
    toleranceMin: string;
    maxPartSize: string;
    startingPrice: number;
    minLeadTimeDays: number;
    imageUrl?: string;
    order: number;
}

export interface Material {
    id: string;
    name: string;
    category: 'aluminum' | 'steel' | 'copper' | 'plastic' | 'other';
    priceMultiplier: number;
    properties: Record<string, string>;
    imageUrl?: string;
}

export interface QuoteRequestItem {
    id: string;
    material: string;
    form: string;
    specification: string;
    quantity: string;
    notes?: string;
}

export interface QuoteRequest {

    id?: string;
    createdAt: number;
    status: 'pending' | 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'completed';

    // Customer info
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    company?: string;

    // Project details
    serviceId: string;
    materialId: string;
    quantity: number;
    items?: QuoteRequestItem[];

    finishRequested?: string;
    toleranceRequired?: string;

    // Files
    fileUrls?: string[];
    fileName?: string;

    // Quote response
    estimatedPrice?: number;
    finalPrice?: number;
    estimatedLeadTime?: string;
    adminNotes?: string;

    // Magic Link & Tracking
    requestNda?: boolean;
    trackingToken?: string;
    updates?: Array<{
        date: string;
        message: string;
        author: 'user' | 'bimo' | 'admin';
    }>;
}

export interface NewsItem {
    id?: string;
    date: string;
    title: string;
    description: string;
    category: string;
    featured?: boolean;
}

export interface JobOpening {
    id?: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
}

export interface ContactSubmission {
    id?: string;
    name: string;
    email: string;
    message: string;
    createdAt: number;
}

export interface Supplier {
    id: string;
    name: string;
    contactEmail: string;
    trustScore: number; // 0-10
    website?: string;
    notes?: string;
    costData?: Record<string, any>; // Placeholder for future algo
    createdAt: number;
}

export interface CMSAdapter {
    // Products
    getProducts(): Promise<Product[]>;
    getProduct(id: string): Promise<Product | null>;
    createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<string>;
    updateProduct(id: string, data: Partial<Product>): Promise<void>;
    deleteProduct(id: string): Promise<void>;

    // Services
    getServices(): Promise<ManufacturingService[]>;
    getService(id: string): Promise<ManufacturingService | null>;
    getServiceBySlug(slug: string): Promise<ManufacturingService | null>;
    createService(service: Omit<ManufacturingService, 'id'>): Promise<string>;
    updateService(id: string, data: Partial<ManufacturingService>): Promise<void>;
    deleteService(id: string): Promise<void>;

    // Quotes
    getQuotes(status?: QuoteRequest['status']): Promise<QuoteRequest[]>;
    getQuote(id: string): Promise<QuoteRequest | null>;
    submitQuote(quote: Omit<QuoteRequest, 'id'>): Promise<string>;
    updateQuote(id: string, data: Partial<QuoteRequest>): Promise<void>;

    // Materials
    getMaterials(): Promise<Material[]>;

    // News
    getNews(): Promise<NewsItem[]>;
    getNewsItem(id: string): Promise<NewsItem | null>;
    createNews(news: Omit<NewsItem, 'id'>): Promise<string>;
    updateNews(id: string, data: Partial<NewsItem>): Promise<void>;
    deleteNews(id: string): Promise<void>;

    // Careers
    getCareers(): Promise<JobOpening[]>;
    getCareer(id: string): Promise<JobOpening | null>;
    createCareer(job: Omit<JobOpening, 'id'>): Promise<string>;
    updateCareer(id: string, data: Partial<JobOpening>): Promise<void>;
    deleteCareer(id: string): Promise<void>;

    // Contact Submissions
    getContacts(): Promise<ContactSubmission[]>;
    submitContact(data: ContactSubmission): Promise<void>;
    deleteContact(id: string): Promise<void>;

    // Suppliers
    getSuppliers(): Promise<Supplier[]>;
    getSupplier(id: string): Promise<Supplier | null>;
    createSupplier(supplier: Omit<Supplier, 'id'>): Promise<string>;
    updateSupplier(id: string, data: Partial<Supplier>): Promise<void>;
    deleteSupplier(id: string): Promise<void>;
}
