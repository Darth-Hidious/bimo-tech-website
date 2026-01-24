import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ServiceStatus {
    name: string;
    status: 'connected' | 'error' | 'not-configured';
    message: string;
    details?: Record<string, any>;
}

export async function GET() {
    const statuses: ServiceStatus[] = [];

    // Check Firebase Configuration
    const firebaseConfigured = !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );

    statuses.push({
        name: 'Firebase Auth',
        status: firebaseConfigured ? 'connected' : 'not-configured',
        message: firebaseConfigured
            ? `Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`
            : 'Firebase environment variables not set',
        details: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set',
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set',
        }
    });

    // Check Firestore (via Firebase)
    if (firebaseConfigured) {
        try {
            // Dynamic import to avoid server-side issues
            const { cms } = await import('@/lib/cms/firestoreAdapter');
            const products = await cms.getProducts();

            statuses.push({
                name: 'Firestore Database',
                status: 'connected',
                message: `Connected - ${products.length} products in database`,
                details: {
                    productsCount: products.length,
                }
            });
        } catch (error: any) {
            statuses.push({
                name: 'Firestore Database',
                status: 'error',
                message: error.message || 'Failed to connect to Firestore',
            });
        }
    } else {
        statuses.push({
            name: 'Firestore Database',
            status: 'not-configured',
            message: 'Firebase not configured',
        });
    }

    // Check Firebase Storage
    statuses.push({
        name: 'Firebase Storage',
        status: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'connected' : 'not-configured',
        message: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
            ? `Bucket: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`
            : 'Storage bucket not configured',
    });

    // Check Gemini AI API
    const geminiConfigured = !!(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY);

    if (geminiConfigured) {
        try {
            // Test the Gemini API with a simple call
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: 'Hello' }] }],
                        generationConfig: { maxOutputTokens: 10 }
                    }),
                }
            );

            if (response.ok) {
                statuses.push({
                    name: 'Gemini AI API',
                    status: 'connected',
                    message: 'API key valid - Gemini 2.0 Flash available',
                    details: {
                        model: 'gemini-2.0-flash',
                    }
                });
            } else {
                const error = await response.json();
                statuses.push({
                    name: 'Gemini AI API',
                    status: 'error',
                    message: error.error?.message || 'API key invalid or quota exceeded',
                });
            }
        } catch (error: any) {
            statuses.push({
                name: 'Gemini AI API',
                status: 'error',
                message: error.message || 'Failed to connect to Gemini API',
            });
        }
    } else {
        statuses.push({
            name: 'Gemini AI API',
            status: 'not-configured',
            message: 'GOOGLE_GENAI_API_KEY not set',
        });
    }

    // Overall health
    const allConnected = statuses.every(s => s.status === 'connected');
    const hasErrors = statuses.some(s => s.status === 'error');

    return NextResponse.json({
        healthy: allConnected,
        hasErrors,
        services: statuses,
        timestamp: new Date().toISOString(),
    });
}
