import { neon } from '@neondatabase/serverless';

export interface AuditEvent {
  actor_user_id?: string;
  org_id?: string;
  workspace_id?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  payload?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  correlation_id?: string;
}

export interface GovernanceAuditEvent {
  tenant_id: string;
  action_id?: string;
  policy_id?: string;
  user_id: string;
  decision: string;
  reason?: string;
  action_type?: string;
  metadata?: Record<string, any>;
  correlation_id?: string;
  event_type?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface BillingAuditEvent {
  org_id: string;
  event_type: string;
  actor_id?: string;
  metadata?: Record<string, any>;
  correlation_id?: string;
}

/**
 * Log a general audit event to the audit_logs table
 */
export async function logAuditEvent(
  dbUrl: string,
  event: AuditEvent
): Promise<void> {
  const sql = neon(dbUrl);

  await sql`
    INSERT INTO audit_logs (
      actor_user_id,
      org_id,
      workspace_id,
      action,
      target_type,
      target_id,
      payload,
      ip_address,
      user_agent,
      correlation_id
    ) VALUES (
      ${event.actor_user_id || null},
      ${event.org_id || null},
      ${event.workspace_id || null},
      ${event.action},
      ${event.target_type || null},
      ${event.target_id || null},
      ${event.payload ? JSON.stringify(event.payload) : null},
      ${event.ip_address || null},
      ${event.user_agent || null},
      ${event.correlation_id || null}
    )
  `;
}

/**
 * Log a governance decision to the governance_audit_log table
 */
export async function logGovernanceEvent(
  dbUrl: string,
  event: GovernanceAuditEvent
): Promise<void> {
  const sql = neon(dbUrl);

  await sql`
    INSERT INTO governance_audit_log (
      tenant_id,
      action_id,
      policy_id,
      user_id,
      decision,
      reason,
      action_type,
      metadata,
      correlation_id,
      event_type,
      ip_address,
      user_agent
    ) VALUES (
      ${event.tenant_id},
      ${event.action_id || null},
      ${event.policy_id || null},
      ${event.user_id},
      ${event.decision},
      ${event.reason || null},
      ${event.action_type || null},
      ${event.metadata ? JSON.stringify(event.metadata) : null},
      ${event.correlation_id || null},
      ${event.event_type || null},
      ${event.ip_address || null},
      ${event.user_agent || null}
    )
  `;
}

/**
 * Log a billing event to the billing_audit_log table
 */
export async function logBillingEvent(
  dbUrl: string,
  event: BillingAuditEvent
): Promise<void> {
  const sql = neon(dbUrl);

  await sql`
    INSERT INTO billing_audit_log (
      org_id,
      event_type,
      actor_id,
      metadata,
      correlation_id
    ) VALUES (
      ${event.org_id},
      ${event.event_type},
      ${event.actor_id || null},
      ${event.metadata ? JSON.stringify(event.metadata) : null},
      ${event.correlation_id || null}
    )
  `;
}

/**
 * Extract client information from request headers
 */
export function extractClientInfo(request: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  const ipAddress = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

  const userAgent = request.headers.get('user-agent') || undefined;

  return {
    ipAddress: ipAddress !== 'unknown' ? ipAddress : undefined,
    userAgent
  };
}

/**
 * Generate correlation ID for request tracing
 */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Audit middleware for API routes
 */
export function createAuditMiddleware(dbUrl: string) {
  return async (request: Request, userId?: string, orgId?: string) => {
    const correlationId = generateCorrelationId();
    const clientInfo = extractClientInfo(request);

    // Log API access
    await logAuditEvent(dbUrl, {
      actor_user_id: userId,
      org_id: orgId,
      action: 'API_ACCESS',
      target_type: 'endpoint',
      target_id: request.url,
      payload: {
        method: request.method,
        path: new URL(request.url).pathname
      },
      ip_address: clientInfo.ipAddress,
      user_agent: clientInfo.userAgent,
      correlation_id: correlationId
    });

    return correlationId;
  };
}