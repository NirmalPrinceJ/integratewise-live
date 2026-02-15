/**
 * Cloudflare D1 Database Client & Service Proxy
 *
 * This module provides database access and service proxying through Cloudflare Workers.
 * The Next.js frontend does NOT have direct DB access - all DB operations
 * go through the L3 service layer (spine, store, views, etc.).
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  Next.js (Thin Control Plane)                                          │
 * │    ↓                                                                    │
 * │  Service Proxy (Scope + Trace + Headers)                               │
 * │    ↓                                                                    │
 * │  [Future: Policy Precheck Layer]                                       │
 * │    ↓                                                                    │
 * │  L3 Workers (Domain Services) ──→ Event/Signal Stream (DO/Queue)       │
 * │    ↓                                                                    │
 * │  Storage (D1 / R2 / Vectorize)                                         │
 * │                                                                         │
 * │  Side Layer: Observability + Audit + Trace                             │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Zero-Trust Principle: Workers MUST validate scope independently.
 * Headers are hints, not authority.
 */
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// #region Service Registry
const SERVICE_URLS = {
  spine: process.env.SPINE_SERVICE_URL || 'https://spine.integratewise.ai',
  store: process.env.STORE_SERVICE_URL || 'https://store.integratewise.ai',
  views: process.env.VIEWS_SERVICE_URL || 'https://views.integratewise.ai',
  knowledge: process.env.KNOWLEDGE_SERVICE_URL || 'https://knowledge.integratewise.ai',
  iqHub: process.env.IQ_HUB_SERVICE_URL || 'https://iq-hub.integratewise.ai',
  govern: process.env.GOVERN_SERVICE_URL || 'https://govern.integratewise.ai',
  loader: process.env.LOADER_SERVICE_URL || 'https://loader.integratewise.ai',
  think: process.env.THINK_SERVICE_URL || 'https://think.integratewise.ai',
  act: process.env.ACT_SERVICE_URL || 'https://act.integratewise.ai',
  tenants: process.env.TENANTS_SERVICE_URL || 'https://tenants.integratewise.ai',
  auth: process.env.AUTH_SERVICE_URL || 'https://auth.integratewise.ai',
  billing: process.env.BILLING_SERVICE_URL || 'https://billing.integratewise.ai',
  signals: process.env.SIGNALS_SERVICE_URL || 'https://signals.integratewise.ai',
} as const;

export type ServiceName = keyof typeof SERVICE_URLS;

function getServiceUrl(service: ServiceName): string {
  // In a real scenario, this could be more complex (e.g., stage-aware)
  return SERVICE_URLS[service];
}
// #endregion

// #region Core Service Functions
export interface ProxyOptions {
  service: ServiceName;
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  extraHeaders?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string>;
  timeout?: number;
}

export interface ServiceRequestOptions extends Omit<ProxyOptions, 'service' | 'path'> {
  scope?: ScopeContext;
}

/**
 * Direct service call (for server-side use, returns parsed JSON)
 */
export async function serviceRequest<T>(
  service: ServiceName,
  path: string,
  options: ServiceRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, extraHeaders, queryParams, scope = {} } = options;
  const url = new URL(path.startsWith('/') ? path : `/${path}`, getServiceUrl(service));

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value);
    }
  }

  const requestHeaders = await buildForwardHeaders(scope, extraHeaders);

  const response = await fetch(url.toString(), {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Service '${service}' error: ${response.status} - ${error}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Proxy a request to an L3 Worker service
 * Returns a NextResponse that can be returned directly from an API route
 */
export async function proxyToService(options: ProxyOptions): Promise<NextResponse> {
  const { service, path, method = 'GET', body, queryParams, timeout = 30000, extraHeaders } = options;

  try {
    const scope = await extractScopeContext();
    const baseUrl = getServiceUrl(service);
    const url = new URL(path.startsWith('/') ? path : `/${path}`, baseUrl);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.append(key, value);
      }
    }

    const forwardHeaders = await buildForwardHeaders(scope, extraHeaders);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url.toString(), {
      method,
      headers: forwardHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseData = await response.text();

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error(`[service-proxy] ${service}${path} failed:`, error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Service timeout', service, path },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Service unavailable', service, path, message: String(error) },
      { status: 502 }
    );
  }
}
// #endregion

