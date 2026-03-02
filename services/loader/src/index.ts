export interface Env {
  PIPELINE_QUEUE: Queue;
  MCP_IDEMPOTENCY: KVNamespace;
  EDGE_DB: D1Database;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = request.headers.get('x-tenant-id') || '';

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'loader' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Inbound webhook from external tools
    if (url.pathname.startsWith('/webhooks/') && request.method === 'POST') {
      const tool = url.pathname.split('/webhooks/')[1]?.split('/')[0]; // e.g., hubspot, stripe
      return handleWebhook(request, env, tool, tenantId);
    }

    // Manual data ingestion (CSV/JSON upload trigger)
    if (url.pathname === '/api/v1/connector/ingest' && request.method === 'POST') {
      const body = await request.json() as { source: string; data: any[] };
      return handleManualIngestion(body, env, tenantId);
    }

    // List connected tools
    if (url.pathname === '/api/v1/connector/list' && request.method === 'GET') {
      return listConnectors(env, tenantId);
    }

    // OAuth initiation
    if (url.pathname.startsWith('/api/v1/connector/oauth/init/') && request.method === 'POST') {
      const tool = url.pathname.split('/').pop()!;
      return initiateOAuth(tool, env, tenantId);
    }

    // OAuth callback
    if (url.pathname === '/api/v1/connector/oauth/callback') {
      return handleOAuthCallback(request, env);
    }

    return new Response('Connector service', { status: 200 });
  },

  // Cron trigger for polling connectors
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Fetch all active connectors that use polling
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: connectors } = await supabase
      .from('connectors')
      .select('*')
      .eq('status', 'active')
      .in('auth_type', ['oauth2', 'api_key']);

    if (!connectors) return;

    for (const connector of connectors) {
      try {
        // TODO: Implement per-tool polling logic
        // For each connector, fetch new data since last_sync_at
        // Send each record to pipeline queue
        console.log(`Polling ${connector.tool_name} for tenant ${connector.tenant_id}`);
      } catch (error) {
        console.error(`Polling failed for ${connector.tool_name}:`, error);
      }
    }
  }
};

async function handleWebhook(request: Request, env: Env, tool: string, tenantId: string): Promise<Response> {
  const body = await request.json();
  const traceId = crypto.randomUUID();

  // Idempotency check
  const idempotencyKey = `${tool}:${JSON.stringify(body).slice(0, 100)}`;
  const existing = await env.MCP_IDEMPOTENCY.get(idempotencyKey);
  if (existing) {
    return new Response(JSON.stringify({ status: 'duplicate' }), { status: 200 });
  }
  await env.MCP_IDEMPOTENCY.put(idempotencyKey, 'processed', { expirationTtl: 86400 });

  // TODO: Signature verification per tool
  // if (tool === 'hubspot') verifyHubSpotSignature(request, body);

  // Resolve tenant from webhook (tool-specific mapping)
  // For now, use the tenantId from gateway header or webhook config
  const resolvedTenant = tenantId || body.portalId || 'default';

  // Send to pipeline
  const records = Array.isArray(body) ? body : [body];
  for (const record of records) {
    await env.PIPELINE_QUEUE.send({
      stage: 'analyze',
      tenant_id: resolvedTenant,
      source: tool,
      source_type: 'webhook',
      payload: record,
      metadata: {
        trace_id: traceId,
        attempt: 0,
        received_at: new Date().toISOString(),
      },
    });
  }

  return new Response(JSON.stringify({ 
    status: 'accepted', 
    trace_id: traceId,
    records: records.length 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleManualIngestion(
  body: { source: string; data: any[] }, 
  env: Env, 
  tenantId: string
): Promise<Response> {
  const traceId = crypto.randomUUID();
  
  for (const record of body.data) {
    await env.PIPELINE_QUEUE.send({
      stage: 'analyze',
      tenant_id: tenantId,
      source: body.source || 'manual',
      source_type: 'manual',
      payload: record,
      metadata: {
        trace_id: traceId,
        attempt: 0,
        received_at: new Date().toISOString(),
      },
    });
  }

  return new Response(JSON.stringify({ 
    status: 'accepted',
    trace_id: traceId,
    records: body.data.length
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function listConnectors(env: Env, tenantId: string): Promise<Response> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('tenant_id', tenantId);

  return new Response(JSON.stringify({ connectors: data || [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function initiateOAuth(tool: string, env: Env, tenantId: string): Promise<Response> {
  // TODO: Generate OAuth URL per tool with state parameter
  // State encodes: tenant_id + tool + timestamp
  const state = btoa(JSON.stringify({ tenant_id: tenantId, tool, ts: Date.now() }));
  
  const oauthUrls: Record<string, string> = {
    hubspot: `https://app.hubspot.com/oauth/authorize?client_id=CLIENT_ID&redirect_uri=CALLBACK&scope=contacts%20deals&state=${state}`,
    // Add more tools as needed
  };

  const url = oauthUrls[tool];
  if (!url) {
    return new Response(JSON.stringify({ error: `Unknown tool: ${tool}` }), { status: 400 });
  }

  return new Response(JSON.stringify({ oauth_url: url }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleOAuthCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  if (!code || !state) {
    return new Response('Missing code or state', { status: 400 });
  }

  const { tenant_id, tool } = JSON.parse(atob(state));

  // TODO: Exchange code for token per tool
  // Store connector record in Supabase
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from('connectors').insert({
    tenant_id,
    tool_name: tool,
    auth_type: 'oauth2',
    status: 'active',
    config: { connected_at: new Date().toISOString() },
  });

  // Redirect back to app
  return Response.redirect('https://app.integratewise.ai/settings/connectors?connected=' + tool);
}
