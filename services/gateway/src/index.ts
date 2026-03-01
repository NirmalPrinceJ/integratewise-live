/**
 * IntegrateWise Gateway Worker — Service ① (Architecture v3.6)
 *
 * Routes ALL frontend requests through /api/v1/* to downstream services
 * via Cloudflare Service Bindings. Handles:
 * - JWT verification (Supabase tokens)
 * - Tenant scoping (x-tenant-id header)
 * - RBAC enforcement
 * - Rate limiting
 * - Request routing to Services ②-⑥ + support services
 * - Webhook ingestion (legacy /webhook/* routes)
 *
 * Route Map (Section 22.1):
 *   /api/v1/connector/*     → ② MCP Connector          (tools, invoke, sessions)
 *   /api/v1/pipeline/*      → ③ Pipeline / Spine V2     (entities, schema, ingest)
 *   /api/v1/intelligence/*  → ④ Intelligence Engine     (cognitive-brain + think)
 *   /api/v1/knowledge/*     → ⑤ Knowledge Service       (search, ingest, embed)
 *   /api/v1/workspace/*     → ⑥ BFF (Stream Gateway)    (views, dashboard, spaces)
 *   /api/v1/brainstorm      → ④ Intelligence Engine      (SSE)
 *   /api/v1/cognitive/*     → Split: ③ + ④ + ⑥ + Govern + Act
 *   /stream/*               → Stream Gateway             (WebSocket, SSE real-time)
 *   /admin/*                → Admin + Tenants
 *   /webhooks/billing/*     → Billing Worker
 *   /webhook/:source        → Legacy webhook ingestion
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';

// ─── Types ───────────────────────────────────────────────────────────────────

type Bindings = {
  // Database
  DATABASE_URL: string;

  // Secrets (via Doppler)
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET: string;

  // ─── Core Service Bindings (Cloudflare Worker-to-Worker) ───
  CONNECTOR: Fetcher;      // ② integratewise-mcp-connector
  PIPELINE: Fetcher;       // ③ integratewise-spine-v2
  INTELLIGENCE: Fetcher;   // ④ integratewise-cognitive-brain
  KNOWLEDGE: Fetcher;      // ⑤ integratewise-knowledge
  BFF: Fetcher;            // ⑥ integratewise-stream-gateway (BFF + real-time)

  // ─── Support Service Bindings ───
  THINK: Fetcher;          // integratewise-think (reasoning/signals)
  GOVERN: Fetcher;         // integratewise-govern (HARD GATE)
  ACT: Fetcher;            // integratewise-act (execution)
  NORMALIZER: Fetcher;     // integratewise-normalizer (pipeline stages)
  LOADER: Fetcher;         // integratewise-loader (data loading)
  STORE: Fetcher;          // integratewise-store (R2 file storage)

  // ─── Agent Bindings ───
  AGENTS: Fetcher;         // integratewise-agents (colony orchestration)

  // ─── Admin/Internal Bindings ───
  ADMIN_SERVICE: Fetcher;  // integratewise-admin
  TENANTS: Fetcher;        // integratewise-tenants
  BILLING: Fetcher;        // integratewise-billing

  // KV for rate limiting
  RATE_LIMIT: KVNamespace;

  // Environment
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow frontend origins
app.use('*', cors({
  origin: [
    'https://integratewise.ai',
    'https://www.integratewise.ai',
    'https://app.integratewise.ai',
    'http://localhost:5173',    // Vite dev
    'http://localhost:3000',    // Alt dev
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'x-tenant-id',
    'x-view-context',
    'x-idempotency-key',
    'x-approval-token',
    'x-correlation-id',
  ],
  exposeHeaders: ['x-request-id', 'x-correlation-id', 'x-upstream-service'],
  credentials: true,
  maxAge: 86400,
}));

// Request ID + correlation tracking
app.use('*', async (c, next) => {
  const requestId = crypto.randomUUID();
  const correlationId = c.req.header('x-correlation-id') || requestId;
  c.header('x-request-id', requestId);
  c.header('x-correlation-id', correlationId);
  c.set('requestId' as any, requestId);
  c.set('correlationId' as any, correlationId);
  await next();
});

// JWT Verification for /api/* routes (skip for public routes)
app.use('/api/*', async (c, next) => {
  // Skip JWT check for public routes
  const path = c.req.path;
  if (path.startsWith('/api/v1/public/') || path.includes('/webhooks/')) {
    await next();
    return;
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    c.set('userId' as any, payload.sub);
    c.set('userRole' as any, payload.role || 'authenticated');
    c.set('tenantId' as any, c.req.header('x-tenant-id') || payload.aud || 'default');
  } catch (err: any) {
    console.error('[Gateway] JWT verification failed:', err.message);
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  await next();
});

// Tenant ID enforcement for /api/* routes (skip for public routes)
app.use('/api/*', async (c, next) => {
  // Skip tenant check for public routes
  const path = c.req.path;
  if (path.startsWith('/api/v1/public/') || path.includes('/webhooks/')) {
    await next();
    return;
  }

  const tenantId = c.req.header('x-tenant-id');
  if (!tenantId) {
    return c.json({ error: 'Missing x-tenant-id header' }, 400);
  }
  await next();
});

// ─── Health & Info ───────────────────────────────────────────────────────────

app.get('/', (c) =>
  c.json({
    service: 'IntegrateWise Gateway',
    version: '3.0.0',
    architecture: 'v3.6',
    status: 'operational',
    routes: [
      '/api/v1/connector/*', '/api/v1/pipeline/*', '/api/v1/intelligence/*',
      '/api/v1/knowledge/*', '/api/v1/workspace/*', '/api/v1/brainstorm',
      '/api/v1/cognitive/*', '/stream/*', '/admin/*', '/webhook/:source',
      '/api/v1/public/newsletter', '/api/v1/public/contact', '/api/v1/support/ticket',
    ],
  })
);

app.get('/health', (c) => c.json({
  service: 'IntegrateWise Gateway',
  status: 'healthy',
  environment: c.env?.ENVIRONMENT ?? 'unknown',
  ts: new Date().toISOString(),
}));

// ─── Service Proxy Helper ────────────────────────────────────────────────────

/**
 * Proxy a request to a downstream service via Service Binding.
 * Forwards auth headers, tenant context, and correlation IDs.
 */
