/**
 * Consolidated Intelligence Worker (v3.6 Architecture)
 * Merges: think + act + govern + agents
 *
 * Handles all intelligence-layer responsibilities:
 * - Signal analysis and situation detection (think)
 * - Action execution with governance enforcement (act)
 * - Policy engine and approval workflows (govern)
 * - Agent colony orchestration (agents)
 *
 * Queue consumers: intelligence.events, intelligence.act, ops.dlq
 */
import thinkWorker from '../../think/src/index';
import actApp from '../../act/src/index';
import governApp from '../../govern/src/index';
import agentsApp from '../../agents/src/index';

function truthy(value: unknown, fallback = true): boolean {
  if (value === undefined || value === null) return fallback;
  return String(value).toLowerCase() === 'true';
}

function logSignalEvent(event: string, details: Record<string, unknown>): void {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    service: 'intelligence',
    event,
    ...details,
  }));
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check for consolidated worker
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'intelligence',
        components: ['think', 'act', 'govern', 'agents'],
        ts: Date.now()
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Route to sub-service based on URL path
    // Act routes: /act/*, /proposals/*
    if (url.pathname === '/act' || url.pathname.startsWith('/act/') ||
        url.pathname === '/proposals' || url.pathname.startsWith('/proposals/')) {
      return actApp.fetch(request, env, ctx);
    }

    // Govern routes: /policies/*, /approve/*, /audit/*, /govern/*
    if (url.pathname === '/policies' || url.pathname.startsWith('/policies/') ||
        url.pathname === '/approve' || url.pathname.startsWith('/approve/') ||
        url.pathname === '/audit' || url.pathname.startsWith('/audit/') ||
        url.pathname === '/govern' || url.pathname.startsWith('/govern/')) {
      return governApp.fetch(request, env, ctx);
    }

    // Agent routes: /colony/*, /agents/*
    if (url.pathname === '/colony' || url.pathname.startsWith('/colony/') ||
        url.pathname === '/agents' || url.pathname.startsWith('/agents/')) {
      return agentsApp.fetch(request, env, ctx);
    }

    // Default: think handles signals, intelligence, brainstorm, cognitive
    return thinkWorker.fetch(request, env, ctx);
  },

  async queue(batch: MessageBatch<any>, env: any): Promise<void> {
    const queueName = batch.queue;

    if (queueName === 'signals') {
      if (!truthy(env.ENABLE_SIGNALS, true)) {
        for (const msg of batch.messages) msg.ack();
        return;
      }

      for (const msg of batch.messages) {
        try {
          const signal = msg.body;
          const correlationId = signal?.signal_id || crypto.randomUUID();
          const tenantId = signal.workspace_id || 'default';

          const cachedEntity = env.D1
            ? await env.D1.prepare('SELECT * FROM entity360_cache WHERE spine_id = ?')
                .bind(signal.spine_id)
                .first()
            : null;

          let requiresApproval = Boolean(signal?.payload?.requires_approval);
          if (!requiresApproval && signal?.payload?.ai_analysis?.recommended_action) {
            const checkReq = new Request('http://internal/v1/check', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
                'x-user-id': 'system-signal-engine',
                'x-correlation-id': correlationId,
                'x-service-auth': env.SERVICE_SECRET || 'internal-default',
              },
              body: JSON.stringify({
                action_type: signal.payload.ai_analysis.recommended_action,
                priority: signal.priority || 'medium',
                parameters: signal.payload.ai_analysis,
              }),
            });
            const checkRes = await governApp.fetch(checkReq, env, {} as ExecutionContext);
            const check = checkRes.ok ? await checkRes.json() as any : null;
            if (!check?.data?.allowed) {
              requiresApproval = true;
            }
          }

          if (requiresApproval) {
            await env.WORKFLOW.fetch(new Request('http://workflow/hitl/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                signal_id: signal.signal_id,
                spine_id: signal.spine_id,
                analysis: signal.payload.ai_analysis,
                workspace_id: signal.workspace_id,
                entity360: cachedEntity || null,
              }),
            }));
            logSignalEvent('hitl_created', {
              correlation_id: correlationId,
              signal_id: signal.signal_id,
              spine_id: signal.spine_id,
              workspace_id: signal.workspace_id,
            });
            msg.ack();
            continue;
          }

          if (signal?.payload?.auto_execute || signal?.payload?.ai_analysis?.recommended_action) {
            await env.ACT.fetch(new Request('http://act/execute', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
                'x-correlation-id': correlationId,
              },
              body: JSON.stringify({
                action_proposal_id: signal.payload.ai_analysis?.action_proposal_id,
                action: signal.payload.ai_analysis?.recommended_action,
                spine_id: signal.spine_id,
                params: signal.payload.ai_analysis,
                entity360: cachedEntity || null,
              }),
            }));
            logSignalEvent('act_executed', {
              correlation_id: correlationId,
              signal_id: signal.signal_id,
              spine_id: signal.spine_id,
              workspace_id: signal.workspace_id,
              recommended_action: signal.payload.ai_analysis?.recommended_action,
            });
          }

          msg.ack();
        } catch (err) {
          console.error('[Intelligence:signals] Processing failed:', err);
          msg.retry();
        }
      }
      return;
    }

    if (queueName === 'intelligence.events') {
      // Think: process intelligence events from pipeline
      return thinkWorker.queue(batch, env);
    }

    if (queueName === 'intelligence.act') {
      // Act: process approved actions
      // Act app doesn't export a queue handler — messages trigger action execution
      for (const message of batch.messages) {
        try {
          const actionRequest = new Request('http://internal/act/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message.body),
          });
          await actApp.fetch(actionRequest, env);
          message.ack();
        } catch (err) {
          console.error(`[Intelligence:Act] Action execution failed:`, err);
          message.retry();
        }
      }
      return;
    }

    if (queueName === 'ops.dlq') {
      // Govern: process dead letter queue for governance review
      for (const message of batch.messages) {
        try {
          const reviewRequest = new Request('http://internal/govern/dlq-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message.body),
          });
          await governApp.fetch(reviewRequest, env);
          message.ack();
        } catch (err) {
          console.error(`[Intelligence:Govern] DLQ processing failed:`, err);
          message.retry();
        }
      }
      return;
    }

    console.warn(`[Intelligence] Unknown queue: ${queueName}`);
  }
};
