export interface Env {
  PIPELINE_QUEUE: Queue;
  KNOWLEDGE_QUEUE: Queue;
  ACCELERATOR_QUEUE: Queue;
  INTELLIGENCE_QUEUE: Queue;
  DLQ_QUEUE: Queue;
  SPINE: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
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

  // Emit intelligence event
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
