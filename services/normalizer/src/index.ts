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

// ============================================================================
// Extended Env type to include Queue bindings
// ============================================================================
type NormalizerEnv = Env & {
  KNOWLEDGE_QUEUE: Queue;
  ACCELERATOR_QUEUE: Queue;
  INTELLIGENCE_QUEUE: Queue;
  DLQ: Queue;
};

const app = new Hono<{ Bindings: NormalizerEnv }>();

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

// ============================================================================
// Queue Handler (v3.6 Section 19.7)
// Consumes: integratewise-pipeline-process
// Produces to: KNOWLEDGE_QUEUE, ACCELERATOR_QUEUE, INTELLIGENCE_QUEUE, DLQ
// ============================================================================
export const queue = {
  async queue(batch: MessageBatch<any>, env: NormalizerEnv): Promise<void> {
    const correlationId = crypto.randomUUID();

    for (const message of batch.messages) {
      const { entity_type, data, tenant_id, source_system, category, user_id, account_id, team_id, user_role, correlation_id: msg_correlation_id } = message.body;
      const trace_id = msg_correlation_id || correlationId;

      try {
        if (!entity_type || !data || !tenant_id || !source_system) {
          throw new Error('Missing required fields: entity_type, data, tenant_id, source_system');
        }

        console.log(`[Normalizer Queue] Processing ${entity_type} for tenant ${tenant_id} - Correlation: ${trace_id}`);

        // Create D1 database instance from env
        const db = env.DB;

        // 1. Normalize data using existing normalization logic
        const context: Partial<NormalizerContext> = {
          tenant_id,
          category,
          user_id,
          account_id,
          team_id,
          user_role
        };

        const result = await normalize(entity_type as EntityType, data, db, env as any, context);

        if (!result.success) {
          console.error(`[Normalizer Queue] Normalization failed for ${entity_type}: ${JSON.stringify(result.errors)}`);

          // Send to DLQ on validation failure
          await env.DLQ.send({
            tenant_id,
            entity_type,
            raw_data: data,
            source_system,
            error: 'Normalization validation failed',
            errors: result.errors,
            timestamp: new Date().toISOString(),
            correlation_id: trace_id,
          });

          message.ack();
          continue;
        }

        // 2. Route normalized data based on entity type
        const normalized_entity = result.normalized_data;

        // Send to KNOWLEDGE_QUEUE if it's a knowledge/documentation entity
        if (['runbook', 'icp', 'technical_manual', 'qbr', 'contract', 'meeting_notes'].includes(entity_type)) {
          await env.KNOWLEDGE_QUEUE.send({
            tenant_id,
            entity_type,
            normalized_data,
            entity_id: normalized_entity?.id,
            source_system,
            correlation_id: trace_id,
          });
          console.log(`[Normalizer Queue] Sent to KNOWLEDGE_QUEUE: ${entity_type}/${normalized_entity?.id}`);
        }

        // Send to INTELLIGENCE_QUEUE for think engine analysis
        await env.INTELLIGENCE_QUEUE.send({
          tenant_id,
          entity_type,
          entity_id: normalized_entity?.id,
          normalized_data,
          source_system,
          correlation_id: trace_id,
        });
        console.log(`[Normalizer Queue] Sent to INTELLIGENCE_QUEUE: ${entity_type}/${normalized_entity?.id}`);

        // Send to ACCELERATOR_QUEUE for high-priority entities
        if (['deal', 'strategic_objective', 'risk_register'].includes(entity_type)) {
          await env.ACCELERATOR_QUEUE.send({
            tenant_id,
            entity_type,
            entity_id: normalized_entity?.id,
            normalized_data,
            priority: 'high',
            correlation_id: trace_id,
          });
          console.log(`[Normalizer Queue] Sent to ACCELERATOR_QUEUE: ${entity_type}/${normalized_entity?.id}`);
        }

        message.ack();
      } catch (error: any) {
        console.error(`[Normalizer Queue] Error processing message: ${error.message}`);

        // Send to DLQ on system error
        await env.DLQ.send({
          tenant_id,
          entity_type,
          raw_data: data,
          source_system,
          error: error.message,
          error_type: 'system_error',
          timestamp: new Date().toISOString(),
          correlation_id: trace_id,
        }).catch((dlq_err) => {
          console.error(`[Normalizer Queue] Failed to send to DLQ: ${dlq_err.message}`);
        });

        // Retry on system errors
        message.retry();
      }
    }
  }
};

export default {
  fetch: app.fetch,
  queue: queue.queue
};
