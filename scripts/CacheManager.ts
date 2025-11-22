/**
 * CacheManager - Manages translation cache to avoid redundant API calls
 * Feature: build-time-i18n-translation
 */

import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import type { TranslationCache, CacheEntry, CacheManager as ICacheManager } from '../types/translation';

export class CacheManager implements ICacheManager {
  private cacheFile: string;
  private cache: TranslationCache;

  constructor(cacheFile: string = '.translation-cache.json') {
    this.cacheFile = cacheFile;
    this.cache = {
      version: '1.0',
      entries: {}
    };
  }

  /**
   * Load cache from disk
   */
  async load(): Promise<TranslationCache> {
    try {
      const content = await fs.readFile(this.cacheFile, 'utf-8');
      this.cache = JSON.parse(content) as TranslationCache;
      
      // Validate cache structure
      if (!this.cache.version || !this.cache.entries) {
        throw new Error('Invalid cache structure');
      }
      
      return this.cache;
    } catch (error) {
      // If file doesn't exist or is corrupted, start with empty cache
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.cache = {
          version: '1.0',
          entries: {}
        };
        return this.cache;
      }
      
      // If cache is corrupted, log warning and start fresh
      console.warn('Cache file corrupted, starting with empty cache');
      this.cache = {
        version: '1.0',
        entries: {}
      };
      return this.cache;
    }
  }

  /**
   * Save cache to disk
   */
  async save(cache: TranslationCache): Promise<void> {
    this.cache = cache;
    const content = JSON.stringify(cache, null, 2);
    await fs.writeFile(this.cacheFile, content + '\n', 'utf-8');
  }

  /**
   * Compute hash of text using SHA-256
   */
  getHash(text: string): string {
    return createHash('sha256').update(text, 'utf-8').digest('hex');
  }

  /**
   * Check if a key should be translated
   * Returns true if translation is needed (cache miss or source changed)
   * Returns false if cached translation is valid
   */
  shouldTranslate(key: string, sourceText: string, locale: string): boolean {
    // Check if locale exists in cache
    if (!this.cache.entries[locale]) {
      return true;
    }

    // Check if key exists in cache for this locale
    const cacheEntry = this.cache.entries[locale][key];
    if (!cacheEntry) {
      return true;
    }

    // If manually overridden, don't translate
    if (cacheEntry.manual) {
      return false;
    }

    // Check if source has changed
    const currentHash = this.getHash(sourceText);
    if (cacheEntry.sourceHash !== currentHash) {
      return true;
    }

    // Cache hit - no translation needed
    return false;
  }

  /**
   * Update cache with new translation
   */
  updateCache(key: string, sourceText: string, locale: string, translation: string): void {
    // Ensure locale entry exists
    if (!this.cache.entries[locale]) {
      this.cache.entries[locale] = {};
    }

    // Create cache entry
    const cacheEntry: CacheEntry = {
      sourceHash: this.getHash(sourceText),
      translation,
      timestamp: Date.now()
    };

    this.cache.entries[locale][key] = cacheEntry;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache = {
      version: '1.0',
      entries: {}
    };
    
    try {
      await fs.unlink(this.cacheFile);
    } catch (error) {
      // Ignore error if file doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Mark a translation as manually overridden
   */
  markManual(key: string, locale: string): void {
    if (!this.cache.entries[locale]) {
      this.cache.entries[locale] = {};
    }

    if (this.cache.entries[locale][key]) {
      this.cache.entries[locale][key].manual = true;
    }
  }

  /**
   * Get cached translation if available
   */
  getCachedTranslation(key: string, locale: string): string | undefined {
    return this.cache.entries[locale]?.[key]?.translation;
  }
}
