"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../locales/en.json';
import pl from '../locales/pl.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import it from '../locales/it.json';
import nl from '../locales/nl.json';
import sv from '../locales/sv.json';
import fi from '../locales/fi.json';
import da from '../locales/da.json';
import pt from '../locales/pt.json';
import cz from '../locales/cz.json';

import ja from '../locales/ja.json';

type LocaleData = typeof en;
type Language = 'en' | 'pl' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'sv' | 'fi' | 'da' | 'pt' | 'cz' | 'ja';

const translations: Record<Language, any> = {
    en, pl, de, fr, es, it, nl, sv, fi, da, pt, cz, ja
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, initialLang }: { children: ReactNode, initialLang: string }) => {
    const [language, setLanguage] = useState<Language>((initialLang as Language) || 'pl');

    useEffect(() => {
        if (initialLang && translations[initialLang as Language]) {
            setLanguage(initialLang as Language);
        }
    }, [initialLang]);

    const t = (key: string): any => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value];
            } else {
                return key;
            }
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        // Fallback for build/static generation edge cases
        return {
            language: 'en' as Language,
            setLanguage: () => { },
            t: (key: string) => key
        };
    }
    return context;
};
