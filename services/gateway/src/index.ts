/**
 * IntegrateWise Gateway (v3.6 Architecture)
 * Consolidated Worker: gateway + admin + billing + tenants
 *
 * Routes all incoming requests to 5 downstream consolidated Workers:
 * - integratewise-connector (loader + mcp-connector + store)
 * - integratewise-pipeline (normalizer + spine-v2)
 * - integratewise-intelligence (think + act + govern + agents)
 * - integratewise-knowledge
 * - integratewise-bff (workflow)
 *
 * Internal services (no service binding needed):
 * - admin, billing, tenants — handled directly
 */
import adminApp from '../../admin/src/index';
import billingApp from '../../billing/src/index';
import tenantsApp from '../../tenants/src/index';

export interface Env {
  // Consolidated downstream Workers (v3.6: 5 external service bindings)
  CONNECTOR: Fetcher;
  PIPELINE: Fetcher;
  INTELLIGENCE: Fetcher;
  KNOWLEDGE: Fetcher;
  BFF: Fetcher;
  // Queue producer for inbound connector data
  CONNECTOR_QUEUE: Queue;
  // KV
  RATE_LIMITS: KVNamespace;
  SESSIONS: KVNamespace;
  // Secrets
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ALLOWED_ORIGINS?: string;
}

// Route table: path prefix → binding name or 'INTERNAL_ADMIN' | 'INTERNAL_BILLING' | 'INTERNAL_TENANTS'
type RouteTarget = keyof Env | 'INTERNAL_ADMIN' | 'INTERNAL_BILLING' | 'INTERNAL_TENANTS';
const ROUTES: [string, RouteTarget][] = [
  ['/api/v1/connector', 'CONNECTOR'],
  ['/api/v1/pipeline', 'PIPELINE'],
  ['/api/v1/intelligence', 'INTELLIGENCE'],
  ['/api/v1/cognitive/signals', 'INTELLIGENCE'],
  ['/api/v1/cognitive/think', 'INTELLIGENCE'],
  ['/api/v1/cognitive/act', 'INTELLIGENCE'],
  ['/api/v1/cognitive/govern', 'INTELLIGENCE'],
  ['/api/v1/cognitive/hitl', 'BFF'],
  ['/api/v1/brainstorm', 'INTELLIGENCE'],
  ['/api/v1/knowledge', 'KNOWLEDGE'],
  ['/api/v1/workspace', 'BFF'],
  ['/api/v1/cognitive/twin', 'KNOWLEDGE'],
  ['/api/v1/cognitive/audit', 'BFF'],
  ['/api/v1/cognitive/agents', 'INTELLIGENCE'],
  ['/stream', 'BFF'],
  ['/admin', 'INTERNAL_ADMIN'],
  ['/webhooks/billing', 'INTERNAL_BILLING'],
  ['/webhooks', 'CONNECTOR'],
];

/**
 * Route to either an external Worker (via service binding) or an internal handler
 */
function routeRequest(request: Request, env: Env, target: RouteTarget): Promise<Response> {
  switch (target) {
    case 'INTERNAL_ADMIN':
      return adminApp.fetch(request, env);
    case 'INTERNAL_BILLING':
      return billingApp.fetch(request, env);
    case 'INTERNAL_TENANTS':
      return tenantsApp.fetch(request, env);
    default:
      return (env[target] as Fetcher).fetch(request);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const allowedOrigins = env.ALLOWED_ORIGINS
      ? env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : [];
    const requestOrigin = request.headers.get('Origin') || '';
    const corsOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0] || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
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
      for (const [prefix, target] of ROUTES) {
        if (url.pathname.startsWith(prefix)) {
          return routeRequest(request, env, target);
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
    const headerTenantId = request.headers.get('x-tenant-id');
    const jwtTenantId = user.user_metadata?.tenant_id;

    // Validate tenant isolation: if both header and JWT have tenant_id, they must match
    if (headerTenantId && jwtTenantId && headerTenantId !== jwtTenantId) {
      return new Response(JSON.stringify({ error: 'Tenant mismatch' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tenantId = headerTenantId || jwtTenantId;

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

    // Route to downstream service (consolidated or internal)
    for (const [prefix, target] of ROUTES) {
      if (url.pathname.startsWith(prefix)) {
        const response = await routeRequest(enrichedRequest, env, target);

        // Add CORS headers to response
        const corsResponse = new Response(response.body, response);
        corsResponse.headers.set('Access-Control-Allow-Origin', corsOrigin);
        return corsResponse;
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