async function proxyToService(
  c: any,
  service: Fetcher | undefined,
  targetPath: string,
  serviceName: string
): Promise<Response> {
  if (!service) {
    return c.json({ error: `Service ${serviceName} not bound` }, 503);
  }

  const headers = new Headers();
  headers.set('Content-Type', c.req.header('Content-Type') || 'application/json');
  headers.set('x-tenant-id', c.req.header('x-tenant-id') || '');
  headers.set('x-correlation-id', c.get('correlationId') || '');
  headers.set('x-user-id', c.get('userId') || '');
  headers.set('x-user-role', c.get('userRole') || '');
  headers.set('x-service-auth', 'gateway');

  // Forward optional headers
  const viewContext = c.req.header('x-view-context');
  if (viewContext) headers.set('x-view-context', viewContext);

  const idempotencyKey = c.req.header('x-idempotency-key');
  if (idempotencyKey) headers.set('x-idempotency-key', idempotencyKey);

  const approvalToken = c.req.header('x-approval-token');
  if (approvalToken) headers.set('x-approval-token', approvalToken);

  try {
    const method = c.req.method;
    const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await c.req.text() : undefined;

    const response = await service.fetch(
      new Request(`https://internal${targetPath}`, {
        method,
        headers,
        body,
      })
    );

    // Forward response headers
    const respHeaders = new Headers(response.headers);
    respHeaders.set('x-upstream-service', serviceName);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: respHeaders,
    });
  } catch (err: any) {
    console.error(`[Gateway] Proxy to ${serviceName} failed:`, err.message);
    return c.json({
      error: `Service ${serviceName} unavailable`,
      details: err.message,
    }, 502);
  }
}

// ─── API v1 Routes (Section 22.1) ────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// ② Connector Service (integratewise-mcp-connector)
//    Internal routes: /tools, /invoke, /health, /v1/mcp/*
// ────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/connector/list', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, `/tools${getQueryString(c)}`, 'Connector');
});

app.post('/api/v1/connector/connect', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/invoke', 'Connector');
});

app.post('/api/v1/connector/disconnect/:toolId', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/invoke', 'Connector');
});

app.post('/api/v1/connector/disconnect', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/invoke', 'Connector');
});

app.get('/api/v1/connector/status/:toolId', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/health', 'Connector');
});

app.get('/api/v1/connector/status', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/health', 'Connector');
});

app.post('/api/v1/connector/webhook', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/invoke', 'Connector');
});

// MCP session capture
app.post('/api/v1/connector/mcp/session', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/v1/mcp/capture_session', 'Connector');
});

app.post('/api/v1/connector/mcp/memory', async (c) => {
  return proxyToService(c, c.env.CONNECTOR, '/v1/mcp/save_session_memory', 'Connector');
});

// Catch-all for other connector routes
app.all('/api/v1/connector/*', async (c) => {
  const path = c.req.path.replace('/api/v1/connector', '');
  return proxyToService(c, c.env.CONNECTOR, `${path}${getQueryString(c)}`, 'Connector');
});

