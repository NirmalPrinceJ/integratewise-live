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
    if (url.pathname.startsWith('/act') || url.pathname.startsWith('/proposals')) {
      return actApp.fetch(request, env, ctx);
    }

    // Govern routes: /policies/*, /approve/*, /audit/*, /govern/*
    if (url.pathname.startsWith('/policies') ||
        url.pathname.startsWith('/approve') ||
        url.pathname.startsWith('/audit') ||
        url.pathname.startsWith('/govern')) {
      return governApp.fetch(request, env, ctx);
    }

    // Agent routes: /colony/*, /agents/*
    if (url.pathname.startsWith('/colony') || url.pathname.startsWith('/agents')) {
      return agentsApp.fetch(request, env, ctx);
    }

    // Default: think handles signals, intelligence, brainstorm, cognitive
    return thinkWorker.fetch(request, env, ctx);
  },

  async queue(batch: MessageBatch<any>, env: any): Promise<void> {
    const queueName = batch.queue;

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
