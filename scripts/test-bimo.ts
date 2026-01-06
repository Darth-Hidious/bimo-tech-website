/**
 * Test script for Bimo AI Genkit integration
 * Run: GOOGLE_API_KEY=<key> npx tsx scripts/test-bimo.ts
 */

import { askBimo } from '../src/lib/genkit/bimo.js';

async function test() {
    console.log('🤖 Testing Bimo AI with Genkit...\n');

    const questions = [
        'What products do you offer?',
        'Tell me about your CNC machining services',
        'What materials can handle temperatures above 2000°C?',
    ];

    for (const q of questions) {
        console.log(`📝 Q: ${q}`);
        try {
            const answer = await askBimo(q);
            console.log(`💬 A: ${answer}\n`);
        } catch (err) {
            console.error(`❌ Error: ${err}\n`);
        }
    }
}

test();