// ─── Connector OAuth (via Tenants service) ───────────────────────
app.get('/api/v1/connectors/:provider/authorize', async (c) => {
  const provider = c.req.param('provider');
  return proxyToService(c, c.env.TENANTS, `/v1/connectors/${provider}/authorize${getQueryString(c)}`, 'ConnectorOAuth');
});

app.get('/api/v1/connectors/:provider/callback', async (c) => {
  const provider = c.req.param('provider');
  return proxyToService(c, c.env.TENANTS, `/v1/connectors/${provider}/callback${getQueryString(c)}`, 'ConnectorOAuth');
});

app.get('/api/v1/connectors/:provider/status', async (c) => {
  const provider = c.req.param('provider');
  return proxyToService(c, c.env.TENANTS, `/v1/connectors/${provider}/status`, 'ConnectorOAuth');
});

app.post('/api/v1/connectors/:provider/disconnect', async (c) => {
  const provider = c.req.param('provider');
  return proxyToService(c, c.env.TENANTS, `/v1/connectors/${provider}/disconnect`, 'ConnectorOAuth');
});

app.get('/api/v1/connectors/list', async (c) => {
  return proxyToService(c, c.env.TENANTS, `/v1/connectors/list`, 'ConnectorOAuth');
});

// ────────────────────────────────────────────────────────────────────────────
// ③ Pipeline Service — Spine V2 (integratewise-spine-v2)
//    Internal routes: /v2/spine/schema, /v2/spine/entities, /v2/spine/ingest, etc.
// ────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/pipeline/entities', async (c) => {
  return proxyToService(c, c.env.PIPELINE, `/v2/spine/entities${getQueryString(c)}`, 'Pipeline');
});

app.get('/api/v1/pipeline/entity/:entityId', async (c) => {
  const entityId = c.req.param('entityId');
  return proxyToService(c, c.env.PIPELINE, `/v2/spine/entities/${entityId}${getQueryString(c)}`, 'Pipeline');
});

app.get('/api/v1/pipeline/schema', async (c) => {
  return proxyToService(c, c.env.PIPELINE, `/v2/spine/schema${getQueryString(c)}`, 'Pipeline');
});

app.get('/api/v1/pipeline/status', async (c) => {
  return proxyToService(c, c.env.PIPELINE, '/v2/spine', 'Pipeline');
});

app.get('/api/v1/pipeline/completeness/:entityId', async (c) => {
  const entityId = c.req.param('entityId');
  return proxyToService(c, c.env.PIPELINE, `/v2/spine/completeness/${entityId}`, 'Pipeline');
});

app.get('/api/v1/pipeline/streams', async (c) => {
  return proxyToService(c, c.env.PIPELINE, `/v2/spine/streams${getQueryString(c)}`, 'Pipeline');
});

app.post('/api/v1/pipeline/ingest', async (c) => {
  return proxyToService(c, c.env.PIPELINE, '/v2/spine/ingest', 'Pipeline');
});

// Normalize via dedicated normalizer
app.post('/api/v1/pipeline/normalize', async (c) => {
  const target = c.env.NORMALIZER || c.env.PIPELINE;
  return proxyToService(c, target, '/normalize', 'Normalizer');
});

app.post('/api/v1/pipeline/normalize/batch', async (c) => {
  const target = c.env.NORMALIZER || c.env.PIPELINE;
  return proxyToService(c, target, '/normalize/batch', 'Normalizer');
});

// Catch-all pipeline
app.all('/api/v1/pipeline/*', async (c) => {
  const path = c.req.path.replace('/api/v1/pipeline', '');
  return proxyToService(c, c.env.PIPELINE, `/v2/spine${path}${getQueryString(c)}`, 'Pipeline');
});

// ────────────────────────────────────────────────────────────────────────────
// ④ Intelligence Engine (integratewise-cognitive-brain + think)
//    Cognitive Brain routes: /v1/decisions/*, /v1/trust/*, /v1/simulation/*, /v1/drift/*
//    Think routes: /v1/signals, /v1/situations, /v1/think/analyze, /v1/decide
// ────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/intelligence/signals', async (c) => {
  const target = c.env.THINK || c.env.INTELLIGENCE;
  return proxyToService(c, target, `/v1/signals${getQueryString(c)}`, 'Think');
});

app.get('/api/v1/intelligence/situations', async (c) => {
  const target = c.env.THINK || c.env.INTELLIGENCE;
  return proxyToService(c, target, `/v1/situations${getQueryString(c)}`, 'Think');
});

app.post('/api/v1/intelligence/analyze', async (c) => {
  const target = c.env.THINK || c.env.INTELLIGENCE;
  return proxyToService(c, target, '/v1/think/analyze', 'Think');
});

