export interface Env {
  SPINE: Fetcher;
  KNOWLEDGE: Fetcher;
  THINK: Fetcher;
  ACT_QUEUE: Queue;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = request.headers.get('x-tenant-id') || '';

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'workflow' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Dashboard — aggregated view for Home
    if (url.pathname === '/api/v1/workspace/dashboard') {
      return getDashboard(env, tenantId);
    }

    // Entity list (proxied from Spine)
    if (url.pathname === '/api/v1/workspace/entities') {
      return env.SPINE.fetch(new Request(
        `https://spine/api/entities?${url.searchParams.toString()}`,
        { headers: request.headers }
      ));
    }

    // HITL approval queue
    if (url.pathname === '/api/v1/cognitive/hitl/queue' && request.method === 'GET') {
      return getApprovalQueue(env, tenantId);
    }

    // HITL approve/deny
    if (url.pathname === '/api/v1/cognitive/hitl/queue' && request.method === 'POST') {
      const body = await request.json() as { action_id: string; decision: 'approve' | 'deny' };
      return handleApproval(body, env, tenantId, request.headers.get('x-user-id') || '');
    }

    // Audit trail
    if (url.pathname === '/api/v1/cognitive/audit') {
      return getAuditLog(env, tenantId, url.searchParams);
    }

    // SSE stream for real-time events
    if (url.pathname === '/stream/events') {
      return streamEvents(env, tenantId);
    }

    return new Response('BFF service', { status: 200 });
  }
};

async function getDashboard(env: Env, tenantId: string): Promise<Response> {
  // Call Spine for dashboard stats
  const dashResponse = await env.SPINE.fetch(new Request('https://spine/api/dashboard', {
    headers: { 'x-tenant-id': tenantId },
  }));
  const dashData = await dashResponse.json();

  // Call Think for active signals
  const signalsResponse = await env.SPINE.fetch(new Request('https://spine/api/signals', {
    headers: { 'x-tenant-id': tenantId },
  }));
  const signalsData = await signalsResponse.json();

  return new Response(JSON.stringify({
    ...dashData,
    signals: signalsData.signals || [],
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getApprovalQueue(env: Env, tenantId: string): Promise<Response> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase
    .from('actions')
    .select('*, signals(*)')
    .eq('tenant_id', tenantId)
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false });

  return new Response(JSON.stringify({ approvals: data || [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleApproval(
  body: { action_id: string; decision: 'approve' | 'deny' },
  env: Env, tenantId: string, userId: string
): Promise<Response> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const newStatus = body.decision === 'approve' ? 'approved' : 'denied';

  const { data, error } = await supabase
    .from('actions')
    .update({
      status: newStatus,
      approved_by: userId,
      approved_at: new Date().toISOString(),
      approval_token: body.decision === 'approve' ? crypto.randomUUID() : null,
    })
    .eq('id', body.action_id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // If approved, send to Act queue for execution
  if (body.decision === 'approve' && data) {
    await env.ACT_QUEUE.send({
      action_id: data.id,
      tenant_id: tenantId,
      action_type: data.action_type,
      target_tool: data.target_tool,
      payload: data.payload,
      approval_token: data.approval_token,
    });
  }

  // Audit log
  await supabase.from('audit_log').insert({
    tenant_id: tenantId,
    user_id: userId,
    action: `action.${body.decision}`,
    entity_id: body.action_id,
    details: { action_type: data?.action_type },
    source: 'user',
  });

  return new Response(JSON.stringify({ status: newStatus, action: data }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getAuditLog(env: Env, tenantId: string, params: URLSearchParams): Promise<Response> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const limit = parseInt(params.get('limit') || '50');
  const { data } = await supabase
    .from('audit_log')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return new Response(JSON.stringify({ entries: data || [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function streamEvents(env: Env, tenantId: string): Promise<Response> {
  // SSE stream — minimal implementation
  // In production, use Durable Objects for persistent connections
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', tenant_id: tenantId })}\n\n`));
      // TODO: Connect to Supabase Realtime and forward events
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
