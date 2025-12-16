"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid #222' }}>
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
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, maxWidth: '300px' }}>
              Advanced materials for space, fusion, and aerospace. Warsaw, Poland.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '20px' }}>
              Navigate
            </p>
            <ul style={{ listStyle: 'none' }}>
              {['Products', 'News', 'Careers', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <Link 
                    href={`/${language}/${item.toLowerCase()}`} 
                    style={{ fontSize: '14px', color: '#888' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '20px' }}>
              Contact
            </p>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
              <a href="mailto:info@bimotech.pl">info@bimotech.pl</a>
            </p>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
              ul. Pawińskiego 5B<br />
              02-106 Warsaw, Poland
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #222' }}>
        <div className="container-main" style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: '#444' }}>
            © {currentYear} Bimo Tech Sp. z o.o.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Impressum'].map((item) => (
              <Link 
                key={item}
                href={`/${language}/${item.toLowerCase()}`} 
                style={{ fontSize: '12px', color: '#444' }}
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

