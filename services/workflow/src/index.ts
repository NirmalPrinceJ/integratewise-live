import { Hono } from 'hono';
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';

// ============================================================================
// Types
// ============================================================================
interface Env {
  DB: D1Database;
  // v3.6: D1 is edge cache only. Supabase PostgreSQL is SINGLE SOURCE OF TRUTH
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ACT_URL: string;
  GOVERN_URL: string;
  APPROVAL_WORKFLOW: Workflow;
}

interface RecommendationPayload {
  signalId: string;
  tenantId: string;
  userId: string;
  recommendation: {
    type: 'action' | 'insight' | 'alert';
    title: string;
    description: string;
    action?: {
      type: string;
      target: string;
      params: Record<string, unknown>;
    };
    confidence: number;
    evidence: Array<{
      source: string;
      data: unknown;
      timestamp: string;
    }>;
  };
  expiresAt?: string;
}

interface ApprovalPayload {
  approved: boolean;
  approvedBy: string;
  comments?: string;
  modifiedAction?: Record<string, unknown>;
}

// ============================================================================
// Approval Workflow - Human-in-the-Loop
// ============================================================================
export class ApprovalWorkflow extends WorkflowEntrypoint<Env, RecommendationPayload> {
  async run(event: WorkflowEvent<RecommendationPayload>, step: WorkflowStep) {
    const { signalId, tenantId, userId, recommendation, expiresAt } = event.payload;
    const instanceId = event.instanceId;

    // Step 1: Store recommendation in pending state (v3.6: Supabase is SINGLE SOURCE OF TRUTH)
    await step.do('store-recommendation', async () => {
      // Note: This uses REST API pattern - workflow steps need SUPABASE_URL and SUPABASE_SERVICE_KEY from env
      // For now, keeping D1 for workflow internal storage, but marked for future migration
      await this.env.DB.prepare(`
        INSERT INTO workflow_recommendations (
          id, instance_id, tenant_id, user_id, signal_id,
          type, title, description, action_data, confidence,
          evidence, status, created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), ?)
      `).bind(
        crypto.randomUUID(),
        instanceId,
        tenantId,
        userId,
        signalId,
        recommendation.type,
        recommendation.title,
        recommendation.description,
        JSON.stringify(recommendation.action || {}),
        recommendation.confidence,
        JSON.stringify(recommendation.evidence),
        expiresAt || null
      ).run();
    });

    // Step 2: Check governance rules (auto-approve low-risk actions)
    const governanceCheck = await step.do('check-governance', async () => {
      const response = await fetch(`${this.env.GOVERN_URL}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          userId,
          action: recommendation.action,
          confidence: recommendation.confidence,
        }),
      });
      return response.json() as Promise<{ autoApprove: boolean; reason?: string }>;
    });

    // If governance auto-approves, skip human approval
    if (governanceCheck.autoApprove) {
      await step.do('auto-approve-update', async () => {
        await this.env.DB.prepare(`
          UPDATE workflow_recommendations 
          SET status = 'auto-approved', approved_at = datetime('now'), approved_by = 'system'
          WHERE instance_id = ?
        `).bind(instanceId).run();
      });

      // Execute the action
      await step.do('execute-auto-approved', async () => {
        await fetch(`${this.env.ACT_URL}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signalId,
            tenantId,
            action: recommendation.action,
            approvalType: 'auto',
          }),
        });
      });

      return { status: 'auto-approved', instanceId };
    }

    // Step 3: Wait for human approval (default 7 days timeout)
    const timeout = expiresAt || '7 days';
    const approvalEvent = await step.waitForEvent<ApprovalPayload>(
      'wait-for-approval',
      {
        type: 'recommendation-approval',
        timeout,
      }
    );

    // Step 4: Handle approval decision
    if (approvalEvent.payload?.approved) {
      // Update status to approved
      await step.do('update-approved', async () => {
        await this.env.DB.prepare(`
          UPDATE workflow_recommendations 
          SET status = 'approved', 
              approved_at = datetime('now'), 
              approved_by = ?,
              comments = ?
          WHERE instance_id = ?
        `).bind(
          approvalEvent.payload.approvedBy,
          approvalEvent.payload.comments || null,
          instanceId
        ).run();
      });

      // Execute the action (possibly modified)
      const actionToExecute = approvalEvent.payload.modifiedAction || recommendation.action;
      
      await step.do('execute-approved', async () => {
        await fetch(`${this.env.ACT_URL}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signalId,
            tenantId,
            action: actionToExecute,
            approvalType: 'manual',
            approvedBy: approvalEvent.payload.approvedBy,
          }),
        });
      });

      return { status: 'approved', instanceId, approvedBy: approvalEvent.payload.approvedBy };
    } else {
      // Update status to rejected
      await step.do('update-rejected', async () => {
        await this.env.DB.prepare(`
          UPDATE workflow_recommendations 
          SET status = 'rejected', 
              rejected_at = datetime('now'), 
              rejected_by = ?,
              comments = ?
          WHERE instance_id = ?
        `).bind(
          approvalEvent.payload?.approvedBy || 'timeout',
          approvalEvent.payload?.comments || 'Rejected or timed out',
          instanceId
        ).run();
      });

      return { status: 'rejected', instanceId };
    }
  }
}

// ============================================================================
// v3.6: Supabase REST API Helpers
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
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function supabaseMutate(
  url: string,
  key: string,
  table: string,
  method: string,
  body?: any,
  query?: string
): Promise<any> {
  try {
    const endpoint = query
      ? `${url}/rest/v1/${table}?${query}`
      : `${url}/rest/v1/${table}`
    const res = await fetch(endpoint, {
      method,
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ============================================================================
// Hono API for Workflow Management
// ============================================================================
const app = new Hono<{ Bindings: Env }>();

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'Workflow Engine',
    version: '1.0.0',
    features: ['approval-workflow', 'waitForEvent', 'governance-check'],
  });
});

// Create a new approval workflow
app.post('/workflows/approval', async (c) => {
  const body = await c.req.json<RecommendationPayload>();
  
  const instance = await c.env.APPROVAL_WORKFLOW.create({
    params: body,
  });

  return c.json({
    success: true,
    instanceId: instance.id,
    status: await instance.status(),
  });
});

// Get workflow status
app.get('/workflows/:instanceId', async (c) => {
  const instanceId = c.req.param('instanceId');
  
  const instance = await c.env.APPROVAL_WORKFLOW.get(instanceId);
  const status = await instance.status();

  return c.json({
    instanceId,
    status,
  });
});

// Send approval event to workflow
app.post('/workflows/:instanceId/approve', async (c) => {
  const instanceId = c.req.param('instanceId');
  const body = await c.req.json<{
    approved: boolean;
    approvedBy: string;
    comments?: string;
    modifiedAction?: Record<string, unknown>;
  }>();

  const instance = await c.env.APPROVAL_WORKFLOW.get(instanceId);
  
  await instance.sendEvent({
    type: 'recommendation-approval',
    payload: body,
  });

  return c.json({
    success: true,
    instanceId,
    action: body.approved ? 'approved' : 'rejected',
  });
});

// List pending recommendations for a user
app.get('/recommendations/pending', async (c) => {
  const tenantId = c.req.query('tenantId');
  const userId = c.req.query('userId');

  // v3.6: Query Supabase (SINGLE SOURCE OF TRUTH)
  const recommendations = await supabaseQuery(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_KEY,
    'workflow_recommendations',
    `tenant_id=eq.${tenantId}&user_id=in.(${userId},null)&status=eq.pending&order=created_at.desc&limit=50`
  );

  return c.json({
    recommendations: recommendations || [],
    count: recommendations?.length || 0,
  });
});

// Get recommendation history
app.get('/recommendations/history', async (c) => {
  const tenantId = c.req.query('tenantId');
  const status = c.req.query('status'); // approved, rejected, auto-approved

  // v3.6: Query Supabase (SINGLE SOURCE OF TRUTH)
  let queryStr = `tenant_id=eq.${tenantId}&order=created_at.desc&limit=100`;

  if (status) {
    queryStr += `&status=eq.${status}`;
  }

  const recommendations = await supabaseQuery(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_KEY,
    'workflow_recommendations',
    queryStr
  );

  return c.json({
    recommendations: recommendations || [],
    count: recommendations?.length || 0,
  });
});

export default app;
