import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
    // Primary data source (truth database)
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;

    // Edge cache (D1) — used for cached projections, idempotency, and sync cursors
    DB: D1Database;

    GOVERN?: Fetcher;
    THINK?: Fetcher;
    STORE?: Fetcher;
    CONNECTOR?: Fetcher;
    PIPELINE?: Fetcher;

    ENVIRONMENT: string;
    SERVICE_SECRET?: string;
};

// ============================================================================
// Supabase Query Helper (Truth Database)
// ============================================================================
async function supabaseQuery(
    url: string,
    key: string,
    table: string,
    query: string
): Promise<any[]> {
    try {
        const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error(`Supabase query failed: ${res.status} ${res.statusText}`);
            return [];
        }

        return res.json();
    } catch (err: any) {
        console.error(`Supabase fetch error: ${err.message}`);
        return [];
    }
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/health', (c) => c.json({ service: 'Act Layer (Agents)', status: 'operational', database: 'Supabase (truth) + D1 (edge cache)' }));

/**
 * Execute an Action Proposal (D1 Aligned)
 */
app.post('/execute', async (c) => {
    const tenantId = c.req.header('x-tenant-id');
    const correlationId = c.req.header('x-correlation-id') || crypto.randomUUID();

    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const body = await c.req.json();
    const { action_proposal_id } = body;

    try {
        // 1. Verify existence of the proposal in Supabase (truth database)
        const proposals = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'action_proposals',
            `id=eq.${action_proposal_id}&tenant_id=eq.${tenantId}`
        );

        const proposal = proposals?.[0];
        if (!proposal) {
            return c.json({ error: 'Action proposal not found in Spine' }, 404);
        }

        // 1.5. MANDATORY GOVERNANCE CHECK (Service Binding)
        if (!c.env.GOVERN) {
            return c.json({ error: 'Governance service unavailable — execution denied (fail-safe)' }, 503);
        }

        const govCheck = await c.env.GOVERN.fetch('http://internal/v1/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
                'x-user-id': 'system-agent',
                'x-correlation-id': correlationId,
                'x-service-auth': c.env.SERVICE_SECRET || 'internal-default'
            },
            body: JSON.stringify({
                action_type: proposal.action_type,
                priority: proposal.priority || 'medium',
                parameters: typeof proposal.parameters === 'string' ? JSON.parse(proposal.parameters) : proposal.parameters
            })
        });

        if (govCheck.ok) {
            const checkResult = await govCheck.json() as any;
            if (!checkResult.data?.allowed) {
                return c.json({
                    error: 'Governance Denied',
                    reason: checkResult.data?.reason || 'Policy violation'
                }, 403);
            }
        } else {
            // If governance service is down/failing, we fail-safe (deny) in production
            return c.json({ error: 'Governance Check Failed' }, 503);
        }

        // 2. Log "Execution Attempt" to Spine
        const runId = crypto.randomUUID();
        await c.env.DB.prepare(`
            INSERT INTO audit_logs (id, tenant_id, actor_id, actor_type, action, entity_type, entity_id, metadata)
            VALUES (?, ?, 'act-engine', 'engine', 'execution_started', 'action_proposal', ?, ?)
        `).bind(
            crypto.randomUUID(),
            tenantId,
            action_proposal_id,
            JSON.stringify({ runId, correlationId })
        ).run();

        // 3. Simulate Execution
        // In a real system, this would call the actual connector (Mailchimp, Slack, etc.)
        const result = {
            success: true,
            run_id: runId,
            executed_at: new Date().toISOString()
        };

        // 4. Update Audit with Success
        await c.env.DB.prepare(`
            INSERT INTO audit_logs (id, tenant_id, actor_id, actor_type, action, entity_type, entity_id, metadata)
            VALUES (?, ?, 'act-engine', 'engine', 'execution_completed', 'action_proposal', ?, ?)
        `).bind(
            crypto.randomUUID(),
            tenantId,
            action_proposal_id,
            JSON.stringify(result)
        ).run();

        return c.json(result);
    } catch (err: any) {
        return c.json({ error: 'Execution failed', message: err.message }, 500);
    }
});

/**
 * Get Action Proposals for a Situation
 * v3.6: Query from Supabase (truth database)
 */
app.get('/proposals/:situation_id', async (c) => {
    const situationId = c.req.param('situation_id');

    // Query Supabase (truth database)
    const results = await supabaseQuery(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_SERVICE_KEY,
        'action_proposals',
        `situation_id=eq.${situationId}&order=proposal_rank.asc`
    );

    return c.json({ success: true, data: results });
});

export default app;
