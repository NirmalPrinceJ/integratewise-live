export interface Env {
  PIPELINE_QUEUE: Queue;
  KNOWLEDGE_QUEUE: Queue;
  ACCELERATOR_QUEUE: Queue;
  INTELLIGENCE_QUEUE: Queue;
  SIGNAL_QUEUE?: Queue;
  DLQ_QUEUE: Queue;
  SPINE: Fetcher;
  D1?: D1Database;
  SIGNAL_CACHE?: KVNamespace;
  METRICS?: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  PYTHON_INTELLIGENCE_URL?: string;
  ENABLE_SIGNALS?: string;
  ENABLE_PYTHON_ANALYSIS?: string;
}

type Stage = 'analyze' | 'classify' | 'filter' | 'refine' | 'extract' | 'validate' | 'sanity' | 'sectorize';

const STAGES: Stage[] = ['analyze', 'classify', 'filter', 'refine', 'extract', 'validate', 'sanity', 'sectorize'];

interface PipelineMessage {
  stage: Stage;
  tenant_id: string;
  source: string;
  source_type: string;
  payload: Record<string, any>;
  metadata: { trace_id: string; attempt: number; received_at: string; };
}

export default {
  // HTTP handler for status/monitoring
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'normalizer' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/v1/pipeline/status') {
      return new Response(JSON.stringify({ status: 'operational', stages: STAGES }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Pipeline service', { status: 200 });
  },

  // Queue consumer — this is where pipeline processing happens
  async queue(batch: MessageBatch<PipelineMessage>, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      const payload = msg.body;
      const startTime = Date.now();

      try {
        const result = await processStage(payload, env);
        
        if (result === null) {
          // Filtered out (Stage 3)
          msg.ack();
          continue;
        }

        // Advance to next stage
        const currentIdx = STAGES.indexOf(payload.stage);
        const nextIdx = currentIdx + 1;

        if (nextIdx < STAGES.length) {
          await env.PIPELINE_QUEUE.send({
            ...result,
            stage: STAGES[nextIdx],
            metadata: { ...result.metadata, attempt: 0 },
          });
        } else {
          // Final stage complete — write to Spine
          await sectorize(result, env);
        }

        // Log success
        await logPipelineStep(env, payload, 'completed', Date.now() - startTime);
        msg.ack();

      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Pipeline ${payload.stage} failed:`, errMsg);

        // Log failure
        await logPipelineStep(env, payload, 'failed', Date.now() - startTime, errMsg);

        if (payload.metadata.attempt < 3) {
          msg.retry({ delaySeconds: 30 * (payload.metadata.attempt + 1) });
        } else {
          // Max retries — send to DLQ
          await env.DLQ_QUEUE.send({
            ...payload,
            error: errMsg,
            failed_at: new Date().toISOString(),
          });
          msg.ack();
        }
      }
    }
  }
};

async function processStage(msg: PipelineMessage, env: Env): Promise<PipelineMessage | null> {
  switch (msg.stage) {
    case 'analyze': {
      // Stage 1: Detect source, identify object type, extract metadata
      const entityType = detectEntityType(msg.payload);
      return { ...msg, payload: { ...msg.payload, _entity_type: entityType, _analyzed_at: Date.now() } };
    }
    case 'classify': {
      // Stage 2: Assign category, priority
      const priority = msg.payload._entity_type === 'deal' ? 'high' : 'normal';
      return { ...msg, payload: { ...msg.payload, _priority: priority, _classified_at: Date.now() } };
    }
    case 'filter': {
      // Stage 3: Scope enforcement, freshness check
      // Drop if data is older than 90 days and not a core entity
      const dataAge = msg.payload.updated_at ? Date.now() - new Date(msg.payload.updated_at).getTime() : 0;
      if (dataAge > 90 * 24 * 60 * 60 * 1000 && !['account', 'contact'].includes(msg.payload._entity_type)) {
        return null; // Filtered
      }
      return msg;
    }
    case 'refine': {
      // Stage 4: Normalize field names, currency conversion, field mapping
      const normalized = normalizeFields(msg.payload, msg.source);
      return { ...msg, payload: normalized };
    }
    case 'extract': {
      // Stage 5: Relationship extraction, change deltas
      // TODO: Generate embeddings and send to knowledge queue
      return msg;
    }
    case 'validate': {
      // Stage 6: Dedup check, business rule enforcement
      return msg;
    }
    case 'sanity': {
      // Stage 7: Anomaly detection
      // TODO: Call OpenRouter for AI-powered anomaly check on high-value entities
      return msg;
    }
    case 'sectorize': {
      // Stage 8: Handled by sectorize() function after this returns
      return msg;
    }
    default:
      throw new Error(`Unknown stage: ${msg.stage}`);
  }
}

async function sectorize(msg: PipelineMessage, env: Env): Promise<void> {
  const startedAt = Date.now();
  const traceId = msg.metadata.trace_id || crypto.randomUUID();

  // Build entity objects for Spine write
  const entities = [{
    entity_type: msg.payload._entity_type || msg.payload.type || 'unknown',
    name: msg.payload.name || msg.payload.title || msg.payload.email || 'Unnamed',
    source: msg.source,
    source_id: msg.payload.id || msg.payload.source_id || crypto.randomUUID(),
    data: msg.payload,
  }];

  // Write to Spine via service binding
  const writeResponse = await env.SPINE.fetch(new Request('https://spine/api/write', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-tenant-id': msg.tenant_id,
    },
    body: JSON.stringify({
      tenant_id: msg.tenant_id,
      entities,
      trace_id: msg.metadata.trace_id,
    }),
  }));

  if (!writeResponse.ok) {
    throw new Error(`Spine write failed: ${writeResponse.status} ${await writeResponse.text()}`);
  }

  const hydrationBucket = resolveHydrationBucket(msg.payload);
  const spineId = String(msg.payload.id || msg.payload.spine_id || msg.payload.source_id || entities[0].source_id);
  const workspaceId = String(msg.payload.workspace_id || msg.tenant_id);
  const domainSchema = String(msg.payload.domain_schema || msg.payload._entity_type || 'general');

  if (isSignalsEnabled(env) && isSignalReadyBucket(hydrationBucket)) {
    await refreshEntity360Entity(env, spineId);
    const entity360 = await readEntity360Projection(env, msg.tenant_id, spineId, workspaceId, hydrationBucket, domainSchema, msg.payload);

    if (env.D1) {
      await env.D1.prepare(
        'INSERT OR REPLACE INTO entity360_cache (spine_id, workspace_id, payload, expires_at, version) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(
          spineId,
          workspaceId,
          JSON.stringify(entity360),
          Math.floor(Date.now() / 1000) + 300,
          Number(msg.payload.version || 1),
        )
        .run();
    }

    const signalId = crypto.randomUUID();
    const analysis = await callPythonIntelligence(env, {
      signal_id: signalId,
      spine_id: spineId,
      workspace_id: workspaceId,
      domain_schema: domainSchema,
      hydration_bucket: hydrationBucket,
      entity_snapshot: msg.payload,
      recent_context: entity360?.recent_context || [],
      recent_knowledge: entity360?.recent_knowledge || [],
    }, traceId);

    const signal = {
      signal_id: signalId,
      spine_id: spineId,
      workspace_id: workspaceId,
      type: analysis.requires_approval ? 'risk_alert' : 'entity_matured',
      priority: analysis.confidence > 0.9 ? 'high' : 'medium',
      confidence: analysis.confidence,
      hydration_bucket: hydrationBucket,
      domain_schema: domainSchema,
      payload: {
        spine_snapshot: msg.payload,
        ai_analysis: analysis,
        auto_execute: analysis.auto_execute,
        requires_approval: analysis.requires_approval,
      },
      timestamp: new Date().toISOString(),
    };

    if (env.SIGNAL_QUEUE) {
      await env.SIGNAL_QUEUE.send(signal);
    }

    if (env.SIGNAL_CACHE) {
      await env.SIGNAL_CACHE.put(`signal:${Date.now()}:${signalId}`, JSON.stringify(signal), { expirationTtl: 3600 });
    }

    logEvent('signal_emitted', {
      trace_id: traceId,
      signal_id: signalId,
      workspace_id: workspaceId,
      spine_id: spineId,
      confidence: analysis.confidence,
      requires_approval: analysis.requires_approval,
      auto_execute: analysis.auto_execute,
      latency_ms: Date.now() - startedAt,
    });
  }

  // Emit intelligence event for backward compatibility with current L2 consumers.
  await env.INTELLIGENCE_QUEUE.send({
    type: 'data_change',
    tenant_id: msg.tenant_id,
    entities,
    source: msg.source,
    trace_id: msg.metadata.trace_id,
    timestamp: new Date().toISOString(),
  });

  // Emit accelerator trigger
  await env.ACCELERATOR_QUEUE.send({
    type: 'spine_write',
    tenant_id: msg.tenant_id,
    entity_count: entities.length,
    trace_id: msg.metadata.trace_id,
  });

  if (env.METRICS) {
    await env.METRICS.put('last_pipeline', String(Date.now()), { expirationTtl: 86400 });
  }
}

function isSignalsEnabled(env: Env): boolean {
  return String(env.ENABLE_SIGNALS ?? 'true').toLowerCase() === 'true';
}

function isSignalReadyBucket(bucket: string): boolean {
  const normalized = bucket.toUpperCase();
  return ['B5', 'B6', 'B7'].includes(normalized);
}

function resolveHydrationBucket(payload: Record<string, any>): string {
  const raw = String(payload.hydration_bucket || payload.bucket || 'B7');
  return raw.toUpperCase();
}

async function refreshEntity360Entity(env: Env, spineId: string): Promise<void> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/refresh_entity360_entity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ entity_uuid: spineId }),
    });
  } catch (e) {
    console.warn('Entity360 refresh skipped:', e);
  }
}

async function readEntity360Projection(
  env: Env,
  tenantId: string,
  spineId: string,
  workspaceId: string,
  hydrationBucket: string,
  domainSchema: string,
  snapshot: Record<string, any>,
): Promise<Record<string, any>> {
  try {
    const query = new URLSearchParams({
      spine_id: `eq.${spineId}`,
      tenant_id: `eq.${tenantId}`,
      select: '*',
      limit: '1',
    });
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/entity360?${query.toString()}`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`entity360 query failed: ${res.status}`);
    const rows = await res.json() as Record<string, any>[];
    return rows[0] || {
      spine_id: spineId,
      workspace_id: workspaceId,
      hydration_bucket: hydrationBucket,
      domain_schema: domainSchema,
      recent_context: [],
      recent_knowledge: [],
      payload: snapshot,
    };
  } catch {
    return {
      spine_id: spineId,
      workspace_id: workspaceId,
      hydration_bucket: hydrationBucket,
      domain_schema: domainSchema,
      recent_context: [],
      recent_knowledge: [],
      payload: snapshot,
    };
  }
}

async function callPythonIntelligence(
  env: Env,
  payload: {
    signal_id: string;
    spine_id: string;
    workspace_id: string;
    domain_schema: string;
    hydration_bucket: string;
    entity_snapshot: Record<string, any>;
    recent_context: any[];
    recent_knowledge: any[];
  },
  traceId: string,
): Promise<{
  signal_id: string;
  recommended_action: string;
  confidence: number;
  reasoning: string[];
  requires_approval: boolean;
  auto_execute: boolean;
}> {
  const fallback = {
    signal_id: payload.signal_id,
    recommended_action: payload.domain_schema === 'sales' ? 'update_crm' : 'notify_user',
    confidence: payload.hydration_bucket === 'B7' ? 0.9 : 0.7,
    reasoning: ['Fallback analysis: Python Intelligence unavailable'],
    requires_approval: payload.hydration_bucket !== 'B7',
    auto_execute: false,
  };

  const pythonEnabled = String(env.ENABLE_PYTHON_ANALYSIS ?? 'true').toLowerCase() === 'true';
  if (!pythonEnabled || !env.PYTHON_INTELLIGENCE_URL) return fallback;

  try {
    const controller = new AbortController();
    const timeoutMs = 800;
    const timeout = setTimeout(() => controller.abort('python_timeout'), timeoutMs);
    let res: Response;
    try {
      res = await fetch(`${env.PYTHON_INTELLIGENCE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-correlation-id': traceId,
        },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!res.ok) return fallback;
    const analysis = await res.json() as typeof fallback;
    return {
      ...fallback,
      ...analysis,
      confidence: Number(analysis.confidence ?? fallback.confidence),
      reasoning: Array.isArray(analysis.reasoning) ? analysis.reasoning : fallback.reasoning,
      requires_approval: Boolean(analysis.requires_approval),
      auto_execute: Boolean(analysis.auto_execute),
    };
  } catch {
    return fallback;
  }
}

function logEvent(event: string, details: Record<string, unknown>): void {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    service: 'normalizer',
    event,
    ...details,
  }));
}

function detectEntityType(payload: Record<string, any>): string {
  // Simple heuristic — improve later with ML
  if (payload.email && payload.firstname) return 'contact';
  if (payload.dealname || payload.amount) return 'deal';
  if (payload.company || payload.domain) return 'account';
  if (payload.subject && payload.due_date) return 'task';
  if (payload.title && payload.start_time) return 'meeting';
  return 'entity';
}

function normalizeFields(payload: Record<string, any>, source: string): Record<string, any> {
  // Normalize common fields across tools
  const normalized = { ...payload };
  
  // HubSpot-specific normalization
  if (source === 'hubspot') {
    if (payload.properties) {
      Object.assign(normalized, payload.properties);
      delete normalized.properties;
    }
    if (payload.firstname) normalized.name = `${payload.firstname} ${payload.lastname || ''}`.trim();
    if (payload.dealname) normalized.name = payload.dealname;
    if (payload.company) normalized.name = payload.company;
  }
  
  // Salesforce-specific normalization
  if (source === 'salesforce') {
    if (payload.Name) normalized.name = payload.Name;
    if (payload.Amount) normalized.amount = payload.Amount;
  }

  return normalized;
}

async function logPipelineStep(
  env: Env, msg: PipelineMessage, status: string, durationMs: number, error?: string
): Promise<void> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from('pipeline_log').insert({
      tenant_id: msg.tenant_id,
      trace_id: msg.metadata.trace_id,
      stage: msg.stage,
      status,
      source: msg.source,
      error_message: error,
      duration_ms: durationMs,
    });
  } catch (e) {
    console.error('Failed to log pipeline step:', e);
  }
}
