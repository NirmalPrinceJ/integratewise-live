import { Hono } from 'hono';
import { z } from 'zod';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

type Bindings = {
    // Primary data source (truth database)
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;

    // Edge cache (D1) — used for cached projections, idempotency, and sync cursors
    DB: D1Database;

    KNOWLEDGE: Fetcher;
    GOVERN: Fetcher; // Service binding to approval gate
    ACT: Fetcher; // Service binding to execution engine

    ENVIRONMENT: string;
    OPENAI_API_KEY?: string;
    SERVICE_SECRET?: string;
};

// ============================================================================
// Supabase Query Helper (Truth Database)
// ============================================================================
async function supabaseQuery(
    url: string,
    key: string,
    table: string,
    query: string
): Promise<any[]> {
    try {
        const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error(`Supabase query failed: ${res.status} ${res.statusText}`);
            return [];
        }

        return res.json();
    } catch (err: any) {
        console.error(`Supabase fetch error: ${err.message}`);
        return [];
    }
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());
app.use('*', secureHeaders());

// ============================================================================
// Best Practices: Correlation ID Middleware
// ============================================================================
app.use('*', async (c, next) => {
    const correlationId = c.req.header('x-correlation-id') || crypto.randomUUID();
    c.set('correlationId' as any, correlationId);
    c.res.headers.set('x-correlation-id', correlationId);
    await next();
});

// ============================================================================
// Security: Simple Rate Limiting (in-memory for demo)
// ============================================================================
const requestCounts = new Map<string, { count: number; reset: number }>();

app.use('/v1/*', async (c, next) => {
    const tenantId = c.req.header('x-tenant-id') || 'anonymous';
    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 100;

    const current = requestCounts.get(tenantId);
    if (!current || now > current.reset) {
        requestCounts.set(tenantId, { count: 1, reset: now + windowMs });
    } else if (current.count >= maxRequests) {
        return c.json({ error: 'Rate limit exceeded', retry_after: Math.ceil((current.reset - now) / 1000) }, 429);
    } else {
        current.count++;
    }
    await next();
});

// ============================================================================
// SCHEMAS
// ============================================================================

const PaginationSchema = z.object({
    limit: z.coerce.number().min(1).max(100).default(20),
});

const SignalQuerySchema = PaginationSchema.extend({
    band: z.string().optional(),
});

// ============================================================================
// ROUTES
// ============================================================================

app.get('/health', (c) => c.json({ status: 'ok', service: 'Think Engine (Layer 2)', database: 'Supabase (truth) + D1 (edge cache)' }));

/**
 * 1. SIGNALS FEED (D1)
 */
app.get('/v1/signals', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const { limit } = PaginationSchema.parse(c.req.query());

    try {
        // Query Supabase (truth database)
        const results = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'signals',
            `tenant_id=eq.${tenantId}&order=computed_at.desc&limit=${limit}`
        );

        return c.json({ data: results });
    } catch (err: any) {
        return c.json({ error: 'Spine query failed', message: err.message }, 500);
    }
});

/**
 * 2. SITUATIONS FEED (Brainstorm Layer)
 */
app.get('/v1/situations', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const { limit } = PaginationSchema.parse(c.req.query());

    try {
        // Query Supabase (truth database)
        const results = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'situations',
            `tenant_id=eq.${tenantId}&order=created_at.desc&limit=${limit}`
        );

        return c.json({ data: results });
    } catch (err: any) {
        return c.json({ error: 'Spine query failed', message: err.message }, 500);
    }
});

import { SignalEngine } from './engine';

/**
 * 3. ANALYZE & BRAINSTORM (Post a manual trigger for situation discovery)
 */
app.post('/v1/think/analyze', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    const { entity_type, entity_id } = await c.req.json();

    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);
    if (!entity_type || !entity_id) return c.json({ error: 'entity_type and entity_id required' }, 400);

    const engine = new SignalEngine(c.env.DB);

    try {
        const result = await engine.analyzeEntity(tenantId, entity_type, entity_id);
        return c.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (err: any) {
        return c.json({ error: 'Analysis failed', message: err.message }, 500);
    }
});

/**
 * 4. DECISIONS (Governance & Act Layer)
 * v3.6: Decisions are stored in D1 edge cache with eventual sync to Supabase truth database
 */
app.post('/v1/decide', async (c) => {
    const tenantId = c.req.header('x-tenant-id') || '00000000-0000-0000-0000-000000000001';
    const { situation_id, action_proposal_id, decision_status, reason } = await c.req.json();

    try {
        const decisionId = crypto.randomUUID();

        // Store in D1 edge cache (v3.6: edge state — will sync to Supabase via background job)
        await c.env.DB.prepare(`
            INSERT INTO agent_decisions (id, tenant_id, situation_id, action_proposal_id, decision_status, decision_source, reason)
            VALUES (?, ?, ?, ?, ?, 'manual', ?)
        `).bind(decisionId, tenantId, situation_id, action_proposal_id, decision_status, reason).run();

        // Log to Audit Stream (D1 edge cache)
        await c.env.DB.prepare(`
            INSERT INTO audit_logs (id, tenant_id, actor_id, actor_type, action, entity_type, entity_id)
            VALUES (?, ?, 'think-engine', 'engine', 'decision_recorded', 'situation', ?)
        `).bind(crypto.randomUUID(), tenantId, situation_id).run();

        return c.json({ success: true, decision_id: decisionId });
    } catch (err: any) {
        return c.json({ error: 'Failed to record decision', message: err.message }, 500);
    }
});

// Export Queue Handler
export const queue = {
    async queue(batch: MessageBatch<any>, env: Bindings): Promise<void> {
        const engine = new SignalEngine(env.DB);

        for (const message of batch.messages) {
            const { tenant_id, entity_type, entity_id, correlation_id } = message.body;

            try {
                console.log(`[Think] Async analysis for ${entity_id} (${entity_type}) - Correlation: ${correlation_id}`);
                await engine.analyzeEntity(tenant_id, entity_type, entity_id);
                message.ack();
            } catch (err: any) {
                console.error(`[Think] Async analysis failed for ${entity_id}: ${err.message}`);
                // Message will be retried based on queue policy (max_retries)
                message.retry();
            }
        }
    }
};

export default {
    fetch: app.fetch,
    queue: queue.queue
};