// #region Observability Spine
/**
 * Trace context for distributed tracing across services.
 * Every request gets a unique trace context that propagates through
 * all service calls for end-to-end observability.
 */
export interface TraceContext {
  /** Unique ID for this specific request */
  request_id: string;
  /** ID that follows the entire distributed trace (may span multiple requests) */
  trace_id: string;
  /** ID for this specific span in the trace */
  span_id: string;
  /** Parent span ID if this is a child span */
  parent_span_id?: string;
  /** Agent ID if request originated from an AI agent */
  agent_id?: string;
  /** Session ID for user session tracking */
  session_id?: string;
  /** Timestamp when trace started */
  start_time: number;
}

/**
 * Generate a new trace context for an incoming request.
 * Inherits trace_id from incoming headers if present (for distributed tracing).
 */
export function createTraceContext(): TraceContext {
  const headerStore = headers();
  const incomingTraceId = headerStore.get('x-trace-id');
  const incomingSpanId = headerStore.get('x-span-id');
  const incomingAgentId = headerStore.get('x-agent-id');
  const incomingSessionId = headerStore.get('x-session-id');

  return {
    request_id: randomUUID(),
    trace_id: incomingTraceId || randomUUID(),
    span_id: randomUUID(),
    parent_span_id: incomingSpanId || undefined,
    agent_id: incomingAgentId || undefined,
    session_id: incomingSessionId || undefined,
    start_time: Date.now(),
  };
}

/**
 * Current request's trace context (module-level for request lifecycle).
 * In production, use AsyncLocalStorage for true request isolation.
 */
let _currentTrace: TraceContext | null = null;

export function getTraceContext(): TraceContext {
  if (!_currentTrace) {
    _currentTrace = createTraceContext();
  }
  return _currentTrace;
}

export function resetTraceContext(): void {
  _currentTrace = null;
}
// #endregion

// #region Auth & Scope
const SESSION_COOKIE = 'iw_session';

export interface ScopeContext {
  tenant_id?: string;
  workspace_id?: string;
  user_id?: string;
  user_role?: string;
  account_id?: string;
  team_id?: string;
}

export async function extractScopeContext(): Promise<ScopeContext> {
  const headerStore = headers();
  const cookieStore = cookies();
  return {
    tenant_id: headerStore.get('x-tenant-id') || cookieStore.get('iw_tenant')?.value,
    workspace_id: headerStore.get('x-workspace-id') || cookieStore.get('iw_workspace')?.value,
    user_id: headerStore.get('x-user-id') || undefined,
    user_role: headerStore.get('x-user-role') || undefined,
    account_id: headerStore.get('x-account-id') || undefined,
    team_id: headerStore.get('x-team-id') || undefined,
  };
}

async function buildForwardHeaders(
  scope: ScopeContext,
  extraHeaders?: Record<string, string>
): Promise<Record<string, string>> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  const trace = getTraceContext();

  const forwardHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    // Observability headers
    'x-request-id': trace.request_id,
    'x-trace-id': trace.trace_id,
    'x-span-id': trace.span_id,
  };

  // Optional trace headers
  if (trace.parent_span_id) forwardHeaders['x-parent-span-id'] = trace.parent_span_id;
  if (trace.agent_id) forwardHeaders['x-agent-id'] = trace.agent_id;
  if (trace.session_id) forwardHeaders['x-session-id'] = trace.session_id;

  // Auth header
  if (sessionToken) forwardHeaders['Authorization'] = `Bearer ${sessionToken}`;

  // Scope headers (hints - Workers must validate independently)
  if (scope.tenant_id) forwardHeaders['x-tenant-id'] = scope.tenant_id;
  if (scope.workspace_id) forwardHeaders['x-workspace-id'] = scope.workspace_id;
  if (scope.user_id) forwardHeaders['x-user-id'] = scope.user_id;
  if (scope.user_role) forwardHeaders['x-user-role'] = scope.user_role;
  if (scope.account_id) forwardHeaders['x-account-id'] = scope.account_id;
  if (scope.team_id) forwardHeaders['x-team-id'] = scope.team_id;

  if (extraHeaders) Object.assign(forwardHeaders, extraHeaders);

  return forwardHeaders;
}
// #endregion

