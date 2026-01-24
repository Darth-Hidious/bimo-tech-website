/**
 * Bimo AI Chat API - Genkit powered
 * POST /api/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { bimoChat } from '@/lib/genkit/bimo';

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface ChatRequest {
  message?: string; // Simple single message format
  messages?: ChatMessage[]; // Array format for chat history
  context?: { basketCount?: number };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, messages, context } = body;

    // Support both formats: single message or messages array
    let userMessage = '';
    let history: Array<{ role: 'user' | 'model'; content: string }> = [];

    if (message) {
      // Simple format: { message: "..." }
      userMessage = message;
    } else if (messages && messages.length > 0) {
      // Array format: { messages: [...] }
      userMessage = messages[messages.length - 1]?.content || '';

      // Convert message history format (assistant -> model for Genkit)
      history = messages.slice(0, -1).map(m => ({
        role: (m.role === 'assistant' ? 'model' : m.role) as 'user' | 'model',
        content: m.content,
      })).filter(m => m.role === 'user' || m.role === 'model');
    }

    if (!userMessage.trim()) {
      return NextResponse.json({
        response: "I'm here to help! Ask me about our materials, services, or getting a quote.",
        type: 'text',
      });
    }

    // Call Genkit flow
    const result = await bimoChat({
      message: userMessage,
      history: history.length > 0 ? history : undefined,
    });

    return NextResponse.json({
      response: result.response,
      toolCalls: result.toolCalls,
      type: 'text',
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // More helpful error messages
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check for common issues
    if (errorMessage.includes('API key')) {
      return NextResponse.json({
        response: "AI service is not configured. Please check the GOOGLE_GENAI_API_KEY environment variable.",
        type: 'error',
      });
    }

    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please try again in a moment.",
      type: 'error',
      error: errorMessage,
    });
  }
}
