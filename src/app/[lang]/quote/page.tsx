"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { QuoteRequest, Material } from '@/lib/cms/types';
import { Upload, Check, AlertCircle, Loader2, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Mock Materials for now
const MOCK_MATERIALS: Material[] = [
    { id: 'tungsten', name: 'Tungsten', category: 'refractory', priceMultiplier: 3.0, properties: { 'Melting Point': '3422°C', 'Density': '19.3 g/cm³' } },
    { id: 'molybdenum', name: 'Molybdenum', category: 'refractory', priceMultiplier: 2.5, properties: { 'Melting Point': '2623°C', 'Density': '10.2 g/cm³' } },
    { id: 'titanium', name: 'Titanium', category: 'structural', priceMultiplier: 2.0, properties: { 'Density': '4.5 g/cm³' } },
    { id: 'rhenium', name: 'Rhenium', category: 'refractory', priceMultiplier: 5.0, properties: { 'Melting Point': '3180°C' } },
    { id: 'tantalum', name: 'Tantalum', category: 'refractory', priceMultiplier: 3.5, properties: {} },
    { id: 'niobium', name: 'Niobium', category: 'refractory', priceMultiplier: 2.8, properties: {} },
    { id: 'alu-6061', name: 'Aluminum 6061', category: 'aluminum', priceMultiplier: 1.0, properties: { 'Density': '2.7 g/cm³' } },
    { id: 'ss-304', name: 'Stainless Steel 304', category: 'steel', priceMultiplier: 2.2, properties: {} },
];

// Mock Services
const MOCK_SERVICES_LIST = [
    { id: 'cnc-milling', name: 'CNC Milling' },
    { id: 'cnc-turning', name: 'CNC Turning' },
    { id: 'sheet-metal', name: 'Sheet Metal' },
    { id: '3d-printing', name: '3D Printing' },
    { id: 'wire-edm', name: 'Wire EDM' },
];

// Types for AI extraction
interface ExtractedSpecs {
    material?: string;
    materialConfidence?: number;
    form?: string;
    formConfidence?: number;
    dimensions?: string;
    dimensionsConfidence?: number;
    quantity?: number;
    quantityConfidence?: number;
    standard?: string;
    standardConfidence?: number;
    application?: string;
    applicationConfidence?: number;
    additionalNotes?: string;
}

interface ExtractionResult {
    extracted: ExtractedSpecs;
    summary: string;
    suggestedService?: string;
    overallConfidence: number;
}

// Confidence badge component
function ConfidenceBadge({ confidence }: { confidence?: number }) {
    if (!confidence) return null;
    const color = confidence >= 80 ? '#22c55e' : confidence >= 50 ? '#eab308' : '#ef4444';
    return (
        <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: `${color}20`,
            color: color,
            marginLeft: '8px',
            fontWeight: 500
        }}>
            {confidence}%
        </span>
    );
}

