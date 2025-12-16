"use client";

import { ArrowUpRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

const news = [
  { date: 'December 2024', title: 'ESA FIRST! Award Winner', description: 'Bimo Tech wins prestigious ESA FIRST! Award for the SPARK project on Refractory High-Entropy Alloys for next-generation space propulsion.', category: 'Award', featured: true },
  { date: 'November 2024', title: 'ITER Rhodium Targets Delivered', description: 'Successfully delivered precision-manufactured rhodium sputtering targets for ITER fusion reactor coating applications.', category: 'Delivery' },
  { date: 'November 2024', title: 'ArianeGroup Partnership Expanded', description: 'Extended collaboration with ArianeGroup for advanced refractory materials in next-generation European launch vehicles.', category: 'Partnership' },
  { date: 'October 2024', title: 'New F4E Contract Signed', description: 'Signed new contract with Fusion for Energy for custom fusion energy components and specialized materials.', category: 'Contract' },
  { date: 'September 2024', title: 'HEA Research Publication', description: 'Published research on High-Entropy Alloy mechanical properties at elevated temperatures in Journal of Alloys and Compounds.', category: 'Research' },
  { date: 'August 2024', title: 'ISO 9001:2015 Recertification', description: 'Successfully completed ISO 9001:2015 recertification audit with zero non-conformances.', category: 'Certification' },
];

export default function NewsPage() {
  const { language } = useLanguage();
  const featuredNews = news.find(n => n.featured);
  const otherNews = news.filter(n => !n.featured);

  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: '24px' }}>
            News
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, maxWidth: '600px' }}>
            Updates from 
            <span style={{ color: '#666' }}> the lab</span>
          </h1>
        </div>
      </section>

      {/* Featured */}
      {featuredNews && (
        <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
          <div className="container-main">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {featuredNews.category}
                </p>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, marginBottom: '20px' }}>
                  {featuredNews.title}
                </h2>
                <p style={{ fontSize: '18px', color: '#888', lineHeight: 1.6, marginBottom: '16px' }}>
                  {featuredNews.description}
                </p>
                <p style={{ fontSize: '14px', color: '#555' }}>{featuredNews.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '72px', fontWeight: 300 }}>ESA</p>
                <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em' }}>FIRST! Award</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: '40px' }}>
            All Updates
          </p>
          
          {otherNews.map((item, index) => (
            <article 
              key={item.title}
              style={{ 
                padding: '32px 0',
                borderTop: index === 0 ? '1px solid #222' : 'none',
                borderBottom: '1px solid #222',
                display: 'grid',
                gridTemplateColumns: '120px 1fr 40px',
                gap: '32px',
                alignItems: 'start'
              }}
            >
              <p style={{ fontSize: '14px', color: '#555' }}>{item.date}</p>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {item.category}
                </p>
                <h3 style={{ fontSize: '22px', fontWeight: 300, marginBottom: '12px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
              <ArrowUpRight size={18} style={{ color: '#444' }} />
            </article>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section style={{ padding: '80px 0', borderTop: '1px solid #222', backgroundColor: '#0a0a0a' }}>
        <div className="container-main">
          <div style={{ maxWidth: '500px' }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: '24px' }}>
              Stay updated
            </p>
            <h2 style={{ fontSize: '32px', fontWeight: 300, marginBottom: '16px' }}>
              Get news from Bimo Tech
            </h2>
            <p style={{ fontSize: '15px', color: '#888', marginBottom: '32px', lineHeight: 1.6 }}>
              Occasional updates on our projects, publications, and material science developments.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="email" 
                placeholder="your@email.com"
                style={{ 
                  flex: 1, 
                  background: 'transparent', 
                  border: '1px solid #333', 
                  padding: '14px 16px', 
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
              <button style={{ 
                padding: '14px 24px', 
                border: '1px solid #fff', 
                background: 'transparent',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
