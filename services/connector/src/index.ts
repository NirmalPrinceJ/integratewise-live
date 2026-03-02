/**
 * Consolidated Connector Worker (v3.6 Architecture)
 * Merges: loader + mcp-connector + store
 *
 * Handles all data ingestion responsibilities:
 * - Webhook reception and connector polling (loader)
 * - MCP tool server and session capture (mcp-connector)
 * - File storage and management (store)
 *
 * Cron trigger: */5 * * * * (connector polling via loader)
 */
import loaderWorker from '../../loader/src/index';
import mcpApp from '../../mcp-connector/src/index';
import storeApp from '../../store/src/index';

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check for consolidated worker
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'connector',
        components: ['loader', 'mcp-connector', 'store'],
        ts: Date.now()
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // MCP routes: /mcp/*, /tools/*, /sessions/*
    if (url.pathname.startsWith('/mcp') ||
        url.pathname.startsWith('/tools') ||
        url.pathname.startsWith('/sessions')) {
      return mcpApp.fetch(request, env, ctx);
    }

    // Store routes: /files/*, /upload/*
    if (url.pathname.startsWith('/files') || url.pathname.startsWith('/upload')) {
      return storeApp.fetch(request, env, ctx);
    }

    // Default: loader handles webhooks, connectors, OAuth, manual uploads
    return loaderWorker.fetch(request, env);
  },

  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext): Promise<void> {
    // Loader: cron-based connector polling (every 5 minutes)
    return loaderWorker.scheduled(event, env, ctx);
  }
};
