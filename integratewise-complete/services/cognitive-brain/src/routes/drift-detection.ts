/**
 * Drift Detection Routes
 * Model-reality divergence monitoring
 * 
 * Constitutional Compliance:
 * - Clause 1: Temporal Truth (time-indexed beliefs)
 * - Clause 3: Reversible Readiness (adjustments can undo)
 */

import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
    DB: D1Database;
    ENVIRONMENT: string;
};

export const driftDetectionRoutes = new Hono<{ Bindings: Bindings }>();

// ============================================================================
// Schemas
// ============================================================================
const BeliefSchema = z.object({
    entity_type: z.string(),
    entity_id: z.string().uuid(),
    attribute_name: z.string(),
    believed_value: z.any(),
    believed_type: z.enum(['point', 'range', 'categorical', 'probability']).default('point'),
    confidence: z.number().min(0).max(1),
    evidence_quality: z.enum(['strong', 'moderate', 'weak', 'inferred']).default('moderate'),
    source_type: z.string(),
    source_id: z.string().optional()
});

const ObservationSchema = z.object({
    entity_type: z.string(),
    entity_id: z.string().uuid(),
    attribute_name: z.string(),
    observed_value: z.any(),
    observation_source: z.string(),
    observation_confidence: z.number().min(0).max(1).default(1.0)
});

