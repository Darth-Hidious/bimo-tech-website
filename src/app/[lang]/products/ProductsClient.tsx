"use client";

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Check, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/lib/cms/types';

interface ProductsClientProps {
    initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { language, t } = useLanguage();
    const [materialCategories, setMaterialCategories] = useState<Product[]>(initialProducts);

    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([initialProducts[0]?.id || 'rhenium']);
    const [compareMode, setCompareMode] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(['products']);

    // For single select mode, use first selected
    const selectedMaterial = selectedMaterials[0];

    const toggleMaterial = (id: string) => {
        if (compareMode) {
            // Multi-select mode
            setSelectedMaterials(prev => {
                if (prev.includes(id)) {
                    // Don't allow deselecting if it's the only one
                    if (prev.length === 1) return prev;
                    return prev.filter(m => m !== id);
                } else {
                    // Limit to 3 for comparison
                    if (prev.length >= 3) return prev;
                    return [...prev, id];
                }
            });
        } else {
            // Single select mode
            setSelectedMaterials([id]);
        }
    };

    const currentMaterial = materialCategories.find(m => m.id === selectedMaterial) || materialCategories[0];

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    if (!materialCategories.length) {
        // Fallback if strictly no data passed, though server should handle this
        return (
            <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>No products found.</p>
            </main>
        );
    }

    return (
        <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh' }}>
            {/* Header */}
            <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
                <div className="container-main">
                    <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('products.hero.label')}</p>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px', marginBottom: '32px' }}>{t('products.hero.title')}</h1>
                    <p style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', color: 'var(--bimo-text-secondary)', maxWidth: '800px', lineHeight: 1.7 }}>{t('products.hero.description')}</p>
                    <p style={{ fontSize: '15px', color: 'var(--bimo-text-disabled)', maxWidth: '800px', lineHeight: 1.7, marginTop: '20px' }}>{t('products.hero.industries')}</p>
                </div>
            </section>

