"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { QuoteRequest, Material } from '@/lib/cms/types';
import { Upload, Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BimoAIChat from '@/components/BimoAIChat';

// Mock Materials for now
const MOCK_MATERIALS: Material[] = [
    { id: 'alu-6061', name: 'Aluminum 6061', category: 'aluminum', priceMultiplier: 1.0, properties: { 'Density': '2.7 g/cm³', 'Hardness': '95 HB' } },
    { id: 'alu-7075', name: 'Aluminum 7075', category: 'aluminum', priceMultiplier: 1.5, properties: { 'Density': '2.81 g/cm³', 'Hardness': '150 HB' } },
    { id: 'ss-304', name: 'Stainless Steel 304', category: 'steel', priceMultiplier: 2.2, properties: { 'Density': '8.0 g/cm³', 'Hardness': '215 HB' } },
    { id: 'ss-316', name: 'Stainless Steel 316L', category: 'steel', priceMultiplier: 2.5, properties: { 'Density': '8.0 g/cm³', 'Hardness': '149 HB' } },
    { id: 'abs', name: 'ABS', category: 'plastic', priceMultiplier: 0.8, properties: { 'Density': '1.04 g/cm³', 'Temp': '80°C' } },
];

// Mock Services for dropdown
const MOCK_SERVICES_LIST = [
    { id: 'cnc-milling', name: 'CNC Milling' },
    { id: 'cnc-turning', name: 'CNC Turning' },
    { id: 'sheet-metal', name: 'Sheet Metal' },
    { id: '3d-printing', name: '3D Printing' },
    { id: 'injection-molding', name: 'Injection Molding' },
    { id: 'wire-edm', name: 'Wire EDM' },
];

function QuoteContent() {
    const { language } = useLanguage();
    const searchParams = useSearchParams();
    const preselectedService = searchParams.get('service');

    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<QuoteRequest>>({
        serviceId: preselectedService || 'cnc-milling',
        materialId: 'alu-6061',
        quantity: 1,
        status: 'pending',
        fileUrls: [],
        requestNda: false,
    });

    const [trackingLink, setTrackingLink] = useState<string>('');

    // Handle Auto-fill from AI
    const handleAutoFill = (aiData: any) => {
        // Map AI data to form data
        // Only update fields that are present in the AI response
        setFormData(prev => ({
            ...prev,
            serviceId: aiData.serviceId || prev.serviceId,
            materialId: aiData.materialId || prev.materialId,
            quantity: aiData.quantity || prev.quantity,
            customerName: aiData.customerName || prev.customerName,
            customerEmail: aiData.customerEmail || prev.customerEmail,
        }));

        // Visual feedback (optional - could scroll to form)
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // Basic validation
            if (!formData.customerName || !formData.customerEmail) {
                throw new Error('Please fill in your contact information.');
            }

            // Generate tracking token
            const trackingToken = crypto.randomUUID();

            const quoteData: Omit<QuoteRequest, 'id'> = {
                createdAt: Date.now(),
                status: 'pending',
                customerName: formData.customerName!,
                customerEmail: formData.customerEmail!,
                customerPhone: formData.customerPhone || '',
                company: formData.company || '',
                serviceId: formData.serviceId!,
                materialId: formData.materialId!,
                quantity: Number(formData.quantity),
                fileUrls: [],
                requestNda: formData.requestNda,
                trackingToken,
            };

            const quoteId = await cms.submitQuote(quoteData);

            // Set tracking link for success screen
            setTrackingLink(`${window.location.origin}/${language}/track/${quoteId}?token=${trackingToken}`);

            setSubmitSuccess(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to submit quote. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
                <div style={{
                    border: '1px solid #333',
                    padding: '40px',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#22c55e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <Check className="text-white" size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '16px', color: '#fff' }}>Request Received</h1>
                    <p style={{ color: '#bbb', marginBottom: '24px', lineHeight: 1.6 }}>
                        Thank you. We will send a quote to <strong>{formData.customerEmail}</strong> within 24 hours.
                    </p>

                    {/* Magic Link Box */}
                    <div style={{ background: '#111', border: '1px solid #333', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
                        <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Track your order</p>
                        <p style={{ fontSize: '13px', color: '#ccc', marginBottom: '12px' }}>
                            Save this private link to track progress, send messages, and view your quote without logging in.
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                readOnly
                                value={trackingLink}
                                style={{ flex: 1, background: '#000', border: '1px solid #444', color: '#fff', fontSize: '12px', padding: '8px' }}
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(trackingLink)}
                                style={{ background: '#333', color: '#fff', border: 'none', padding: '0 12px', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Copy
                            </button>
                        </div>
                        <Link
                            href={trackingLink.replace(window.location.origin, '')}
                            style={{ display: 'inline-block', marginTop: '12px', fontSize: '12px', color: '#22c55e', textDecoration: 'underline' }}
                        >
                            Open Tracking Page →
                        </Link>
                    </div>

                    <button
                        onClick={() => window.location.href = `/${language}/services`}
                        style={{
                            padding: '14px 28px',
                            border: '1px solid #fff',
                            background: '#fff',
                            color: '#000',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Back to Services
                    </button>
                </div>
            </div>
        );
    }

    const inputStyle = {
        width: '100%',
        background: '#0a0a0a',
        border: '1px solid #333',
        padding: '16px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        borderRadius: '0'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: '#666',
        marginBottom: '8px',
        fontWeight: 500
    };

    return (
        <div className="container-main max-w-5xl">
            {/* Header */}
            <section style={{ paddingBottom: '80px' }}>
                <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Start Project</p>
                <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px', marginBottom: '32px' }}>Get an instant quote</h1>
                <p style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', color: '#bbb', maxWidth: '800px', lineHeight: 1.7 }}>
                    Upload your CAD files and configure your manufacturing requirements. We'll analyze your parts and provide a quote within 24 hours.
                </p>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '48px',
                    alignItems: 'center'
                }}>
                    {[
                        'Standard lead time: 3-5 days',
                        'Express delivery available',
                        'ISO 9001:2015 certified',
                        'NDA protection guaranteed'
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '10px 20px',
                            borderRadius: '100px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Check size={16} className="text-green-400" />
                            <span style={{ fontSize: '13px', color: '#eee', fontWeight: 500 }}>{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Chat Integration */}
            <BimoAIChat language={language} onAutoFill={handleAutoFill} />

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 mb-8 flex items-start gap-3">
                        <AlertCircle className="mt-1 shrink-0" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', borderTop: '1px solid #222', paddingTop: '60px' }}>

                    {/* Left Column - Specs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>1. Specifications</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Manufacturing Process</label>
                                    <select
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                        style={inputStyle}
                                    >
                                        {MOCK_SERVICES_LIST.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Material</label>
                                    <select
                                        value={formData.materialId}
                                        onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                                        style={inputStyle}
                                    >
                                        {MOCK_MATERIALS.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingTop: '40px', borderTop: '1px solid #222' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>2. CAD Files</h2>
                            <div style={{
                                border: '1px dashed #333',
                                padding: '60px 20px',
                                textAlign: 'center',
                                background: '#0a0a0a',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s'
                            }}
                                className="hover:border-white/50"
                            >
                                <Upload className="mx-auto text-gray-500 mb-4" size={24} />
                                <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>Click to upload files</p>
                                <p style={{ color: '#666', fontSize: '12px' }}>STEP, IGES, Parasolid (Max 100MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact & Submit */}
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>3. Details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.customerName || ''}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Jane Cooper"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Work Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.customerEmail || ''}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    style={inputStyle}
                                    placeholder="jane@company.com"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Company</label>
                                <input
                                    type="text"
                                    value={formData.company || ''}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Company Ltd."
                                />
                            </div>

                            {/* NDA Checkbox */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                <input
                                    type="checkbox"
                                    id="nda"
                                    checked={formData.requestNda || false}
                                    onChange={(e) => setFormData({ ...formData, requestNda: e.target.checked })}
                                    style={{ width: '16px', height: '16px', accentColor: '#22c55e', cursor: 'pointer' }}
                                />
                                <label htmlFor="nda" style={{ fontSize: '13px', color: '#bbb', cursor: 'pointer', userSelect: 'none' }}>
                                    Request standard NDA before quote
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    marginTop: '24px',
                                    padding: '20px',
                                    background: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px'
                                }}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Submit Quote Request
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '16px' }}>
                                By submitting this form, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function QuotePage() {
    return (
        <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={32} color="#fff" /></div>}>
                <QuoteContent />
            </Suspense>
            <Footer />
        </main>
    );
}
