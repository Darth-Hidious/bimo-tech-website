"use client";

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import BrandCarousel from '@/components/BrandCarousel';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { language, t } = useLanguage();

  const brands = [
    { name: 'ESA', filename: 'ESA_logo_2020_White.svg' },
    { name: 'ArianeGroup', filename: 'arianegroup.svg' },
    { name: 'Fusion for Energy', filename: 'F4E.svg' },
    { name: 'IPPT PAN', filename: 'IPPT_PAN.svg' },
    { name: 'NCBJ', filename: 'NCBJ.svg' },
  ];

  const applications = [
    {
      title: 'Space',
      description: 'Propulsion systems, thermal protection, and structural components for satellites and launch vehicles.',
      image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Fusion Energy',
      description: 'Plasma-facing materials and components for ITER and next-generation fusion reactors.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Aerospace',
      description: 'High-temperature alloys and coatings for turbine engines and hypersonic vehicles.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '200vh' }}>
        <Hero />
      </div>

      {/* Mission */}
      <section style={{ padding: '120px 0' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Our Purpose</p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 72px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '900px' }}>We engineer the materials that make <span style={{ color: 'var(--bimo-text-secondary)' }}>the impossible</span> possible.</h2>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px' }}>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>15+</p>
              <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Years</p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>99.9%</p>
              <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Purity</p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>50+</p>
              <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Projects</p>
            </div>
            <div>
              <p style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 500 }}>20+</p>
              <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '40px', fontWeight: 500 }}>Trusted By</p>
        </div>
        <BrandCarousel brandLogos={brands} />
      </section>

      {/* Capabilities with Image */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Capabilities</p>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '24px' }}>Advanced materials for extreme environments</h2>
              <p style={{ fontSize: '18px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>From fusion reactors to deep space, we develop materials that perform where others fail.</p>

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
                    borderBottom: i < 3 ? '1px solid var(--bimo-border)' : 'none',
                    gap: '16px'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '4px' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-disabled)' }}>{item.desc}</p>
                  </div>
                  <ArrowUpRight size={20} style={{ color: 'var(--bimo-text-disabled)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>

            {/* Capabilities Image */}
            <div style={{ position: 'relative', height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
                alt="CNC machining precision manufacturing"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(0.8)' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '32px',
                background: 'linear-gradient(to top, rgba(0,6,36,0.9), transparent)'
              }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '8px' }}>Precision Manufacturing</p>
                <p style={{ fontSize: '16px', color: 'var(--bimo-text-primary)' }}>Tolerances down to ±0.01mm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured with Image */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-secondary)' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Featured</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '24px' }}>SPARK Project</h2>
              <p style={{ fontSize: '18px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>Winner of ESA&apos;s FIRST! Award. Developing Refractory High-Entropy Alloys for next-generation space propulsion systems.</p>
              <Link href={`/${language}/news`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>Read the case study<ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                  alt="Space technology and satellite systems"
                  fill
                  style={{ objectFit: 'cover', filter: 'brightness(0.7)' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <p style={{ fontSize: '64px', fontWeight: 500, color: 'var(--bimo-text-primary)' }}>ESA</p>
                  <p style={{ fontSize: '12px', color: 'var(--bimo-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>FIRST! Award Winner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications with Images */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '48px', fontWeight: 500 }}>Applications</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {applications.map((app) => (
              <div key={app.title} style={{ position: 'relative' }}>
                <div style={{ position: 'relative', height: '240px', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <Image
                    src={app.image}
                    alt={app.title}
                    fill
                    style={{ objectFit: 'cover', filter: 'brightness(0.6)' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px'
                  }}>
                    <h3 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 500, color: 'var(--bimo-text-primary)' }}>{app.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', color: 'var(--bimo-text-secondary)', lineHeight: 1.6 }}>{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>About</p>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '24px' }}>Built by scientists.</h2>
              <p style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', color: 'var(--bimo-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>Bimo Tech was founded by material scientists with decades of experience in advanced materials research.
                We bridge the gap between cutting-edge science and industrial applications.</p>
              <p style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', color: 'var(--bimo-text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>Based in Wrocław, Poland. Working globally.</p>
              <Link href={`/${language}/careers`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>Join the team<ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ position: 'relative', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                alt="Laboratory research and development"
                fill
                style={{ objectFit: 'cover', filter: 'brightness(0.7)' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '32px',
                background: 'linear-gradient(to top, rgba(0,6,36,0.9), transparent)'
              }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '8px' }}>R&D Center</p>
                <p style={{ fontSize: '16px', color: 'var(--bimo-text-primary)' }}>Wrocław, Poland</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--bimo-border)', textAlign: 'center' }}>
        <div className="container-main">
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500, marginBottom: '40px' }}>Let&apos;s build something.</h2>
          <Link
            href={`/${language}/contact`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              border: '1px solid var(--bimo-text-primary)',
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