            {/* Material Finder */}
            <section style={{ padding: '40px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-secondary)' }}>
                <div className="container-main">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', fontWeight: 500 }}>Select Material{compareMode ? 's (up to 3)' : ''}</p>
                        <button
                            onClick={() => {
                                setCompareMode(!compareMode);
                                if (compareMode) {
                                    // Exiting compare mode, keep only first selection
                                    setSelectedMaterials(prev => [prev[0]]);
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                border: compareMode ? '1px solid var(--bimo-accent)' : '1px solid var(--bimo-border)',
                                background: compareMode ? 'rgba(126, 25, 70, 0.15)' : 'transparent',
                                color: compareMode ? 'var(--bimo-text-primary)' : 'var(--bimo-text-secondary)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                            }}
                        >
                            {compareMode ? <X size={14} /> : <Check size={14} />}
                            {compareMode ? 'Exit Compare' : 'Compare Materials'}
                        </button>
                    </div>

                    {/* Periodic Table Style Material Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        {materialCategories.map((mat) => {
                            const isSelected = selectedMaterials.includes(mat.id);
                            return (
                                <button
                                    key={mat.id}
                                    onClick={() => toggleMaterial(mat.id)}
                                    style={{
                                        padding: '20px 16px',
                                        border: isSelected ? '2px solid var(--bimo-accent)' : '1px solid var(--bimo-border)',
                                        background: isSelected ? 'rgba(126, 25, 70, 0.15)' : 'var(--bimo-bg-secondary)',
                                        color: isSelected ? 'var(--bimo-text-primary)' : 'var(--bimo-text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        borderRadius: '8px',
                                        textAlign: 'left',
                                        position: 'relative',
                                    }}
                                >
                                    {compareMode && isSelected && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            width: '20px',
                                            height: '20px',
                                            background: 'var(--bimo-accent)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: 'var(--bimo-text-primary)'
                                        }}>
                                            {selectedMaterials.indexOf(mat.id) + 1}
                                        </span>
                                    )}
                                    <span style={{
                                        display: 'block',
                                        fontSize: '28px',
                                        fontWeight: 500,
                                        marginBottom: '4px',
                                        color: isSelected ? 'var(--bimo-accent)' : 'var(--bimo-text-disabled)'
                                    }}>
                                        {mat.symbol}
                                    </span>
                                    <span style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        marginBottom: '4px'
                                    }}>
                                        {mat.name}
                                    </span>
                                    <span style={{
                                        display: 'block',
                                        fontSize: '11px',
                                        color: 'var(--bimo-text-disabled)'
                                    }}>
                                        {mat.properties?.meltingPoint || '—'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Compare View */}
            {compareMode && selectedMaterials.length > 1 && (
                <section style={{ padding: '40px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-primary)' }}>
                    <div className="container-main">
                        <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '24px' }}>Material Comparison</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid var(--bimo-border)', fontSize: '11px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Property</th>
                                        {selectedMaterials.map(id => {
                                            const mat = materialCategories.find(m => m.id === id);
                                            return (
                                                <th key={id} style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid var(--bimo-border)', fontSize: '14px', fontWeight: 500 }}>
                                                    <span style={{ color: 'var(--bimo-accent)', marginRight: '8px' }}>{mat?.symbol}</span>
                                                    {mat?.name}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {['meltingPoint', 'density', 'thermalConductivity', 'electricalResistivity'].map(prop => (
                                        <tr key={prop}>
                                            <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--bimo-border)', fontSize: '13px', color: 'var(--bimo-text-disabled)' }}>
                                                {prop.replace(/([A-Z])/g, ' $1').trim()}
                                            </td>
                                            {selectedMaterials.map(id => {
                                                const mat = materialCategories.find(m => m.id === id);
                                                return (
                                                    <td key={id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--bimo-border)', fontSize: '14px' }}>
                                                        {mat?.properties?.[prop] || '—'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* Material Detail */}
            {currentMaterial && (
                <section style={{ padding: '60px 0', borderTop: '1px solid var(--bimo-border)' }}>
                    <div className="container-main">
                        {/* Material Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'start', marginBottom: '60px' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                border: '1px solid var(--bimo-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '36px',
                                fontWeight: 400,
                                color: 'var(--bimo-text-disabled)'
                            }}>
                                {currentMaterial.symbol}
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 500, marginBottom: '20px' }}>{currentMaterial.name}</h2>
                                <div style={{ fontSize: '16px', color: 'var(--bimo-text-secondary)', lineHeight: 1.7, maxWidth: '700px' }}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }: any) => <p style={{ marginBottom: '16px', color: 'var(--bimo-text-secondary)' }}>{children}</p>,
                                            ul: ({ children }: any) => <ul style={{ marginLeft: '20px', marginBottom: '16px', listStyleType: 'disc' }}>{children}</ul>,
                                            li: ({ children }: any) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                                            strong: ({ children }: any) => <strong style={{ color: 'var(--bimo-text-primary)', fontWeight: 600 }}>{children}</strong>,
                                            a: ({ children, href }: any) => <a href={href} style={{ color: 'var(--bimo-text-primary)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>,
                                        }}
                                    >
                                        {currentMaterial.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Properties */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('properties')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid var(--bimo-border)',
                                    cursor: 'pointer',
                                    color: 'var(--bimo-text-primary)'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.properties')}</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('properties') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('properties') && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', paddingBottom: '24px' }}>
                                    {Object.entries(currentMaterial.properties || {}).map(([key, value]) => (
                                        <div key={key}>
                                            <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                            <p style={{ fontSize: '15px', fontWeight: 500 }}>{value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Products */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('products')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid var(--bimo-border)',
                                    cursor: 'pointer',
                                    color: 'var(--bimo-text-primary)'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.productsAndSizes')}</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('products') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('products') && (
                                <div style={{ paddingBottom: '24px' }}>
                                    {(currentMaterial.products || []).map((product, i) => (
                                        <div key={i} style={{
                                            padding: '16px 0',
                                            borderBottom: i < (currentMaterial.products?.length || 0) - 1 ? '1px solid var(--bimo-border)' : 'none',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 2fr',
                                            gap: '20px',
                                            alignItems: 'start'
                                        }}>
                                            <h4 style={{ fontSize: '15px', fontWeight: 500 }}>{product.name}</h4>
                                            <div>
                                                <p style={{ fontSize: '13px', color: 'var(--bimo-text-secondary)' }}>{product.sizes}</p>
                                                {(product as any).standard && (
                                                    <p style={{ fontSize: '11px', color: 'var(--bimo-text-disabled)', marginTop: '4px' }}>Standard: {(product as any).standard}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Alloys */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('alloys')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid var(--bimo-border)',
                                    cursor: 'pointer',
                                    color: 'var(--bimo-text-primary)'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.alloysAndGrades')}</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('alloys') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('alloys') && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingBottom: '24px' }}>
                                    {(currentMaterial.alloys || []).map((alloy, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '6px 12px',
                                                border: '1px solid var(--bimo-border)',
                                                fontSize: '12px',
                                                color: 'var(--bimo-text-secondary)'
                                            }}
                                        >
                                            {alloy}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Applications */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('applications')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid var(--bimo-border)',
                                    cursor: 'pointer',
                                    color: 'var(--bimo-text-primary)'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.applications')}</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('applications') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('applications') && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', paddingBottom: '24px' }}>
                                    {(currentMaterial.applications || []).map((app, i) => (
                                        <p key={i} style={{ fontSize: '13px', color: 'var(--bimo-text-secondary)' }}>• {app}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Standards */}
                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => toggleSection('standards')}
                                style={{
                                    width: '100%',
                                    padding: '20px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid var(--bimo-border)',
                                    borderBottom: '1px solid var(--bimo-border)',
                                    cursor: 'pointer',
                                    color: 'var(--bimo-text-primary)'
                                }}
                            >
                                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.standards')}</span>
                                <ChevronDown size={18} style={{ transform: expandedSections.includes('standards') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {expandedSections.includes('standards') && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '24px 0' }}>
                                    {(currentMaterial.standards || []).map((std, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '4px 10px',
                                                backgroundColor: 'var(--bimo-bg-elevated)',
                                                fontSize: '11px',
                                                color: 'var(--bimo-text-disabled)'
                                            }}
                                        >
                                            {std}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px' }}>
                            <Link
                                href={`/${language}/contact`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 28px',
                                    border: '1px solid var(--bimo-text-primary)',
                                    fontSize: '13px',
                                    color: 'var(--bimo-text-primary)'
                                }}
                            >Request quote<ArrowRight size={16} />
                            </Link>
                            <Link
                                href={`/${language}/contact`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 28px',
                                    border: '1px solid var(--bimo-border)',
                                    fontSize: '13px',
                                    color: 'var(--bimo-text-secondary)'
                                }}
                            >Technical inquiry<ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Custom Products */}
            <section style={{ padding: '80px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-secondary)' }}>
                <div className="container-main">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                        <div>
                            <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Custom Manufacturing</p>
                            <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '24px' }}>Parts to your specifications</h2>
                            <p style={{ fontSize: '15px', color: 'var(--bimo-text-secondary)', lineHeight: 1.7 }}>We manufacture parts from all listed metals according to customer specifications and drawings.
                                If the product you are looking for is not on this list, please contact our orders and sales
                                department to discuss the possibility of sourcing or custom-made products.</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Quality Assurance</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {[
                                    { cert: 'ISO 9001', desc: 'Quality Management' },
                                    { cert: 'EN 9100', desc: 'Aerospace Standard' },
                                    { cert: 'ESA Qualified', desc: 'Space Applications' },
                                    { cert: 'Full Traceability', desc: 'Material Certification' },
                                ].map((item) => (
                                    <div key={item.cert}>
                                        <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>{item.cert}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--bimo-text-disabled)' }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px 0', borderTop: '1px solid var(--bimo-border)', textAlign: 'center' }}>
                <div className="container-main">
                    <h2 style={{ fontSize: '36px', fontWeight: 500, marginBottom: '20px' }}>Need something specific?</h2>
                    <p style={{ fontSize: '16px', color: 'var(--bimo-text-secondary)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>Contact our technical team to discuss your requirements. We specialize in custom solutions.</p>
                    <Link
                        href={`/${language}/contact`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 32px',
                            border: '1px solid var(--bimo-text-primary)',
                            fontSize: '14px'
                        }}
                    >Get in touch<ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