// ============================================================================
// GET /v1/drift/events - List drift events
// ============================================================================
driftDetectionRoutes.get('/events', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const limit = parseInt(c.req.query('limit') || '20');
    const severity = c.req.query('severity');
    const status = c.req.query('status');

    try {
        let sql = `SELECT * FROM drift_events WHERE tenant_id = ?`;
        const params: any[] = [tenantId];

        if (severity) {
            sql += ` AND severity = ?`;
            params.push(severity);
        }
        if (status) {
            sql += ` AND response_status = ?`;
            params.push(status);
        }

        sql += ` ORDER BY detected_at DESC LIMIT ?`;
        params.push(limit);

        const { results } = await c.env.DB.prepare(sql).bind(...params).all();

        return c.json({ drift_events: results });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// GET /v1/drift/events/:id - Get specific drift event
// ============================================================================
driftDetectionRoutes.get('/events/:id', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const id = c.req.param('id');

    try {
        const event = await c.env.DB.prepare(`
            SELECT * FROM drift_events WHERE id = ? AND tenant_id = ?
        `).bind(id, tenantId).first();

        if (!event) {
            return c.json({ error: 'Drift event not found' }, 404);
        }

        return c.json(event);
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// PATCH /v1/drift/events/:id/resolve - Resolve a drift event
// ============================================================================
driftDetectionRoutes.patch('/events/:id/resolve', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const userId = c.req.header('x-user-id');
    const id = c.req.param('id');

    try {
        const body = await c.req.json();
        const notes = body.resolution_notes || '';

        const result = await c.env.DB.prepare(`
            UPDATE drift_events 
            SET response_status = 'resolved', 
                resolved_at = datetime('now'),
                resolved_by = ?,
                resolution_notes = ?
            WHERE id = ? AND tenant_id = ?
        `).bind(userId || null, notes, id, tenantId).run();

        if (result.meta?.changes === 0) {
            return c.json({ error: 'Drift event not found' }, 404);
        }

        return c.json({ id, resolved: true });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// POST /v1/drift/beliefs - Record a belief
// ============================================================================
driftDetectionRoutes.post('/beliefs', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        const body = await c.req.json();
        const data = BeliefSchema.parse(body);
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        // Invalidate any existing belief for this attribute
        await c.env.DB.prepare(`
            UPDATE model_beliefs 
            SET valid_until = datetime('now')
            WHERE tenant_id = ? 
              AND entity_type = ? 
              AND entity_id = ? 
              AND attribute_name = ?
              AND valid_until IS NULL
        `).bind(tenantId, data.entity_type, data.entity_id, data.attribute_name).run();

        // Insert new belief (Clause 1: time-indexed)
        await c.env.DB.prepare(`
            INSERT INTO model_beliefs (
                id, tenant_id, entity_type, entity_id, attribute_name,
                believed_value, believed_type, confidence, evidence_quality,
                source_type, source_id, valid_from
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            tenantId,
            data.entity_type,
            data.entity_id,
            data.attribute_name,
            JSON.stringify(data.believed_value),
            data.believed_type,
            data.confidence,
            data.evidence_quality,
            data.source_type,
            data.source_id || null,
            now
        ).run();

        return c.json({ id, success: true }, 201);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return c.json({ error: 'Validation error', details: err.errors }, 400);
        }
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// GET /v1/drift/beliefs/:entity_type/:entity_id - Get active beliefs
// ============================================================================
driftDetectionRoutes.get('/beliefs/:entity_type/:entity_id', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const entityType = c.req.param('entity_type');
    const entityId = c.req.param('entity_id');

    try {
        const { results } = await c.env.DB.prepare(`
            SELECT * FROM model_beliefs 
            WHERE tenant_id = ? 
              AND entity_type = ? 
              AND entity_id = ?
              AND valid_until IS NULL
            ORDER BY attribute_name
        `).bind(tenantId, entityType, entityId).all();

        return c.json({ beliefs: results });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// POST /v1/drift/observations - Record a reality observation
// ============================================================================
driftDetectionRoutes.post('/observations', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        const body = await c.req.json();
        const data = ObservationSchema.parse(body);
        const id = crypto.randomUUID();

        await c.env.DB.prepare(`
            INSERT INTO reality_observations (
                id, tenant_id, entity_type, entity_id, attribute_name,
                observed_value, observation_source, observation_confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            tenantId,
            data.entity_type,
            data.entity_id,
            data.attribute_name,
            JSON.stringify(data.observed_value),
            data.observation_source,
            data.observation_confidence
        ).run();

        return c.json({ id, success: true }, 201);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return c.json({ error: 'Validation error', details: err.errors }, 400);
        }
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// POST /v1/drift/detect/:entity_type/:entity_id - Trigger drift detection
// ============================================================================
driftDetectionRoutes.post('/detect/:entity_type/:entity_id', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const entityType = c.req.param('entity_type');
    const entityId = c.req.param('entity_id');

    try {
        // Get current beliefs
        const { results: beliefs } = await c.env.DB.prepare(`
            SELECT * FROM model_beliefs 
            WHERE tenant_id = ? 
              AND entity_type = ? 
              AND entity_id = ?
              AND valid_until IS NULL
        `).bind(tenantId, entityType, entityId).all();

        // Get unprocessed observations
        const { results: observations } = await c.env.DB.prepare(`
            SELECT * FROM reality_observations 
            WHERE tenant_id = ? 
              AND entity_type = ? 
              AND entity_id = ?
              AND processed = 0
        `).bind(tenantId, entityType, entityId).all();

        const driftEvents: any[] = [];

        for (const obs of observations || []) {
            const belief = (beliefs || []).find((b: any) => b.attribute_name === (obs as any).attribute_name);

            if (belief) {
                const believedValue = JSON.parse((belief as any).believed_value);
                const observedValue = JSON.parse((obs as any).observed_value);

                // Calculate drift magnitude
                let driftMagnitude = 0;
                if (typeof believedValue === 'number' && typeof observedValue === 'number') {
                    driftMagnitude = Math.abs(believedValue - observedValue) / Math.max(Math.abs(believedValue), 1);
                } else if (JSON.stringify(believedValue) !== JSON.stringify(observedValue)) {
                    driftMagnitude = 1.0; // Categorical change
                }

                if (driftMagnitude > 0.1) {
                    const driftId = crypto.randomUUID();
                    const severity = driftMagnitude > 0.8 ? 'critical' :
                                   driftMagnitude > 0.5 ? 'high' :
                                   driftMagnitude > 0.2 ? 'medium' : 'low';
                    const responseAction = driftMagnitude > 0.5 ? 'pause_automations' : 'update_belief';

                    await c.env.DB.prepare(`
                        INSERT INTO drift_events (
                            id, tenant_id, entity_type, entity_id, attribute_name,
                            model_belief_id, believed_value, observed_value,
                            drift_magnitude, drift_type, severity, response_action
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        driftId,
                        tenantId,
                        entityType,
                        entityId,
                        (obs as any).attribute_name,
                        (belief as any).id,
                        (belief as any).believed_value,
                        (obs as any).observed_value,
                        driftMagnitude,
                        driftMagnitude > 0.5 ? 'sudden_shift' : 'gradual_drift',
                        severity,
                        responseAction
                    ).run();

                    driftEvents.push({
                        id: driftId,
                        attribute: (obs as any).attribute_name,
                        drift_magnitude: driftMagnitude,
                        severity
                    });
                }
            }

            // Mark observation as processed
            await c.env.DB.prepare(`
                UPDATE reality_observations SET processed = 1 WHERE id = ?
            `).bind((obs as any).id).run();
        }

        return c.json({
            entity_type: entityType,
            entity_id: entityId,
            observations_processed: observations?.length || 0,
            drifts_detected: driftEvents.length,
            drift_events: driftEvents
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// GET /v1/drift/adjustments - List readiness adjustments
// ============================================================================
driftDetectionRoutes.get('/adjustments', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const limit = parseInt(c.req.query('limit') || '20');
    const reversible = c.req.query('reversible');

    try {
        let sql = `SELECT * FROM readiness_adjustments WHERE tenant_id = ?`;
        const params: any[] = [tenantId];

        if (reversible === 'true') {
            sql += ` AND is_reversible = 1 AND status = 'active'`;
        }

        sql += ` ORDER BY created_at DESC LIMIT ?`;
        params.push(limit);

        const { results } = await c.env.DB.prepare(sql).bind(...params).all();

        return c.json({ adjustments: results });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// POST /v1/drift/adjustments/:id/revert - Revert an adjustment (Clause 3)
// ============================================================================
driftDetectionRoutes.post('/adjustments/:id/revert', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const reason = (body as any).reason || 'Manual reversal';

    try {
        // Get original adjustment
        const original = await c.env.DB.prepare(`
            SELECT * FROM readiness_adjustments 
            WHERE id = ? AND tenant_id = ? AND is_reversible = 1 AND status = 'active'
        `).bind(id, tenantId).first();

        if (!original) {
            return c.json({ error: 'Adjustment not found or not reversible' }, 404);
        }

        // Create reversal
        const reversalId = crypto.randomUUID();
        await c.env.DB.prepare(`
            INSERT INTO readiness_adjustments (
                id, tenant_id, entity_type, entity_id, adjustment_type,
                previous_value, new_value, trigger_type, trigger_id, is_reversible
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'manual', ?, 1)
        `).bind(
            reversalId,
            tenantId,
            (original as any).entity_type,
            (original as any).entity_id,
            (original as any).adjustment_type,
            (original as any).new_value,
            (original as any).previous_value,
            id
        ).run();

        // Mark original as reversed
        await c.env.DB.prepare(`
            UPDATE readiness_adjustments 
            SET status = 'reversed', 
                reversed_at = datetime('now'),
                reversed_by_adjustment_id = ?,
                reversal_reason = ?
            WHERE id = ?
        `).bind(reversalId, reason, id).run();

        return c.json({
            original_adjustment_id: id,
            reversal_adjustment_id: reversalId,
            message: 'Adjustment reverted per Clause 3 (Reversible Readiness)'
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// GET /v1/drift/dashboard - Drift detection dashboard
// ============================================================================
driftDetectionRoutes.get('/dashboard', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        const [pending, bySeverity, recent] = await Promise.all([
            c.env.DB.prepare(`
                SELECT COUNT(*) as count FROM drift_events 
                WHERE tenant_id = ? AND response_status = 'pending'
            `).bind(tenantId).first<{ count: number }>(),
            c.env.DB.prepare(`
                SELECT severity, COUNT(*) as count 
                FROM drift_events 
                WHERE tenant_id = ? AND detected_at > datetime('now', '-30 days')
                GROUP BY severity
            `).bind(tenantId).all(),
            c.env.DB.prepare(`
                SELECT COUNT(*) as count 
                FROM drift_events 
                WHERE tenant_id = ? AND detected_at > datetime('now', '-24 hours')
            `).bind(tenantId).first<{ count: number }>()
        ]);

        return c.json({
            pending_drifts: pending?.count || 0,
            drifts_last_24h: recent?.count || 0,
            by_severity: bySeverity.results
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});
