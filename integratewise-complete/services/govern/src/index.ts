import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { z } from 'zod';
import type { Env } from './types';
import {
  CreatePolicySchema,
  UpdatePolicySchema,
  ActionCheckSchema,
  ApproveActionSchema,
  RejectActionSchema,
  AuditFiltersSchema,
} from './types';
import {
  listPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deactivatePolicy,
  canExecute,
} from './policies';
import { approveAction, rejectAction, getPendingActions } from './workflow';
import { logDecision, getAuditLog, getAuditSummary } from './audit';

// ============================================================================
// Best Practice: Correlation ID for Request Tracing
// ============================================================================

const CORRELATION_ID_HEADER = 'x-correlation-id';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCorrelationId(c: any): string {
  return c.req.header(CORRELATION_ID_HEADER) || generateUUID();
}

function logWithContext(
  correlationId: string,
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
): void {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    correlation_id: correlationId,
    service: 'govern',
    message,
    ...data,
  };
  console[level](JSON.stringify(log));
}

// ============================================================================
// App Setup
// ============================================================================
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', secureHeaders());

/**
 * Best Practice: Internal Service Authentication
 * Trust Layer: Ensures only authorized services can reach the governance engine
 */
const internalAuth = () => {
  return async (c: any, next: any) => {
    // Skip auth for health checks
    if (c.req.path === '/health' || c.req.path === '/') {
      await next();
      return;
    }

    const serviceAuth = c.req.header('x-service-auth');
    const isDevelopment = c.env.ENVIRONMENT === 'development' || !c.env.ENVIRONMENT;

    if (!isDevelopment && c.env.SERVICE_SECRET && serviceAuth !== c.env.SERVICE_SECRET) {
      logWithContext('security-violation', 'warn', 'Unauthorized service-to-service call', {
        path: c.req.path,
        ip: c.req.header('cf-connecting-ip')
      });
      return c.json({ error: 'Unauthorized Service Access' }, 401);
    }
    await next();
  };
};

app.use('/v1/*', internalAuth());

// ============================================================================
// Health Check
// ============================================================================
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'govern',
    v: '1.1.0-traced',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Helper: Extract tenant/user from headers
// ============================================================================
function getTenantId(c: any): string {
  const tenantId = c.req.header('x-tenant-id');
  if (!tenantId) {
    throw new Error('Missing x-tenant-id header');
  }
  return tenantId;
}

function getUserId(c: any): string {
  const userId = c.req.header('x-user-id');
  if (!userId) {
    throw new Error('Missing x-user-id header');
  }
  return userId;
}

function getUserRoles(c: any): string[] {
  const rolesHeader = c.req.header('x-user-roles');
  if (!rolesHeader) return [];
  try {
    return JSON.parse(rolesHeader);
  } catch {
    return rolesHeader.split(',').map((r: string) => r.trim());
  }
}

// ============================================================================
// Policy Routes
// ============================================================================

/**
 * GET /v1/policies - List all policies for tenant
 */
