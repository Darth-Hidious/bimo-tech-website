/**
 * Property-based and unit tests for TranslationProvider
 * Feature: build-time-i18n-translation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { OpenAITranslationProvider } from './TranslationProvider';
import type {
  TranslationRequest,
  TranslationResponse,
  ProviderConfig
} from '../types/translation';

// Mock OpenAI client for testing
class MockOpenAIProvider extends OpenAITranslationProvider {
  private mockResponses: Map<string, string> = new Map();
  private shouldFail: boolean = false;
  private failureCount: number = 0;
  private callCount: number = 0;

  constructor(config: ProviderConfig) {
    super(config);
  }

  setMockResponse(key: string, translation: string): void {
    this.mockResponses.set(key, translation);
  }

  setMockBatchResponse(translations: Record<string, string>): void {
    for (const [key, value] of Object.entries(translations)) {
      this.mockResponses.set(key, value);
    }
  }

  setShouldFail(fail: boolean, count: number = 1): void {
    this.shouldFail = fail;
    this.failureCount = count;
  }

  getCallCount(): number {
    return this.callCount;
  }

  resetCallCount(): void {
    this.callCount = 0;
  }

  // Override the private method by accessing it through prototype
  protected async executeBatchTranslation(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    this.callCount++;

    // Simulate failure for testing retry logic
    if (this.shouldFail && this.failureCount > 0) {
      this.failureCount--;
      throw new Error('Mock API error');
    }

    // Build response object
    const responseObj: Record<string, string> = {};
    for (const request of requests) {
      const mockTranslation = this.mockResponses.get(request.key);
      if (mockTranslation) {
        responseObj[request.key] = mockTranslation;
      } else {
        // Default mock translation that preserves patterns
        responseObj[request.key] = `[${request.targetLanguage}] ${request.sourceText}`;
      }
    }

    // Simulate OpenAI response format
    const mockResponse = JSON.stringify(responseObj, null, 2);
    
    // Parse using parent class logic
    return this.parseResponsePublic(mockResponse, requests);
  }

  // Expose private method for testing
  parseResponsePublic(responseText: string, requests: TranslationRequest[]): TranslationResponse[] {
    // Access the private parseResponse method through a workaround
    return (this as any).parseResponse(responseText, requests);
  }

  validateTranslationPublic(sourceText: string, translatedText: string, context?: TranslationRequest['context']): string | undefined {
    return (this as any).validateTranslation(sourceText, translatedText, context);
  }
}

describe('TranslationProvider - Property Tests', () => {
  let provider: MockOpenAIProvider;

  beforeEach(() => {
    const config: ProviderConfig = {
      name: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.3
    };
    provider = new MockOpenAIProvider(config);
  });

  /**
   * Property 3: Special pattern preservation
   * Validates: Requirements 2.1, 2.2
   * 
   * For any translation containing variable placeholders (e.g., {x}, {y}) or HTML tags (e.g., <br>),
   * the translated text SHALL contain all the same placeholders and tags that were present in the source text.
   */
  it('Property 3: should preserve variable placeholders in translations', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate text with random placeholders
        fc.tuple(
          fc.string({ minLength: 5, maxLength: 50 }),
          fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 5 })
        ),
        async ([baseText, placeholderNames]) => {
          // Create source text with placeholders
          const placeholders = placeholderNames.map(name => `{${name}}`);
          const sourceText = `${baseText} ${placeholders.join(' ')}`;

          // Create mock translation that preserves placeholders
          const mockTranslation = `[Polish] ${baseText} ${placeholders.join(' ')}`;
          
          const request: TranslationRequest = {
            key: 'test.key',
            sourceText,
            targetLanguage: 'Polish'
          };

          provider.setMockResponse('test.key', mockTranslation);
          const responses = await provider.translate([request]);

          // Property: All placeholders from source should be in translation
          const sourcePlaceholderRegex = /\{[^}]+\}/g;
          const sourcePlaceholders = sourceText.match(sourcePlaceholderRegex) || [];
          const translatedPlaceholders = responses[0].translatedText.match(sourcePlaceholderRegex) || [];

          const sourcePlaceholderSet = new Set(sourcePlaceholders);
          const translatedPlaceholderSet = new Set(translatedPlaceholders);

          for (const placeholder of sourcePlaceholderSet) {
            expect(translatedPlaceholderSet.has(placeholder)).toBe(true);
          }

          // Property: No error should be present if placeholders are preserved
          if (responses[0].error) {
            expect(responses[0].error).not.toContain('Missing placeholder');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: should preserve HTML tags in translations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.string({ minLength: 5, maxLength: 50 }),
          fc.array(
            fc.constantFrom('br', 'strong', 'em', 'span', 'div', 'p'),
            { minLength: 1, maxLength: 3 }
          )
        ),
        async ([baseText, tagNames]) => {
          // Create source text with HTML tags
          const tags = tagNames.map(tag => `<${tag}>`);
          const sourceText = `${baseText} ${tags.join(' ')}`;

          // Create mock translation that preserves tags
          const mockTranslation = `[German] ${baseText} ${tags.join(' ')}`;
          
          const request: TranslationRequest = {
            key: 'test.key',
            sourceText,
            targetLanguage: 'German'
          };

          provider.setMockResponse('test.key', mockTranslation);
          const responses = await provider.translate([request]);

          // Property: All HTML tags from source should be in translation
          const sourceTagRegex = /<[^>]+>/g;
          const sourceTags = sourceText.match(sourceTagRegex) || [];
          const translatedTags = responses[0].translatedText.match(sourceTagRegex) || [];

          const sourceTagSet = new Set(sourceTags);
          const translatedTagSet = new Set(translatedTags);

          for (const tag of sourceTagSet) {
            expect(translatedTagSet.has(tag)).toBe(true);
          }

          // Property: No error should be present if tags are preserved
          if (responses[0].error) {
            expect(responses[0].error).not.toContain('Missing HTML tag');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: should detect missing placeholders and report error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.string({ minLength: 5, maxLength: 30 }),
          fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 3 })
        ),
        async ([baseText, placeholderNames]) => {
          const placeholders = placeholderNames.map(name => `{${name}}`);
          const sourceText = `${baseText} ${placeholders.join(' ')}`;

          // Create mock translation that DROPS placeholders (invalid)
          const mockTranslation = `[French] ${baseText}`;
          
          const request: TranslationRequest = {
            key: 'test.key',
            sourceText,
            targetLanguage: 'French'
          };

          provider.setMockResponse('test.key', mockTranslation);
          const responses = await provider.translate([request]);

          // Property: Should detect missing placeholders
          if (placeholders.length > 0) {
            expect(responses[0].error).toBeDefined();
            expect(responses[0].error).toContain('Missing placeholder');
            // Property: Should fallback to source text on error
            expect(responses[0].translatedText).toBe(sourceText);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: should detect missing HTML tags and report error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.string({ minLength: 5, maxLength: 30 }),
          fc.array(fc.constantFrom('br', 'strong', 'em'), { minLength: 1, maxLength: 2 })
        ),
        async ([baseText, tagNames]) => {
          const tags = tagNames.map(tag => `<${tag}>`);
          const sourceText = `${baseText} ${tags.join(' ')}`;

          // Create mock translation that DROPS tags (invalid)
          const mockTranslation = `[Spanish] ${baseText}`;
          
          const request: TranslationRequest = {
            key: 'test.key',
            sourceText,
            targetLanguage: 'Spanish'
          };

          provider.setMockResponse('test.key', mockTranslation);
          const responses = await provider.translate([request]);

          // Property: Should detect missing tags
          if (tags.length > 0) {
            expect(responses[0].error).toBeDefined();
            expect(responses[0].error).toContain('Missing HTML tag');
            // Property: Should fallback to source text on error
            expect(responses[0].translatedText).toBe(sourceText);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: should preserve custom patterns specified in context', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.string({ minLength: 5, maxLength: 30 }),
          fc.array(fc.string({ minLength: 2, maxLength: 5 }), { minLength: 1, maxLength: 3 })
        ),
        async ([baseText, patterns]) => {
          const sourceText = `${baseText} ${patterns.join(' ')}`;

          // Create mock translation that preserves patterns
          const mockTranslation = `[Italian] ${baseText} ${patterns.join(' ')}`;
          
          const request: TranslationRequest = {
            key: 'test.key',
            sourceText,
            targetLanguage: 'Italian',
            context: {
              domain: 'test',
              tone: 'professional',
              preservePatterns: patterns
            }
          };

          provider.setMockResponse('test.key', mockTranslation);
          const responses = await provider.translate([request]);

          // Property: All custom patterns should be preserved
          for (const pattern of patterns) {
            const sourceCount = (sourceText.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            const translatedCount = (responses[0].translatedText.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            
            expect(translatedCount).toBe(sourceCount);
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});

  /**
   * Property 5: Batch efficiency
   * Validates: Requirements 3.3
   * 
   * For any set of N translation keys requiring translation, the system SHALL make
   * fewer than or equal to ceil(N / batchSize) API calls.
   */
  it('Property 5: should batch translation requests efficiently', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate array of translation requests
        fc.array(
          fc.record({
            key: fc.string({ minLength: 1, maxLength: 20 }),
            sourceText: fc.string({ minLength: 5, maxLength: 50 })
          }),
          { minLength: 1, maxLength: 50 }
        ),
        async (requestData) => {
          // Reset call counter
          provider.resetCallCount();

          // Create translation requests
          const requests: TranslationRequest[] = requestData.map(data => ({
            key: data.key,
            sourceText: data.sourceText,
            targetLanguage: 'Polish'
          }));

          // Set up mock responses
          const mockResponses: Record<string, string> = {};
          for (const req of requests) {
            mockResponses[req.key] = `[Polish] ${req.sourceText}`;
          }
          provider.setMockBatchResponse(mockResponses);

          // Execute translation
          await provider.translate(requests);

          // Property: Should make exactly 1 API call for a single batch
          // (Since we're passing all requests at once, they should be batched together)
          const callCount = provider.getCallCount();
          
          // For this implementation, all requests in a single translate() call
          // are processed as one batch, so we expect exactly 1 API call
          expect(callCount).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: should handle empty request array efficiently', async () => {
    provider.resetCallCount();
    
    const responses = await provider.translate([]);
    
    // Property: No API calls should be made for empty requests
    expect(provider.getCallCount()).toBe(0);
    expect(responses).toEqual([]);
  });

  it('Property 5: should process all requests in single batch', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }),
        async (numRequests) => {
          provider.resetCallCount();

          // Create N requests
          const requests: TranslationRequest[] = [];
          const mockResponses: Record<string, string> = {};
          
          for (let i = 0; i < numRequests; i++) {
            const key = `key${i}`;
            const sourceText = `Text ${i}`;
            requests.push({
              key,
              sourceText,
              targetLanguage: 'German'
            });
            mockResponses[key] = `[German] ${sourceText}`;
          }

          provider.setMockBatchResponse(mockResponses);
          const responses = await provider.translate(requests);

          // Property: Exactly 1 API call for any number of requests in single batch
          expect(provider.getCallCount()).toBe(1);
          
          // Property: All requests should get responses
          expect(responses.length).toBe(numRequests);
          
          // Property: All responses should be successful (no errors)
          const successfulResponses = responses.filter(r => !r.error);
          expect(successfulResponses.length).toBe(numRequests);
        }
      ),
      { numRuns: 50 }
    );
  });
});
