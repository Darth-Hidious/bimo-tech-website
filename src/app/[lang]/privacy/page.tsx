"use client";

import { useLanguage } from '@/context/LanguageContext';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    const { t } = useLanguage();

    return (
        <main style={{ backgroundColor: 'var(--bimo-bg-primary)', color: 'var(--bimo-text-primary)', minHeight: '100vh', paddingTop: '140px' }}>
            <div className="container-main" style={{ maxWidth: '800px', paddingBottom: '80px' }}>
                <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, marginBottom: '24px' }}>
                    {t('privacyPage.title')}
                </h1>
                <p style={{ color: 'var(--bimo-text-disabled)', marginBottom: '60px', fontFamily: 'var(--font-space-mono)', fontSize: '14px' }}>
                    {t('privacyPage.lastUpdated')}
                </p>

                <div style={{ display: 'grid', gap: '48px' }}>
                    <section>
                        <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--bimo-text-secondary)' }}>
                            {t('privacyPage.intro')}
                        </p>
                    </section>

                    {[
                        'controller',
                        'dataCollection',
                        'purpose',
                        'sharing',
                        'rights'
                    ].map((section) => (
                        <section key={section}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--bimo-text-primary)' }}>
                                {t(`privacyPage.${section}.title`)}
                            </h2>
                            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--bimo-text-disabled)' }}>
                                {t(`privacyPage.${section}.content`)}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
