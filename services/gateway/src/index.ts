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
  SIGNAL_CACHE?: KVNamespace;
  METRICS?: KVNamespace;
  // Secrets
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ALLOWED_ORIGINS?: string;
  HUBSPOT_WEBHOOK_SECRET?: string;
  ENABLE_SIGNALS?: string;
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

    // IP-based edge throttling for all ingress requests.
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const ipRateKey = `ip:${ip}:${Math.floor(Date.now() / 60000)}`;
    const currentIpCount = parseInt((await env.RATE_LIMITS.get(ipRateKey)) || '0', 10);
    if (currentIpCount >= 100) {
      logGatewayEvent('rate_limited_ip', { ip });
      return new Response('Rate limited', { status: 429 });
    }
    await env.RATE_LIMITS.put(ipRateKey, String(currentIpCount + 1), { expirationTtl: 120 });

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'gateway', ts: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/metrics/signals') {
      if (!isSignalsEnabled(env)) {
        return new Response(JSON.stringify({
          recent_signals: [],
          hitl_pending: { pending: 0 },
          pipeline_latency: null,
          enabled: false,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const recentSignals = await readRecentSignals(env.SIGNAL_CACHE);
      const hitlPending = await readHitlPending(env.BFF);
      const lastPipeline = Number((await env.METRICS?.get('last_pipeline')) || '0');
      const pipelineLatency = lastPipeline > 0 ? Date.now() - lastPipeline : null;

      return new Response(JSON.stringify({
        recent_signals: recentSignals.slice(0, 50),
        hitl_pending: hitlPending,
        pipeline_latency: pipelineLatency,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Webhook routes bypass auth (they use signature verification)
    if (url.pathname.startsWith('/webhooks')) {
      const provider = url.pathname.split('/webhooks/')[1]?.split('/')[0] || 'unknown';
      const isValid = await verifyWebhook(provider, request.clone(), env);
      if (!isValid) {
        logGatewayEvent('webhook_rejected', { provider, path: url.pathname });
        return new Response('Unauthorized', { status: 401 });
      }
      logGatewayEvent('webhook_verified', { provider, path: url.pathname });

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

async function verifyWebhook(provider: string, request: Request, env: Env): Promise<boolean> {
  if (provider === 'hubspot') {
    const signature = request.headers.get('x-hubspot-signature-v3');
    const timestampHeader = request.headers.get('x-hubspot-request-timestamp');
    if (!signature || !timestampHeader || !env.HUBSPOT_WEBHOOK_SECRET) return false;

    const requestTs = Number(timestampHeader);
    if (!Number.isFinite(requestTs)) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSec - requestTs) > 300) return false;

    const body = await request.text();
    const fullUrl = new URL(request.url).toString();
    const payload = `${request.method}${fullUrl}${body}${timestampHeader}`;
    const encodedSecret = new TextEncoder().encode(env.HUBSPOT_WEBHOOK_SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      encodedSecret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const computedBase64 = base64FromBytes(new Uint8Array(digest));
    return timingSafeEqual(computedBase64, signature);
  }
  // Unknown providers are denied by default.
  return false;
}

function isSignalsEnabled(env: Env): boolean {
  return String(env.ENABLE_SIGNALS ?? 'true').toLowerCase() === 'true';
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function base64FromBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

async function readRecentSignals(signalCache?: KVNamespace): Promise<any[]> {
  if (!signalCache) return [];
  const keyList = await signalCache.list({ prefix: 'signal:', limit: 50 });
  const values = await Promise.all(
    keyList.keys.map(async (k) => {
      try {
        const raw = await signalCache.get(k.name);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })
  );
  return values.filter(Boolean).sort((a: any, b: any) => {
    const at = new Date(a.timestamp || 0).getTime();
    const bt = new Date(b.timestamp || 0).getTime();
    return bt - at;
  });
}

async function readHitlPending(bff: Fetcher): Promise<any> {
  try {
    const res = await bff.fetch(new Request('http://bff/hitl/count'));
    if (!res.ok) return { pending: 0 };
    return await res.json();
  } catch {
    return { pending: 0 };
  }
}

function logGatewayEvent(event: string, details: Record<string, unknown>): void {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    service: 'gateway',
    event,
    ...details,
  }));
}
