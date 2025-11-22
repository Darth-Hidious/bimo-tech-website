# Design Document: Build-Time i18n Translation System

## Overview

This design specifies a build-time internationalization translation system that automatically maintains 100% translation coverage across all locale files. The system uses LLM-based translation to convert content from a source locale (English) to all target locales during the build process, with intelligent caching to minimize API calls and costs.

The system is designed to be non-intrusive, maintainable, and extensible. It operates as a pre-build step that ensures all locale files are synchronized before the Next.js application builds.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  npm run build  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Translation Script     │
│  (scripts/translate.ts) │
└────────┬────────────────┘
         │
         ├──► Read en.json (source)
         │
         ├──► Discover target locales
         │
         ├──► Load translation cache
         │
         ├──► Compute diff for each locale
         │
         ├──► Batch translate missing/changed keys
         │    └──► LLM Provider API
         │
         ├──► Merge translations into target files
         │
         ├──► Update cache
         │
         └──► Continue to Next.js build
```

### Component Architecture

The system consists of four main components:

1. **Translation Orchestrator**: Main entry point that coordinates the translation workflow
2. **Locale Manager**: Handles reading, writing, and diffing locale files
3. **Translation Provider**: Abstract interface for LLM translation services
4. **Cache Manager**: Manages translation cache to avoid redundant API calls

## Components and Interfaces

### 1. Translation Orchestrator

**Responsibility**: Coordinates the entire translation process

**Interface**:
```typescript
interface TranslationOrchestrator {
  run(): Promise<TranslationResult>;
}

interface TranslationResult {
  success: boolean;
  stats: TranslationStats;
  errors: TranslationError[];
}

interface TranslationStats {
  totalKeys: number;
  translatedKeys: number;
  cachedKeys: number;
  apiCalls: number;
  localesProcessed: number;
}
```

### 2. Locale Manager

**Responsibility**: File I/O operations for locale files and structural analysis

**Interface**:
```typescript
interface LocaleManager {
  loadSourceLocale(): Promise<LocaleData>;
  loadTargetLocale(locale: string): Promise<LocaleData>;
  saveTargetLocale(locale: string, data: LocaleData): Promise<void>;
  discoverTargetLocales(): Promise<string[]>;
  computeDiff(source: LocaleData, target: LocaleData): LocaleDiff;
  mergeTranslations(target: LocaleData, translations: TranslationMap): LocaleData;
}

interface LocaleData {
  [key: string]: string | LocaleData;
}

interface LocaleDiff {
  missing: string[];      // Keys in source but not in target
  changed: string[];      // Keys where source hash differs from cache
  removed: string[];      // Keys in target but not in source
}

interface TranslationMap {
  [key: string]: string;
}
```

### 3. Translation Provider

**Responsibility**: Abstract interface for LLM translation services

**Interface**:
```typescript
interface TranslationProvider {
  translate(requests: TranslationRequest[]): Promise<TranslationResponse[]>;
  getName(): string;
}

interface TranslationRequest {
  key: string;
  sourceText: string;
  targetLanguage: string;
  context?: TranslationContext;
}

interface TranslationContext {
  domain: string;
  tone: string;
  glossary?: Record<string, string>;
  preservePatterns: string[];  // e.g., ["{x}", "{y}", "<br>"]
}

interface TranslationResponse {
  key: string;
  translatedText: string;
  error?: string;
}
```

**Concrete Implementations**:
- `OpenAITranslationProvider`: Uses OpenAI GPT models
- `AnthropicTranslationProvider`: Uses Anthropic Claude models (future)

### 4. Cache Manager

**Responsibility**: Manages translation cache to avoid redundant translations

**Interface**:
```typescript
interface CacheManager {
  load(): Promise<TranslationCache>;
  save(cache: TranslationCache): Promise<void>;
  getHash(text: string): string;
  shouldTranslate(key: string, sourceText: string, locale: string): boolean;
  updateCache(key: string, sourceText: string, locale: string, translation: string): void;
  clear(): Promise<void>;
}

interface TranslationCache {
  version: string;
  entries: {
    [locale: string]: {
      [key: string]: CacheEntry;
    };
  };
}

