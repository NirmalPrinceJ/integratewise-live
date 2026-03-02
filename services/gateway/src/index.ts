export interface Env {
  LOADER: Fetcher;
  NORMALIZER: Fetcher;
  THINK: Fetcher;
  KNOWLEDGE: Fetcher;
  WORKFLOW: Fetcher;
  ADMIN: Fetcher;
  BILLING: Fetcher;
  TENANTS: Fetcher;
  ACT: Fetcher;
  GOVERN: Fetcher;
  RATE_LIMITS: KVNamespace;
  SESSIONS: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const ROUTES: [string, keyof Env][] = [
  ['/api/v1/connector', 'LOADER'],
  ['/api/v1/pipeline', 'NORMALIZER'],
  ['/api/v1/intelligence', 'THINK'],
  ['/api/v1/cognitive/signals', 'THINK'],
  ['/api/v1/cognitive/think', 'THINK'],
  ['/api/v1/cognitive/act', 'ACT'],
  ['/api/v1/cognitive/govern', 'GOVERN'],
  ['/api/v1/cognitive/hitl', 'WORKFLOW'],
  ['/api/v1/brainstorm', 'THINK'],
  ['/api/v1/knowledge', 'KNOWLEDGE'],
  ['/api/v1/workspace', 'WORKFLOW'],
  ['/api/v1/cognitive/twin', 'KNOWLEDGE'],
  ['/api/v1/cognitive/audit', 'WORKFLOW'],
  ['/api/v1/cognitive/agents', 'THINK'],
  ['/stream', 'WORKFLOW'],
  ['/admin', 'ADMIN'],
  ['/webhooks/billing', 'BILLING'],
  ['/webhooks', 'LOADER'],
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-tenant-id, x-idempotency-key, x-view-context, x-approval-token',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'gateway', ts: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Webhook routes bypass auth (they use signature verification)
    if (url.pathname.startsWith('/webhooks')) {
      for (const [prefix, binding] of ROUTES) {
        if (url.pathname.startsWith(prefix)) {
          const service = env[binding] as Fetcher;
          return service.fetch(request);
        }
      }
    }

    // Auth check — verify JWT from Supabase
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT with Supabase
    const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      }
    });

    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await userResponse.json() as { id: string; user_metadata?: { tenant_id?: string; role?: string } };
    const tenantId = request.headers.get('x-tenant-id') || user.user_metadata?.tenant_id;

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'No tenant context' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Rate limit check
    const rateLimitKey = `${tenantId}:${user.id}:${Math.floor(Date.now() / 60000)}`;
    const count = parseInt(await env.RATE_LIMITS.get(rateLimitKey) || '0');
    if (count > 100) {
      return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429 });
    }
    await env.RATE_LIMITS.put(rateLimitKey, String(count + 1), { expirationTtl: 120 });

    // Enrich request with auth context and forward
    const enrichedHeaders = new Headers(request.headers);
    enrichedHeaders.set('x-tenant-id', tenantId);
    enrichedHeaders.set('x-user-id', user.id);
    enrichedHeaders.set('x-user-role', user.user_metadata?.role || 'member');

    const enrichedRequest = new Request(request.url, {
      method: request.method,
      headers: enrichedHeaders,
      body: request.body,
    });

    // Route to downstream service
    for (const [prefix, binding] of ROUTES) {
      if (url.pathname.startsWith(prefix)) {
        const service = env[binding] as Fetcher;
        const response = await service.fetch(enrichedRequest);

        // Add CORS headers to response
        const corsResponse = new Response(response.body, response);
        corsResponse.headers.set('Access-Control-Allow-Origin', '*');
        return corsResponse;
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
