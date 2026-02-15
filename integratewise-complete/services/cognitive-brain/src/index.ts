/**
 * Cognitive Brain Service - L2 Intelligence Layer
 * 
 * Routes for:
 * - Decision Memory (organizational learning)
 * - Trust Score Engine (source reliability, autonomy control)
 * - Simulation Engine (outcome prediction)
 * - Drift Detection (model-reality divergence)
 * 
 * Constitutional Compliance:
 * - Clause 1: Temporal Truth (time-indexed data)
 * - Clause 2: Source Trust Physics
 * - Clause 3: Reversible Readiness
 * - Clause 4: Decision Replay Guarantee
 * - Clause 5: Autonomy Kill Hierarchy
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

// Route modules
import { decisionMemoryRoutes } from './routes/decision-memory';
import { trustScoreRoutes } from './routes/trust-score';
import { simulationRoutes } from './routes/simulation';
import { driftDetectionRoutes } from './routes/drift-detection';

type Bindings = {
    DB: D1Database;
    ENVIRONMENT: string;
    SERVICE_SECRET?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());
app.use('*', secureHeaders());

// ============================================================================
// Correlation ID Middleware
// ============================================================================
app.use('*', async (c, next) => {
    const correlationId = c.req.header('x-correlation-id') || crypto.randomUUID();
    c.set('correlationId' as any, correlationId);
    c.res.headers.set('x-correlation-id', correlationId);
    await next();
});

// ============================================================================
// Rate Limiting
// ============================================================================
const requestCounts = new Map<string, { count: number; reset: number }>();

app.use('/v1/*', async (c, next) => {
    const tenantId = c.req.header('x-tenant-id') || 'anonymous';
    const now = Date.now();
    const windowMs = 60000;
    const maxRequests = 200;

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
// Health Check
// ============================================================================
app.get('/health', (c) => c.json({
    status: 'ok',
    service: 'Cognitive Brain (L2)',
    version: 'v1.0',
    database: 'D1',
    constitution: 'v1',
    subsystems: ['decision-memory', 'trust-score', 'simulation', 'drift-detection']
}));

// ============================================================================
// Mount Route Modules
// ============================================================================
app.route('/v1/decisions', decisionMemoryRoutes);
app.route('/v1/trust', trustScoreRoutes);
app.route('/v1/simulation', simulationRoutes);
app.route('/v1/drift', driftDetectionRoutes);

// ============================================================================
// System Status
// ============================================================================
app.get('/v1/status', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        // Get counts from each subsystem
        const [decisions, drifts, overrides] = await Promise.all([
            c.env.DB.prepare(`SELECT COUNT(*) as count FROM decision_memory WHERE tenant_id = ?`).bind(tenantId).first<{ count: number }>(),
            c.env.DB.prepare(`SELECT COUNT(*) as count FROM drift_events WHERE tenant_id = ? AND response_status = 'pending'`).bind(tenantId).first<{ count: number }>(),
            c.env.DB.prepare(`SELECT COUNT(*) as count FROM autonomy_overrides WHERE tenant_id = ? AND (expires_at IS NULL OR expires_at > datetime('now'))`).bind(tenantId).first<{ count: number }>()
        ]);

        return c.json({
            tenant_id: tenantId,
            decision_memory: {
                total_decisions: decisions?.count || 0
            },
            drift_detection: {
                pending_drifts: drifts?.count || 0
            },
            autonomy: {
                active_overrides: overrides?.count || 0
            }
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
