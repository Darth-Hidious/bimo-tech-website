"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Linkedin, Link2, Check, Calendar, Tag, User } from 'lucide-react';
import Footer from '@/components/Footer';
import type { NewsItem } from '@/lib/cms/types';

interface Props {
  article: NewsItem;
  relatedArticles: NewsItem[];
  lang: string;
}

export default function NewsArticleClient({ article, relatedArticles, lang }: Props) {
  const [copied, setCopied] = useState(false);

  const articleUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://bimotech.pl/${lang}/news/${article.slug || article.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={{ marginBottom: '24px', paddingLeft: '24px' }}>
            {listItems.map((item, i) => (
              <li key={i} style={{ color: 'var(--bimo-text-secondary)', marginBottom: '8px', lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const body = tableRows.slice(2); // Skip header separator
        elements.push(
          <div key={`table-${elements.length}`} style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderBottom: '1px solid var(--bimo-border)',
                      color: 'var(--bimo-text-primary)',
                      fontWeight: 500
                    }}>
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '12px',
                        borderBottom: '1px solid var(--bimo-border)',
                        color: 'var(--bimo-text-secondary)'
                      }}>
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };

    lines.forEach((line, index) => {
      // Table detection
      if (line.startsWith('|')) {
        if (!inList) flushList();
        inTable = true;
        const cells = line.split('|').filter(c => c.trim() !== '' && !c.match(/^-+$/));
        if (cells.length > 0 && !line.match(/^\|[-\s|]+\|$/)) {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} style={{
            fontSize: '24px',
            fontWeight: 500,
            color: 'var(--bimo-text-primary)',
            marginTop: '48px',
            marginBottom: '16px'
          }}>
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} style={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--bimo-text-primary)',
            marginTop: '32px',
            marginBottom: '12px'
          }}>
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // List items
      if (line.startsWith('- ')) {
        inList = true;
        listItems.push(line.replace('- ', ''));
        return;
      }

      // Numbered list
      if (line.match(/^\d+\.\s/)) {
        inList = true;
        listItems.push(line.replace(/^\d+\.\s/, ''));
        return;
      }

      // Flush list if we hit a non-list line
      if (inList) {
        flushList();
      }

      // Empty line
      if (line.trim() === '') {
        return;
      }

      // Regular paragraph with bold support
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <p key={index} style={{
          color: 'var(--bimo-text-secondary)',
          lineHeight: 1.8,
          marginBottom: '16px',
          fontSize: '16px'
        }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });

    // Flush any remaining list or table
    flushList();
    flushTable();

    return elements;
  };

  return (
    <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ paddingTop: '140px', paddingBottom: '40px' }}>
        <div className="container-main" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Back link */}
          <Link
            href={`/${lang}/news`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--bimo-text-disabled)',
              fontSize: '14px',
              marginBottom: '32px',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} />
            Back to News
          </Link>

          {/* Category */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            border: '1px solid var(--bimo-border)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--bimo-text-secondary)',
            marginBottom: '24px'
          }}>
            <Tag size={12} />
            {article.category}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 500,
            lineHeight: 1.2,
            marginBottom: '24px'
          }}>
            {article.title}
          </h1>

          {/* Meta info */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
            paddingBottom: '32px',
            borderBottom: '1px solid var(--bimo-border)',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--bimo-text-disabled)', fontSize: '14px' }}>
              <Calendar size={16} />
              {article.date}
            </div>
            {article.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--bimo-text-disabled)', fontSize: '14px' }}>
                <User size={16} />
                {article.author}
              </div>
            )}

            {/* Share buttons */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button
                onClick={handleShareLinkedIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  border: '1px solid var(--bimo-border)',
                  background: 'transparent',
                  color: 'var(--bimo-text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
                Share
              </button>
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  border: '1px solid var(--bimo-border)',
                  background: copied ? 'var(--bimo-text-primary)' : 'transparent',
                  color: copied ? 'var(--bimo-bg-primary)' : 'var(--bimo-text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Copy link"
              >
                {copied ? <Check size={16} /> : <Link2 size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Lead paragraph */}
          <p style={{
            fontSize: 'clamp(18px, 2vw, 20px)',
            color: 'var(--bimo-text-primary)',
            lineHeight: 1.7,
            marginBottom: '40px'
          }}>
            {article.description}
          </p>
        </div>
      </section>

      {/* Content */}
      {article.content && (
        <section style={{ paddingBottom: '80px' }}>
          <div className="container-main" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="article-content">
              {renderContent(article.content)}
            </div>
          </div>
        </section>
      )}

      {/* Share CTA */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--bimo-border)', backgroundColor: 'var(--bimo-bg-secondary)' }}>
        <div className="container-main" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Share2 size={24} style={{ color: 'var(--bimo-text-disabled)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>Share this article</h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleShareLinkedIn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: '1px solid var(--bimo-text-primary)',
                background: 'transparent',
                color: 'var(--bimo-text-primary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <Linkedin size={18} />
              LinkedIn
            </button>
            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: '1px solid var(--bimo-border)',
                background: 'transparent',
                color: 'var(--bimo-text-secondary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <Link2 size={18} />
              Copy Link
            </button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section style={{ padding: '80px 0', borderTop: '1px solid var(--bimo-border)' }}>
          <div className="container-main">
            <h2 style={{
              fontSize: '14px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--bimo-text-disabled)',
              marginBottom: '32px',
              fontWeight: 500
            }}>
              Related Articles
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {relatedArticles.map((related) => {
                const relatedSlug = related.slug || related.id || related.title.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={related.id}
                    href={`/${lang}/news/${relatedSlug}`}
                    style={{
                      padding: '24px',
                      border: '1px solid var(--bimo-border)',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <p style={{
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--bimo-text-disabled)',
                      marginBottom: '12px'
                    }}>
                      {related.category}
                    </p>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 500,
                      color: 'var(--bimo-text-primary)',
                      marginBottom: '12px',
                      lineHeight: 1.4
                    }}>
                      {related.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--bimo-text-disabled)'
                    }}>
                      {related.date}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
