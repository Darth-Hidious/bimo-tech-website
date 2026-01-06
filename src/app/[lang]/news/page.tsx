"use client";

import { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { NewsItem } from '@/lib/cms/types';

export default function NewsPage() {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cms.getNews();
        setNews(data);
      } catch (e) {
        console.error("Failed to load news", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredNews = news.find(n => n.featured);
  const otherNews = news.filter(n => !n.featured);

  if (loading) {
    return (
      <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-white" size={48} />
      </main>
    );
  }

  return (<main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
    {/* Header */}
    <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
      <div className="container-main">
        <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('nav.news')}</p>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '600px' }}>{t('news.hero.title')}<span style={{ color: '#888' }}>{t('news.hero.highlight')}</span>
        </h1>
      </div>
    </section>

    {/* Featured */}
    {featuredNews && (
      <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>
                {featuredNews.category}
              </p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 500, marginBottom: '20px' }}>
                {featuredNews.title}
              </h2>
              <p style={{ fontSize: '18px', color: '#bbb', lineHeight: 1.6, marginBottom: '16px' }}>
                {featuredNews.description}
              </p>
              <p style={{ fontSize: '14px', color: '#888' }}>{featuredNews.date}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 500 }}>ESA</p>
              <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>FIRST! Award Winner</p>
            </div>
          </div>
        </div>
      </section>
    )}

    {/* All News */}
    <section style={{ padding: '60px 0', borderTop: '1px solid #222' }}>
      <div className="container-main">
        <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '40px', fontWeight: 500 }}>{t('news.allUpdates')}</p>

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
            <p style={{ fontSize: '14px', color: '#888' }}>{item.date}</p>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>
                {item.category}
              </p>
              <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '12px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '15px', color: '#999', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
            <ArrowUpRight size={18} style={{ color: '#666' }} />
          </article>
        ))}
      </div>
    </section>

    {/* Subscribe */}
    <section style={{ padding: '80px 0', borderTop: '1px solid #222', backgroundColor: '#0a0a0a' }}>
      <div className="container-main">
        <div style={{ maxWidth: '500px' }}>
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('news.subscribe.label')}</p>
          <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '16px' }}>{t('news.subscribe.title')}</h2>
          <p style={{ fontSize: '15px', color: '#bbb', marginBottom: '32px', lineHeight: 1.6 }}>{t('news.subscribe.description')}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="email"
              placeholder={t('news.subscribe.placeholder')}
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
            }}>{t('news.subscribe.button')}</button>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </main>
  );
}
