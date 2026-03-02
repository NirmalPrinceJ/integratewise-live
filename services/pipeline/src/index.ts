/**
 * Consolidated Pipeline Worker (v3.6 Architecture)
 * Merges: normalizer + spine-v2
 *
 * SECURITY: This is the ONLY service with Spine write credentials.
 * No other worker may write to the Spine SSOT.
 *
 * Handles:
 * - 8-stage pipeline processing (normalizer)
 * - Spine SSOT reads/writes (spine-v2)
 *
 * Queue consumers: pipeline.process, accelerator.trigger
 */
import normalizerWorker from '../../normalizer/src/index';
import spineWorker from '../../spine-v2/src/index';

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check for consolidated worker
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'pipeline',
        components: ['normalizer', 'spine-v2'],
        ts: Date.now()
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Spine routes: entity reads, dashboard, signals
    if (url.pathname.startsWith('/api/write') ||
        url.pathname.startsWith('/api/entity') ||
        url.pathname.startsWith('/api/signals') ||
        url.pathname.startsWith('/api/dashboard') ||
        url.pathname.startsWith('/spine')) {
      return spineWorker.fetch(request, env);
    }

    // Default: normalizer handles pipeline status/monitoring
    return normalizerWorker.fetch(request, env);
  },

  async queue(batch: MessageBatch<any>, env: any): Promise<void> {
    // All queue processing goes through the normalizer
    // (pipeline.process and accelerator.trigger)
    return normalizerWorker.queue(batch, env);
  }
};
