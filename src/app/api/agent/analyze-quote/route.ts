import { NextRequest, NextResponse } from 'next/server';
import { analyzeQuoteFlow } from '@/lib/genkit/bimo';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // body expect: { quoteId, details: { ... } }
        if (!body.quoteId || !body.details) {
            return NextResponse.json(
                { error: 'Missing quoteId or details' },
                { status: 400 }
            );
        }

        // Run the Genkit flow
        const result = await analyzeQuoteFlow(body);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: `Failed to analyze quote: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
