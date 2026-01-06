/**
 * Bimo AI Agent - Genkit Integration
 * 
 * AI-powered assistant for Bimo Tech products and services.
 * Uses Gemini 2.5 Flash with tools to access Firestore database.
 */

import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';
import { cms } from '@/lib/cms/firestoreAdapter';

// Initialize Genkit with Google AI
export const ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.0-flash',
});

// =============================================================================
// TYPES
// =============================================================================


// =============================================================================
// TOOLS - Data retrieval from Firestore
// =============================================================================

/**
 * Get all products from Firestore
 */
export const getProductsTool = ai.defineTool(
    {
        name: 'getProducts',
        description: 'Get all products from the Bimo Tech catalog.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            symbol: z.string().optional(),
            description: z.string(),
            applications: z.array(z.string()),
            alloys: z.array(z.string()),
        })),
    },
    async () => {
        const products = await cms.getProducts();
        return products.map(p => ({
            id: p.id,
            name: p.name,
            symbol: p.symbol,
            description: p.description,
            applications: p.applications || [],
            alloys: p.alloys || [],
        }));
    }
);

/**
 * Get specific product details
 */
export const getProductDetailsTool = ai.defineTool(
    {
        name: 'getProductDetails',
        description: 'Get detailed information about a specific product by ID.',
        inputSchema: z.object({
            productId: z.string().describe('Product ID'),
        }),
        outputSchema: z.object({
            found: z.boolean(),
            product: z.object({
                id: z.string(),
                name: z.string(),
                symbol: z.string().optional(),
                description: z.string(),
                properties: z.record(z.string()).optional(),
                applications: z.array(z.string()),
                standards: z.array(z.string()),
            }).optional(),
        }),
    },
    async ({ productId }) => {
        const product = await cms.getProduct(productId);
        if (!product) return { found: false };

        return {
            found: true,
            product: {
                id: product.id,
                name: product.name,
                symbol: product.symbol,
                description: product.description,
                properties: product.properties,
                applications: product.applications || [],
                standards: product.standards || [],
            },
        };
    }
);

/**
 * Get all manufacturing services
 */
export const getServicesTool = ai.defineTool(
    {
        name: 'getServices',
        description: 'Get all manufacturing services offered by Bimo Tech.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            slug: z.string(),
            tagline: z.string(),
            description: z.string(),
            features: z.array(z.string()),
            materials: z.array(z.string()),
            startingPrice: z.number(),
            minLeadTimeDays: z.number(),
        })),
    },
    async () => {
        const services = await cms.getServices();
        return services.map(s => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            tagline: s.tagline,
            description: s.description,
            features: s.features || [],
            materials: s.materials || [],
            startingPrice: s.startingPrice,
            minLeadTimeDays: s.minLeadTimeDays,
        }));
    }
);

/**
 * Get specific service by slug
 */
export const getServiceBySlugTool = ai.defineTool(
    {
        name: 'getServiceBySlug',
        description: 'Get detailed information about a specific service by its URL slug.',
        inputSchema: z.object({
            slug: z.string().describe('Service slug (e.g., "cnc-machining")'),
        }),
        outputSchema: z.object({
            found: z.boolean(),
            service: z.object({
                id: z.string(),
                name: z.string(),
                description: z.string(),
                features: z.array(z.string()),
                materials: z.array(z.string()),
                toleranceMin: z.string(),
                maxPartSize: z.string(),
                startingPrice: z.number(),
                minLeadTimeDays: z.number(),
            }).optional(),
        }),
    },
    async ({ slug }) => {
        const service = await cms.getServiceBySlug(slug);
        if (!service) return { found: false };

        return {
            found: true,
            service: {
                id: service.id,
                name: service.name,
                description: service.description,
                features: service.features || [],
                materials: service.materials || [],
                toleranceMin: service.toleranceMin,
                maxPartSize: service.maxPartSize,
                startingPrice: service.startingPrice,
                minLeadTimeDays: service.minLeadTimeDays,
            },
        };
    }
);

/**
 * Get available materials
 */
export const getMaterialsTool = ai.defineTool(
    {
        name: 'getMaterials',
        description: 'Get all available materials for manufacturing.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            category: z.string(),
            priceMultiplier: z.number(),
            properties: z.record(z.string()).optional(),
        })),
    },
    async () => {
        const materials = await cms.getMaterials();
        return materials.map(m => ({
            id: m.id,
            name: m.name,
            category: m.category,
            priceMultiplier: m.priceMultiplier,
            properties: m.properties,
        }));
    }
);



/**
 * Feature: Auto-fill Quote Form
 * This tool allows the AI to extract quote parameters and signal the frontend to fill the form.
 */
