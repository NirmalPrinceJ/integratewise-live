import { Hono } from 'hono'
import { runAiSessionSync } from './jobs/ai-session-sync'
import { processIncoming, processBatch, type PipelineResult } from './pipeline'
import { telemetryMiddleware } from './handlers/telemetry'
import { telemetryMetricsHandler, telemetryHealthHandler } from './handlers/telemetry'
import { httpConnectivityHandler, dnsResolutionHandler, serviceConnectivityHandler, networkDiagnosticsHandler, nettoolsInfoHandler } from './handlers/nettools'

type Bindings = {
    FIREBASE_PROJECT_ID: string;
    DB: D1Database; // Day 2: D1 Database
    ENVIRONMENT: string;
    NORMALIZER_URL: string;
    STORE_URL: string;
    FILES: R2Bucket;
    THINK_QUEUE: Queue;
    COGNITIVE_EVENTS_URL: string;
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
            requestId: c.get('requestId') || crypto.randomUUID(),
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
            requestId: c.get('requestId') || crypto.randomUUID(),
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

    const successCount = results.filter(r => r.success).length;
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

export default app
