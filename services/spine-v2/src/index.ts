import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CACHE: KVNamespace;
}

function getSupabase(env: Env, tenantId: string): SupabaseClient {
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { 'x-tenant-id': tenantId } },
    db: { schema: 'public' },
  });
  return client;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = request.headers.get('x-tenant-id') || '';
    const supabase = getSupabase(env, tenantId);

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'spine-v2' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // WRITE: Called by normalizer (pipeline sectorize stage)
    if (url.pathname === '/api/write' && request.method === 'POST') {
      const body = await request.json() as {
        tenant_id: string;
        entities: Array<{
          entity_type: string;
          name: string;
          source: string;
          source_id: string;
          data: Record<string, any>;
        }>;
        trace_id: string;
      };

      const results = [];
      for (const entity of body.entities) {
        // Upsert — match on source + source_id to avoid duplicates
        const { data, error } = await supabase
          .from('entities')
          .upsert({
            tenant_id: body.tenant_id,
            entity_type: entity.entity_type,
            name: entity.name,
            source: entity.source,
            source_id: entity.source_id,
            data: entity.data,
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { 
            onConflict: 'tenant_id,source,source_id',
            ignoreDuplicates: false
          })
          .select();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        results.push(data);

        // Invalidate cache
        await env.CACHE.delete(`entity:${body.tenant_id}:${entity.source}:${entity.source_id}`);
      }

      // Audit log
      await supabase.from('audit_log').insert({
        tenant_id: body.tenant_id,
        action: 'entities.upserted',
        details: { count: body.entities.length, trace_id: body.trace_id, source: body.entities[0]?.source },
        source: 'pipeline',
      });

      return new Response(JSON.stringify({ written: results.length }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // READ: Entities list
    if (url.pathname === '/api/entities' && request.method === 'GET') {
      const entityType = url.searchParams.get('type');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabase
        .from('entities')
        .select('*', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (entityType) query = query.eq('entity_type', entityType);

      const { data, error, count } = await query;
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

      return new Response(JSON.stringify({ entities: data, total: count }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // READ: Single entity with full detail
    if (url.pathname.startsWith('/api/entities/') && request.method === 'GET') {
      const entityId = url.pathname.split('/').pop();
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('id', entityId)
        .eq('tenant_id', tenantId)
        .single();

      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 404 });

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // READ: Signals
    if (url.pathname === '/api/signals' && request.method === 'GET') {
      const status = url.searchParams.get('status') || 'active';
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

      return new Response(JSON.stringify({ signals: data }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // READ: Dashboard stats
    if (url.pathname === '/api/dashboard' && request.method === 'GET') {
      const [entities, signals, actions, connectors] = await Promise.all([
        supabase.from('entities').select('entity_type', { count: 'exact' }).eq('tenant_id', tenantId),
        supabase.from('signals').select('severity', { count: 'exact' }).eq('tenant_id', tenantId).eq('status', 'active'),
        supabase.from('actions').select('status', { count: 'exact' }).eq('tenant_id', tenantId).eq('status', 'pending_approval'),
        supabase.from('connectors').select('tool_name, status, entity_count, last_sync_at').eq('tenant_id', tenantId),
      ]);

      return new Response(JSON.stringify({
        entity_count: entities.count || 0,
        active_signals: signals.count || 0,
        pending_approvals: actions.count || 0,
        connectors: connectors.data || [],
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};
