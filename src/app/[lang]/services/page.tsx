"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { ManufacturingService } from '@/lib/cms/types';
import { ArrowRight, ArrowUpRight, ChevronDown, Loader2, Send, Bot, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import * as LucideIcons from 'lucide-react';

// Fallback data
const MOCK_SERVICES: ManufacturingService[] = [
    {
        id: 'cnc-milling',
        name: 'CNC Milling',
        slug: 'cnc-milling',
        tagline: '3-, 4- & full 5-axis CNC milling',
        description: 'High-precision parts with complex geometries. We use advanced 3, 4, and 5-axis machines.',
        icon: 'Hexagon',
        features: ['3/4/5-axis machining', 'Complex geometries', 'Thread milling', 'Tight tolerances'],
        materials: ['Aluminum', 'Steel', 'Titanium'],
        toleranceMin: '±0.02mm',
        maxPartSize: '1100x600x500mm',
        startingPrice: 25.00,
        minLeadTimeDays: 3,
        imageUrl: 'https://images.unsplash.com/photo-1565439396693-0176dfb6c6d7?auto=format&fit=crop&q=80&w=600',
        order: 1
    },
    {
        id: 'cnc-turning',
        name: 'CNC Turning',
        slug: 'cnc-turning',
        tagline: 'Precision turning & mill-turn',
        description: 'CNC turning for cylindrical parts with tight tolerances and mill-turn capabilities.',
        icon: 'CircleDot',
        features: ['Live tooling', 'Precision cylindrical parts', 'Axial drilling'],
        materials: ['Stainless Steel', 'Brass', 'Plastics'],
        toleranceMin: '±0.01mm',
        maxPartSize: 'Ø450x800mm',
        startingPrice: 20.00,
        minLeadTimeDays: 3,
        imageUrl: 'https://images.unsplash.com/photo-1622370830427-466d98d28124?auto=format&fit=crop&q=80&w=600',
        order: 2
    },
    {
        id: 'sheet-metal',
        name: 'Sheet Metal Fabrication',
        slug: 'sheet-metal',
        tagline: 'Laser cutting, bending & assembly',
        description: 'Rapid turnaround sheet metal fabrication. From laser cutting to welding and finishing.',
        icon: 'Layers',
        features: ['Laser cutting', 'CNC bending', 'Welding', 'Powder coating'],
        materials: ['Aluminum', 'Steel', 'Copper'],
        toleranceMin: '±0.1mm',
        maxPartSize: '3000x1500mm',
        startingPrice: 55.00,
        minLeadTimeDays: 4,
        imageUrl: 'https://images.unsplash.com/photo-1533236054176-6556536b3df3?auto=format&fit=crop&q=80&w=600',
        order: 3
    },
    {
        id: '3d-printing',
        name: '3D Printing / Additive',
        slug: '3d-printing',
        tagline: 'SLS, SLA, FDM & metal printing',
        description: 'Rapid prototyping and production with industrial 3D printing technologies.',
        icon: 'Box',
        features: ['SLS Nylon', 'SLA Resin', 'FDM', 'Metal DMLS'],
        materials: ['Nylon', 'Resin', 'PLA/ABS', 'Titanium'],
        toleranceMin: '±0.1mm',
        maxPartSize: '600x600x400mm',
        startingPrice: 15.00,
        minLeadTimeDays: 2,
        order: 4
    },
    {
        id: 'injection-molding',
        name: 'Injection Molding',
        slug: 'injection-molding',
        tagline: 'Tooling & mass production',
        description: 'From prototype tooling to full-scale production injection molding.',
        icon: 'Droplet',
        features: ['Rapid tooling', 'Production tooling', 'Overmolding', 'Insert molding'],
        materials: ['ABS', 'PC', 'PP', 'Nylon'],
        toleranceMin: '±0.05mm',
        maxPartSize: '800x600x400mm',
        startingPrice: 2500.00,
        minLeadTimeDays: 14,
        order: 5
    },
    {
        id: 'wire-edm',
        name: 'Wire EDM',
        slug: 'wire-edm',
        tagline: 'Electrical discharge machining',
        description: 'Ultra-precise cutting for hardened materials and conductive metals.',
        icon: 'Zap',
        features: ['Hardened steel', 'Tight tolerances', 'Complex shapes', 'Micro features'],
        materials: ['Tool Steel', 'Carbide', 'Titanium'],
        toleranceMin: '±0.005mm',
        maxPartSize: '500x400x300mm',
        startingPrice: 150.00,
        minLeadTimeDays: 5,
        order: 6
    }
];

// Inline AI Chat Component
interface Message {
    role: 'user' | 'assistant';
    content: string;
    recommendations?: { service: ManufacturingService; matchScore: number; reason: string }[];
}

function BimoAIChat({ services, language }: { services: ManufacturingService[]; language: string }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "I'm Bimo, your manufacturing AI. Describe your project and I'll recommend the best services." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    const analyzeAndRecommend = (userMessage: string) => {
        const msg = userMessage.toLowerCase();
        const recommendations: { service: ManufacturingService; matchScore: number; reason: string }[] = [];
        const keywords: Record<string, string[]> = {
            'cnc-milling': ['milling', 'cnc', 'complex', 'geometry', '5-axis', 'aluminum', 'precision'],
            'cnc-turning': ['turning', 'cylindrical', 'lathe', 'round', 'shaft', 'rod'],
            'sheet-metal': ['sheet', 'metal', 'bend', 'laser', 'cut', 'bracket', 'panel'],
            '3d-printing': ['3d print', 'additive', 'prototype', 'rapid', 'plastic'],
            'injection-molding': ['injection', 'mold', 'plastic', 'mass production', 'volume'],
            'wire-edm': ['edm', 'wire', 'electrical discharge', 'hardened'],
        };

        services.forEach(service => {
            const kws = keywords[service.id] || [];
            const matches = kws.filter(kw => msg.includes(kw));
            if (matches.length > 0) {
                recommendations.push({
                    service,
                    matchScore: Math.min(95, 60 + matches.length * 12),
                    reason: service.tagline || `Ideal for ${matches[0]}`
                });
            }
        });

        recommendations.sort((a, b) => b.matchScore - a.matchScore);
        if (recommendations.length === 0 && services.length > 0) {
            services.slice(0, 3).forEach((s, i) => {
                recommendations.push({ service: s, matchScore: 75 - i * 5, reason: s.tagline });
            });
        }
        return recommendations.slice(0, 3);
    };

    const handleSubmit = async (text?: string) => {
        const query = text || input.trim();
        if (!query || loading) return;
        setInput('');
        setLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: query }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, { role: 'user', content: query }], context: {} })
            });
            const data = await res.json();
            const recs = analyzeAndRecommend(query);
            setMessages(prev => [...prev, { role: 'assistant', content: data.response, recommendations: recs.length > 0 ? recs : undefined }]);
        } catch {
            const recs = analyzeAndRecommend(query);
            setMessages(prev => [...prev, { role: 'assistant', content: recs.length > 0 ? "Based on your project, here are my recommendations:" : "Tell me more about your project - material, quantity, or process.", recommendations: recs.length > 0 ? recs : undefined }]);
        } finally {
            setLoading(false);
        }
    };

    const quickPrompts = ["CNC machining for aluminum", "Rapid prototyping", "Sheet metal enclosure", "High-volume production"];

    return (
        <div style={{ border: '1px solid #222' }}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#0a0a0a',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bot size={20} style={{ color: '#888' }} />
                    <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Bimo AI Consultation</span>
                    <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
                </div>
                <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#888' }} />
            </button>

            {isExpanded && (
                <>
                    {/* Messages */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '20px 24px', borderTop: '1px solid #222' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '14px', color: msg.role === 'user' ? '#fff' : '#bbb', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '10px', color: '#666', marginRight: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {msg.role === 'user' ? 'You' : 'Bimo'}
                                    </span>
                                    {msg.content}
                                </p>
                                {msg.recommendations && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                                        {msg.recommendations.map((rec, j) => (
                                            <Link
                                                key={j}
                                                href={`/${language}/quote?service=${rec.service.id}`}
                                                style={{
                                                    padding: '16px',
                                                    border: '1px solid #333',
                                                    display: 'block',
                                                    transition: 'border-color 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                    <Sparkles size={12} style={{ color: '#888' }} />
                                                    <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recommended</span>
                                                    <span style={{ fontSize: '10px', color: '#22c55e', marginLeft: 'auto' }}>{rec.matchScore}%</span>
                                                </div>
                                                <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>{rec.service.name}</p>
                                                <p style={{ fontSize: '12px', color: '#888' }}>{rec.reason}</p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <p style={{ fontSize: '12px', color: '#666' }}>Bimo is thinking...</p>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick prompts */}
                    {messages.length < 4 && !loading && (
                        <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {quickPrompts.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSubmit(p)}
                                    style={{
                                        padding: '6px 12px',
                                        border: '1px solid #333',
                                        background: 'transparent',
                                        color: '#999',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >{p}</button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{ display: 'flex', gap: '8px', padding: '16px 24px', borderTop: '1px solid #222', background: '#0a0a0a' }}>
                        <input
                            type="text"
                            placeholder="Describe your manufacturing project..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                background: '#000',
                                border: '1px solid #333',
                                color: '#fff',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '12px 16px',
                                background: input.trim() ? '#fff' : '#333',
                                border: 'none',
                                color: input.trim() ? '#000' : '#666',
                                cursor: input.trim() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ServicesPage() {
    const { language, t } = useLanguage();
    const [services, setServices] = useState<ManufacturingService[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>(['features']);

    useEffect(() => {
        async function loadServices() {
            try {
                const data = await cms.getServices();
                setServices(data && data.length > 0 ? data : MOCK_SERVICES);
            } catch {
                setServices(MOCK_SERVICES);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    useEffect(() => {
        if (services.length > 0 && !selectedService) {
            setSelectedService(services[0].id);
        }
    }, [services, selectedService]);

    const currentService = services.find(s => s.id === selectedService) || services[0];

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    if (loading) {
        return (
            <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin text-white" size={48} />
            </main>
        );
    }

    const IconComponent = currentService ? ((LucideIcons as any)[currentService.icon] || LucideIcons.Settings) : LucideIcons.Settings;

    return (
        <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
            {/* Header */}
            <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
                <div className="container-main">
                    <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('services.hero.label')}</p>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px', marginBottom: '32px' }}>{t('services.hero.title')}</h1>
                    <p style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', color: '#bbb', maxWidth: '800px', lineHeight: 1.7 }}>{t('services.hero.description')}</p>
                </div>
            </section>

            {/* Bimo AI Consultation */}
            <section style={{ padding: '0 0 40px' }}>
                <div className="container-main">
                    <BimoAIChat services={services} language={language} />
                </div>
            </section>

            {/* Service Selector */}
            <section style={{ padding: '24px 0', borderTop: '1px solid #222', position: 'sticky', top: '80px', backgroundColor: '#000', zIndex: 10 }}>
                <div className="container-main">
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedService(service.id)}
                                style={{
                                    padding: '8px 14px',
                                    border: selectedService === service.id ? '1px solid #fff' : '1px solid #333',
                                    background: selectedService === service.id ? '#fff' : 'transparent',
                                    color: selectedService === service.id ? '#000' : '#bbb',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Detail */}
            {currentService && (
                <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
                    <div className="container-main">
                        {/* Service Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'start', marginBottom: '60px' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                border: '1px solid #444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <IconComponent size={36} style={{ color: '#999' }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 500, marginBottom: '12px' }}>{currentService.name}</h2>
                                <p style={{ fontSize: '15px', color: '#888', marginBottom: '20px' }}>{currentService.tagline}</p>
                                <p style={{ fontSize: '16px', color: '#bbb', lineHeight: 1.7, maxWidth: '700px' }}>
                                    {currentService.description}
                                </p>
                            </div>
                        </div>

                        {/* Specs */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', marginBottom: '40px', padding: '24px 0', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
                            <div>
                                <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>Starting Price</p>
                                <p style={{ fontSize: '18px', fontWeight: 500 }}>€{currentService.startingPrice}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>Lead Time</p>
                                <p style={{ fontSize: '18px', fontWeight: 500 }}>{currentService.minLeadTimeDays}+ days</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>Tolerance</p>
                                <p style={{ fontSize: '18px', fontWeight: 500 }}>{currentService.toleranceMin}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>Max Part Size</p>
                                <p style={{ fontSize: '18px', fontWeight: 500 }}>{currentService.maxPartSize}</p>
                            </div>
                        </div>

                        {/* Features Accordion */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('features')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid #222',
                                    cursor: 'pointer',
                                    color: '#fff'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Features & Capabilities</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('features') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('features') && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingBottom: '24px' }}>
                                    {currentService.features.map((feature, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Check size={14} style={{ color: '#22c55e' }} />
                                            <span style={{ fontSize: '14px', color: '#bbb' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Materials Accordion */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('materials')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid #222',
                                    borderBottom: '1px solid #222',
                                    cursor: 'pointer',
                                    color: '#fff'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Compatible Materials</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('materials') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('materials') && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '24px 0' }}>
                                    {currentService.materials.map((mat, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid #444',
                                                fontSize: '12px',
                                                color: '#bbb'
                                            }}
                                        >
                                            {mat}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px' }}>
                            <Link
                                href={`/${language}/quote?service=${currentService.id}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 28px',
                                    border: '1px solid #fff',
                                    fontSize: '13px',
                                    color: '#fff'
                                }}
                            >Get quote<ArrowRight size={16} /></Link>
                            <Link
                                href={`/${language}/contact`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 28px',
                                    border: '1px solid #444',
                                    fontSize: '13px',
                                    color: '#bbb'
                                }}
                            >Technical inquiry<ArrowUpRight size={16} /></Link>
                        </div>
                    </div>
                </section>
            )}

            {/* All Services Overview */}
            <section style={{ padding: '80px 0', borderTop: '1px solid #222', backgroundColor: '#0a0a0a' }}>
                <div className="container-main">
                    <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>All Services</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {services.map((service) => {
                            const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Settings;
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => {
                                        setSelectedService(service.id);
                                        window.scrollTo({ top: 400, behavior: 'smooth' });
                                    }}
                                    style={{
                                        padding: '24px',
                                        border: selectedService === service.id ? '1px solid #fff' : '1px solid #333',
                                        background: 'transparent',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={24} style={{ color: '#888', marginBottom: '16px' }} />
                                    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>{service.name}</h3>
                                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>{service.tagline}</p>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#666' }}>
                                        <span>From €{service.startingPrice}</span>
                                        <span>{service.minLeadTimeDays}+ days</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px 0', borderTop: '1px solid #222', textAlign: 'center' }}>
                <div className="container-main">
                    <h2 style={{ fontSize: '36px', fontWeight: 500, marginBottom: '20px' }}>Ready to start?</h2>
                    <p style={{ fontSize: '16px', color: '#bbb', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
                        Upload your CAD files and get an instant quote for your manufacturing project.
                    </p>
                    <Link
                        href={`/${language}/quote`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 32px',
                            border: '1px solid #fff',
                            fontSize: '14px'
                        }}
                    >Start new quote<ArrowRight size={18} /></Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
