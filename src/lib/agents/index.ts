/**
 * AI Agent Integration Hooks
 * 
 * This module provides interfaces and hooks for integrating AI agents (like Bimo)
 * with the admin dashboard while maintaining data isolation.
 * 
 * Architecture:
 * - Each AI agent operates in an isolated context
 * - Agents can only access data explicitly granted to them
 * - All agent actions are logged for audit purposes
 * - RFQ processing can be delegated to agents with scoped permissions
 */

export interface AgentContext {
    agentId: string;
    agentName: string;
    permissions: AgentPermission[];
    createdAt: number;
}

export type AgentPermission =
    | 'rfq:read'
    | 'rfq:respond'
    | 'products:read'
    | 'services:read'
    | 'contacts:read'
    | 'contacts:respond'
    | 'analytics:read';

export interface AgentAction {
    id: string;
    agentId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}

// Agent registry - will be populated when agents are added
const agentRegistry: Map<string, AgentContext> = new Map();

/**
 * Register an AI agent with specific permissions
 */
export function registerAgent(context: AgentContext): void {
    agentRegistry.set(context.agentId, context);
}

/**
 * Get agent context by ID
 */
export function getAgentContext(agentId: string): AgentContext | undefined {
    return agentRegistry.get(agentId);
}

/**
 * Check if an agent has a specific permission
 */
export function hasPermission(agentId: string, permission: AgentPermission): boolean {
    const context = agentRegistry.get(agentId);
    if (!context) return false;
    return context.permissions.includes(permission);
}

/**
 * Create a scoped data accessor for an agent
 * This ensures the agent can only access data it's permitted to
 */
export function createScopedAccessor(agentId: string) {
    const context = agentRegistry.get(agentId);
    if (!context) {
        throw new Error(`Agent ${agentId} not registered`);
    }

    return {
        canReadRFQ: () => hasPermission(agentId, 'rfq:read'),
        canRespondToRFQ: () => hasPermission(agentId, 'rfq:respond'),
        canReadProducts: () => hasPermission(agentId, 'products:read'),
        canReadServices: () => hasPermission(agentId, 'services:read'),
        canReadContacts: () => hasPermission(agentId, 'contacts:read'),
        canRespondToContacts: () => hasPermission(agentId, 'contacts:respond'),
    };
}

/**
 * Log an agent action for audit purposes
 */
export function logAgentAction(action: Omit<AgentAction, 'id' | 'timestamp'>): AgentAction {
    const fullAction: AgentAction = {
        ...action,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    // TODO: Persist to Firestore in 'agent_actions' collection
    console.log('[AgentAction]', fullAction);

    return fullAction;
}

/**
 * Future: Bimo Agent Configuration
 * 
 * When implementing Bimo, register it like this:
 * 
 * registerAgent({
 *   agentId: 'bimo-v1',
 *   agentName: 'Bimo',
 *   permissions: ['rfq:read', 'rfq:respond', 'products:read', 'services:read'],
 *   createdAt: Date.now(),
 * });
 */
