/**
 * Core type definitions for the build-time i18n translation system
 */

// ============================================================================
// Data Models
// ============================================================================

/**
 * Represents locale data as a nested JSON structure
 */
export interface LocaleData {
  [key: string]: string | LocaleData;
}

/**
 * Map of translation keys to translated strings
 */
export interface TranslationMap {
  [key: string]: string;
}

/**
 * Difference between source and target locale
 */
export interface LocaleDiff {
  /** Keys present in source but not in target */
  missing: string[];
  /** Keys where source content has changed since last translation */
  changed: string[];
  /** Keys present in target but not in source (should be removed) */
  removed: string[];
}

// ============================================================================
// Translation Provider
// ============================================================================

/**
 * Context information for translation requests
 */
export interface TranslationContext {
  /** Application domain (e.g., "aerospace technology") */
  domain: string;
  /** Desired tone (e.g., "professional and technical") */
  tone: string;
  /** Optional glossary for consistent term translation */
  glossary?: Record<string, string>;
  /** Patterns to preserve (e.g., ["{x}", "{y}", "<br>"]) */
  preservePatterns: string[];
}

/**
 * Request for translating a single key
 */
export interface TranslationRequest {
  /** Translation key (dot-notation path) */
  key: string;
  /** Source text to translate */
  sourceText: string;
  /** Target language name (e.g., "Polish", "German") */
  targetLanguage: string;
  /** Optional context for translation */
  context?: TranslationContext;
}

/**
 * Response from translation provider
 */
export interface TranslationResponse {
  /** Translation key */
  key: string;
  /** Translated text */
  translatedText: string;
  /** Error message if translation failed */
  error?: string;
}

/**
 * Abstract interface for LLM translation services
 */
export interface TranslationProvider {
  /**
   * Translate multiple requests in batch
   * @param requests Array of translation requests
   * @returns Array of translation responses
   */
  translate(requests: TranslationRequest[]): Promise<TranslationResponse[]>;
  
  /**
   * Get the provider name
   * @returns Provider name (e.g., "openai", "anthropic")
   */
  getName(): string;
}

// ============================================================================
// Cache Manager
// ============================================================================

/**
 * Single cache entry for a translated key
 */
export interface CacheEntry {
  /** Hash of the source text */
  sourceHash: string;
  /** Cached translation */
  translation: string;
  /** Timestamp when translation was cached */
  timestamp: number;
  /** Flag indicating manual override (should not be overwritten) */
  manual?: boolean;
}

/**
 * Complete translation cache structure
 */
export interface TranslationCache {
  /** Cache format version */
  version: string;
  /** Cache entries organized by locale and key */
  entries: {
    [locale: string]: {
      [key: string]: CacheEntry;
    };
  };
}

/**
 * Interface for managing translation cache
 */
export interface CacheManager {
  /**
   * Load cache from disk
   * @returns Translation cache
   */
  load(): Promise<TranslationCache>;
  
  /**
   * Save cache to disk
   * @param cache Translation cache to save
   */
  save(cache: TranslationCache): Promise<void>;
  
  /**
   * Compute hash of text
   * @param text Text to hash
   * @returns Hash string
   */
  getHash(text: string): string;
  
  /**
   * Check if a key should be translated
   * @param key Translation key
   * @param sourceText Current source text
   * @param locale Target locale
   * @returns True if translation is needed
   */
  shouldTranslate(key: string, sourceText: string, locale: string): boolean;
  
  /**
   * Update cache with new translation
   * @param key Translation key
   * @param sourceText Source text
   * @param locale Target locale
   * @param translation Translated text
   */
  updateCache(key: string, sourceText: string, locale: string, translation: string): void;
  
  /**
   * Clear all cache entries
   */
  clear(): Promise<void>;
}

// ============================================================================
// Locale Manager
// ============================================================================

/**
 * Interface for managing locale files
 */
export interface LocaleManager {
  /**
   * Load source locale file
   * @returns Source locale data
   */
  loadSourceLocale(): Promise<LocaleData>;
  
  /**
   * Load target locale file
   * @param locale Target locale code (e.g., "pl", "de")
   * @returns Target locale data
   */
  loadTargetLocale(locale: string): Promise<LocaleData>;
  
  /**
   * Save target locale file
   * @param locale Target locale code
   * @param data Locale data to save
   */
  saveTargetLocale(locale: string, data: LocaleData): Promise<void>;
  
  /**
   * Discover all target locale files
   * @returns Array of locale codes
   */
  discoverTargetLocales(): Promise<string[]>;
  
  /**
   * Compute difference between source and target
   * @param source Source locale data
   * @param target Target locale data
   * @returns Locale diff
   */
  computeDiff(source: LocaleData, target: LocaleData): LocaleDiff;
  
  /**
   * Merge translations into target locale structure
   * @param target Current target locale data
   * @param translations Map of translations to merge
   * @returns Updated locale data
   */
  mergeTranslations(target: LocaleData, translations: TranslationMap): LocaleData;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Provider configuration
 */
export interface ProviderConfig {
  /** Provider name */
  name: "openai" | "anthropic";
  /** API key for the provider */
  apiKey: string;
  /** Optional model name */
  model?: string;
  /** Optional max tokens */
  maxTokens?: number;
  /** Optional temperature */
  temperature?: number;
}

/**
 * Translation context configuration
 */
export interface ContextConfig {
  /** Application domain */
  domain: string;
  /** Desired tone */
  tone: string;
  /** Optional glossary */
  glossary?: Record<string, string>;
}

/**
 * Complete translation system configuration
 */
export interface TranslationConfig {
  /** Source locale code (default: "en") */
  sourceLocale: string;
  /** Target locales (if not specified, auto-discover) */
  targetLocales?: string[];
  /** Directory containing locale files */
  localesDir: string;
  /** Cache file path */
  cacheFile: string;
  /** Provider configuration */
  provider: ProviderConfig;
  /** Translation context */
  context: ContextConfig;
  /** Batch size for translation requests */
  batchSize: number;
  /** Skip translation in development mode */
  skipInDevelopment: boolean;
}

// ============================================================================
// Translation Orchestrator
// ============================================================================

/**
 * Statistics from translation run
 */
export interface TranslationStats {
  /** Total number of keys in source locale */
  totalKeys: number;
  /** Number of keys translated in this run */
  translatedKeys: number;
  /** Number of keys served from cache */
  cachedKeys: number;
  /** Number of API calls made */
  apiCalls: number;
  /** Number of locales processed */
  localesProcessed: number;
}

/**
 * Translation error information
 */
export interface TranslationError {
  /** Locale where error occurred */
  locale: string;
  /** Translation key that failed */
  key: string;
  /** Error message */
  message: string;
}

/**
 * Result of translation run
 */
export interface TranslationResult {
  /** Whether translation completed successfully */
  success: boolean;
  /** Translation statistics */
  stats: TranslationStats;
  /** Array of errors encountered */
  errors: TranslationError[];
}

/**
 * Interface for orchestrating the translation process
 */
export interface TranslationOrchestrator {
  /**
   * Run the complete translation process
   * @returns Translation result
   */
  run(): Promise<TranslationResult>;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Mapping of locale codes to language names
 */
export const LOCALE_LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  pl: "Polish",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  nl: "Dutch",
  sv: "Swedish",
  fi: "Finnish",
  da: "Danish",
  pt: "Portuguese",
  cz: "Czech"
};
