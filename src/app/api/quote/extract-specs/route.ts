import { NextRequest, NextResponse } from 'next/server';
import { extractSpecsFlow } from '@/lib/genkit/bimo';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.rawText || typeof body.rawText !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid rawText field' },
                { status: 400 }
            );
        }

        // Limit input length for safety
        const rawText = body.rawText.slice(0, 5000);

        // Run the Genkit extraction flow
        const result = await extractSpecsFlow({ rawText });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Spec extraction error:', error);
        return NextResponse.json(
            { error: `Failed to extract specs: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
