/**
 * LocaleManager - Handles file I/O operations for locale files
 * Feature: build-time-i18n-translation
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import type { LocaleData, LocaleDiff, TranslationMap, LocaleManager as ILocaleManager } from '../types/translation';

export class LocaleManager implements ILocaleManager {
  private sourceLocale: string;
  private localesDir: string;

  constructor(sourceLocale: string = 'en', localesDir: string = 'src/locales') {
    this.sourceLocale = sourceLocale;
    this.localesDir = localesDir;
  }

  /**
   * Load source locale file
   */
  async loadSourceLocale(): Promise<LocaleData> {
    const filePath = path.join(this.localesDir, `${this.sourceLocale}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as LocaleData;
  }

  /**
   * Load target locale file
   */
  async loadTargetLocale(locale: string): Promise<LocaleData> {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as LocaleData;
    } catch (error) {
      // If file doesn't exist, return empty object
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return {};
      }
      throw error;
    }
  }

  /**
   * Save target locale file
   */
  async saveTargetLocale(locale: string, data: LocaleData): Promise<void> {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    const content = JSON.stringify(data, null, 4);
    await fs.writeFile(filePath, content + '\n', 'utf-8');
  }

  /**
   * Discover all target locale files (excluding source locale)
   */
  async discoverTargetLocales(): Promise<string[]> {
    const files = await fs.readdir(this.localesDir);
    const locales = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''))
      .filter(locale => locale !== this.sourceLocale);
    return locales.sort();
  }

  /**
   * Compute difference between source and target locales
   */
  computeDiff(source: LocaleData, target: LocaleData): LocaleDiff {
    const sourceKeys = this.flattenKeys(source);
    const targetKeys = this.flattenKeys(target);

    const sourceKeySet = new Set(sourceKeys);
    const targetKeySet = new Set(targetKeys);

    const missing = sourceKeys.filter(key => !targetKeySet.has(key));
    const removed = targetKeys.filter(key => !sourceKeySet.has(key));
    
    // For 'changed', we need to compare values
    // Since we don't have cache here, we'll return empty array
    // The CacheManager will handle detecting changes
    const changed: string[] = [];

    return { missing, changed, removed };
  }

  /**
   * Merge translations into target locale structure
   */
  mergeTranslations(target: LocaleData, translations: TranslationMap): LocaleData {
    // Start with a copy of the target
    const result = JSON.parse(JSON.stringify(target)) as LocaleData;

    // Merge each translation
    for (const [key, value] of Object.entries(translations)) {
      this.setNestedValue(result, key, value);
    }

    return result;
  }

  /**
   * Flatten nested JSON structure into dot-notation keys
   */
  private flattenKeys(data: LocaleData, prefix: string = ''): string[] {
    const keys: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        keys.push(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        keys.push(...this.flattenKeys(value as LocaleData, fullKey));
      }
    }

    return keys;
  }

  /**
   * Get value from nested structure using dot-notation key
   */
  private getNestedValue(data: LocaleData, key: string): string | undefined {
    const parts = key.split('.');
    let current: any = data;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * Set value in nested structure using dot-notation key
   */
  private setNestedValue(data: LocaleData, key: string, value: string): void {
    const parts = key.split('.');
    let current: any = data;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Flatten nested JSON into flat key-value map
   */
  flatten(data: LocaleData, prefix: string = ''): TranslationMap {
    const result: TranslationMap = {};

    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        result[fullKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(result, this.flatten(value as LocaleData, fullKey));
      }
    }

    return result;
  }

  /**
   * Unflatten flat key-value map into nested JSON
   */
  unflatten(flat: TranslationMap): LocaleData {
    const result: LocaleData = {};

    for (const [key, value] of Object.entries(flat)) {
      this.setNestedValue(result, key, value);
    }

    return result;
  }
}
