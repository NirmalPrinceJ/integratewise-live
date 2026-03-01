import { Hono } from 'hono'
import { runAiSessionSync } from './jobs/ai-session-sync'
import { processIncoming, processBatch, type PipelineResult } from './pipeline'
import { telemetryMiddleware } from './handlers/telemetry'
import { telemetryMetricsHandler, telemetryHealthHandler } from './handlers/telemetry'
import { httpConnectivityHandler, dnsResolutionHandler, serviceConnectivityHandler, networkDiagnosticsHandler, nettoolsInfoHandler } from './handlers/nettools'
import { McpSessionDO } from './durable-objects/mcp-session'

type Bindings = {
    FIREBASE_PROJECT_ID: string;
    DB: D1Database; // Day 2: D1 Database
    ENVIRONMENT: string;
    NORMALIZER_URL: string;
    STORE_URL: string;
    FILES: R2Bucket;
    PIPELINE_QUEUE: Queue; // v3.6 Section 19.7 — 8-stage pipeline processing
    KNOWLEDGE?: Fetcher; // Service binding to integratewise-knowledge for embeddings
    COGNITIVE_EVENTS_URL: string;
    DISCORD_PUBLIC_KEY?: string; // Discord webhook public key for Ed25519 signature verification
    MCP_SESSION: DurableObjectNamespace; // Durable Object for MCP session management
}

type Variables = {
    requestId: string;
    tenantId: string;
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Add telemetry middleware for observability
app.use('*', telemetryMiddleware())

app.get('/', (c) => c.json({ service: 'loader', status: 'operational' }))

// ✅ Add health check route
app.get('/health', async (c) => {
    return c.json({
        service: 'IntegrateWise Loader',
        status: 'healthy',
        environment: c.env?.ENVIRONMENT ?? 'unknown',
        ts: new Date().toISOString(),
    });
});

app.post('/jobs/sync-ai-sessions', async (c) => {
    // Basic auth check for internal job trigger
    const auth = c.req.header('Authorization');
    if (auth !== `Bearer ${c.env.ENVIRONMENT === 'production' ? 'prod-secret' : 'dev-secret'}`) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        await runAiSessionSync(c.env, {
            info: (msg: string, data?: any) => console.log(msg, data),
            error: (msg: string, data?: any) => console.error(msg, data)
        });
        return c.json({ status: 'completed' });
    } catch (error: any) {
        return c.json({ status: 'failed', error: error.message }, 500);
    }
})

app.post('/jobs', async (c) => {
    // Logic to load data from external sources (ETL)
    return c.json({ status: 'job_started', details: 'Loading data...' })
})

// Pipeline endpoints for direct normalization
app.post('/v1/pipeline/process', async (c) => {
    const body = await c.req.json() as {
        entity_type: string;
        data: any;
        tenant_id: string;
        source_system: string;
        category?: string;
        user_id?: string;
        account_id?: string;
        team_id?: string;
        user_role?: string;
    };

    if (!body.entity_type || !body.data || !body.tenant_id || !body.source_system) {
        return c.json({
            error: 'Missing required fields: entity_type, data, tenant_id, source_system'
        }, 400);
    }

    const correlationId = c.get('requestId') || crypto.randomUUID();

    const result = await processIncoming(
        body.entity_type,
        body.data,
        body.tenant_id,
        body.source_system,
        {
            env: {
                NORMALIZER_URL: c.env.NORMALIZER_URL,
                STORE_URL: c.env.STORE_URL,
                COGNITIVE_EVENTS_URL: c.env.COGNITIVE_EVENTS_URL,
            },
            requestId: correlationId,
            tenant_id: body.tenant_id,
            category: body.category,
            user_id: body.user_id,
            account_id: body.account_id,
            team_id: body.team_id,
            user_role: body.user_role,
            log: {
                info: (msg: string, data?: any) => console.log(msg, data),
                warn: (msg: string, data?: any) => console.warn(msg, data),
                error: (msg: string, data?: any) => console.error(msg, data),
            },
        }
    );

    // Send to PIPELINE_QUEUE for async 8-stage pipeline processing
    if (result.success) {
        try {
            await c.env.PIPELINE_QUEUE.send({
                entity_type: body.entity_type,
                data: body.data,
                tenant_id: body.tenant_id,
                source_system: body.source_system,
                category: body.category,
                user_id: body.user_id,
                account_id: body.account_id,
                team_id: body.team_id,
                user_role: body.user_role,
                correlation_id: correlationId,
            });
            console.log(`[Loader] Enqueued to PIPELINE_QUEUE: ${body.entity_type} for tenant ${body.tenant_id}`);
        } catch (queue_err: any) {
            console.error(`[Loader] Failed to enqueue to PIPELINE_QUEUE: ${queue_err.message}`);
            // Non-blocking — HTTP response already sent successfully
        }
    }

    return c.json(result, result.success ? 200 : 422);
})