interface CacheEntry {
  sourceHash: string;
  translation: string;
  timestamp: number;
  manual?: boolean;  // Flag for manual overrides
}
```

## Data Models

### Configuration Model

```typescript
interface TranslationConfig {
  sourceLocale: string;           // Default: "en"
  targetLocales?: string[];       // If not specified, auto-discover
  localesDir: string;             // Default: "src/locales"
  cacheFile: string;              // Default: ".translation-cache.json"
  provider: {
    name: "openai" | "anthropic";
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  };
  context: {
    domain: string;               // e.g., "aerospace technology"
    tone: string;                 // e.g., "professional and technical"
    glossary?: Record<string, string>;
  };
  batchSize: number;              // Default: 10
  skipInDevelopment: boolean;     // Default: true
}
```

### Locale Language Mapping

```typescript
const LOCALE_LANGUAGE_MAP: Record<string, string> = {
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
```

## Cor
rectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


Property 1: Complete key coverage
*For any* source locale and any target locale, after the translation system runs, the set of translation keys in the target SHALL be identical to the set of keys in the source.
**Validates: Requirements 1.4**

Property 2: Structural preservation
*For any* nested JSON structure in the source locale, after translation, the target locale SHALL have the same nesting structure (same keys at each level of the hierarchy).
**Validates: Requirements 1.5**

Property 3: Special pattern preservation
*For any* translation containing variable placeholders (e.g., {x}, {y}) or HTML tags (e.g., `<br>`), the translated text SHALL contain all the same placeholders and tags that were present in the source text.
**Validates: Requirements 2.1, 2.2**

Property 4: Cache effectiveness
*For any* translation key that has not changed between builds, the second build SHALL not make an API call for that key (it SHALL use the cached translation).
**Validates: Requirements 3.1**

Property 5: Batch efficiency
*For any* set of N translation keys requiring translation, the system SHALL make fewer than or equal to ceil(N / batchSize) API calls.
**Validates: Requirements 3.3**

Property 6: Configuration loading
*For any* valid configuration provided via environment variables, the translation system SHALL correctly parse and use those configuration values.
**Validates: Requirements 4.1**

Property 7: Missing configuration errors
*For any* required configuration field that is missing, the translation system SHALL throw an error that explicitly mentions which field is missing.
**Validates: Requirements 4.2**

Property 8: Provider support
*For any* supported provider name specified in configuration, the translation system SHALL successfully instantiate and use that provider.
**Validates: Requirements 4.3**

Property 9: Locale filtering
*For any* subset of target locales specified in configuration, the translation system SHALL only generate translations for those specified locales and ignore others.
**Validates: Requirements 4.4**

Property 10: Valid JSON output
*For any* translation generated by the system, the output SHALL be valid JSON that can be parsed without errors.
**Validates: Requirements 6.4**

Property 11: Error resilience
*For any* translation that fails with an error, the translation system SHALL continue processing remaining translations rather than stopping completely.
**Validates: Requirements 6.5**

Property 12: Manual override preservation
*For any* translation marked as a manual override in the cache, the translation system SHALL not overwrite that translation when the source changes.
**Validates: Requirements 7.1**

Property 13: Key removal propagation
*For any* key removed from the source locale, after the translation system runs, that key SHALL be removed from all target locales.
**Validates: Requirements 7.5**

Property 14: New locale initialization
*For any* new target locale file added to the locales directory, the translation system SHALL translate all keys from the source locale to that new locale.
**Validates: Requirements 8.1**

Property 15: Locale file discovery
*For any* set of locale files in the locales directory, the translation system SHALL discover and process all of them.
**Validates: Requirements 8.4**

Property 16: Locale code mapping
*For any* valid locale code (e.g., "pl", "de", "fr"), the translation system SHALL correctly map it to its corresponding language name (e.g., "Polish", "German", "French").
**Validates: Requirements 8.5**

## Error Handling

### Error Categories

1. **Configuration Errors**
   - Missing required environment variables
   - Invalid provider configuration
   - Invalid locale directory path
   - Solution: Fail fast with clear error messages indicating what's missing

2. **File System Errors**
   - Unable to read source locale file
   - Unable to write target locale files
   - Unable to read/write cache file
   - Solution: Fail with descriptive error including file path and permission details

3. **Translation Errors**
   - LLM API errors (rate limits, authentication, network)
   - Invalid translation responses
   - Malformed JSON in responses
   - Solution: Log error, mark translation as failed, continue with remaining translations

4. **Validation Errors**
   - Missing placeholders in translated text
   - Structural mismatches between source and target
   - Solution: Log warning, optionally retry translation, use fallback (source text)

### Error Recovery Strategies

- **Retry Logic**: For transient API errors, implement exponential backoff retry (max 3 attempts)
- **Partial Success**: Allow build to succeed even if some translations fail, but log warnings
- **Fallback**: If translation fails, use source text as fallback to maintain functionality
- **Cache Corruption**: If cache file is corrupted, delete and rebuild from scratch

## Testing Strategy

### Unit Testing

The translation system will use **Vitest** as the testing framework, consistent with modern TypeScript/Node.js practices.

Unit tests will cover:

1. **Locale Manager**
   - Reading and parsing locale files
   - Computing diffs between source and target
   - Merging translations into target structures
   - Discovering locale files

2. **Cache Manager**
   - Hash computation consistency
   - Cache hit/miss logic
   - Manual override detection
   - Cache persistence and loading

3. **Translation Provider**
   - Request formatting
   - Response parsing
   - Error handling
   - Batch request construction

4. **Utility Functions**
   - Placeholder extraction and validation
   - JSON structure comparison
   - Locale code to language name mapping

### Property-Based Testing

The system will use **fast-check** for property-based testing in TypeScript/Node.js environment.

Each property-based test will:
- Run a minimum of 100 iterations
- Use smart generators that create realistic locale data structures
- Tag tests with comments referencing the design document properties

Property-based tests will cover:

1. **Structural Properties** (Properties 1, 2)
   - Generate random nested JSON structures
   - Verify key sets and structure preservation after translation

2. **Pattern Preservation** (Property 3)
   - Generate random text with various placeholder patterns
   - Verify all patterns are preserved in output

3. **Caching Behavior** (Property 4)
   - Generate random locale data and run translation twice
   - Verify cache hits on second run

4. **Configuration Handling** (Properties 6, 7, 8, 9)
   - Generate random valid/invalid configurations
   - Verify correct parsing and error handling

5. **Error Resilience** (Property 11)
   - Generate translation batches with some failures
   - Verify system continues processing

### Integration Testing

Integration tests will verify:

1. **End-to-End Translation Flow**
   - Create test locale files
   - Run full translation process
   - Verify output files match expectations

2. **Build Integration**
   - Verify script runs successfully as pre-build step
   - Verify build fails appropriately on errors

3. **LLM Provider Integration**
   - Test with real API calls (in CI environment with test API keys)
   - Verify request/response handling with actual providers

### Test Configuration

- Tests will use mock LLM providers by default to avoid API costs
- Integration tests with real providers will be optional (CI only)
- Test fixtures will include sample locale files with various edge cases
- Cache tests will use temporary directories to avoid pollution

## Implementation Notes

### Technology Choices

- **Language**: TypeScript for type safety and better developer experience
- **Runtime**: Node.js (compatible with Next.js build environment)
- **LLM Provider**: OpenAI GPT-4 as primary provider (extensible to others)
- **Testing**: Vitest for unit tests, fast-check for property-based testing
- **File I/O**: Node.js fs/promises for async file operations
- **Hashing**: Node.js crypto module for content hashing

### Build Integration

The translation script will be integrated into package.json:

```json
{
  "scripts": {
    "translate": "tsx scripts/translate.ts",
    "build": "npm run translate && next build",
    "dev": "next dev"
  }
}
```

### Environment Variables

Required environment variables:
- `TRANSLATION_PROVIDER`: Provider name (e.g., "openai")
- `TRANSLATION_API_KEY`: API key for the provider
- `TRANSLATION_MODEL`: (Optional) Model name (default: "gpt-4")
- `TRANSLATION_SKIP_DEV`: (Optional) Skip translation in development (default: "true")

### Performance Considerations

- **Batching**: Group translations into batches of 10 to reduce API overhead
- **Parallelization**: Process multiple locales in parallel when possible
- **Caching**: Use content-based hashing to avoid redundant translations
- **Incremental**: Only translate changed/new keys, not entire files

### Extensibility Points

1. **New Providers**: Implement `TranslationProvider` interface
2. **Custom Validators**: Add validators for specific placeholder patterns
3. **Post-Processing**: Hook for custom translation post-processing
4. **Cache Strategies**: Pluggable cache backends (file, Redis, etc.)

## Workflow

### Normal Build Flow

1. Developer adds/modifies content in `src/locales/en.json`
2. Developer runs `npm run build`
3. Translation script executes:
   - Loads source locale and cache
   - Discovers target locales
   - Computes diffs for each target
   - Batches and translates missing/changed keys
   - Merges translations into target files
   - Updates cache
   - Logs statistics
4. Next.js build proceeds with updated locale files
5. Application serves fully translated content

### Development Flow

1. Developer runs `npm run dev`
2. Translation is skipped (TRANSLATION_SKIP_DEV=true)
3. Development server starts immediately
4. Developer works with existing translations

### Manual Override Flow

1. Developer identifies a translation that needs manual correction
2. Developer edits the target locale file directly
3. Developer runs `npm run translate -- --mark-manual <locale> <key>`
4. System marks that translation as manual in cache
5. Future builds preserve the manual translation

### Cache Clear Flow

1. Developer wants to force re-translation of all content
2. Developer runs `npm run translate -- --clear-cache`
3. System deletes cache file
4. Next build re-translates everything

## Dependencies

New dependencies to add:

```json
{
  "dependencies": {
    "openai": "^4.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "vitest": "^1.0.0",
    "fast-check": "^3.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Migration Strategy

Since the application already has locale files:

1. **Phase 1**: Install translation system without modifying existing files
2. **Phase 2**: Run translation system to generate cache from existing translations
3. **Phase 3**: Verify translations match existing content
4. **Phase 4**: Enable automatic translation in build process
5. **Phase 5**: Update documentation for developers

This ensures no disruption to existing translations while adding the automation layer.
