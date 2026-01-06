
import React from 'react';

import { useLanguage } from '@/context/LanguageContext';

export default function TestI18n() {
    const { t } = useLanguage();
    return (
        <div className="p-4" title="Tooltip Text">
            <h1>Hello World</h1>
            <p>This is a test paragraph.</p>
            <input placeholder="Enter text here" />
            <button aria-label="Submit Button">Click Me</button>
            <span>Short</span>
            <div>{t('already.translated')}</div>
        </div>
    );
}
