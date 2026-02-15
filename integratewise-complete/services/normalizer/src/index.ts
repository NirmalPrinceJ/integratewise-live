/**
 * IntegrateWise Normalizer Service (D1 Aligned)
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { normalize, normalizeBatch, validate } from './normalize';
import { getAllSchemaInfos, getSchemaInfo, schemas } from './schemas';
import { runNormalizerAccelerator, type NormalizerContext } from './normalizer-accelerator';
import { checkIdempotency, generateKeyFromData, registerIdempotencyKey } from './idempotency';
import type { Env, EntityType, NormalizeRequest, BatchNormalizeRequest, ValidateRequest } from './types';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());
app.use('*', logger());

app.get('/', (c) => c.json({ service: 'Normalizer Service', status: 'operational', database: 'D1' }));

app.get('/health', (c) => c.json({ status: 'healthy', service: 'normalizer', timestamp: new Date().toISOString() }));

/**
 * POST /normalize - Normalize a single entity
 */
app.post('/normalize', async (c) => {
  const correlationId = c.req.header('x-correlation-id') || crypto.randomUUID();

  try {
    const body = await c.req.json<NormalizeRequest>();
    const tenantId = body.tenant_id || (body.raw_data?.tenant_id as string);

    if (!tenantId) {
      return c.json({ success: false, error: 'Missing tenant_id', correlation_id: correlationId }, 400);
    }

    // 1. Idempotency Check
    const idempotencyKey = generateKeyFromData(body.entity_type, tenantId, body.raw_data);
    const idempCheck = await checkIdempotency(idempotencyKey, tenantId, body.entity_type, c.env.DB);

    if (idempCheck.isDuplicate) {
      return c.json({
        success: true,
        is_duplicate: true,
        entity_id: idempCheck.existingEntityId,
        correlation_id: correlationId
      });
    }

    // 2. Normalize with Context
    const context: Partial<NormalizerContext> = {
      tenant_id: tenantId,
      category: body.category,
      user_id: body.user_id,
      account_id: body.account_id,
      team_id: body.team_id,
      user_role: body.user_role
    };

    const result = await normalize(body.entity_type, body.raw_data, c.env.DB, c.env, context);

    if (result.success && result.normalized_data) {
      // 3. Register Idempotency
      const entityId = (result.normalized_data.id as string) || idempotencyKey;
      await registerIdempotencyKey(idempotencyKey, tenantId, body.entity_type, entityId, c.env.DB);
    }

    return c.json({ ...result, correlation_id: correlationId }, result.success ? 200 : 422);

  } catch (error: any) {
    return c.json({ success: false, error: error.message, correlation_id: correlationId }, 500);
  }
});

/**
 * POST /normalize/batch
 */
app.post('/normalize/batch', async (c) => {
  const body = await c.req.json<BatchNormalizeRequest>();
  const tenantId = body.tenant_id;

  const context: Partial<NormalizerContext> = {
    tenant_id: tenantId,
    category: body.category,
    user_id: body.user_id,
    account_id: body.account_id,
    team_id: body.team_id,
    user_role: body.user_role
  };

  const results = await normalizeBatch(body.entity_type, body.items, c.env.DB, c.env, context);
  return c.json({ success: true, total: results.length, results });
});

/**
 * GET /schemas
 */
app.get('/schemas', (c) => c.json({ schemas: getAllSchemaInfos() }));

export default app;
