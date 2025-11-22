/**
 * Tests for CacheManager
 * Feature: build-time-i18n-translation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { CacheManager } from './CacheManager';
import { promises as fs } from 'fs';
import * as path from 'path';

describe('CacheManager', () => {
  const testCacheFile = '.test-cache.json';
  let cacheManager: CacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager(testCacheFile);
  });

  afterEach(async () => {
    // Clean up test cache file
    try {
      await fs.unlink(testCacheFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  describe('Property Tests', () => {
    /**
     * Feature: build-time-i18n-translation, Property 4: Cache effectiveness
     * Validates: Requirements 3.1
     * 
     * For any translation key that has not changed between builds,
     * the second build SHALL not make an API call for that key
     * (it SHALL use the cached translation).
     */
    it('Property 4: Cache effectiveness - unchanged keys should not require translation on second check', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1 }), // key
          fc.string({ minLength: 1 }), // sourceText
          fc.string({ minLength: 1, maxLength: 5 }), // locale
          fc.string({ minLength: 1 }), // translation
          async (key, sourceText, locale, translation) => {
            // Create a fresh cache manager for each test
            const testFile = `.test-cache-${Math.random()}.json`;
            const cm = new CacheManager(testFile);
            
            try {
              const cache = await cm.load();

              // First check - should need translation (cache miss)
              const firstCheck = cm.shouldTranslate(key, sourceText, locale);
              expect(firstCheck).toBe(true);

              // Update cache with translation
              cm.updateCache(key, sourceText, locale, translation);
              await cm.save(cache);

              // Reload cache to simulate second build
              await cm.load();

              // Second check - should NOT need translation (cache hit)
              const secondCheck = cm.shouldTranslate(key, sourceText, locale);
              expect(secondCheck).toBe(false);

              // Verify cached translation is available
              const cached = cm.getCachedTranslation(key, locale);
              expect(cached).toBe(translation);
            } finally {
              // Cleanup
              try {
                await fs.unlink(testFile);
              } catch (e) {
                // Ignore
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: build-time-i18n-translation, Property 12: Manual override preservation
     * Validates: Requirements 7.1
     * 
     * For any translation marked as a manual override in the cache,
     * the translation system SHALL not overwrite that translation when the source changes.
     */
    it('Property 12: Manual override preservation - manual translations should not be overwritten', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1 }), // key
          fc.string({ minLength: 1 }), // originalSourceText
          fc.string({ minLength: 1 }), // changedSourceText
          fc.string({ minLength: 1, maxLength: 5 }), // locale
          fc.string({ minLength: 1 }), // manualTranslation
          async (key, originalSourceText, changedSourceText, locale, manualTranslation) => {
            // Ensure source texts are different
            fc.pre(originalSourceText !== changedSourceText);

            const testFile = `.test-cache-${Math.random()}.json`;
            const cm = new CacheManager(testFile);
            
            try {
              const cache = await cm.load();

              // Add translation and mark as manual
              cm.updateCache(key, originalSourceText, locale, manualTranslation);
              cm.markManual(key, locale);
              await cm.save(cache);

              // Reload cache to simulate second build
              await cm.load();

              // Check if translation is needed when source changes
              // Should return false because it's marked as manual
              const shouldTranslate = cm.shouldTranslate(key, changedSourceText, locale);
              expect(shouldTranslate).toBe(false);

              // Verify the manual translation is still preserved
              const cached = cm.getCachedTranslation(key, locale);
              expect(cached).toBe(manualTranslation);
            } finally {
              // Cleanup
              try {
                await fs.unlink(testFile);
              } catch (e) {
                // Ignore
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    describe('Hash computation', () => {
      it('should compute consistent hashes for same text', () => {
        const text = 'Hello, world!';
        const hash1 = cacheManager.getHash(text);
        const hash2 = cacheManager.getHash(text);
        expect(hash1).toBe(hash2);
      });

      it('should compute different hashes for different text', () => {
        const hash1 = cacheManager.getHash('Hello');
        const hash2 = cacheManager.getHash('World');
        expect(hash1).not.toBe(hash2);
      });

      it('should be sensitive to whitespace changes', () => {
        const hash1 = cacheManager.getHash('Hello');
        const hash2 = cacheManager.getHash('Hello ');
        expect(hash1).not.toBe(hash2);
      });
    });

    describe('Cache hit/miss logic', () => {
      it('should return true for cache miss (key not in cache)', async () => {
        await cacheManager.load();
        const result = cacheManager.shouldTranslate('new.key', 'Some text', 'pl');
        expect(result).toBe(true);
      });

      it('should return false for cache hit (unchanged source)', async () => {
        await cacheManager.load();
        const key = 'test.key';
        const sourceText = 'Test text';
        const locale = 'pl';
        
        cacheManager.updateCache(key, sourceText, locale, 'Tekst testowy');
        
        const result = cacheManager.shouldTranslate(key, sourceText, locale);
        expect(result).toBe(false);
      });

      it('should return true when source text changes', async () => {
        await cacheManager.load();
        const key = 'test.key';
        const locale = 'pl';
        
        cacheManager.updateCache(key, 'Original text', locale, 'Oryginalny tekst');
        
        const result = cacheManager.shouldTranslate(key, 'Changed text', locale);
        expect(result).toBe(true);
      });

      it('should return true for new locale', async () => {
        await cacheManager.load();
        const key = 'test.key';
        const sourceText = 'Test text';
        
        cacheManager.updateCache(key, sourceText, 'pl', 'Tekst testowy');
        
        const result = cacheManager.shouldTranslate(key, sourceText, 'de');
        expect(result).toBe(true);
      });
    });

    describe('Manual override detection', () => {
      it('should preserve manual translations even when source changes', async () => {
        await cacheManager.load();
        const key = 'test.key';
        const locale = 'pl';
        
        cacheManager.updateCache(key, 'Original', locale, 'Manual translation');
        cacheManager.markManual(key, locale);
        
        const result = cacheManager.shouldTranslate(key, 'Changed', locale);
        expect(result).toBe(false);
      });

      it('should not translate keys marked as manual', async () => {
        await cacheManager.load();
        const key = 'manual.key';
        const locale = 'de';
        
        cacheManager.updateCache(key, 'Text', locale, 'Manuell');
        cacheManager.markManual(key, locale);
        
        const shouldTranslate = cacheManager.shouldTranslate(key, 'Different text', locale);
        expect(shouldTranslate).toBe(false);
      });
    });

    describe('Cache persistence and loading', () => {
      it('should persist cache to disk and reload it', async () => {
        const cache = await cacheManager.load();
        
        cacheManager.updateCache('key1', 'Text 1', 'pl', 'Tekst 1');
        cacheManager.updateCache('key2', 'Text 2', 'de', 'Text 2');
        
        await cacheManager.save(cache);
        
        // Create new cache manager and load
        const newCacheManager = new CacheManager(testCacheFile);
        await newCacheManager.load();
        
        expect(newCacheManager.getCachedTranslation('key1', 'pl')).toBe('Tekst 1');
        expect(newCacheManager.getCachedTranslation('key2', 'de')).toBe('Text 2');
      });

      it('should handle missing cache file gracefully', async () => {
        const cache = await cacheManager.load();
        expect(cache.version).toBe('1.0');
        expect(cache.entries).toEqual({});
      });

      it('should create cache file on first save', async () => {
        await cacheManager.load();
        cacheManager.updateCache('test', 'text', 'pl', 'tekst');
        
        const cache = await cacheManager.load();
        await cacheManager.save(cache);
        
        const fileExists = await fs.access(testCacheFile)
          .then(() => true)
          .catch(() => false);
        
        expect(fileExists).toBe(true);
      });
    });

    describe('Cache corruption handling', () => {
      it('should handle corrupted cache file', async () => {
        // Write invalid JSON to cache file
        await fs.writeFile(testCacheFile, 'invalid json{{{', 'utf-8');
        
        const cache = await cacheManager.load();
        expect(cache.version).toBe('1.0');
        expect(cache.entries).toEqual({});
      });

      it('should handle cache file with missing fields', async () => {
        // Write incomplete cache structure
        await fs.writeFile(testCacheFile, '{"version": "1.0"}', 'utf-8');
        
        const cache = await cacheManager.load();
        expect(cache.version).toBe('1.0');
        expect(cache.entries).toEqual({});
      });
    });

    describe('Clear cache', () => {
      it('should clear all cache entries', async () => {
        await cacheManager.load();
        
        cacheManager.updateCache('key1', 'Text 1', 'pl', 'Tekst 1');
        cacheManager.updateCache('key2', 'Text 2', 'de', 'Text 2');
        
        await cacheManager.clear();
        
        const cache = await cacheManager.load();
        expect(cache.entries).toEqual({});
      });

      it('should delete cache file', async () => {
        await cacheManager.load();
        cacheManager.updateCache('test', 'text', 'pl', 'tekst');
        
        const cache = await cacheManager.load();
        await cacheManager.save(cache);
        
        await cacheManager.clear();
        
        const fileExists = await fs.access(testCacheFile)
          .then(() => true)
          .catch(() => false);
        
        expect(fileExists).toBe(false);
      });

      it('should handle clearing non-existent cache', async () => {
        await expect(cacheManager.clear()).resolves.not.toThrow();
      });
    });
  });
});