app.post('/v1/pipeline/batch', async (c) => {
    const body = await c.req.json() as {
        items: Array<{
            entity_type: string;
            data: any;
            event_type?: string;
            category?: string;
            user_id?: string;
            account_id?: string;
            team_id?: string;
            user_role?: string;
        }>;
        tenant_id: string;
        source_system: string;
        category?: string;
        user_id?: string;
        account_id?: string;
        team_id?: string;
        user_role?: string;
    };

    if (!body.items || !body.tenant_id || !body.source_system) {
        return c.json({
            error: 'Missing required fields: items, tenant_id, source_system'
        }, 400);
    }

    const correlationId = c.get('requestId') || crypto.randomUUID();

    const results = await processBatch(
        body.items,
        body.tenant_id,
        body.source_system,
        {
            env: {
                NORMALIZER_URL: c.env.NORMALIZER_URL,
                STORE_URL: c.env.STORE_URL,
                COGNITIVE_EVENTS_URL: c.env.COGNITIVE_EVENTS_URL,
            },
            requestId: correlationId,
            tenant_id: body.tenant_id,
            category: body.category,
            user_id: body.user_id,
            account_id: body.account_id,
            team_id: body.team_id,
            user_role: body.user_role,
            log: {
                info: (msg: string, data?: any) => console.log(msg, data),
                warn: (msg: string, data?: any) => console.warn(msg, data),
                error: (msg: string, data?: any) => console.error(msg, data),
            },
        }
    );

    // Send successful items to PIPELINE_QUEUE for async 8-stage pipeline processing
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
        try {
            for (let i = 0; i < body.items.length; i++) {
                if (results[i].success) {
                    await c.env.PIPELINE_QUEUE.send({
                        entity_type: body.items[i].entity_type,
                        data: body.items[i].data,
                        tenant_id: body.tenant_id,
                        source_system: body.source_system,
                        category: body.items[i].category || body.category,
                        user_id: body.items[i].user_id || body.user_id,
                        account_id: body.items[i].account_id || body.account_id,
                        team_id: body.items[i].team_id || body.team_id,
                        user_role: body.items[i].user_role || body.user_role,
                        correlation_id: correlationId,
                    });
                }
            }
            console.log(`[Loader] Enqueued ${successCount} items to PIPELINE_QUEUE for tenant ${body.tenant_id}`);
        } catch (queue_err: any) {
            console.error(`[Loader] Failed to enqueue batch to PIPELINE_QUEUE: ${queue_err.message}`);
            // Non-blocking — HTTP response already sent successfully
        }
    }

    return c.json({
        results,
        summary: {
            total: results.length,
            success: successCount,
            failed: results.length - successCount,
        }
    });
})

// ============================================================================
// TELEMETRY & OBSERVABILITY ENDPOINTS
// ============================================================================

app.get('/telemetry/metrics', telemetryMetricsHandler)
app.get('/telemetry/health', telemetryHealthHandler)

// ============================================================================
// NETWORK TOOLS & DIAGNOSTICS ENDPOINTS
// ============================================================================

app.get('/nettools', nettoolsInfoHandler)
app.get('/nettools/http-connectivity', httpConnectivityHandler)
app.get('/nettools/dns-resolution', dnsResolutionHandler)
app.get('/nettools/service-connectivity', serviceConnectivityHandler)
app.get('/nettools/diagnostics', networkDiagnosticsHandler)

// ============================================================================
// Queue Producer (v3.6 Section 19.7)
// The loader enqueues items to PIPELINE_QUEUE in HTTP endpoints above
// This export ensures proper Cloudflare Workers queue producer binding
// ============================================================================
// No separate queue consumer — Loader is producer-only
// Normalizer service consumes from PIPELINE_QUEUE

export default app

// Export Durable Object class
export { McpSessionDO }
