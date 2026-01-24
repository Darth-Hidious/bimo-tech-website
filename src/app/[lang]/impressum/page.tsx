"use client";

import { useLanguage } from '@/context/LanguageContext';
import React, { useState } from 'react';
import Footer from '@/components/Footer';

export default function ImpressumPage() {
    const { t } = useLanguage();

    return (
        <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px' }}>
            <div className="container-main">
                <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, marginBottom: '60px' }}>
                    {t('impressum.title')}
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '60px', alignItems: 'start' }}>
                    {/* Left: Content */}
                    <div>
                        <section style={{ marginBottom: '80px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, maxWidth: '800px', lineHeight: 1.6, marginBottom: '32px' }}>
                                {t('impressum.isoTitle')}
                            </h2>

                            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px', fontSize: '16px', lineHeight: 1.7, color: 'var(--bimo-text-secondary)' }}>
                                <p>{t('impressum.description')}</p>
                                <p>{t('impressum.specialization')}</p>
                                <p>{t('impressum.sectors')}</p>
                                <p>{t('impressum.quality')}</p>
                            </div>
                        </section>

                        <section style={{ marginBottom: '80px', maxWidth: '800px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '24px' }}>{t('impressum.peopleTitle')}</h3>
                            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--bimo-text-secondary)' }}>{t('impressum.peopleDesc')}</p>
                        </section>

                        <section style={{ marginBottom: '80px', maxWidth: '800px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '24px' }}>{t('impressum.servicesTitle')}</h3>
                            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--bimo-text-secondary)', marginBottom: '16px' }}>{t('impressum.servicesDesc')}</p>
                            <ul style={{ paddingLeft: '20px', color: 'var(--bimo-text-secondary)', lineHeight: 1.8 }}>
                                {(Array.isArray(t('impressum.serviceList')) ? t('impressum.serviceList') : []).map((service: string, index: number) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        </section>

                        <section style={{ marginBottom: '40px', maxWidth: '800px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '24px' }}>{t('impressum.excellence')}</h3>
                            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--bimo-text-secondary)', marginBottom: '24px' }}>{t('impressum.environment')}</p>
                            <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--bimo-text-primary)' }}>{t('impressum.partner')}</p>
                        </section>
                    </div>

                    {/* Right: Sticky Sidebar (Impressum Details) */}
                    <aside style={{
                        position: 'sticky',
                        top: '120px',
                        padding: '32px',
                        backgroundColor: 'var(--bimo-bg-secondary)',
                        border: '1px solid var(--bimo-border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: 'var(--bimo-text-secondary)',
                        lineHeight: 1.6
                    }}>
                        <h4 style={{ color: 'var(--bimo-text-primary)', fontSize: '16px', fontWeight: 600, marginBottom: '20px', borderBottom: '1px solid var(--bimo-border)', paddingBottom: '12px' }}>
                            Impressum
                        </h4>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ display: 'block', color: 'var(--bimo-text-primary)', marginBottom: '4px' }}>{t('impressum.companyName')}</strong>
                            {t('impressum.address')}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ display: 'block', color: 'var(--bimo-text-primary)', marginBottom: '4px' }}>{t('impressum.representedBy')}:</strong>
                            {t('impressum.ceoName')} ({t('impressum.ceoRole')})<br />
                            Beata Urszula Orzechowska (Prokurent)
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ display: 'block', color: 'var(--bimo-text-primary)', marginBottom: '4px' }}>{t('impressum.contact')}:</strong>
                            E-Mail: info@bimotech.pl<br />
                            {/* Assuming phone is available or general contact */}
                            {t('contact.info.phone')}: +48 71 341 84 81
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ display: 'block', color: 'var(--bimo-text-primary)', marginBottom: '4px' }}>{t('impressum.registerEntry')}:</strong>
                            Sąd Rejonowy dla Wrocławia-Fabrycznej<br />
                            VI Wydział Gospodarczy KRS<br />
                            KRS: 0000468797<br />
                            {t('impressum.registrationDate')}: 2013-07-05
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ display: 'block', color: 'var(--bimo-text-primary)', marginBottom: '4px' }}>{t('impressum.ids')}:</strong>
                            {t('impressum.vatId')}: PL8943047189<br />
                            REGON: 02218164500000<br />
                            {t('impressum.shareCapital')}: <SecureData>50 000 PLN</SecureData>
                        </div>

                        <div>
                            <strong style={{ display: 'block', color: 'var(--bimo-text-primary)', marginBottom: '4px' }}>{t('impressum.bankAccounts')}:</strong>
                            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                                <SecureData>
                                    <div style={{ padding: '4px 0' }}>54 1020 5242 0000 2102 0336 5343</div>
                                    <div style={{ padding: '4px 0' }}>79 1020 5242 0000 2002 0311 1481</div>
                                    <div style={{ padding: '4px 0' }}>85 1020 5242 0000 2402 0336 5608</div>
                                </SecureData>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </main>
    );
}

function SecureData({ children }: { children: React.ReactNode }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <span
            onMouseEnter={() => setRevealed(true)}
            onMouseLeave={() => setRevealed(false)}
            style={{
                cursor: 'pointer',
                color: revealed ? 'inherit' : 'var(--bimo-text-disabled)',
                borderBottom: revealed ? 'none' : '1px dotted var(--bimo-border)',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                minWidth: '100px'
            }}
            title="Hover to reveal"
        >
            {revealed ? children : (
                <span style={{ filter: 'blur(4px)', userSelect: 'none', opacity: 0.7 }}>
                    &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                </span>
            )}
        </span>
    );
}