export const fillQuoteFormTool = ai.defineTool(
    {
        name: 'fillQuoteForm',
        description: 'Extract quote parameters from user conversation to pre-fill the RFQ form. Use this when the user expresses intent to get a quote and provides details.',
        inputSchema: z.object({
            serviceId: z.string().optional().describe('The ID of the manufacturing service (e.g., "cnc-milling")'),
            materialId: z.string().optional().describe('The ID of the material (e.g., "alu-6061")'),
            quantity: z.number().optional().describe('The number of parts needed'),
            customerEmail: z.string().optional().describe('Customer email if provided'),
            customerName: z.string().optional().describe('Customer name if provided'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async (params) => {
        // In a real agentic flow, this might just return the params for the client to handle
        return {
            success: true,
            message: "Form parameters extracted",
            // The client will see the tool inputs and act on them
        };
    }
);

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

const BIMO_SYSTEM_PROMPT = `You are Bimo, the AI assistant for Bimo Tech - a leading manufacturer of advanced metallic materials and high-precision components.

## Your Expertise
- Refractory metals (tungsten, molybdenum, niobium)
- Sputtering targets
- Additive manufacturing
- CNC machining, EDM, and other services

## Your Goals
1. Answer technical questions about materials and services.
2. **Aggressively (but politely) guide users to the "Steps" or "Get Quote" process.**
3. If a user provides details about a project (material, service, quantity), ask if they would like to start a quote.
4. If they say YES, call the \`fillQuoteForm\` tool with the extracted details.

## Guidelines
- Always use tools to look up information.
- When you have enough info (Material + Service + Quantity), ASK: "Shall I prepare a quote for you with these details?"
- If they agree, use \`fillQuoteForm\`.
- Keep responses concise.`;

// =============================================================================
// CHAT FLOW
// =============================================================================

export const bimoChat = ai.defineFlow(
    {
        name: 'bimoChat',
        inputSchema: z.object({
            message: z.string(),
            history: z.array(z.object({
                role: z.enum(['user', 'model']),
                content: z.string(),
            })).optional(),
        }),
        outputSchema: z.object({
            response: z.string(),
            toolCalls: z.array(z.any()).optional(),
        }),
    },
    async ({ message, history }) => {
        const messages: Array<{ role: 'user' | 'model'; content: Array<{ text: string }> }> = [];

        if (history?.length) {
            messages.push(...history.map(h => ({
                role: h.role as 'user' | 'model',
                content: [{ text: h.content }],
            })));
        }

        messages.push({ role: 'user', content: [{ text: message }] });

        const result = await ai.generate({
            system: BIMO_SYSTEM_PROMPT,
            messages,
            tools: [
                getProductsTool,
                getProductDetailsTool,
                getServicesTool,
                getServiceBySlugTool,
                getMaterialsTool,

                fillQuoteFormTool,
            ],
        });

        // Extract tool calls if any
        const toolCalls = (result as any).toolCalls?.map((tc: any) => ({
            toolName: tc.tool.name,
            args: tc.tool.input,
        }));

        return {
            response: result.text,
            toolCalls
        };
    }
);

export async function askBimo(question: string): Promise<string> {
    const result = await bimoChat({ message: question });
    return result.response;
}

// =============================================================================
// QUOTE ANALYSIS FLOW
// =============================================================================

export const analyzeQuoteFlow = ai.defineFlow(
    {
        name: 'analyzeQuoteFlow',
        inputSchema: z.object({
            quoteId: z.string(),
            details: z.object({
                customerName: z.string(),
                company: z.string().optional(),
                serviceId: z.string(),
                materialId: z.string(),
                quantity: z.number(),
                description: z.string().optional(),
            }),
        }),
        outputSchema: z.object({
            analysis: z.string(),
            suggestedSuppliers: z.array(z.string()),
            feasibilityScore: z.number().min(0).max(100),
        }),
    },
    async ({ details }) => {
        const analysisPrompt = `
            Analyze this RFQ:
            - Customer: ${details.customerName} (${details.company || 'Individual'})
            - Service: ${details.serviceId}
            - Material: ${details.materialId}
            - Quantity: ${details.quantity}
            
            Determine:
            1. Feasibility (0-100 score).
            2. Detailed technical analysis.
            
            Format as JSON.
        `;

        const result = await ai.generate({
            system: BIMO_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: [{ text: analysisPrompt }] }],
            output: {
                format: 'json',
                schema: z.object({
                    analysis: z.string(),
                    suggestedSuppliers: z.array(z.string()),
                    feasibilityScore: z.number(),
                }),
            },
        });

        if (result.output) {
            return result.output;
        }

        return {
            analysis: "Could not generate analysis.",
            suggestedSuppliers: [],
            feasibilityScore: 0,
        };
    }
);
