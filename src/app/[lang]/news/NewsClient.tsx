"use client";

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import type { NewsItem } from '@/lib/cms/types';

interface NewsClientProps {
  initialNews: NewsItem[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  const { t, language } = useLanguage();

  const featuredNews = initialNews.find(n => n.featured);
  const otherNews = initialNews.filter(n => !n.featured);

  const getArticleSlug = (item: NewsItem) => item.slug || item.id || item.title.toLowerCase().replace(/\s+/g, '-');

  if (!initialNews.length) {
    return (
      <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh' }}>
        <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
          <div className="container-main">
            <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('nav.news')}</p>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '600px' }}>
              {t('news.hero.title')}<span style={{ color: 'var(--bimo-text-secondary)' }}>{t('news.hero.highlight')}</span>
            </h1>
            <p style={{ marginTop: '40px', color: 'var(--bimo-text-secondary)' }}>No news articles yet. Check back soon.</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('nav.news')}</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.1, maxWidth: '600px' }}>
            {t('news.hero.title')}<span style={{ color: 'var(--bimo-text-secondary)' }}>{t('news.hero.highlight')}</span>
          </h1>
        </div>
      </section>

      {/* Featured */}
      {featuredNews && (
        <section style={{ padding: '60px 0', borderTop: '1px solid var(--bimo-border)' }}>
          <div className="container-main">
            <Link
              href={`/${language}/news/${getArticleSlug(featuredNews)}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '60px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}>
                <div>
                  <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 500 }}>
                    {featuredNews.category}
                  </p>
                  <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 500, marginBottom: '20px' }}>
                    {featuredNews.title}
                  </h2>
                  <p style={{ fontSize: '18px', color: 'var(--bimo-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {featuredNews.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)' }}>{featuredNews.date}</p>
                    <span style={{
                      fontSize: '13px',
                      color: 'var(--bimo-text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      Read more <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 500 }}>ESA</p>
                  <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>FIRST! Award Winner</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All News */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main">
          <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '40px', fontWeight: 500 }}>{t('news.allUpdates')}</p>

          {otherNews.length === 0 && !featuredNews && (
            <p style={{ color: 'var(--bimo-text-secondary)' }}>No additional news at this time.</p>
          )}

          {otherNews.map((item, index) => (
            <Link
              key={item.id || item.title}
              href={`/${language}/news/${getArticleSlug(item)}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <article
                style={{
                  padding: '32px 0',
                  borderTop: index === 0 ? '1px solid var(--bimo-border)' : 'none',
                  borderBottom: '1px solid var(--bimo-border)',
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 40px',
                  gap: '32px',
                  alignItems: 'start',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
              >
                <p style={{ fontSize: '14px', color: 'var(--bimo-text-secondary)' }}>{item.date}</p>
                <div>
                  <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 500 }}>
                    {item.category}
                  </p>
                  <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '12px', color: 'var(--bimo-text-primary)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--bimo-text-disabled)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight size={18} style={{ color: 'var(--bimo-text-disabled)' }} />
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-secondary)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '500px' }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>{t('news.subscribe.label')}</p>
            <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '16px' }}>{t('news.subscribe.title')}</h2>
            <p style={{ fontSize: '15px', color: 'var(--bimo-text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>{t('news.subscribe.description')}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="email"
                placeholder={t('news.subscribe.placeholder')}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid var(--bimo-border)',
                  padding: '14px 16px',
                  color: 'var(--bimo-text-primary)',
                  fontSize: '14px'
                }}
              />
              <button style={{
                padding: '14px 24px',
                border: '1px solid var(--bimo-text-primary)',
                background: 'transparent',
                color: 'var(--bimo-text-primary)',
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