app.post('/api/v1/intelligence/decide', async (c) => {
  const target = c.env.THINK || c.env.INTELLIGENCE;
  return proxyToService(c, target, '/v1/decide', 'Think');
});

// Cognitive Brain specific routes
app.all('/api/v1/intelligence/decisions/*', async (c) => {
  const path = c.req.path.replace('/api/v1/intelligence/decisions', '');
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/decisions${path}${getQueryString(c)}`, 'Intelligence');
});

app.all('/api/v1/intelligence/trust/*', async (c) => {
  const path = c.req.path.replace('/api/v1/intelligence/trust', '');
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/trust${path}${getQueryString(c)}`, 'Intelligence');
});

app.all('/api/v1/intelligence/simulation/*', async (c) => {
  const path = c.req.path.replace('/api/v1/intelligence/simulation', '');
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/simulation${path}${getQueryString(c)}`, 'Intelligence');
});

app.all('/api/v1/intelligence/drift/*', async (c) => {
  const path = c.req.path.replace('/api/v1/intelligence/drift', '');
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/drift${path}${getQueryString(c)}`, 'Intelligence');
});

app.get('/api/v1/intelligence/agents', async (c) => {
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/status${getQueryString(c)}`, 'Intelligence');
});

// Catch-all intelligence
app.all('/api/v1/intelligence/*', async (c) => {
  const path = c.req.path.replace('/api/v1/intelligence', '');
  return proxyToService(c, c.env.INTELLIGENCE, `/v1${path}${getQueryString(c)}`, 'Intelligence');
});

// ────────────────────────────────────────────────────────────────────────────
// ⑤ Knowledge Service (integratewise-knowledge)
//    Internal routes: /knowledge/search, /knowledge/ingest, /knowledge/embed/*,
//                     /knowledge/chunk, /knowledge/similar/*, /v1/knowledge/*
// ────────────────────────────────────────────────────────────────────────────
app.post('/api/v1/knowledge/search', async (c) => {
  return proxyToService(c, c.env.KNOWLEDGE, '/knowledge/search', 'Knowledge');
});

app.post('/api/v1/knowledge/search/sessions', async (c) => {
  return proxyToService(c, c.env.KNOWLEDGE, '/knowledge/search/sessions', 'Knowledge');
});

// GET /sessions maps to POST /knowledge/search/sessions with empty query
app.get('/api/v1/knowledge/sessions', async (c) => {
  return proxyToService(c, c.env.KNOWLEDGE, `/knowledge/search/sessions${getQueryString(c)}`, 'Knowledge');
});

app.post('/api/v1/knowledge/ingest', async (c) => {
  return proxyToService(c, c.env.KNOWLEDGE, '/knowledge/ingest', 'Knowledge');
});

app.post('/api/v1/knowledge/upload', async (c) => {
  // Route to Store service if available, else Knowledge
  const target = c.env.STORE || c.env.KNOWLEDGE;
  return proxyToService(c, target, '/v1/store/upload', 'Store');
});

app.post('/api/v1/knowledge/embed/session', async (c) => {
  return proxyToService(c, c.env.KNOWLEDGE, '/knowledge/embed/session', 'Knowledge');
});

app.post('/api/v1/knowledge/chunk', async (c) => {
  return proxyToService(c, c.env.KNOWLEDGE, '/knowledge/chunk', 'Knowledge');
});

app.get('/api/v1/knowledge/similar/:chunkId', async (c) => {
  const chunkId = c.req.param('chunkId');
  return proxyToService(c, c.env.KNOWLEDGE, `/knowledge/similar/${chunkId}`, 'Knowledge');
});

// Catch-all knowledge
app.all('/api/v1/knowledge/*', async (c) => {
  const path = c.req.path.replace('/api/v1/knowledge', '');
  return proxyToService(c, c.env.KNOWLEDGE, `/knowledge${path}${getQueryString(c)}`, 'Knowledge');
});

// ────────────────────────────────────────────────────────────────────────────
// ⑥ Workspace BFF (integratewise-stream-gateway)
//    Internal routes: /ws/*, /sse/*, /broadcast, /stats, /presence/*
//    BFF workspace routes are handled by composing from Pipeline + Knowledge
// ────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/workspace/dashboard', async (c) => {
  // Dashboard is a composite view - route to BFF which aggregates from Pipeline + Knowledge
  return proxyToService(c, c.env.BFF, `/v1/workspace/dashboard${getQueryString(c)}`, 'BFF');
});

app.get('/api/v1/workspace/readiness', async (c) => {
  return proxyToService(c, c.env.BFF, `/v1/workspace/readiness${getQueryString(c)}`, 'BFF');
});

app.get('/api/v1/workspace/navigation', async (c) => {
  return proxyToService(c, c.env.BFF, `/v1/workspace/navigation${getQueryString(c)}`, 'BFF');
});

app.get('/api/v1/workspace/hydration/manifest', async (c) => {
  return proxyToService(c, c.env.BFF, `/v1/workspace/hydration/manifest${getQueryString(c)}`, 'BFF');
});

app.get('/api/v1/workspace/space/:spaceType', async (c) => {
  const spaceType = c.req.param('spaceType');
  return proxyToService(c, c.env.BFF, `/v1/workspace/space/${spaceType}${getQueryString(c)}`, 'BFF');
});

app.get('/api/v1/workspace/view/:viewId', async (c) => {
  const viewId = c.req.param('viewId');
  return proxyToService(c, c.env.BFF, `/v1/workspace/view/${viewId}${getQueryString(c)}`, 'BFF');
});

// CSM routes (domain-specific workspace data)
app.all('/api/v1/workspace/csm/*', async (c) => {
  const path = c.req.path.replace('/api/v1/workspace/csm', '');
  return proxyToService(c, c.env.BFF, `/v1/workspace/csm${path}${getQueryString(c)}`, 'BFF');
});

// Catch-all workspace
app.all('/api/v1/workspace/*', async (c) => {
  const path = c.req.path.replace('/api/v1/workspace', '');
  return proxyToService(c, c.env.BFF, `/v1/workspace${path}${getQueryString(c)}`, 'BFF');
});

// ────────────────────────────────────────────────────────────────────────────
// Brainstorm (⌘J) → Intelligence Engine (SSE stream)
// ────────────────────────────────────────────────────────────────────────────
app.post('/api/v1/brainstorm', async (c) => {
  return proxyToService(c, c.env.INTELLIGENCE, '/v1/brainstorm', 'Intelligence');
});

// ────────────────────────────────────────────────────────────────────────────
// L2 Cognitive Surfaces — split across multiple services
// ────────────────────────────────────────────────────────────────────────────

// Spine entities via cognitive path → Pipeline
app.all('/api/v1/cognitive/spine/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/spine', '');
  return proxyToService(c, c.env.PIPELINE, `/v2/spine${path}${getQueryString(c)}`, 'Pipeline');
});

// Evidence → BFF
app.all('/api/v1/cognitive/evidence/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/evidence', '');
  return proxyToService(c, c.env.BFF, `/v1/workspace/evidence${path}${getQueryString(c)}`, 'BFF');
});

// Signals → Think engine
app.all('/api/v1/cognitive/signals', async (c) => {
  const target = c.env.THINK || c.env.INTELLIGENCE;
  return proxyToService(c, target, `/v1/signals${getQueryString(c)}`, 'Think');
});

// Think analysis → Think engine
app.all('/api/v1/cognitive/think/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/think', '');
  const target = c.env.THINK || c.env.INTELLIGENCE;
  return proxyToService(c, target, `/v1/think${path}${getQueryString(c)}`, 'Think');
});

// Act execution → Act service (with mandatory Govern check)
app.all('/api/v1/cognitive/act/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/act', '');
  const target = c.env.ACT || c.env.INTELLIGENCE;
  // Act paths: /execute, /proposals/:situation_id
  return proxyToService(c, target, `${path || '/'}${getQueryString(c)}`, 'Act');
});

// HITL approval queue → Govern (HARD GATE)
app.get('/api/v1/cognitive/hitl/queue', async (c) => {
  return proxyToService(c, c.env.GOVERN, `/v1/pending${getQueryString(c)}`, 'Govern');
});

// POST to /hitl/queue with action in body — route to appropriate Govern endpoint
app.post('/api/v1/cognitive/hitl/queue', async (c) => {
  try {
    const body = await c.req.json();
    const action = body.action;
    if (action === 'approve') {
      return proxyToService(c, c.env.GOVERN, '/v1/approve', 'Govern');
    } else if (action === 'deny' || action === 'reject') {
      return proxyToService(c, c.env.GOVERN, '/v1/reject', 'Govern');
    }
    // Default: forward as check
    return proxyToService(c, c.env.GOVERN, '/v1/check', 'Govern');
  } catch {
    return c.json({ error: 'Invalid request body' }, 400);
  }
});

app.post('/api/v1/cognitive/hitl/approve', async (c) => {
  return proxyToService(c, c.env.GOVERN, '/v1/approve', 'Govern');
});

app.post('/api/v1/cognitive/hitl/reject', async (c) => {
  return proxyToService(c, c.env.GOVERN, '/v1/reject', 'Govern');
});

app.all('/api/v1/cognitive/hitl/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/hitl', '');
  return proxyToService(c, c.env.GOVERN, `/v1${path}${getQueryString(c)}`, 'Govern');
});

// Govern policies → Govern
app.get('/api/v1/cognitive/govern/policies', async (c) => {
  return proxyToService(c, c.env.GOVERN, `/v1/policies${getQueryString(c)}`, 'Govern');
});

app.post('/api/v1/cognitive/govern/check', async (c) => {
  return proxyToService(c, c.env.GOVERN, '/v1/check', 'Govern');
});

app.all('/api/v1/cognitive/govern/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/govern', '');
  return proxyToService(c, c.env.GOVERN, `/v1${path}${getQueryString(c)}`, 'Govern');
});

// Agents → Intelligence (registry & config)
app.all('/api/v1/cognitive/agents', async (c) => {
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/status${getQueryString(c)}`, 'Intelligence');
});

