"use client";

import { useLanguage } from '@/context/LanguageContext';
import Footer from '@/components/Footer';

export default function TermsPage() {
    const { t } = useLanguage();

    return (
        <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', paddingTop: '140px' }}>
            <div className="container-main" style={{ maxWidth: '800px', paddingBottom: '80px' }}>
                <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, marginBottom: '24px' }}>
                    {t('termsPage.title')}
                </h1>

                <section style={{ marginBottom: '60px' }}>
                    <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#ccc' }}>
                        {t('termsPage.intro')}
                    </p>
                </section>

                <div style={{ display: 'grid', gap: '48px' }}>
                    {[
                        'orders',
                        'delivery',
                        'prices',
                        'warranty',
                        'law'
                    ].map((section) => (
                        <section key={section}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>
                                {t(`termsPage.${section}.title`)}
                            </h2>
                            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#999' }}>
                                {t(`termsPage.${section}.content`)}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
