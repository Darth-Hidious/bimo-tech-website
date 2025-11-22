/**
 * TranslationProvider - Abstract interface and OpenAI implementation for LLM translation
 * Feature: build-time-i18n-translation
 */

import OpenAI from 'openai';
import type {
  TranslationProvider as ITranslationProvider,
  TranslationRequest,
  TranslationResponse,
  ProviderConfig
} from '../types/translation';

/**
 * Abstract base class for translation providers
 */
export abstract class TranslationProvider implements ITranslationProvider {
  abstract translate(requests: TranslationRequest[]): Promise<TranslationResponse[]>;
  abstract getName(): string;
}

/**
 * OpenAI-based translation provider
 */
export class OpenAITranslationProvider extends TranslationProvider {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private maxRetries: number = 3;
  private baseDelay: number = 1000; // 1 second

  constructor(config: ProviderConfig) {
    super();
    
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey
    });
    
    this.model = config.model || 'gpt-4';
    this.maxTokens = config.maxTokens || 2000;
    this.temperature = config.temperature || 0.3;
  }

  getName(): string {
    return 'openai';
  }

  /**
   * Translate multiple requests in batch
   */
  async translate(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    if (requests.length === 0) {
      return [];
    }

    const responses: TranslationResponse[] = [];

    // Process requests in batch
    try {
      const batchResponse = await this.translateBatch(requests);
      responses.push(...batchResponse);
    } catch (error) {
      // If batch fails, return error responses for all requests
      for (const request of requests) {
        responses.push({
          key: request.key,
          translatedText: request.sourceText, // Fallback to source
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return responses;
  }

  /**
   * Translate a batch of requests with retry logic
   */
  private async translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await this.executeBatchTranslation(requests);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on the last attempt
        if (attempt < this.maxRetries - 1) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Translation failed after retries');
  }

  /**
   * Execute batch translation via OpenAI API
   */
  private async executeBatchTranslation(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    const targetLanguage = requests[0].targetLanguage;
    const context = requests[0].context;

    // Format the prompt
    const prompt = this.formatPrompt(requests, targetLanguage, context);

    // Call OpenAI API
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt(targetLanguage, context)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: this.temperature,
      max_tokens: this.maxTokens
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse and validate response
    return this.parseResponse(responseText, requests);
  }

  /**
   * Format system prompt with context and instructions
   */
  private getSystemPrompt(targetLanguage: string, context?: TranslationRequest['context']): string {
    let prompt = `You are a professional translator specializing in ${targetLanguage} translations.`;

    if (context) {
      if (context.domain) {
        prompt += ` The content is related to ${context.domain}.`;
      }
      if (context.tone) {
        prompt += ` Maintain a ${context.tone} tone.`;
      }
    }

    prompt += `\n\nIMPORTANT INSTRUCTIONS:
1. Preserve ALL variable placeholders exactly as they appear (e.g., {x}, {y}, {i}, {count})
2. Preserve ALL HTML tags exactly as they appear (e.g., <br>, <strong>, <em>)
3. Maintain the same structure and formatting as the source text
4. Return ONLY valid JSON in the exact format requested
5. Do not add explanations or additional text outside the JSON`;

    if (context?.preservePatterns && context.preservePatterns.length > 0) {
      prompt += `\n6. Specifically preserve these patterns: ${context.preservePatterns.join(', ')}`;
    }

    if (context?.glossary && Object.keys(context.glossary).length > 0) {
      prompt += `\n\nGLOSSARY (use these translations for consistency):`;
      for (const [term, translation] of Object.entries(context.glossary)) {
        prompt += `\n- ${term}: ${translation}`;
      }
    }

    return prompt;
  }

  /**
   * Format translation request as prompt
   */
  private formatPrompt(requests: TranslationRequest[], targetLanguage: string, context?: TranslationRequest['context']): string {
    const translationObject: Record<string, string> = {};
    
    for (const request of requests) {
      translationObject[request.key] = request.sourceText;
    }

    let prompt = `Translate the following JSON object from English to ${targetLanguage}.\n\n`;
    prompt += `Source JSON:\n${JSON.stringify(translationObject, null, 2)}\n\n`;
    prompt += `Return the translations in the same JSON format with the same keys, but with values translated to ${targetLanguage}.`;
    
    return prompt;
  }

  /**
   * Parse and validate translation response
   */
  private parseResponse(responseText: string, requests: TranslationRequest[]): TranslationResponse[] {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      const lines = jsonText.split('\n');
      lines.shift(); // Remove opening ```
      if (lines[lines.length - 1].trim() === '```') {
        lines.pop(); // Remove closing ```
      }
      jsonText = lines.join('\n').trim();
    }

    // Parse JSON
    let translations: Record<string, string>;
    try {
      translations = JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`Invalid JSON response: ${error instanceof Error ? error.message : 'Parse error'}`);
    }

    // Validate and create responses
    const responses: TranslationResponse[] = [];
    
    for (const request of requests) {
      const translatedText = translations[request.key];
      
      if (!translatedText) {
        responses.push({
          key: request.key,
          translatedText: request.sourceText, // Fallback
          error: 'Missing translation in response'
        });
        continue;
      }

      // Validate placeholder preservation
      const validationError = this.validateTranslation(request.sourceText, translatedText, request.context);
      
      if (validationError) {
        responses.push({
          key: request.key,
          translatedText: request.sourceText, // Fallback
          error: validationError
        });
        continue;
      }

      responses.push({
        key: request.key,
        translatedText
      });
    }

    return responses;
  }

  /**
   * Validate that translation preserves required patterns
   */
  private validateTranslation(sourceText: string, translatedText: string, context?: TranslationRequest['context']): string | undefined {
    // Extract placeholders from source
    const placeholderRegex = /\{[^}]+\}/g;
    const sourcePlaceholders = sourceText.match(placeholderRegex) || [];
    const translatedPlaceholders = translatedText.match(placeholderRegex) || [];

    // Check if all placeholders are preserved
    const sourcePlaceholderSet = new Set(sourcePlaceholders);
    const translatedPlaceholderSet = new Set(translatedPlaceholders);

    for (const placeholder of sourcePlaceholderSet) {
      if (!translatedPlaceholderSet.has(placeholder)) {
        return `Missing placeholder: ${placeholder}`;
      }
    }

    // Extract HTML tags from source
    const tagRegex = /<[^>]+>/g;
    const sourceTags = sourceText.match(tagRegex) || [];
    const translatedTags = translatedText.match(tagRegex) || [];

    // Check if all tags are preserved
    const sourceTagSet = new Set(sourceTags);
    const translatedTagSet = new Set(translatedTags);

    for (const tag of sourceTagSet) {
      if (!translatedTagSet.has(tag)) {
        return `Missing HTML tag: ${tag}`;
      }
    }

    // Check custom preserve patterns if specified
    if (context?.preservePatterns) {
      for (const pattern of context.preservePatterns) {
        const sourceCount = (sourceText.match(new RegExp(this.escapeRegex(pattern), 'g')) || []).length;
        const translatedCount = (translatedText.match(new RegExp(this.escapeRegex(pattern), 'g')) || []).length;
        
        if (sourceCount !== translatedCount) {
          return `Pattern count mismatch: ${pattern}`;
        }
      }
    }

    return undefined;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
