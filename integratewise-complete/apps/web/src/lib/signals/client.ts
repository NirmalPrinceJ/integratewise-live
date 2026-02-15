/**
 * Signal Fabric Client
 * 
 * Provides a clean interface for domain services to emit signals
 * into the Cognitive OS event backbone.
 */
import { serviceRequest, extractScopeContext, getTraceContext } from '@/lib/db';
import { Signal, SignalType, SignalPayload } from './types';
import { randomUUID } from 'crypto';

export class SignalClient {
    private source: string;

    constructor(source: string) {
        this.source = source;
    }

    /**
     * Emit a structured signal to the Signal Fabric.
     */
    async emit(type: SignalType, payload: SignalPayload): Promise<void> {
        const scope = await extractScopeContext();
        const trace = getTraceContext();

        const signal: Signal = {
            id: randomUUID(),
            type,
            timestamp: Date.now(),
            source: this.source,
            payload,
            context: {
                tenantId: scope.tenant_id || 'unknown',
                workspaceId: scope.workspace_id || 'unknown',
                userId: scope.user_id,
                requestId: trace.request_id,
                traceId: trace.trace_id,
            },
        };

        try {
            // In production, this would go to the 'signals' worker 
            // which uses Durable Objects to guarantee ordering/delivery.
            await serviceRequest('signals', '/v1/emit', {
                method: 'POST',
                body: signal,
            });

            console.log(`[signal-fabric] Emitted ${type} from ${this.source}`);
        } catch (error) {
            // Signals are usually non-blocking, so we log but don't throw 
            // unless it's a critical system error.
            console.error(`[signal-fabric] Failed to emit ${type}:`, error);
        }
    }
}

// Default singleton for easy use
export const signals = new SignalClient('nextjs-frontend');
