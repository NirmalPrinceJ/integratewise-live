/**
 * Execution Library for Act Service
 * 
 * Handles action execution with connector dispatch logic
 * and run history management.
 */

import { neon } from '@neondatabase/serverless';

// =============================================================================
// Types
// =============================================================================

export interface ActionPayload {
  action_id: string;
  action_type: string;
  parameters: Record<string, any>;
  decision_id?: string;
}

export interface ExecutionContext {
  tenant_id: string;
  user_id: string;
  idempotency_key?: string;
}

export interface ExecutionResult {
  success: boolean;
  run_id: string;
  action_id: string;
  status: 'success' | 'failed' | 'cancelled';
  result?: Record<string, any>;
  error?: string;
  duration_ms: number;
}

export interface ActionRun {
  id: string;
  action_id: string;
  decision_id: string | null;
  tenant_id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  result: Record<string, any> | null;
  error_details: Record<string, any> | null;
  retry_count: number;
  idempotency_key: string | null;
  created_at: string;
}

export interface RunFilters {
  action_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// =============================================================================
// Connector Dispatch Logic
// =============================================================================

/**
 * Dispatches action to appropriate connector based on action type prefix
 */
async function dispatchToConnector(
  actionType: string,
  parameters: Record<string, any>
): Promise<{ result: Record<string, any>; success: boolean; error?: string }> {
  const [connector, operation] = actionType.split('.');
  
  switch (connector) {
    case 'billing':
      return executeBillingAction(operation, parameters);
    case 'crm':
      return executeCrmAction(operation, parameters);
    case 'task':
      return executeTaskAction(operation, parameters);
    case 'slack':
      return executeSlackAction(operation, parameters);
    default:
      return {
        success: false,
        result: {},
        error: `Unsupported connector type: ${connector}`
      };
  }
}

/**
 * Billing connector - Stripe API simulation
 */
async function executeBillingAction(
  operation: string,
  parameters: Record<string, any>
): Promise<{ result: Record<string, any>; success: boolean; error?: string }> {
  // Simulate network latency
  await delay(50 + Math.random() * 100);
  
  // Simulate occasional failures (5% rate)
  if (Math.random() < 0.05) {
    return {
      success: false,
      result: {},
      error: 'Stripe API temporarily unavailable'
    };
  }
  
  switch (operation) {
    case 'apply_grace_period':
      return {
        success: true,
        result: {
          stripe_event_id: `evt_${generateId()}`,
          applied_days: parameters.days || 7,
          customer_id: parameters.customer_id,
          status: 'applied',
          applied_at: new Date().toISOString()
        }
      };
    
    case 'create_invoice':
      return {
        success: true,
        result: {
          invoice_id: `inv_${generateId()}`,
          amount: parameters.amount || 0,
          currency: parameters.currency || 'usd',
          customer_id: parameters.customer_id,
          status: 'draft',
          created_at: new Date().toISOString()
        }
      };
    
    case 'update_subscription':
      return {
        success: true,
        result: {
          subscription_id: parameters.subscription_id || `sub_${generateId()}`,
          plan_id: parameters.plan_id,
          status: 'active',
          updated_at: new Date().toISOString()
        }
      };
    
    case 'refund':
      return {
        success: true,
        result: {
          refund_id: `re_${generateId()}`,
          charge_id: parameters.charge_id,
          amount: parameters.amount,
          status: 'succeeded',
          created_at: new Date().toISOString()
        }
      };
    
    default:
      return {
        success: true,
        result: {
          operation,
          status: 'completed',
          parameters,
          completed_at: new Date().toISOString()
        }
      };
  }
}

/**
 * CRM connector - HubSpot API simulation
 */
async function executeCrmAction(
  operation: string,
  parameters: Record<string, any>
): Promise<{ result: Record<string, any>; success: boolean; error?: string }> {
  await delay(50 + Math.random() * 100);
  
  if (Math.random() < 0.03) {
    return {
      success: false,
      result: {},
      error: 'HubSpot API rate limit exceeded'
    };
  }
  
  switch (operation) {
    case 'create_task':
      return {
        success: true,
        result: {
          task_id: `hubspot_task_${generateId()}`,
          title: parameters.title,
          assignee: parameters.assignee,
          due_date: parameters.due_date,
          status: 'open',
          created_at: new Date().toISOString()
        }
      };
    
    case 'update_contact':
      return {
        success: true,
        result: {
          contact_id: parameters.contact_id,
          updated_fields: Object.keys(parameters).filter(k => k !== 'contact_id'),
          updated_at: new Date().toISOString()
        }
      };
    
    case 'create_deal':
      return {
        success: true,
        result: {
          deal_id: `hubspot_deal_${generateId()}`,
          name: parameters.name,
          amount: parameters.amount,
          stage: parameters.stage || 'qualification',
          created_at: new Date().toISOString()
        }
      };
    
    case 'add_note':
      return {
        success: true,
        result: {
          note_id: `hubspot_note_${generateId()}`,
          object_id: parameters.object_id,
          object_type: parameters.object_type,
          created_at: new Date().toISOString()
        }
      };
    
    default:
      return {
        success: true,
        result: {
          operation,
          status: 'completed',
          parameters,
          completed_at: new Date().toISOString()
        }
      };
  }
}

/**
 * Task connector - Asana/Jira simulation
 */
async function executeTaskAction(
  operation: string,
  parameters: Record<string, any>
): Promise<{ result: Record<string, any>; success: boolean; error?: string }> {
  await delay(50 + Math.random() * 100);
  
  if (Math.random() < 0.02) {
    return {
      success: false,
      result: {},
      error: 'Task management service temporarily unavailable'
    };
  }
  
  const provider = parameters.provider || 'asana';
  
  switch (operation) {
    case 'create':
      return {
        success: true,
        result: {
          task_id: `${provider}_${generateId()}`,
          project_id: parameters.project_id,
          title: parameters.title,
          description: parameters.description,
          assignee: parameters.assignee,
          priority: parameters.priority || 'medium',
          status: 'todo',
          provider,
          created_at: new Date().toISOString()
        }
      };
    
    case 'update':
      return {
        success: true,
        result: {
          task_id: parameters.task_id,
          updated_fields: Object.keys(parameters).filter(k => k !== 'task_id'),
          provider,
          updated_at: new Date().toISOString()
        }
      };
    
    case 'complete':
      return {
        success: true,
        result: {
          task_id: parameters.task_id,
          status: 'completed',
          provider,
          completed_at: new Date().toISOString()
        }
      };
    
    case 'assign':
      return {
        success: true,
        result: {
          task_id: parameters.task_id,
          assignee: parameters.assignee,
          provider,
          assigned_at: new Date().toISOString()
        }
      };
    
    default:
      return {
        success: true,
        result: {
          operation,
          status: 'completed',
          provider,
          parameters,
          completed_at: new Date().toISOString()
        }
      };
  }
}

/**
 * Slack connector - Slack webhook simulation
 */
async function executeSlackAction(
  operation: string,
  parameters: Record<string, any>
): Promise<{ result: Record<string, any>; success: boolean; error?: string }> {
  await delay(30 + Math.random() * 70);
  
  if (Math.random() < 0.02) {
    return {
      success: false,
      result: {},
      error: 'Slack webhook delivery failed'
    };
  }
  
  switch (operation) {
    case 'send_message':
      return {
        success: true,
        result: {
          message_ts: `${Date.now()}.${generateId().slice(0, 6)}`,
          channel: parameters.channel,
          ok: true,
          sent_at: new Date().toISOString()
        }
      };
    
    case 'send_dm':
      return {
        success: true,
        result: {
          message_ts: `${Date.now()}.${generateId().slice(0, 6)}`,
          user_id: parameters.user_id,
          ok: true,
          sent_at: new Date().toISOString()
        }
      };
    
    case 'update_message':
      return {
        success: true,
        result: {
          message_ts: parameters.message_ts,
          channel: parameters.channel,
          ok: true,
          updated_at: new Date().toISOString()
        }
      };
    
    case 'add_reaction':
      return {
        success: true,
        result: {
          message_ts: parameters.message_ts,
          reaction: parameters.reaction,
          ok: true,
          added_at: new Date().toISOString()
        }
      };
    
    default:
      return {
        success: true,
        result: {
          operation,
          status: 'completed',
          parameters,
          completed_at: new Date().toISOString()
        }
      };
  }
}

// =============================================================================
// Main Execution Functions
// =============================================================================

/**
 * Execute an action with full lifecycle management
 */
export async function executeAction(
  dbUrl: string,
  action: ActionPayload,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const sql = neon(dbUrl);
  const startTime = Date.now();
  const idempotencyKey = context.idempotency_key || `${action.action_id}_${Date.now()}`;
  
  // Check for existing run with same idempotency key
  const [existingRun] = await sql`
    SELECT * FROM action_runs 
    WHERE tenant_id = ${context.tenant_id}::uuid 
      AND idempotency_key = ${idempotencyKey}
  `;
  
  if (existingRun) {
    // Return cached result for idempotent requests
    return {
      success: existingRun.status === 'success',
      run_id: existingRun.id,
      action_id: action.action_id,
      status: existingRun.status,
      result: existingRun.result,
      error: existingRun.error_details?.message,
      duration_ms: 0 // Cached, no new execution
    };
  }
  
  // Create run record with pending status
  const [runRecord] = await sql`
    INSERT INTO action_runs (
      action_id, decision_id, tenant_id, status, 
      started_at, idempotency_key
    ) VALUES (
      ${action.action_id}::uuid, 
      ${action.decision_id || null}::uuid, 
      ${context.tenant_id}::uuid, 
      'running',
      NOW(),
      ${idempotencyKey}
    )
    RETURNING id
  `;
  
  const runId = runRecord.id;
  
  try {
    // Dispatch to appropriate connector
    const dispatchResult = await dispatchToConnector(action.action_type, action.parameters);
    
    const duration = Date.now() - startTime;
    
    if (dispatchResult.success) {
      // Update run with success
      await sql`
        UPDATE action_runs 
        SET status = 'success',
            completed_at = NOW(),
            result = ${JSON.stringify(dispatchResult.result)}
        WHERE id = ${runId}::uuid
      `;
      
      return {
        success: true,
        run_id: runId,
        action_id: action.action_id,
        status: 'success',
        result: dispatchResult.result,
        duration_ms: duration
      };
    } else {
      // Update run with failure
      await sql`
        UPDATE action_runs 
        SET status = 'failed',
            completed_at = NOW(),
            error_details = ${JSON.stringify({ message: dispatchResult.error })}
        WHERE id = ${runId}::uuid
      `;
      
      return {
        success: false,
        run_id: runId,
        action_id: action.action_id,
        status: 'failed',
        error: dispatchResult.error,
        duration_ms: duration
      };
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Update run with error
    await sql`
      UPDATE action_runs 
      SET status = 'failed',
          completed_at = NOW(),
          error_details = ${JSON.stringify({ message: error.message, stack: error.stack })}
      WHERE id = ${runId}::uuid
    `;
    
    return {
      success: false,
      run_id: runId,
      action_id: action.action_id,
      status: 'failed',
      error: error.message,
      duration_ms: duration
    };
  }
}

/**
 * Get run history for a tenant with optional filters
 */
export async function getRunHistory(
  dbUrl: string,
  tenant_id: string,
  filters: RunFilters = {}
): Promise<ActionRun[]> {
  const sql = neon(dbUrl);
  const limit = filters.limit || 50;
  const offset = filters.offset || 0;
  
  // Build dynamic query based on filters
  if (filters.action_id && filters.status) {
    const runs = await sql`
      SELECT * FROM action_runs 
      WHERE tenant_id = ${tenant_id}::uuid
        AND action_id = ${filters.action_id}::uuid
        AND status = ${filters.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return runs as ActionRun[];
  } else if (filters.action_id) {
    const runs = await sql`
      SELECT * FROM action_runs 
      WHERE tenant_id = ${tenant_id}::uuid
        AND action_id = ${filters.action_id}::uuid
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return runs as ActionRun[];
  } else if (filters.status) {
    const runs = await sql`
      SELECT * FROM action_runs 
      WHERE tenant_id = ${tenant_id}::uuid
        AND status = ${filters.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return runs as ActionRun[];
  } else {
    const runs = await sql`
      SELECT * FROM action_runs 
      WHERE tenant_id = ${tenant_id}::uuid
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return runs as ActionRun[];
  }
}

/**
 * Get a single run by ID
 */
export async function getRunById(
  dbUrl: string,
  tenant_id: string,
  run_id: string
): Promise<ActionRun | null> {
  const sql = neon(dbUrl);
  
  const [run] = await sql`
    SELECT * FROM action_runs 
    WHERE id = ${run_id}::uuid 
      AND tenant_id = ${tenant_id}::uuid
  `;
  
  return run as ActionRun || null;
}

/**
 * Retry a failed run
 */
export async function retryRun(
  dbUrl: string,
  tenant_id: string,
  run_id: string,
  user_id: string
): Promise<ExecutionResult> {
  const sql = neon(dbUrl);
  
  // Get the original run
  const [originalRun] = await sql`
    SELECT ar.*, ad.id as original_decision_id
    FROM action_runs ar
    LEFT JOIN agent_decisions ad ON ar.decision_id = ad.id
    WHERE ar.id = ${run_id}::uuid 
      AND ar.tenant_id = ${tenant_id}::uuid
  `;
  
  if (!originalRun) {
    throw new Error('Run not found');
  }
  
  if (originalRun.status !== 'failed') {
    throw new Error('Only failed runs can be retried');
  }
  
  // Increment retry count on original
  await sql`
    UPDATE action_runs 
    SET retry_count = retry_count + 1
    WHERE id = ${run_id}::uuid
  `;
  
  // Get action details from proposed_actions if available
  const [actionDetails] = await sql`
    SELECT action_type, parameters 
    FROM proposed_actions 
    WHERE id = ${originalRun.action_id}::uuid
  `;
  
  if (!actionDetails) {
    throw new Error('Original action details not found');
  }
  
  // Execute with new idempotency key for retry
  return executeAction(
    dbUrl,
    {
      action_id: originalRun.action_id,
      action_type: actionDetails.action_type,
      parameters: actionDetails.parameters,
      decision_id: originalRun.decision_id
    },
    {
      tenant_id,
      user_id,
      idempotency_key: `${originalRun.action_id}_retry_${originalRun.retry_count + 1}_${Date.now()}`
    }
  );
}

// =============================================================================
// Utility Functions
// =============================================================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