function QuoteContent() {
    const { language } = useLanguage();
    const searchParams = useSearchParams();
    const preselectedService = searchParams.get('service');

    // AI Extraction state
    const [rawSpecs, setRawSpecs] = useState('');
    const [extracting, setExtracting] = useState(false);
    const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
    const [showManualForm, setShowManualForm] = useState(false);

    // Form state
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<QuoteRequest> & {
        dimensions?: string;
        form?: string;
        standard?: string;
        application?: string;
        notes?: string;
    }>({
        serviceId: preselectedService || 'cnc-milling',
        materialId: 'tungsten',
        quantity: 1,
        status: 'pending',
        fileUrls: [],
        requestNda: false,
    });

    const [trackingLink, setTrackingLink] = useState<string>('');

    // AI Extraction handler
    const handleExtractSpecs = async () => {
        if (!rawSpecs.trim()) return;

        setExtracting(true);
        setError('');

        try {
            const response = await fetch('/api/quote/extract-specs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawText: rawSpecs }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze specifications');
            }

            const result: ExtractionResult = await response.json();
            setExtraction(result);

            // Auto-fill form with extracted data
            const materialMatch = MOCK_MATERIALS.find(m =>
                result.extracted.material?.toLowerCase().includes(m.name.toLowerCase()) ||
                m.name.toLowerCase().includes(result.extracted.material?.toLowerCase() || '')
            );

            setFormData(prev => ({
                ...prev,
                materialId: materialMatch?.id || prev.materialId,
                serviceId: result.suggestedService || prev.serviceId,
                quantity: result.extracted.quantity || prev.quantity,
                dimensions: result.extracted.dimensions || '',
                form: result.extracted.form || '',
                standard: result.extracted.standard || '',
                application: result.extracted.application || '',
                notes: result.extracted.additionalNotes || '',
            }));

            setShowManualForm(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to analyze specifications');
        } finally {
            setExtracting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (!formData.customerName || !formData.customerEmail) {
                throw new Error('Please fill in your contact information.');
            }

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
                // Store extra fields in notes or description
                description: [
                    formData.form && `Form: ${formData.form}`,
                    formData.dimensions && `Dimensions: ${formData.dimensions}`,
                    formData.standard && `Standard: ${formData.standard}`,
                    formData.application && `Application: ${formData.application}`,
                    formData.notes && `Notes: ${formData.notes}`,
                    rawSpecs && `Original specs: ${rawSpecs}`,
                ].filter(Boolean).join('\n'),
            };

            const quoteId = await cms.submitQuote(quoteData);
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
                    border: '1px solid var(--bimo-border)',
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
                    <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '16px', color: 'var(--bimo-text-primary)' }}>Request Received</h1>
                    <p style={{ color: 'var(--bimo-text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                        Thank you. We will send a quote to <strong>{formData.customerEmail}</strong> within 24 hours.
                    </p>

                    <div style={{ background: 'var(--bimo-bg-secondary)', border: '1px solid var(--bimo-border)', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
                        <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Track your order</p>
                        <p style={{ fontSize: '13px', color: 'var(--bimo-text-secondary)', marginBottom: '12px' }}>
                            Save this private link to track progress and view your quote.
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                readOnly
                                value={trackingLink}
                                style={{ flex: 1, background: 'var(--bimo-bg-primary)', border: '1px solid var(--bimo-border)', color: 'var(--bimo-text-primary)', fontSize: '12px', padding: '8px' }}
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(trackingLink)}
                                style={{ background: 'var(--bimo-border)', color: 'var(--bimo-text-primary)', border: 'none', padding: '0 12px', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.href = `/${language}/services`}
                        style={{
                            padding: '14px 28px',
                            border: '1px solid var(--bimo-text-primary)',
                            background: 'var(--bimo-text-primary)',
                            color: 'var(--bimo-bg-primary)',
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
        background: 'var(--bimo-bg-secondary)',
        border: '1px solid var(--bimo-border)',
        padding: '16px',
        color: 'var(--bimo-text-primary)',
        fontSize: '14px',
        outline: 'none',
        borderRadius: '0'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'var(--bimo-text-disabled)',
        marginBottom: '8px',
        fontWeight: 500
    };

    return (
        <div className="container-main max-w-5xl">
            {/* Header */}
            <section style={{ paddingBottom: '60px' }}>
                <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Start Project</p>
                <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px', marginBottom: '32px' }}>Get an instant quote</h1>
                <p style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', color: 'var(--bimo-text-secondary)', maxWidth: '800px', lineHeight: 1.7 }}>
                    Paste your specifications below and our AI will extract the details, or fill in the form manually.
                </p>
            </section>

            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="mt-1 shrink-0" size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* AI Spec Input */}
            <section style={{
                padding: '40px',
                border: '1px solid var(--bimo-border)',
                marginBottom: '40px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Sparkles size={20} style={{ color: '#818cf8' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 500 }}>AI-Assisted Quote</h2>
                    <span style={{
                        fontSize: '10px',
                        padding: '4px 8px',
                        background: 'rgba(129, 140, 248, 0.2)',
                        color: '#818cf8',
                        borderRadius: '4px',
                        fontWeight: 500
                    }}>
                        BETA
                    </span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)', marginBottom: '20px' }}>
                    Paste your material specifications, purchase order text, or describe your requirements. Our AI will extract the details automatically.
                </p>

                <textarea
                    value={rawSpecs}
                    onChange={(e) => setRawSpecs(e.target.value)}
                    placeholder="Example: We need 50 tungsten sheets, 2mm thickness, 100x200mm, ASTM B760, for aerospace shielding application. Delivery to Germany."
                    style={{
                        ...inputStyle,
                        minHeight: '120px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                    }}
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleExtractSpecs}
                        disabled={extracting || !rawSpecs.trim()}
                        style={{
                            padding: '14px 24px',
                            background: rawSpecs.trim() ? '#6366f1' : 'var(--bimo-border)',
                            color: 'white',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: rawSpecs.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: extracting ? 0.7 : 1
                        }}
                    >
                        {extracting ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Extract Specifications
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setShowManualForm(!showManualForm)}
                        style={{
                            padding: '14px 24px',
                            background: 'transparent',
                            color: 'var(--bimo-text-secondary)',
                            border: '1px solid var(--bimo-border)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {showManualForm ? 'Hide' : 'Show'} Manual Form
                        {showManualForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                {/* Extraction Results */}
                {extraction && (
                    <div style={{ marginTop: '32px', padding: '24px', background: 'var(--bimo-bg-secondary)', border: '1px solid var(--bimo-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--bimo-text-primary)' }}>Extracted Information</h3>
                            <span style={{
                                fontSize: '11px',
                                padding: '4px 10px',
                                background: extraction.overallConfidence >= 70 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                color: extraction.overallConfidence >= 70 ? '#22c55e' : '#eab308',
                                borderRadius: '4px',
                                fontWeight: 500
                            }}>
                                {extraction.overallConfidence}% Confidence
                            </span>
                        </div>

                        <p style={{ fontSize: '13px', color: 'var(--bimo-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                            {extraction.summary}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                            {extraction.extracted.material && (
                                <div>
                                    <p style={{ fontSize: '10px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Material <ConfidenceBadge confidence={extraction.extracted.materialConfidence} />
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-primary)' }}>{extraction.extracted.material}</p>
                                </div>
                            )}
                            {extraction.extracted.form && (
                                <div>
                                    <p style={{ fontSize: '10px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Form <ConfidenceBadge confidence={extraction.extracted.formConfidence} />
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-primary)' }}>{extraction.extracted.form}</p>
                                </div>
                            )}
                            {extraction.extracted.dimensions && (
                                <div>
                                    <p style={{ fontSize: '10px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Dimensions <ConfidenceBadge confidence={extraction.extracted.dimensionsConfidence} />
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-primary)' }}>{extraction.extracted.dimensions}</p>
                                </div>
                            )}
                            {extraction.extracted.quantity && (
                                <div>
                                    <p style={{ fontSize: '10px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Quantity <ConfidenceBadge confidence={extraction.extracted.quantityConfidence} />
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-primary)' }}>{extraction.extracted.quantity}</p>
                                </div>
                            )}
                            {extraction.extracted.standard && (
                                <div>
                                    <p style={{ fontSize: '10px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Standard <ConfidenceBadge confidence={extraction.extracted.standardConfidence} />
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-primary)' }}>{extraction.extracted.standard}</p>
                                </div>
                            )}
                            {extraction.extracted.application && (
                                <div>
                                    <p style={{ fontSize: '10px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                        Application <ConfidenceBadge confidence={extraction.extracted.applicationConfidence} />
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-primary)' }}>{extraction.extracted.application}</p>
                                </div>
                            )}
                        </div>

                        <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '20px' }}>
                            Review and adjust the form below, then submit your quote request.
                        </p>
                    </div>
                )}
            </section>

            {/* Manual Form */}
            {(showManualForm || extraction) && (
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', borderTop: '1px solid var(--bimo-border)', paddingTop: '60px' }}>

                        {/* Left Column - Specs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>1. Specifications</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={labelStyle}>Form/Shape</label>
                                            <input
                                                type="text"
                                                value={formData.form || ''}
                                                onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                                                style={inputStyle}
                                                placeholder="Sheet, Rod, Wire..."
                                            />
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

                                    <div>
                                        <label style={labelStyle}>Dimensions</label>
                                        <input
                                            type="text"
                                            value={formData.dimensions || ''}
                                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                            style={inputStyle}
                                            placeholder="e.g., 100x200mm, 2mm thickness"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={labelStyle}>Standard (optional)</label>
                                            <input
                                                type="text"
                                                value={formData.standard || ''}
                                                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                                                style={inputStyle}
                                                placeholder="ASTM, AMS, ISO..."
                                            />
                                        </div>
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
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Application / Notes (optional)</label>
                                        <textarea
                                            value={formData.notes || ''}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                            placeholder="Aerospace, medical, nuclear, or other application details..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ paddingTop: '40px', borderTop: '1px solid var(--bimo-border)' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>2. CAD Files (optional)</h2>
                                <div style={{
                                    border: '1px dashed var(--bimo-border)',
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    background: 'var(--bimo-bg-secondary)',
                                    cursor: 'pointer',
                                }}
                                >
                                    <Upload className="mx-auto text-gray-500 mb-4" size={24} />
                                    <p style={{ color: 'var(--bimo-text-primary)', fontSize: '14px', marginBottom: '8px' }}>Click to upload files</p>
                                    <p style={{ color: 'var(--bimo-text-disabled)', fontSize: '12px' }}>STEP, IGES, PDF drawings (Max 100MB)</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact & Submit */}
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '32px' }}>3. Contact Details</h2>
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

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="nda"
                                        checked={formData.requestNda || false}
                                        onChange={(e) => setFormData({ ...formData, requestNda: e.target.checked })}
                                        style={{ width: '16px', height: '16px', accentColor: '#22c55e', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="nda" style={{ fontSize: '13px', color: 'var(--bimo-text-secondary)', cursor: 'pointer' }}>
                                        Request standard NDA before quote
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        marginTop: '24px',
                                        padding: '20px',
                                        background: 'var(--bimo-text-primary)',
                                        color: 'var(--bimo-bg-primary)',
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
                                <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', textAlign: 'center', marginTop: '16px' }}>
                                    By submitting, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Benefits */}
            <section style={{ marginTop: '80px', padding: '40px 0', borderTop: '1px solid var(--bimo-border)' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center'
                }}>
                    {[
                        'Response within 24 hours',
                        'Express delivery available',
                        'ISO 9001:2015 certified',
                        'NDA protection'
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
                            <span style={{ fontSize: '13px', color: 'var(--bimo-text-primary)', fontWeight: 500 }}>{item}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function QuotePage() {
    return (
        <main style={{
            backgroundColor: 'var(--bimo-bg-primary)',
            color: 'var(--bimo-text-primary)',
            minHeight: '100vh',
            paddingTop: '140px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ flex: 1, paddingBottom: '100px' }}>
                <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={32} color="var(--bimo-text-primary)" /></div>}>
                    <QuoteContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
