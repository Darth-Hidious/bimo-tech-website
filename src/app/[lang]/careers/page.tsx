"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { JobOpening } from '@/lib/cms/types';

const values = [
  { title: 'Scientific rigor', description: 'Every decision grounded in data and research. We don\'t guess, we measure.' },
  { title: 'Quality obsession', description: 'We never compromise on material integrity. 99.95% purity isn\'t good enough when 99.99% is possible.' },
  { title: 'Collaborative spirit', description: 'The best solutions come from diverse perspectives. We work across disciplines and borders.' },
  { title: 'Continuous learning', description: 'Materials science never stops evolving, neither do we. 20% time for personal research.' },
];

export default function CareersPage() {
  const { language } = useLanguage();
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cms.getCareers();
        setOpenings(data);
      } catch (e) {
        console.error("Failed to load careers", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-white" size={48} />
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Careers</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '800px', marginBottom: '32px' }}>Build the materials that shape <span style={{ color: 'var(--bimo-text-secondary)' }}>the future</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--bimo-text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>Join a team of scientists and engineers working on breakthrough materials for space, fusion, and aerospace.</p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>Culture</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 500, marginBottom: '24px' }}>What drives us</h2>
              <p style={{ fontSize: '16px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6 }}>We're a team of 30+ scientists, engineers, and specialists united by a passion for
                pushing the boundaries of materials science.</p>
            </div>
            <div>
              {values.map((value, index) => (
                <div key={value.title} style={{
                  borderBottom: index < values.length - 1 ? '1px solid var(--bimo-border)' : 'none',
                  paddingBottom: '24px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>{value.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--bimo-text-disabled)', lineHeight: 1.6 }}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-secondary)' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>Openings</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 500 }}>Current positions</h2>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--bimo-text-disabled)' }}>{openings.length} roles</span>
          </div>

          {openings.map((job, index) => (
            <Link
              key={job.title}
              href={`/${language}/contact`}
              style={{
                display: 'block',
                padding: '28px 0',
                borderTop: index === 0 ? '1px solid var(--bimo-border)' : 'none',
                borderBottom: '1px solid var(--bimo-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>{job.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)', marginBottom: '12px' }}>{job.description}</p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--bimo-text-secondary)' }}>
                    <span>{job.department}</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span>·</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <ArrowUpRight size={20} style={{ color: 'var(--bimo-text-disabled)', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '48px', fontWeight: 500 }}>Benefits</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: 500, marginBottom: '16px' }}>Research freedom</h3>
              <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6 }}>20% time for personal research projects. Access to state-of-the-art equipment and facilities.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: 500, marginBottom: '16px' }}>Growth</h3>
              <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6 }}>Conference attendance, training programs, and pathways to leadership for those who want it.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '28px', fontWeight: 500, marginBottom: '16px' }}>Impact</h3>
              <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6 }}>Work on materials that will power fusion reactors and enable deep space exploration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', borderTop: '1px solid var(--bimo-border)', textAlign: 'center' }}>
        <div className="container-main">
          <h2 style={{ fontSize: '36px', fontWeight: 500, marginBottom: '20px' }}>Don't see the right role?</h2>
          <p style={{ fontSize: '16px', color: 'var(--bimo-text-secondary)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>We're always looking for exceptional talent. Send us your CV and tell us why you want to join.</p>
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
