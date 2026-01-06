"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { Product } from '@/lib/cms/types';

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [materialCategories, setMaterialCategories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('rhenium');
  const [expandedSections, setExpandedSections] = useState<string[]>(['products']);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cms.getProducts();
        // Sort by a defined order or just use the fetched order. 
        // For now, let's keep it simple.
        // If data exists and rhenimum is not there, we might fallback.
        setMaterialCategories(data);
      } catch (e) {
        console.error("Failed to load products", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentMaterial = materialCategories.find(m => m.id === selectedMaterial) || materialCategories[0];

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (loading) {
    return (
      <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-white" size={48} />
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('products.hero.label')}</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px', marginBottom: '32px' }}>{t('products.hero.title')}</h1>
          <p style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', color: '#bbb', maxWidth: '800px', lineHeight: 1.7 }}>{t('products.hero.description')}</p>
          <p style={{ fontSize: '15px', color: '#999', maxWidth: '800px', lineHeight: 1.7, marginTop: '20px' }}>{t('products.hero.industries')}</p>
        </div>
      </section>

      {/* Material Selector */}
      <section style={{ padding: '24px 0', borderTop: '1px solid #222', position: 'sticky', top: '80px', backgroundColor: '#000', zIndex: 10 }}>
        <div className="container-main">
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {materialCategories.map((mat) => (
              <button
                key={mat.id}
                onClick={() => setSelectedMaterial(mat.id)}
                style={{
                  padding: '8px 14px',
                  border: selectedMaterial === mat.id ? '1px solid #fff' : '1px solid #333',
                  background: selectedMaterial === mat.id ? '#fff' : 'transparent',
                  color: selectedMaterial === mat.id ? '#000' : '#bbb',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {mat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Material Detail */}
      {currentMaterial && (
        <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
          <div className="container-main">
            {/* Material Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'start', marginBottom: '60px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                border: '1px solid #444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 400,
                color: '#999'
              }}>
                {currentMaterial.symbol}
              </div>
              <div>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 500, marginBottom: '20px' }}>{currentMaterial.name}</h2>
                <div style={{ fontSize: '16px', color: '#bbb', lineHeight: 1.7, maxWidth: '700px' }}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }: any) => <p style={{ marginBottom: '16px', color: '#bbb' }}>{children}</p>,
                      ul: ({ children }: any) => <ul style={{ marginLeft: '20px', marginBottom: '16px', listStyleType: 'disc' }}>{children}</ul>,
                      li: ({ children }: any) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                      strong: ({ children }: any) => <strong style={{ color: '#fff', fontWeight: 600 }}>{children}</strong>,
                      a: ({ children, href }: any) => <a href={href} style={{ color: '#fff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>,
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
                  borderTop: '1px solid #222',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.properties')}</span>
                <ChevronDown size={18} style={{ transform: expandedSections.includes('properties') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {expandedSections.includes('properties') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', paddingBottom: '24px' }}>
                  {Object.entries(currentMaterial.properties).map(([key, value]) => (
                    <div key={key}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>
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
                  borderTop: '1px solid #222',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.productsAndSizes')}</span>
                <ChevronDown size={18} style={{ transform: expandedSections.includes('products') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {expandedSections.includes('products') && (
                <div style={{ paddingBottom: '24px' }}>
                  {currentMaterial.products.map((product, i) => (
                    <div key={i} style={{
                      padding: '16px 0',
                      borderBottom: i < currentMaterial.products.length - 1 ? '1px solid #1a1a1a' : 'none',
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: '20px',
                      alignItems: 'start'
                    }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 500 }}>{product.name}</h4>
                      <div>
                        <p style={{ fontSize: '13px', color: '#bbb' }}>{product.sizes}</p>
                        {(product as any).standard && (
                          <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Standard: {(product as any).standard}</p>
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
                  borderTop: '1px solid #222',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.alloysAndGrades')}</span>
                <ChevronDown size={18} style={{ transform: expandedSections.includes('alloys') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {expandedSections.includes('alloys') && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingBottom: '24px' }}>
                  {currentMaterial.alloys.map((alloy, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #444',
                        fontSize: '12px',
                        color: '#bbb'
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
                  borderTop: '1px solid #222',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.applications')}</span>
                <ChevronDown size={18} style={{ transform: expandedSections.includes('applications') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {expandedSections.includes('applications') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', paddingBottom: '24px' }}>
                  {currentMaterial.applications.map((app, i) => (
                    <p key={i} style={{ fontSize: '13px', color: '#bbb' }}>• {app}</p>
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
                  borderTop: '1px solid #222',
                  borderBottom: '1px solid #222',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('products.sections.standards')}</span>
                <ChevronDown size={18} style={{ transform: expandedSections.includes('standards') ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {expandedSections.includes('standards') && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '24px 0' }}>
                  {currentMaterial.standards.map((std, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#111',
                        fontSize: '11px',
                        color: '#999'
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
                  border: '1px solid #fff',
                  fontSize: '13px',
                  color: '#fff'
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
                  border: '1px solid #444',
                  fontSize: '13px',
                  color: '#bbb'
                }}
              >Technical inquiry<ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Custom Products */}
      <section style={{ padding: '80px 0', borderTop: '1px solid #222', backgroundColor: '#0a0a0a' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Custom Manufacturing</p>
              <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '24px' }}>Parts to your specifications</h2>
              <p style={{ fontSize: '15px', color: '#bbb', lineHeight: 1.7 }}>We manufacture parts from all listed metals according to customer specifications and drawings.
                If the product you are looking for is not on this list, please contact our orders and sales
                department to discuss the possibility of sourcing or custom-made products.</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Quality Assurance</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                  { cert: 'ISO 9001', desc: 'Quality Management' },
                  { cert: 'EN 9100', desc: 'Aerospace Standard' },
                  { cert: 'ESA Qualified', desc: 'Space Applications' },
                  { cert: 'Full Traceability', desc: 'Material Certification' },
                ].map((item) => (
                  <div key={item.cert}>
                    <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>{item.cert}</p>
                    <p style={{ fontSize: '11px', color: '#999' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', borderTop: '1px solid #222', textAlign: 'center' }}>
        <div className="container-main">
          <h2 style={{ fontSize: '36px', fontWeight: 500, marginBottom: '20px' }}>Need something specific?</h2>
          <p style={{ fontSize: '16px', color: '#bbb', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>Contact our technical team to discuss your requirements. We specialize in custom solutions.</p>
          <Link
            href={`/${language}/contact`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              border: '1px solid #fff',
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
