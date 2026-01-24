"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--bimo-border)' }}>
      <div className="container-main" style={{ padding: '80px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
          {/* Logo & Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href={`/${language}`} style={{ display: 'inline-block', marginBottom: '20px' }}>
              <Image
                src="/logo.png"
                alt="BIMOTECH"
                width={120}
                height={32}
                style={{ opacity: 0.8, height: '32px', width: 'auto' }}
              />
            </Link>
            <p style={{ fontSize: '15px', color: 'var(--bimo-text-disabled)', lineHeight: 1.6, maxWidth: '300px' }}>Advanced materials for space, fusion, and aerospace. Wrocław, Poland.</p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 500 }}>Navigate</p>
            <ul style={{ listStyle: 'none' }}>
              {['Products', 'News', 'Careers', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <Link
                    href={`/${language}/${item.toLowerCase()}`}
                    style={{ fontSize: '15px', color: 'var(--bimo-text-secondary)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--bimo-text-disabled)', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 500 }}>Contact</p>
            <p style={{ fontSize: '15px', color: 'var(--bimo-text-secondary)', marginBottom: '12px' }}>
              <a href="mailto:info@bimotech.pl">info@bimotech.pl</a>
            </p>
            <p style={{ fontSize: '15px', color: 'var(--bimo-text-disabled)', lineHeight: 1.6, marginBottom: '20px' }}>Francuska 11<br />54-405 Wroclaw, Poland</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://www.linkedin.com/company/bimotech"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  border: '1px solid var(--bimo-border)',
                  borderRadius: '6px',
                  color: 'var(--bimo-text-disabled)',
                  transition: 'all 0.2s ease'
                }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/bimotech"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  border: '1px solid var(--bimo-border)',
                  borderRadius: '6px',
                  color: 'var(--bimo-text-disabled)',
                  transition: 'all 0.2s ease'
                }}
                aria-label="X (Twitter)"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--bimo-border)' }}>
        <div className="container-main" style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)' }}>
            © {currentYear} Bimo Tech Sp. z o.o.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Impressum', 'Admin'].map((item) => (
              <Link
                key={item}
                href={item === 'Admin' ? '/admin' : `/${language}/${item.toLowerCase()}`}
                style={{ fontSize: '12px', color: 'var(--bimo-text-disabled)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


