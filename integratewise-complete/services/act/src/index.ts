import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
    DB: D1Database;
    GOVERN?: Fetcher;
    ENVIRONMENT: string;
    SERVICE_SECRET?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/health', (c) => c.json({ service: 'Act Layer (Agents)', status: 'operational', database: 'D1' }));

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
        // 1. Verify existence of the proposal in the Spine
        const proposal = await c.env.DB.prepare(`
            SELECT * FROM action_proposals WHERE id = ? AND tenant_id = ?
        `).bind(action_proposal_id, tenantId).first();

        if (!proposal) {
            return c.json({ error: 'Action proposal not found in Spine' }, 404);
        }

        // 1.5. MANDATORY GOVERNANCE CHECK (Service Binding)
        if (c.env.GOVERN) {
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
 */
app.get('/proposals/:situation_id', async (c) => {
    const situationId = c.req.param('situation_id');
    const { results } = await c.env.DB.prepare(`
        SELECT * FROM action_proposals WHERE situation_id = ? ORDER BY proposal_rank ASC
    `).bind(situationId).all();

    return c.json({ success: true, data: results });
});

export default app;
