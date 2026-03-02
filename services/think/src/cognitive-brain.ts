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
import { decisionMemoryRoutes } from './cognitive-routes/decision-memory';
import { trustScoreRoutes } from './cognitive-routes/trust-score';
import { simulationRoutes } from './cognitive-routes/simulation';
import { driftDetectionRoutes } from './cognitive-routes/drift-detection';

type Bindings = {
    // Primary data source (truth database)
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;

    // Edge cache (D1) — used for cached projections, idempotency, and sync cursors
    DB: D1Database;

    // Service bindings (v3.6 Section 19.3-19.4)
    THINK: Fetcher;
    ACT: Fetcher;
    GOVERN: Fetcher;
    KNOWLEDGE: Fetcher;
    CONNECTOR: Fetcher;

    ENVIRONMENT: string;
    SERVICE_SECRET?: string;
    OPENROUTER_API_KEY?: string;
};

type CognitiveBrainBindings = Bindings & {
    // DLQ is consumed via [[queues.consumers]] in wrangler.toml
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
    database: 'Supabase (truth) + D1 (edge cache)',
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
// Brainstorm (⌘J) — Scoped AI Chat with SSE Streaming
// Architecture v3.6: Flow C — always HITL, scoped to entity/goal context
// Wired to OpenRouter Claude Messages API for intelligent analysis
// ============================================================================
app.post('/v1/brainstorm', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const correlationId = c.get('correlationId' as any) || crypto.randomUUID();

    let body: any;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: 'Invalid JSON body' }, 400);
    }

    const { query, context, model } = body;
    if (!query) return c.json({ error: 'query is required' }, 400);

    // SSE response for streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                // Phase 1: Acknowledge + context retrieval
                send({
                    type: 'status',
                    phase: 'context',
                    message: 'Gathering context...',
                    correlation_id: correlationId,
                });

                // Retrieve relevant decisions and drift events for context
                let decisions: any[] = [];
                let drifts: any[] = [];

                if (context?.entityId || context?.goalId) {
                    try {
                        // Query Supabase (truth database)
                        const query = `tenant_id=eq.${tenantId}&order=created_at.desc&limit=5`;
                        decisions = await supabaseQuery(
                            c.env.SUPABASE_URL,
                            c.env.SUPABASE_SERVICE_KEY,
                            'decision_memory',
                            query
                        );
                    } catch { /* non-blocking — Supabase error logged */ }
                }

                // Get active drift events from Supabase
                try {
                    const query = `tenant_id=eq.${tenantId}&response_status=eq.active&order=detected_at.desc&limit=3`;
                    drifts = await supabaseQuery(
                        c.env.SUPABASE_URL,
                        c.env.SUPABASE_SERVICE_KEY,
                        'drift_events',
                        query
                    );
                } catch { /* non-blocking — Supabase error logged */ }

                send({
                    type: 'context',
                    decisions: decisions.length,
                    drifts: drifts.length,
                    entity_id: context?.entityId,
                    goal_id: context?.goalId,
                    domain: context?.domain,
                });

                // Phase 2: Call OpenRouter Claude API if API key is available
                const apiKey = c.env.OPENROUTER_API_KEY;

                if (apiKey) {
                    send({
                        type: 'status',
                        phase: 'thinking',
                        message: 'Analyzing with Claude AI context...',
                    });

                    // Build system prompt with organizational context
                    const systemPrompt = `You are the IntegrateWise Intelligence Engine — a cognitive assistant embedded in a B2B SaaS operating system. You help users make data-driven decisions by analyzing their organizational context, signals, and patterns.

Your Role:
- Provide actionable, specific insights grounded in actual organizational data
- Reference the user's decision history and current drift patterns
- Suggest next steps that connect to active goals and metrics
- Never hallucinate data — if you don't have information, acknowledge the gap

Context Available:
- Recent decisions: ${decisions.length > 0 ? JSON.stringify(decisions.slice(0, 3)) : 'No recent decisions'}
- Active drift events: ${drifts.length > 0 ? JSON.stringify(drifts.slice(0, 2)) : 'No active drifts'}
- Domain: ${context?.domain || 'general'}
- Entity: ${context?.entityId || 'unscoped'}

Response Style:
- Start with a direct answer to the user's query
- Use clear sections and bullet points
- Reference specific data when available
- End with 2-3 actionable suggestions`;

                    try {
                        const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${apiKey}`,
                                "HTTP-Referer": "https://integratewise.ai",
                                "X-Title": "IntegrateWise",
                            },
                            body: JSON.stringify({
                                model: model ? `anthropic/${model}` : "anthropic/claude-sonnet-4-20250514",
                                max_tokens: 2048,
                                stream: true,
                                messages: [
                                    { role: "system", content: systemPrompt },
                                    { role: "user", content: query }
                                ],
                            }),
                        });

                        if (!openrouterResponse.ok) {
                            throw new Error(`OpenRouter API error: ${openrouterResponse.status}`);
                        }

                        // Stream OpenRouter response (OpenAI SSE format)
                        const reader = openrouterResponse.body?.getReader();
                        if (!reader) throw new Error('No response stream');

                        const decoder = new TextDecoder();
                        let buffer = '';

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || '';

                            for (const line of lines) {
                                if (!line.startsWith('data:')) continue;

                                try {
                                    const dataStr = line.slice(5).trim();

                                    // Handle stream end marker
                                    if (dataStr === '[DONE]') {
                                        send({
                                            type: 'brainstorm_complete',
                                            context_used: {
                                                decisions_referenced: decisions.length,
                                                drifts_analyzed: drifts.length,
                                                entity_id: context?.entityId,
                                                domain: context?.domain || 'general',
                                            },
                                            correlation_id: correlationId,
                                        });
                                        continue;
                                    }

                                    const event = JSON.parse(dataStr);

                                    // Stream content delta (OpenAI format)
                                    if (event.choices?.[0]?.delta?.content) {
                                        send({
                                            type: 'brainstorm_chunk',
                                            content: event.choices[0].delta.content,
                                        });
                                    }
                                } catch {
                                    // Ignore JSON parse errors for non-JSON lines
                                }
                            }
                        }

                    } catch (err: any) {
                        // Fallback to structured skeleton if API call fails
                        send({
                            type: 'status',
                            phase: 'fallback',
                            message: `Claude API unavailable (${err.message}). Using structured analysis...`,
                        });

                        send({
                            type: 'brainstorm',
                            content: `Brainstorm analysis for: "${query}"\n\nAPI Context:\n- Decisions referenced: ${decisions.length}\n- Active drifts: ${drifts.length}\n- Domain: ${context?.domain || 'general'}`,
                            context_used: {
                                decisions_referenced: decisions.length,
                                drifts_analyzed: drifts.length,
                                entity_id: context?.entityId,
                                domain: context?.domain || 'general',
                            },
                            suggestions: [
                                'Connect this to your active goals for deeper analysis',
                                'Review related signals in the Intelligence dashboard',
                                'Check trust scores for data sources mentioned',
                            ],
                            correlation_id: correlationId,
                        });
                    }
                } else {
                    // No API key — return structured skeleton
                    send({
                        type: 'status',
                        phase: 'thinking',
                        message: 'Analyzing with cognitive context (no LLM)...',
                    });

                    send({
                        type: 'brainstorm',
                        content: `Brainstorm analysis for: "${query}"\n\nContext Summary:\n- Recent decisions: ${decisions.length}\n- Active drift events: ${drifts.length}\n- Domain: ${context?.domain || 'general'}`,
                        context_used: {
                            decisions_referenced: decisions.length,
                            drifts_analyzed: drifts.length,
                            entity_id: context?.entityId,
                            domain: context?.domain || 'general',
                        },
                        suggestions: [
                            'Connect this to your active goals for deeper analysis',
                            'Review related signals in the Intelligence dashboard',
                            'Check trust scores for data sources mentioned',
                        ],
                        correlation_id: correlationId,
                    });
                }

                send({ type: 'done' });
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            } catch (err: any) {
                send({ type: 'error', message: err.message });
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'x-correlation-id': correlationId,
        },
    });
});

// ============================================================================
// Digital Twin — Proactive Suggestions + Memory Browser
// ============================================================================
app.get('/v1/twin/proactive', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        // Get recent decisions + active drifts from Supabase (truth database)
        const [recentDecisions, activeDrifts] = await Promise.all([
            supabaseQuery(
                c.env.SUPABASE_URL,
                c.env.SUPABASE_SERVICE_KEY,
                'decision_memory',
                `tenant_id=eq.${tenantId}&order=created_at.desc&limit=10`
            ),
            supabaseQuery(
                c.env.SUPABASE_URL,
                c.env.SUPABASE_SERVICE_KEY,
                'drift_events',
                `tenant_id=eq.${tenantId}&response_status=eq.pending&order=detected_at.desc&limit=5`
            ),
        ]);

        return c.json({
            tenant_id: tenantId,
            suggestions: [
                ...(activeDrifts || []).map((d: any) => ({
                    type: 'drift_alert',
                    priority: d.severity === 'critical' ? 'high' : 'medium',
                    message: `Drift detected: ${d.description}`,
                    drift_id: d.id,
                })),
                ...(recentDecisions || []).slice(0, 3).map((d: any) => ({
                    type: 'decision_review',
                    priority: 'low',
                    message: `Review outcome of: ${d.summary}`,
                    decision_id: d.id,
                })),
            ],
            generated_at: new Date().toISOString(),
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

app.get('/v1/twin/memories', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const entityId = c.req.query('entity_id');
    const goalId = c.req.query('goal_id');
    const limit = parseInt(c.req.query('limit') || '20');

    try {
        // Build Supabase query string (truth database)
        let queryStr = `tenant_id=eq.${tenantId}&order=created_at.desc&limit=${limit}`;

        const memories = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'decision_memory',
            queryStr
        );

        return c.json({
            tenant_id: tenantId,
            memories: memories || [],
            total: memories?.length || 0,
            filters: { entity_id: entityId, goal_id: goalId },
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// System Status
// ============================================================================
app.get('/v1/status', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        // Get counts from Supabase (truth database)
        const decisionResults = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'decision_memory',
            `tenant_id=eq.${tenantId}&select=id`
        );

        const driftResults = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'drift_events',
            `tenant_id=eq.${tenantId}&response_status=eq.pending&select=id`
        );

        const overrideResults = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'autonomy_overrides',
            `tenant_id=eq.${tenantId}&select=id`
        );

        return c.json({
            tenant_id: tenantId,
            decision_memory: {
                total_decisions: decisionResults?.length || 0
            },
            drift_detection: {
                pending_drifts: driftResults?.length || 0
            },
            autonomy: {
                active_overrides: overrideResults?.length || 0
            }
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// ============================================================================
// Queue Handler (v3.6 Section 19.7)
// Consumes: integratewise-ops-dlq (Dead Letter Queue)
// Logs comprehensive error details and stores failure metadata for monitoring
// DLQ is a terminal queue — all messages are ack'd (no retries from DLQ)
// ============================================================================
export const queue = {
  async queue(batch: MessageBatch<any>, env: CognitiveBrainBindings): Promise<void> {
    const correlationId = crypto.randomUUID();

    for (const message of batch.messages) {
      const {
        tenant_id,
        entity_type,
        raw_data,
        source_system,
        error,
        error_type,
        errors,
        timestamp,
        correlation_id: msg_correlation_id,
      } = message.body;

      const trace_id = msg_correlation_id || correlationId;

      try {
        console.log(`[Cognitive Brain DLQ] Processing failed message for tenant ${tenant_id} - Correlation: ${trace_id}`);

        // 1. Log comprehensive error details
        const errorLog = {
          timestamp: timestamp || new Date().toISOString(),
          correlation_id: trace_id,
          tenant_id,
          entity_type,
          source_system,
          error_message: error,
          error_type: error_type || 'unknown',
          error_details: errors ? JSON.stringify(errors) : null,
          raw_data_preview: raw_data ? JSON.stringify(raw_data).substring(0, 500) : null,
          severity: error_type === 'system_error' ? 'critical' : 'warning',
        };

        console.error('[Cognitive Brain DLQ] Error Details:', JSON.stringify(errorLog, null, 2));

        // 2. Categorize failure type
        let failureCategory = 'unknown';
        if (error_type === 'system_error') {
          failureCategory = 'system';
        } else if (error?.includes('validation')) {
          failureCategory = 'validation';
        } else if (error?.includes('format')) {
          failureCategory = 'format';
        } else if (error?.includes('missing')) {
          failureCategory = 'missing_field';
        } else if (error?.includes('transform')) {
          failureCategory = 'transform';
        }

        // 3. Store failure metadata in D1 edge cache for monitoring/alerting
        try {
          const dlq_id = crypto.randomUUID();
          await env.DB.prepare(`
            INSERT INTO dlq_entries (
              id,
              tenant_id,
              entity_type,
              source_system,
              error_message,
              error_type,
              failure_category,
              raw_data_snapshot,
              correlation_id,
              severity,
              stored_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            dlq_id,
            tenant_id,
            entity_type,
            source_system,
            error,
            error_type || 'unknown',
            failureCategory,
            raw_data ? JSON.stringify(raw_data).substring(0, 1000) : null,
            trace_id,
            error_type === 'system_error' ? 'critical' : 'warning',
            new Date().toISOString()
          ).run();

          console.log(`[Cognitive Brain DLQ] Stored DLQ entry: ${dlq_id}`);
        } catch (db_err: any) {
          console.error(`[Cognitive Brain DLQ] Failed to store DLQ entry in D1: ${db_err.message}`);
          // Continue processing even if storage fails
        }

        // 4. Create monitoring alert for critical failures
        if (error_type === 'system_error') {
          console.warn(`[Cognitive Brain DLQ] CRITICAL: System error in pipeline for tenant ${tenant_id}`);
          // In production, would trigger alert to ops team (e.g., PagerDuty, Slack)
        }

        // 5. Always ack DLQ messages (terminal queue — no retries)
        message.ack();
        console.log(`[Cognitive Brain DLQ] Message acked (terminal): ${trace_id}`);

      } catch (error: any) {
        // Even if processing fails, ack the message to prevent infinite loops
        console.error(`[Cognitive Brain DLQ] Unexpected error processing DLQ message: ${error.message}`);
        message.ack();
      }
    }
  }
};

export default {
  fetch: app.fetch,
  queue: queue.queue
};
