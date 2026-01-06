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
  messages: ChatMessage[];
  context?: { basketCount?: number };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, context } = body;

    // Get the last user message
    const userMessage = messages[messages.length - 1]?.content || '';

    if (!userMessage.trim()) {
      return NextResponse.json({
        response: "I'm here to help! Ask me about our materials, services, or getting a quote.",
        type: 'text',
      });
    }

    // Convert message history format (assistant -> model for Genkit)
    const history = messages.slice(0, -1).map(m => ({
      role: (m.role === 'assistant' ? 'model' : m.role) as 'user' | 'model',
      content: m.content,
    })).filter(m => m.role === 'user' || m.role === 'model');

    // Call Genkit flow
    const result = await bimoChat({
      message: userMessage,
      history: history.length > 0 ? history : undefined,
    });

    return NextResponse.json({
      response: result.response,
      toolCalls: result.toolCalls, // Pass tool calls to frontend
      type: 'text',
    });
  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json({
      response: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
      type: 'text',
    });
  }
}