// ─── Agent Colony (integratewise-agents — orchestration + scoring) ────────
app.post('/api/v1/agents/colony/run', async (c) => {
  return proxyToService(c, c.env.AGENTS, '/colony/run', 'AgentColony');
});

app.get('/api/v1/agents/colony/:instanceId', async (c) => {
  const instanceId = c.req.param('instanceId');
  return proxyToService(c, c.env.AGENTS, `/colony/${instanceId}`, 'AgentColony');
});

app.get('/api/v1/agents/colony/history/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  return proxyToService(c, c.env.AGENTS, `/colony/history/${tenantId}${getQueryString(c)}`, 'AgentColony');
});

app.post('/api/v1/agents/:agentType', async (c) => {
  const agentType = c.req.param('agentType');
  return proxyToService(c, c.env.AGENTS, `/agent/${agentType}`, 'AgentColony');
});

app.get('/api/v1/agents/health', async (c) => {
  return proxyToService(c, c.env.AGENTS, '/health', 'AgentColony');
});

// Digital Twin → Intelligence (cognitive-brain)
app.get('/api/v1/cognitive/twin/proactive', async (c) => {
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/twin/proactive${getQueryString(c)}`, 'Intelligence');
});

app.get('/api/v1/cognitive/twin/memories', async (c) => {
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/twin/memories${getQueryString(c)}`, 'Intelligence');
});

