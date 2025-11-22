/**
 * Property-based tests for translation system types
 * Feature: build-time-i18n-translation
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { LOCALE_LANGUAGE_MAP } from './translation';

describe('Translation System - Type Properties', () => {
  /**
   * Property 16: Locale code mapping
   * Validates: Requirements 8.5
   * 
   * For any valid locale code (e.g., "pl", "de", "fr"), the translation system
   * SHALL correctly map it to its corresponding language name (e.g., "Polish", "German", "French").
   */
  it('Property 16: should correctly map all valid locale codes to language names', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(LOCALE_LANGUAGE_MAP)),
        (localeCode) => {
          // Get the language name for the locale code
          const languageName = LOCALE_LANGUAGE_MAP[localeCode];
          
          // Property 1: The mapping should exist (not undefined)
          expect(languageName).toBeDefined();
          
          // Property 2: The language name should be a non-empty string
          expect(typeof languageName).toBe('string');
          expect(languageName.length).toBeGreaterThan(0);
          
          // Property 3: The language name should be properly capitalized
          // (first letter uppercase, rest can vary)
          expect(languageName[0]).toBe(languageName[0].toUpperCase());
          
          // Property 4: The locale code should be lowercase
          expect(localeCode).toBe(localeCode.toLowerCase());
          
          // Property 5: Mapping should be consistent (idempotent)
          expect(LOCALE_LANGUAGE_MAP[localeCode]).toBe(languageName);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: should have bidirectional uniqueness (no duplicate language names)', () => {
    const languageNames = Object.values(LOCALE_LANGUAGE_MAP);
    const uniqueLanguageNames = new Set(languageNames);
    
    // Each language name should be unique
    expect(uniqueLanguageNames.size).toBe(languageNames.length);
  });

  it('Property 16: should have all expected locale codes', () => {
    // Based on requirements, these are the expected locales
    const expectedLocales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'sv', 'fi', 'da', 'pt', 'cz'];
    
    for (const locale of expectedLocales) {
      expect(LOCALE_LANGUAGE_MAP[locale]).toBeDefined();
      expect(typeof LOCALE_LANGUAGE_MAP[locale]).toBe('string');
    }
  });

  it('Property 16: should return undefined for invalid locale codes', () => {
    fc.assert(
      fc.property(
        // Generate random strings that are NOT in the valid locale codes
        fc.string().filter(s => !Object.keys(LOCALE_LANGUAGE_MAP).includes(s)),
        (invalidLocale) => {
          const result = LOCALE_LANGUAGE_MAP[invalidLocale];
          expect(result).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
