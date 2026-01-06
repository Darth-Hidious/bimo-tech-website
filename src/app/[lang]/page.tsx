"use client";

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { language, t } = useLanguage();

  const brands = [
    { name: 'ESA', src: '/brands/ESA_logo_2020_White.svg' },
    { name: 'ArianeGroup', src: '/brands/arianegroup.svg' },
    { name: 'Fusion for Energy', src: '/brands/F4E.svg' },
    { name: 'IPPT PAN', src: '/brands/IPPT_PAN.svg' },
    { name: 'NCBJ', src: '/brands/NCBJ.svg' },
  ];

  return (
    <main style={{ backgroundColor: '#000', color: '#fff' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '200vh' }}>
        <Hero />
      </div>

      {/* Mission */}
      <section style={{ padding: '120px 0' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Our Purpose</p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 72px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px' }}>We engineer the materials that make <span style={{ color: '#888' }}>the impossible</span> possible.</h2>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px' }}>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>15+</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Years</p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>99.9%</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Purity</p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>50+</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Projects</p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>20+</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '40px', fontWeight: 500 }}>Trusted By</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
            {brands.map((brand) => (
              <div key={brand.name} style={{ height: '32px', opacity: 0.5, transition: 'opacity 0.3s' }} className="hover:opacity-100">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={120}
                  height={32}
                  style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ padding: '120px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Capabilities</p>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '24px' }}>Advanced materials for extreme environments</h2>
              <p style={{ fontSize: '18px', color: '#bbb', lineHeight: 1.6 }}>From fusion reactors to deep space, we develop materials that perform where others fail.</p>
            </div>

            <div>
              {[
                { title: 'Refractory Metals', desc: 'Tungsten, Molybdenum, Tantalum, Niobium' },
                { title: 'Sputtering Targets', desc: 'High-purity PVD targets for thin-film deposition' },
                { title: 'High-Entropy Alloys', desc: 'Next-generation multi-principal element alloys' },
                { title: 'Custom Components', desc: 'Precision-machined to specification' },
              ].map((item, i) => (
                <Link
                  key={item.title}
                  href={`/${language}/products`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '24px 0',
                    borderBottom: i < 3 ? '1px solid #222' : 'none',
                    gap: '16px'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '4px' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: '#999' }}>{item.desc}</p>
                  </div>
                  <ArrowUpRight size={20} style={{ color: '#666', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: '120px 0', borderTop: '1px solid #222', backgroundColor: '#0a0a0a' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Featured</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '24px' }}>SPARK Project</h2>
              <p style={{ fontSize: '18px', color: '#bbb', lineHeight: 1.6, marginBottom: '32px' }}>Winner of ESA's FIRST! Award. Developing Refractory High-Entropy Alloys for next-generation space propulsion systems.</p>
              <Link href={`/${language}/news`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>Read the case study<ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '64px', fontWeight: 500 }}>ESA</p>
              <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>FIRST! Award Winner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section style={{ padding: '120px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '48px', fontWeight: 500 }}>Applications</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 500, marginBottom: '16px' }}>Space</h3>
              <p style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', color: '#bbb', lineHeight: 1.6 }}>Propulsion systems, thermal protection, and structural components for satellites and launch vehicles.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 500, marginBottom: '16px' }}>Fusion Energy</h3>
              <p style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', color: '#bbb', lineHeight: 1.6 }}>Plasma-facing materials and components for ITER and next-generation fusion reactors.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 500, marginBottom: '16px' }}>Aerospace</h3>
              <p style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', color: '#bbb', lineHeight: 1.6 }}>High-temperature alloys and coatings for turbine engines and hypersonic vehicles.</p>
            </div>
          </div>
        </div>
      </section>
      {/* About */}
      <section style={{ padding: '120px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>About</p>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, lineHeight: 1.2 }}>Built by scientists.</h2>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(20px, 2vw, 26px)', color: '#bbb', lineHeight: 1.6, marginBottom: '24px' }}>Bimo Tech was founded by material scientists with decades of experience in advanced materials research.
                We bridge the gap between cutting-edge science and industrial applications.</p>
              <p style={{ fontSize: 'clamp(20px, 2vw, 26px)', color: '#bbb', lineHeight: 1.6, marginBottom: '40px' }}>Based in Wrocław, Poland. Working globally.</p>
              <Link href={`/${language}/careers`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>Join the team<ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 0', borderTop: '1px solid #222', textAlign: 'center' }}>
        <div className="container-main">
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, marginBottom: '40px' }}>Let's build something.</h2>
          <Link
            href={`/${language}/contact`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              border: '1px solid #fff',
              fontSize: 'clamp(16px, 1.5vw, 18px)',
              fontWeight: 500,
              transition: 'all 0.3s'
            }}
          >{t('home.cta.button')}<ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main >
  );
}