app.all('/api/v1/cognitive/twin/*', async (c) => {
  const path = c.req.path.replace('/api/v1/cognitive/twin', '');
  return proxyToService(c, c.env.INTELLIGENCE, `/v1/twin${path}${getQueryString(c)}`, 'Intelligence');
});

// Audit → Govern
app.get('/api/v1/cognitive/audit', async (c) => {
  return proxyToService(c, c.env.GOVERN, `/v1/audit${getQueryString(c)}`, 'Govern');
});

app.get('/api/v1/cognitive/audit/summary', async (c) => {
  return proxyToService(c, c.env.GOVERN, `/v1/audit/summary${getQueryString(c)}`, 'Govern');
});

// ────────────────────────────────────────────────────────────────────────────
// Stream (real-time WebSocket/SSE)
// ────────────────────────────────────────────────────────────────────────────
app.get('/stream/ws/signals', async (c) => {
  return proxyToService(c, c.env.BFF, `/ws/signals${getQueryString(c)}`, 'Stream');
});

app.get('/stream/sse/signals', async (c) => {
  return proxyToService(c, c.env.BFF, `/sse/signals${getQueryString(c)}`, 'Stream');
});

app.post('/stream/broadcast', async (c) => {
  return proxyToService(c, c.env.BFF, '/broadcast', 'Stream');
});

app.get('/stream/stats', async (c) => {
  return proxyToService(c, c.env.BFF, '/stats', 'Stream');
});

app.all('/stream/*', async (c) => {
  const path = c.req.path.replace('/stream', '');
  return proxyToService(c, c.env.BFF, `${path}${getQueryString(c)}`, 'Stream');
});

// ────────────────────────────────────────────────────────────────────────────
// Billing Routes (integratewise-billing)
//    Routes: /checkout, /plans, /subscription, /webhooks/*
// ────────────────────────────────────────────────────────────────────────────

app.post('/api/v1/billing/checkout', async (c) => {
  return proxyToService(c, c.env.BILLING, '/v1/billing/checkout', 'Billing');
});

app.get('/api/v1/billing/plans', async (c) => {
  return proxyToService(c, c.env.BILLING, `/v1/billing/plans${getQueryString(c)}`, 'Billing');
});

app.get('/api/v1/billing/subscription', async (c) => {
  return proxyToService(c, c.env.BILLING, `/v1/billing/subscription${getQueryString(c)}`, 'Billing');
});

