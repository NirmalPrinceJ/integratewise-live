/**
 * Signal Fabric Types
 * 
 * Defines the structured signals emitted by domain services.
 * Signals are the lifeblood of the Cognitive OS, enabling async
 * insights, memory formation, and agentic responses.
 */

export type SignalType =
    | 'ENTITY_CREATED'
    | 'ENTITY_UPDATED'
    | 'GOAL_COMPLETED'
    | 'TASK_BLOCKED'
    | 'INSIGHT_GENERATED'
    | 'APPROVAL_REQUESTED'
    | 'USER_ACTION_PERFORMED'
    | 'SYSTEM_EVENT';

export interface SignalPayload extends Record<string, unknown> {
    entityId?: string;
    entityType?: string;
    previousValue?: unknown;
    currentValue?: unknown;
}

export interface Signal {
    id: string;
    type: SignalType;
    timestamp: number;
    source: string; // The service emitting the signal
    payload: SignalPayload;
    context: {
        tenantId: string;
        workspaceId: string;
        userId?: string;
        requestId: string;
        traceId: string;
    };
}
