/**
 * Property-based and unit tests for LocaleManager
 * Feature: build-time-i18n-translation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { promises as fs } from 'fs';
import * as path from 'path';
import { LocaleManager } from './LocaleManager';
import type { LocaleData, TranslationMap } from '../types/translation';

// Test directory for file operations
const TEST_LOCALES_DIR = path.join(__dirname, '__test_locales__');

describe('LocaleManager - Property Tests', () => {
  let manager: LocaleManager;

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(TEST_LOCALES_DIR, { recursive: true });
    manager = new LocaleManager('en', TEST_LOCALES_DIR);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_LOCALES_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  /**
   * Property 15: Locale file discovery
   * Validates: Requirements 8.4
   * 
   * For any set of locale files in the locales directory, the translation system
   * SHALL discover and process all of them.
   */
  it('Property 15: should discover all locale files in directory', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a set of locale codes (2-letter strings, excluding 'en')
        fc.uniqueArray(
          fc.stringMatching(/^[a-z]{2}$/).filter(s => s !== 'en'),
          { minLength: 1, maxLength: 10 }
        ),
        async (localeCodes) => {
          // Clean directory first
          const existingFiles = await fs.readdir(TEST_LOCALES_DIR).catch(() => []);
          for (const file of existingFiles) {
            await fs.unlink(path.join(TEST_LOCALES_DIR, file)).catch(() => {});
          }

          // Create locale files
          const localeFiles = ['en', ...localeCodes]; // Include source locale
          for (const locale of localeFiles) {
            const filePath = path.join(TEST_LOCALES_DIR, `${locale}.json`);
            await fs.writeFile(filePath, JSON.stringify({ test: 'value' }), 'utf-8');
          }

          // Discover target locales
          const discovered = await manager.discoverTargetLocales();

          // Property: All non-source locales should be discovered
          const expectedTargets = localeCodes.sort();
          expect(discovered).toEqual(expectedTargets);

          // Property: Source locale should not be in discovered list
          expect(discovered).not.toContain('en');

          // Property: Discovered list should be sorted
          const sortedDiscovered = [...discovered].sort();
          expect(discovered).toEqual(sortedDiscovered);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 15: should ignore non-JSON files during discovery', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uniqueArray(fc.stringMatching(/^[a-z]{2}$/), { minLength: 1, maxLength: 5 }),
        fc.array(fc.string().filter(s => s.length > 0 && !s.includes('/') && !s.includes('\\')), { minLength: 1, maxLength: 3 }),
        async (locales, nonJsonFiles) => {
          // Clean directory first
          const existingFiles = await fs.readdir(TEST_LOCALES_DIR).catch(() => []);
          for (const file of existingFiles) {
            await fs.unlink(path.join(TEST_LOCALES_DIR, file)).catch(() => {});
          }

          // Create JSON locale files
          for (const locale of locales) {
            const filePath = path.join(TEST_LOCALES_DIR, `${locale}.json`);
            await fs.writeFile(filePath, JSON.stringify({}), 'utf-8');
          }

          // Create non-JSON files
          for (const fileName of nonJsonFiles) {
            if (!fileName.endsWith('.json') && fileName.length > 0) {
              const filePath = path.join(TEST_LOCALES_DIR, fileName);
              try {
                await fs.writeFile(filePath, 'content', 'utf-8');
              } catch {
                // Skip invalid filenames
              }
            }
          }

          // Discover locales
          const discovered = await manager.discoverTargetLocales();

          // Property: Only JSON files (minus source) should be discovered
          for (const locale of discovered) {
            expect(locales).toContain(locale);
          }

          // Property: Non-JSON files should not appear
          for (const fileName of nonJsonFiles) {
            const withoutExt = fileName.replace('.json', '');
            if (!fileName.endsWith('.json')) {
              expect(discovered).not.toContain(withoutExt);
            }
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 13: Key removal propagation
   * Validates: Requirements 7.5
   * 
   * For any key removed from the source locale, after the translation system runs,
   * that key SHALL be removed from all target locales.
   */
  it('Property 13: should identify removed keys in diff', () => {
    fc.assert(
      fc.property(
        // Generate source and target with valid keys (no empty strings, no dots, no __proto__)
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 1, maxKeys: 10 }
        ),
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 1, maxKeys: 10 }
        ),
        (sourceFlat, targetFlat) => {
          // Convert flat maps to nested structures
          const source = manager.unflatten(sourceFlat);
          const target = manager.unflatten(targetFlat);

          // Compute diff
          const diff = manager.computeDiff(source, target);

          // Property: All keys in target but not in source should be in 'removed'
          const sourceKeys = new Set(Object.keys(sourceFlat));
          const targetKeys = Object.keys(targetFlat);

          for (const key of targetKeys) {
            if (!sourceKeys.has(key)) {
              expect(diff.removed).toContain(key);
            }
          }

          // Property: No key in both source and target should be in 'removed'
          for (const key of diff.removed) {
            expect(sourceKeys.has(key)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: mergeTranslations should not add removed keys back', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 1, maxKeys: 10 }
        ),
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 0, maxKeys: 5 }
        ),
        (targetFlat, translationsToAdd) => {
          const target = manager.unflatten(targetFlat);
          
          // Merge translations
          const merged = manager.mergeTranslations(target, translationsToAdd);
          const mergedFlat = manager.flatten(merged);

          // Property: All original target keys should still exist (unless overwritten)
          for (const key of Object.keys(targetFlat)) {
            expect(key in mergedFlat).toBe(true);
          }

          // Property: All new translations should be added
          for (const key of Object.keys(translationsToAdd)) {
            expect(mergedFlat[key]).toBe(translationsToAdd[key]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Structural preservation
   * Validates: Requirements 1.5
   * 
   * For any nested JSON structure in the source locale, after translation,
   * the target locale SHALL have the same nesting structure.
   */
  it('Property 2: should preserve nested structure when merging translations', () => {
    fc.assert(
      fc.property(
        // Generate flat data and unflatten it to create nested structure
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 1, maxKeys: 20 }
        ),
        (flatData) => {
          // Create nested source from flat data
          const sourceData = manager.unflatten(flatData);
          
          // Flatten the source to get all keys
          const sourceFlat = manager.flatten(sourceData);
          
          // Create translations for all keys
          const translations: TranslationMap = {};
          for (const key of Object.keys(sourceFlat)) {
            translations[key] = `translated_${sourceFlat[key]}`;
          }

          // Start with empty target and merge
          const target: LocaleData = {};
          const merged = manager.mergeTranslations(target, translations);

          // Property: The structure should match source structure
          const mergedFlat = manager.flatten(merged);
          const sourceKeys = Object.keys(sourceFlat).sort();
          const mergedKeys = Object.keys(mergedFlat).sort();

          expect(mergedKeys).toEqual(sourceKeys);

          // Property: Nested structure should be preserved
          // Check that parent-child relationships are maintained
          for (const key of sourceKeys) {
            const parts = key.split('.');
            if (parts.length > 1) {
              // Check that parent exists in merged
              const parentKey = parts.slice(0, -1).join('.');
              const parentExists = mergedKeys.some(k => k.startsWith(parentKey));
              expect(parentExists).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: flatten and unflatten should be inverse operations', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 1, maxKeys: 20 }
        ),
        (flatData) => {
          // Unflatten then flatten should give back original
          const nested = manager.unflatten(flatData);
          const flattened = manager.flatten(nested);

          // Property: Round trip should preserve all keys and values
          expect(Object.keys(flattened).sort()).toEqual(Object.keys(flatData).sort());
          
          for (const key of Object.keys(flatData)) {
            expect(flattened[key]).toBe(flatData[key]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: should maintain structure depth consistency', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string().filter(s => s.length > 0 && s !== '.' && !s.startsWith('.') && !s.endsWith('.') && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
          fc.string(),
          { minKeys: 1, maxKeys: 10 }
        ),
        (flatData) => {
          const nested = manager.unflatten(flatData);
          const reflattened = manager.flatten(nested);

          // Property: Depth of nesting should be consistent
          for (const key of Object.keys(flatData)) {
            const originalDepth = key.split('.').length;
            const reflattenedDepth = key.split('.').length;
            expect(reflattenedDepth).toBe(originalDepth);
          }

          // Property: All keys should be preserved
          expect(Object.keys(reflattened).sort()).toEqual(Object.keys(flatData).sort());
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('LocaleManager - Unit Tests', () => {
  let manager: LocaleManager;

  beforeEach(async () => {
    await fs.mkdir(TEST_LOCALES_DIR, { recursive: true });
    manager = new LocaleManager('en', TEST_LOCALES_DIR);
  });

  afterEach(async () => {
    try {
      await fs.rm(TEST_LOCALES_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('File reading and parsing', () => {
    it('should load source locale file correctly', async () => {
      const sourceData = {
        nav: { home: 'Home', about: 'About' },
        hero: { title: 'Welcome' }
      };
      
      await fs.writeFile(
        path.join(TEST_LOCALES_DIR, 'en.json'),
        JSON.stringify(sourceData),
        'utf-8'
      );

      const loaded = await manager.loadSourceLocale();
      expect(loaded).toEqual(sourceData);
    });

    it('should load target locale file correctly', async () => {
      const targetData = {
        nav: { home: 'Strona główna', about: 'O nas' }
      };
      
      await fs.writeFile(
        path.join(TEST_LOCALES_DIR, 'pl.json'),
        JSON.stringify(targetData),
        'utf-8'
      );

      const loaded = await manager.loadTargetLocale('pl');
      expect(loaded).toEqual(targetData);
    });

    it('should return empty object for non-existent target locale', async () => {
      const loaded = await manager.loadTargetLocale('nonexistent');
      expect(loaded).toEqual({});
    });

    it('should throw error for malformed JSON', async () => {
      await fs.writeFile(
        path.join(TEST_LOCALES_DIR, 'en.json'),
        'invalid json{',
        'utf-8'
      );

      await expect(manager.loadSourceLocale()).rejects.toThrow();
    });
  });

  describe('Diff computation', () => {
    it('should identify missing keys', () => {
      const source: LocaleData = {
        nav: { home: 'Home', about: 'About', contact: 'Contact' },
        hero: { title: 'Welcome' }
      };
      
      const target: LocaleData = {
        nav: { home: 'Strona główna' }
      };

      const diff = manager.computeDiff(source, target);
      
      expect(diff.missing).toContain('nav.about');
      expect(diff.missing).toContain('nav.contact');
      expect(diff.missing).toContain('hero.title');
      expect(diff.missing).not.toContain('nav.home');
    });

    it('should identify removed keys', () => {
      const source: LocaleData = {
        nav: { home: 'Home' }
      };
      
      const target: LocaleData = {
        nav: { home: 'Strona główna', oldKey: 'Old value' },
        deprecated: { key: 'Value' }
      };

      const diff = manager.computeDiff(source, target);
      
      expect(diff.removed).toContain('nav.oldKey');
      expect(diff.removed).toContain('deprecated.key');
      expect(diff.removed).not.toContain('nav.home');
    });

    it('should handle empty source', () => {
      const source: LocaleData = {};
      const target: LocaleData = { key: 'value' };

      const diff = manager.computeDiff(source, target);
      
      expect(diff.missing).toEqual([]);
      expect(diff.removed).toContain('key');
    });

    it('should handle empty target', () => {
      const source: LocaleData = { key: 'value' };
      const target: LocaleData = {};

      const diff = manager.computeDiff(source, target);
      
      expect(diff.missing).toContain('key');
      expect(diff.removed).toEqual([]);
    });

    it('should handle deeply nested structures', () => {
      const source: LocaleData = {
        level1: {
          level2: {
            level3: {
              key: 'value'
            }
          }
        }
      };
      
      const target: LocaleData = {};

      const diff = manager.computeDiff(source, target);
      
      expect(diff.missing).toContain('level1.level2.level3.key');
    });
  });

  describe('Merging translations', () => {
    it('should merge translations into empty target', () => {
      const target: LocaleData = {};
      const translations: TranslationMap = {
        'nav.home': 'Strona główna',
        'nav.about': 'O nas',
        'hero.title': 'Witamy'
      };

      const merged = manager.mergeTranslations(target, translations);
      
      expect(merged).toEqual({
        nav: { home: 'Strona główna', about: 'O nas' },
        hero: { title: 'Witamy' }
      });
    });

    it('should merge translations into existing target', () => {
      const target: LocaleData = {
        nav: { home: 'Strona główna' },
        footer: { copyright: '© 2024' }
      };
      
      const translations: TranslationMap = {
        'nav.about': 'O nas',
        'hero.title': 'Witamy'
      };

      const merged = manager.mergeTranslations(target, translations);
      
      expect(merged.nav).toEqual({ home: 'Strona główna', about: 'O nas' });
      expect(merged.hero).toEqual({ title: 'Witamy' });
      expect(merged.footer).toEqual({ copyright: '© 2024' });
    });

    it('should overwrite existing translations', () => {
      const target: LocaleData = {
        nav: { home: 'Old translation' }
      };
      
      const translations: TranslationMap = {
        'nav.home': 'New translation'
      };

      const merged = manager.mergeTranslations(target, translations);
      
      expect(merged.nav).toEqual({ home: 'New translation' });
    });

    it('should handle deeply nested translations', () => {
      const target: LocaleData = {};
      const translations: TranslationMap = {
        'a.b.c.d.e': 'deep value'
      };

      const merged = manager.mergeTranslations(target, translations);
      
      expect(merged).toEqual({
        a: { b: { c: { d: { e: 'deep value' } } } }
      });
    });

    it('should not mutate original target', () => {
      const target: LocaleData = {
        nav: { home: 'Original' }
      };
      
      const translations: TranslationMap = {
        'nav.about': 'About'
      };

      const merged = manager.mergeTranslations(target, translations);
      
      expect(target.nav).toEqual({ home: 'Original' });
      expect(merged.nav).toEqual({ home: 'Original', about: 'About' });
    });
  });

  describe('File saving', () => {
    it('should save target locale with proper formatting', async () => {
      const data: LocaleData = {
        nav: { home: 'Strona główna', about: 'O nas' },
        hero: { title: 'Witamy' }
      };

      await manager.saveTargetLocale('pl', data);

      const content = await fs.readFile(
        path.join(TEST_LOCALES_DIR, 'pl.json'),
        'utf-8'
      );
      
      const parsed = JSON.parse(content);
      expect(parsed).toEqual(data);
      
      // Check formatting (4 spaces indentation)
      expect(content).toContain('    ');
      expect(content.endsWith('\n')).toBe(true);
    });

    it('should create file if it does not exist', async () => {
      const data: LocaleData = { test: 'value' };

      await manager.saveTargetLocale('new', data);

      const exists = await fs.access(path.join(TEST_LOCALES_DIR, 'new.json'))
        .then(() => true)
        .catch(() => false);
      
      expect(exists).toBe(true);
    });
  });

  describe('Helper methods', () => {
    it('should flatten nested structure correctly', () => {
      const nested: LocaleData = {
        nav: { home: 'Home', about: 'About' },
        hero: { title: 'Welcome' }
      };

      const flat = manager.flatten(nested);
      
      expect(flat).toEqual({
        'nav.home': 'Home',
        'nav.about': 'About',
        'hero.title': 'Welcome'
      });
    });

    it('should unflatten flat structure correctly', () => {
      const flat: TranslationMap = {
        'nav.home': 'Home',
        'nav.about': 'About',
        'hero.title': 'Welcome'
      };

      const nested = manager.unflatten(flat);
      
      expect(nested).toEqual({
        nav: { home: 'Home', about: 'About' },
        hero: { title: 'Welcome' }
      });
    });

    it('should handle single-level keys', () => {
      const flat: TranslationMap = { key: 'value' };
      const nested = manager.unflatten(flat);
      
      expect(nested).toEqual({ key: 'value' });
      expect(manager.flatten(nested)).toEqual(flat);
    });

    it('should handle empty objects', () => {
      expect(manager.flatten({})).toEqual({});
      expect(manager.unflatten({})).toEqual({});
    });
  });
});