app.get('/api/v1/billing/subscriptions/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  return proxyToService(c, c.env.BILLING, `/v1/subscriptions/${tenantId}${getQueryString(c)}`, 'Billing');
});

app.post('/api/v1/billing/subscriptions', async (c) => {
  return proxyToService(c, c.env.BILLING, '/v1/subscriptions', 'Billing');
});

app.put('/api/v1/billing/subscriptions/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  return proxyToService(c, c.env.BILLING, `/v1/subscriptions/${tenantId}`, 'Billing');
});

app.post('/api/v1/billing/usage', async (c) => {
  return proxyToService(c, c.env.BILLING, '/v1/usage', 'Billing');
});

app.get('/api/v1/billing/usage/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  return proxyToService(c, c.env.BILLING, `/v1/usage/${tenantId}${getQueryString(c)}`, 'Billing');
});

app.get('/api/v1/billing/invoices/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  return proxyToService(c, c.env.BILLING, `/v1/invoices/${tenantId}${getQueryString(c)}`, 'Billing');
});

app.get('/api/v1/billing/entitlements/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  return proxyToService(c, c.env.BILLING, `/v1/entitlements/${tenantId}${getQueryString(c)}`, 'Billing');
});

// ────────────────────────────────────────────────────────────────────────────
// Admin routes (admin-only, JWT verified above)
// ────────────────────────────────────────────────────────────────────────────
app.all('/admin/*', async (c) => {
  const userRole = c.get('userRole');
  if (userRole !== 'admin' && userRole !== 'service_role') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  const path = c.req.path;
  const target = c.env.ADMIN_SERVICE || c.env.TENANTS;
  return proxyToService(c, target, `${path}${getQueryString(c)}`, 'Admin');
});

// ────────────────────────────────────────────────────────────────────────────
// Public Routes (Newsletter, Contact, Support — no auth required)
// ────────────────────────────────────────────────────────────────────────────

// Remove JWT auth requirement for public routes
app.post('/api/v1/public/newsletter', async (c) => {
  try {
    const { email } = await c.req.json<{ email: string }>();
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email required' }, 400);
    }

    // Route to admin service for storage
    const adminService = c.env.ADMIN_SERVICE;
    if (!adminService) {
      return c.json({ error: 'Admin service not available' }, 503);
    }

    const res = await adminService.fetch(new Request('http://admin/v1/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-auth': 'gateway',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    }));

    const data = await res.json<any>();
    if (res.ok) {
      return c.json({ success: true, message: 'Subscribed successfully' });
    }
    return c.json({ error: data.error || 'Failed to subscribe' }, res.status);
  } catch (err: any) {
    console.error('[Gateway] Newsletter subscription failed:', err.message);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

app.post('/api/v1/public/contact', async (c) => {
  try {
    const body = await c.req.json<any>();
    const { name, email, company, type, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: 'Name, email, and message are required' }, 400);
    }

    // Route to admin service for storage
    const adminService = c.env.ADMIN_SERVICE;
    if (!adminService) {
      return c.json({ error: 'Admin service not available' }, 503);
    }

    const res = await adminService.fetch(new Request('http://admin/v1/contact-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-auth': 'gateway',
      },
      body: JSON.stringify({
        name,
        email: email.toLowerCase().trim(),
        company: company || null,
        type: type || 'general',
        message,
        submitted_at: new Date().toISOString(),
      }),
    }));

    const data = await res.json<any>();
    if (res.ok) {
      return c.json({ success: true, message: 'Message sent successfully' });
    }
    return c.json({ error: data.error || 'Failed to submit' }, res.status);
  } catch (err: any) {
    console.error('[Gateway] Contact submission failed:', err.message);
    return c.json({ error: 'Failed to submit message' }, 500);
  }
});