app.get('/v1/policies', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const policies = await listPolicies(c.env.DATABASE_URL, tenantId);

    return c.json({
      success: true,
      data: policies,
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * GET /v1/policies/:id - Get a single policy
 */
app.get('/v1/policies/:id', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const policyId = c.req.param('id');

    const policy = await getPolicy(c.env.DATABASE_URL, tenantId, policyId);

    if (!policy) {
      return c.json({
        success: false,
        error: 'Policy not found',
      }, 404);
    }

    return c.json({
      success: true,
      data: policy,
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * POST /v1/policies - Create a new policy
 */
app.post('/v1/policies', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const body = await c.req.json();

    // Validate input
    const validated = CreatePolicySchema.parse({
      ...body,
      tenant_id: tenantId,
    });

    const policy = await createPolicy(c.env.DATABASE_URL, validated, c.env.CACHE);

    return c.json({
      success: true,
      data: policy,
    }, 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, 400);
    }
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * PUT /v1/policies/:id - Update a policy
 */
app.put('/v1/policies/:id', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const policyId = c.req.param('id');
    const body = await c.req.json();

    // Validate input
    const validated = UpdatePolicySchema.parse(body);

    const policy = await updatePolicy(c.env.DATABASE_URL, tenantId, policyId, validated, c.env.CACHE);

    if (!policy) {
      return c.json({
        success: false,
        error: 'Policy not found',
      }, 404);
    }

    return c.json({
      success: true,
      data: policy,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, 400);
    }
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * DELETE /v1/policies/:id - Deactivate a policy (soft delete)
 */
app.delete('/v1/policies/:id', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const policyId = c.req.param('id');

    const success = await deactivatePolicy(c.env.DATABASE_URL, tenantId, policyId, c.env.CACHE);

    if (!success) {
      return c.json({
        success: false,
        error: 'Policy not found',
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Policy deactivated',
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

// ============================================================================
// Policy Check Routes
// ============================================================================

/**
 * POST /v1/check - Check if an action can be executed
 * 
 * Best Practice: Propagates correlation_id for full request tracing
 */
app.post('/v1/check', async (c) => {
  const correlationId = getCorrelationId(c);

  try {
    const tenantId = getTenantId(c);
    const userId = getUserId(c);
    const userRoles = getUserRoles(c);
    const body = await c.req.json();

    logWithContext(correlationId, 'info', 'Governance check requested', {
      action_type: body.action_type,
      priority: body.priority,
      user_id: userId,
    });

    // Validate input
    const action = ActionCheckSchema.parse(body);

    const result = await canExecute(
      c.env.DATABASE_URL,
      tenantId,
      userId,
      userRoles,
      action,
      c.env.CACHE
    );

    // Log the check decision with correlation_id
    await logDecision(c.env.DATABASE_URL, {
      tenant_id: tenantId,
      policy_id: result.policy_id,
      user_id: userId,
      decision: result.auto_approved ? 'auto_approved' : (result.allowed ? 'allowed' : 'denied'),
      reason: result.reason,
      action_type: action.action_type,
      correlation_id: correlationId,
      metadata: {
        priority: action.priority,
        evidence_ref_count: action.evidence_ref_count,
        user_roles: userRoles,
      },
    }, c.env.SIGNATURE_KEY || 'dev-secret');

    logWithContext(correlationId, 'info', 'Governance check completed', {
      allowed: result.allowed,
      auto_approved: result.auto_approved,
      reason: result.reason,
    });

    return c.json({
      success: true,
      data: result,
      correlation_id: correlationId,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logWithContext(correlationId, 'warn', 'Governance validation error', {
        errors: error.errors,
      });
      return c.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
        correlation_id: correlationId,
      }, 400);
    }
    logWithContext(correlationId, 'error', 'Governance check error', {
      error: error.message,
    });
    return c.json({
      success: false,
      error: error.message,
      correlation_id: correlationId,
    }, 400);
  }
});

// ============================================================================
// Approval Workflow Routes
// ============================================================================

/**
 * POST /v1/approve - Approve an action
 */
app.post('/v1/approve', async (c) => {
  try {
    const userId = getUserId(c);
    const body = await c.req.json();

    // Validate input
    const { action_id, reason } = ApproveActionSchema.parse(body);

    await approveAction(c.env.DATABASE_URL, action_id, userId, c.env.SIGNATURE_KEY || 'dev-secret', reason);

    return c.json({
      success: true,
      message: 'Action approved',
      data: { action_id },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, 400);
    }
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * POST /v1/reject - Reject an action
 */
app.post('/v1/reject', async (c) => {
  try {
    const userId = getUserId(c);
    const body = await c.req.json();

    // Validate input
    const { action_id, reason } = RejectActionSchema.parse(body);

    await rejectAction(c.env.DATABASE_URL, action_id, userId, c.env.SIGNATURE_KEY || 'dev-secret', reason);

    return c.json({
      success: true,
      message: 'Action rejected',
      data: { action_id },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, 400);
    }
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * GET /v1/pending - Get pending actions for approval
 */
app.get('/v1/pending', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const limit = parseInt(c.req.query('limit') || '50');

    const actions = await getPendingActions(c.env.DATABASE_URL, tenantId, limit);

    return c.json({
      success: true,
      data: actions,
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

// ============================================================================
// Audit Routes
// ============================================================================

/**
 * GET /v1/audit - Get audit log entries
 */
app.get('/v1/audit', async (c) => {
  try {
    const tenantId = getTenantId(c);

    // Parse query parameters
    const filters = AuditFiltersSchema.parse({
      action_id: c.req.query('action_id'),
      policy_id: c.req.query('policy_id'),
      user_id: c.req.query('user_id'),
      decision: c.req.query('decision'),
      action_type: c.req.query('action_type'),
      from_date: c.req.query('from_date'),
      to_date: c.req.query('to_date'),
      limit: c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined,
      offset: c.req.query('offset') ? parseInt(c.req.query('offset')!) : undefined,
    });

    const entries = await getAuditLog(c.env.DATABASE_URL, tenantId, filters);

    return c.json({
      success: true,
      data: entries,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, 400);
    }
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

/**
 * GET /v1/audit/summary - Get audit summary statistics
 */
app.get('/v1/audit/summary', async (c) => {
  try {
    const tenantId = getTenantId(c);
    const days = parseInt(c.req.query('days') || '30');

    const summary = await getAuditSummary(c.env.DATABASE_URL, tenantId, days);

    return c.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
    }, 400);
  }
});

// ============================================================================
// Export
// ============================================================================
export default app;