// #region Service Clients
export const spine = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('spine', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('spine', path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('spine', path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('spine', path, { ...options, method: 'DELETE' }),
};

export const store = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('store', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('store', path, { ...options, method: 'POST', body }),
};

export const views = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('views', path, { ...options, method: 'GET' }),
};

export const knowledge = {
  search: <T>(query: string, options?: { limit?: number; filters?: Record<string, unknown> } & ServiceRequestOptions) =>
    serviceRequest<T>('knowledge', '/search', { ...options, method: 'POST', body: { query, ...options } }),
};

export const iqHub = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('iqHub', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('iqHub', path, { ...options, method: 'POST', body }),
};

export const govern = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('govern', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('govern', path, { ...options, method: 'POST', body }),
};

export const loader = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('loader', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('loader', path, { ...options, method: 'POST', body }),
};

export const think = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('think', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('think', path, { ...options, method: 'POST', body }),
};

export const act = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('act', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('act', path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('act', path, { ...options, method: 'PATCH', body }),
};

export const tenants = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('tenants', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('tenants', path, { ...options, method: 'POST', body }),
};

export const auth = {
  get: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('auth', path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('auth', path, { ...options, method: 'POST', body }),
  validate: <T>(token: string, options?: ServiceRequestOptions) => serviceRequest<T>('auth', '/validate', { ...options, method: 'POST', body: { token } }),
};

export const signals = {
  emit: <T>(body: unknown, options?: ServiceRequestOptions) => serviceRequest<T>('signals', '/v1/emit', { ...options, method: 'POST', body }),
  query: <T>(path: string, options?: ServiceRequestOptions) => serviceRequest<T>('signals', path, { ...options, method: 'GET' }),
};
// #endregion

// #region Utilities

/**
 * @deprecated Legacy DB query interface - use service clients (spine, store, etc.) instead.
 * This exists for migration compatibility. All new code should use service proxies.
 */
export const db = {
  async query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[] }> {
    const response = await serviceRequest<{ rows: T[] }>('spine', '/v1/query', {
      method: 'POST',
      body: { sql, params },
    });
    return { rows: response?.rows || [] };
  },
};

export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  services: Record<string, { healthy: boolean; latencyMs: number; error?: string }>;
}> {
  const results: Record<string, { healthy: boolean; latencyMs: number; error?: string }> = {};
  const serviceEntries = Object.entries(SERVICE_URLS);

  await Promise.all(
    serviceEntries.map(async ([name, url]) => {
      const start = Date.now();
      try {
        const response = await fetch(`${url}/health`);
        if (!response.ok) throw new Error(`Service returned status ${response.status}`);
        results[name] = { healthy: true, latencyMs: Date.now() - start };
      } catch (error) {
        results[name] = {
          healthy: false,
          latencyMs: Date.now() - start,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  return {
    healthy: Object.values(results).every((r) => r.healthy),
    services: results,
  };
}

export function isReadOnlyEnvironment(): boolean {
  const env = process.env.ENVIRONMENT || process.env.NODE_ENV;
  return env === 'preview' || env === 'staging';
}

export async function withWriteCheck<T>(
  operation: () => Promise<T>,
  entityName: string
): Promise<T> {
  if (isReadOnlyEnvironment()) {
    throw new Error(`Write operations for ${entityName} are disabled in this environment.`);
  }
  return operation();
}
// #endregion

