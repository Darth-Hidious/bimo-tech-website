"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { ManufacturingService } from '@/lib/cms/types';
import Link from 'next/link';
import { ArrowLeft, Check, Info, ShieldCheck, Ruler, Truck } from 'lucide-react';
import Footer from '@/components/Footer';

// Fallback mock data (same as in parent page for consistency)
const MOCK_SERVICES: Record<string, ManufacturingService> = {
    'cnc-milling': {
        id: 'cnc-milling',
        name: 'CNC Milling',
        slug: 'cnc-milling',
        tagline: '3-, 4- & full 5-axis CNC milling',
        description: 'High-precision parts with complex geometries. We use advanced 3, 4, and 5-axis machines to produce parts with tight tolerances and excellent surface finishes.',
        icon: 'Hexagon',
        features: ['3/4/5-axis machining', 'Complex geometries', 'Thread milling', 'Tight tolerances up to ±0.01mm', 'Rapid prototyping to production'],
        materials: ['Aluminum (6061, 7075)', 'Stainless Steel (304, 316L)', 'Titanium (Ti-6Al-4V)', 'Brass', 'Copper', 'Plastics (POM, ABS, PEEK)'],
        toleranceMin: '±0.02mm',
        maxPartSize: '1100x600x500mm',
        startingPrice: 25.00,
        minLeadTimeDays: 3,
        imageUrl: 'https://images.unsplash.com/photo-1565439396693-0176dfb6c6d7?auto=format&fit=crop&q=80&w=1200',
        order: 1
    },
    'cnc-turning': {
        id: 'cnc-turning',
        name: 'CNC Turning',
        slug: 'cnc-turning',
        tagline: 'Precision turning & mill-turn',
        description: 'CNC turning for cylindrical parts with tight tolerances and mill-turn capabilities. Ideal for shafts, pins, custom bolts, and circular components.',
        icon: 'CircleDot',
        features: ['Live tooling', 'Precision cylindrical parts', 'Axial drilling', 'Knurling', 'Threading'],
        materials: ['Stainless Steel', 'Brass', 'Aluminum', 'Titanium', 'Inconel', 'Plastics'],
        toleranceMin: '±0.01mm',
        maxPartSize: 'Ø450x800mm',
        startingPrice: 20.00,
        minLeadTimeDays: 3,
        imageUrl: 'https://images.unsplash.com/photo-1622370830427-466d98d28124?auto=format&fit=crop&q=80&w=1200',
        order: 2
    },
    'sheet-metal': {
        id: 'sheet-metal',
        name: 'Sheet Metal Fabrication',
        slug: 'sheet-metal',
        tagline: 'Laser cutting, bending & assembly',
        description: 'Rapid turnaround sheet metal fabrication. From laser cutting to bending, welding, and finishing. Suitable for brackets, enclosures, and chassis.',
        icon: 'Layers',
        features: ['Laser cutting', 'CNC bending', 'Welding (MIG/TIG)', 'Powder coating', 'Assembly'],
        materials: ['Aluminum', 'Steel', 'Stainless Steel', 'Copper', 'Brass'],
        toleranceMin: '±0.1mm',
        maxPartSize: '3000x1500mm',
        startingPrice: 55.00,
        minLeadTimeDays: 4,
        imageUrl: 'https://images.unsplash.com/photo-1533236054176-6556536b3df3?auto=format&fit=crop&q=80&w=1200',
        order: 3
    }
};

export default function ServiceDetailPage() {
    const { language, t } = useLanguage();
    const params = useParams();
    const slug = params.slug as string;
    const [service, setService] = useState<ManufacturingService | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadService() {
            setLoading(true);
            try {
                // Try to find by slug in Firestore (simulated by ID for now as we don't have queryBySlug yet)
                // In a real scenario we'd query: collection('services'), where('slug', '==', slug)
                // Here we fallback to mock data immediately if ID lookup fails or just rely on mock for this demo step
                const data = await cms.getService(slug);
                if (data) {
                    setService(data);
                } else {
                    setService(MOCK_SERVICES[slug] || null);
                }
            } catch (error) {
                console.error("Failed to load service", error);
                setService(MOCK_SERVICES[slug] || null);
            } finally {
                setLoading(false);
            }
        }
        loadService();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl">Service not found</h1>
                <Link href={`/${language}/services`} className="text-blue-500 hover:underline">
                    Back to Services
                </Link>
            </div>
        );
    }

    return (
        <main className="bg-black text-white min-h-screen">
            {/* Hero Image Section */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 pb-12">
                    <div className="container-main">
                        <Link
                            href={`/${language}/services`}
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Services
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{service.name}</h1>
                        <p className="text-xl text-gray-300 max-w-2xl">{service.tagline}</p>
                    </div>
                </div>
            </div>

            <div className="container-main py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-medium mb-6">Overview</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {service.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-6">Key Features</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                        <Check className="text-blue-500 mt-1 shrink-0" size={18} />
                                        <span className="text-gray-200">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-6">Compatible Materials</h2>
                            <div className="flex flex-wrap gap-2">
                                {service.materials.map((material, i) => (
                                    <span key={i} className="px-4 py-2 bg-blue-900/20 text-blue-300 rounded-full text-sm border border-blue-800/50">
                                        {material}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 sticky top-24">
                            <h3 className="text-xl font-medium mb-6">Specifications</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Ruler className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Standard Tolerance</p>
                                        <p className="font-medium">{service.toleranceMin}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Info className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Max Part Size</p>
                                        <p className="font-medium">{service.maxPartSize}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Truck className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lead Time</p>
                                        <p className="font-medium">From {service.minLeadTimeDays} business days</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <ShieldCheck className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quality Assurance</p>
                                        <p className="font-medium">ISO 9001:2015</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <Link
                                    href={`/${language}/quote?service=${service.slug}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-4 rounded font-medium transition-colors"
                                >
                                    Get Instant Quote
                                </Link>
                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Starting from €{service.startingPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