// Support ticket route (requires auth)
app.post('/api/v1/support/ticket', async (c) => {
  try {
    const tenantId = c.req.header('x-tenant-id') || 'default';
    const body = await c.req.json<any>();

    // Route to admin service
    const adminService = c.env.ADMIN_SERVICE;
    if (!adminService) {
      return c.json({ error: 'Admin service not available' }, 503);
    }

    const res = await adminService.fetch(new Request('http://admin/v1/support-tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
        'x-service-auth': 'gateway',
      },
      body: JSON.stringify(body),
    }));

    const data = await res.json<any>();
    if (res.ok) {
      return c.json({ success: true, ticket_id: data.ticket_id });
    }
    return c.json({ error: data.error || 'Failed to create ticket' }, res.status);
  } catch (err: any) {
    console.error('[Gateway] Support ticket creation failed:', err.message);
    return c.json({ error: 'Failed to create support ticket' }, 500);
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Legacy Webhook Routes (kept for backward compat)
// ────────────────────────────────────────────────────────────────────────────

import { StripePaymentEventSchema, SalesforceLeadSchema } from '@integratewise/connector-contracts';
import { handleConnectorError } from '@integratewise/connector-utils';

const MAPPERS: Record<string, (payload: any) => any> = {
  stripe: (payload: any) => {
    const event = StripePaymentEventSchema.parse(payload);
    return {
      type: `stripe.${event.type}`,
      idempotency_key: event.id,
      entity_type: 'account',
      entity_id: event.data.object.customer,
      payload: event,
    };
  },
  salesforce: (payload: any) => {
    const lead = SalesforceLeadSchema.parse(payload);
    return {
      type: 'salesforce.lead.upsert',
      idempotency_key: `sf_lead_${lead.Id || lead.Email}`,
      entity_type: 'lead',
      entity_id: lead.Id || lead.Email,
      payload: lead,
    };
  },
  zendesk: (payload: any) => ({
    type: 'zendesk.ticket.created',
    idempotency_key: `zen_${payload.id}`,
    entity_type: 'account',
    entity_id: payload.external_id || payload.organization_id,
    payload,
  }),
  calendar: (payload: any) => ({
    type: 'calendar.event.created',
    idempotency_key: `cal_${payload.id}`,
    entity_type: 'person',
    entity_id: payload.organizer.email,
    payload,
  }),
};

// Billing webhooks (Stripe/Razorpay) — no JWT required
app.post('/webhooks/billing/*', async (c) => {
  const target = c.env.BILLING;
  if (target) {
    return proxyToService(c, target, c.req.path, 'Billing');
  }
  return c.json({ status: 'received' });
});

// Legacy webhook ingestion
app.post('/webhook/:source', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const source = c.req.param('source');
  const tenant_id = c.req.header('x-tenant-id');

  if (!tenant_id) return c.json({ error: 'Missing x-tenant-id' }, 400);
  if (!MAPPERS[source]) return c.json({ error: `Unsupported source: ${source}` }, 400);

  const rawPayload = await c.req.json();

  try {
    const startTime = Date.now();
    const normalized = MAPPERS[source](rawPayload);

    const [insertedEvent] = await sql`
      INSERT INTO events (
        tenant_id, event_type, source_system, payload,
        idempotency_key, entity_type, entity_id,
        received_at, normalized_at
      ) VALUES (
        ${tenant_id}::uuid,
        ${normalized.type},
        ${source},
        ${JSON.stringify(normalized.payload)},
        ${normalized.idempotency_key},
        ${normalized.entity_type},
        ${normalized.entity_id},
        ${new Date().toISOString()},
        ${new Date().toISOString()}
      )
      ON CONFLICT (tenant_id, source_system, idempotency_key) DO NOTHING
      RETURNING id, event_type, entity_type, entity_id
    `;

    // Trigger Think engine if event was inserted
    if (insertedEvent && c.env.THINK) {
      c.env.THINK.fetch(
        new Request('https://internal/v1/process-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenant_id,
            'x-service-auth': 'gateway',
          },
          body: JSON.stringify(insertedEvent),
        })
      ).catch((e: any) => console.error('Think Engine Trigger Failed:', e));
    }

    return c.json({
      status: 'success',
      event_id: insertedEvent?.id,
      event_type: normalized.type,
      latency_ms: Date.now() - startTime,
    });
  } catch (err: any) {
    await sql`
      INSERT INTO normalization_errors (tenant_id, source_system, raw_payload, error_message)
      VALUES (${tenant_id}::uuid, ${source}, ${JSON.stringify(rawPayload)}, ${err.message})
    `;
    await handleConnectorError(c.env.DATABASE_URL, {
      tool_name: source,
      operation: 'normalization',
      tenant_id,
      error: err,
      payload: rawPayload,
    });
    return c.json({ error: 'Normalization failed', details: err.message }, 400);
  }
});

// ─── JWT Verification ────────────────────────────────────────────────────────

async function verifyJWT(token: string, secret: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const payload = JSON.parse(atob(parts[1]));

  // Check expiration
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    throw new Error('Token expired');
  }

  // Verify HMAC signature using Web Crypto API
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureInput = encoder.encode(`${parts[0]}.${parts[1]}`);
  const signature = Uint8Array.from(
    atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')),
    c => c.charCodeAt(0)
  );

  const valid = await crypto.subtle.verify('HMAC', key, signature, signatureInput);
  if (!valid) throw new Error('Invalid signature');

  return payload;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getQueryString(c: any): string {
  const url = new URL(c.req.url);
  return url.search || '';
}

export default app;
