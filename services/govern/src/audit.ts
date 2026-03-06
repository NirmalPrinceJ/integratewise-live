import { neon } from '@neondatabase/serverless';
import type { AuditEntry, AuditFilters } from './types';

// ============================================================================
// Audit Logging
// ============================================================================

/**
 * Sign data using a secret key (HMAC SHA-256)
 */
async function signData(data: any, secret: string): Promise<string> {
  const msg = JSON.stringify(data);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(msg);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, dataToSign);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Log a governance decision to the audit log
 * 
 * Best Practice: Includes correlation_id for full request tracing
 * Trust Layer: Digitally signs every entry for tamper-proofing
 */
export async function logDecision(
  dbUrl: string,
  entry: Omit<AuditEntry, 'id' | 'created_at' | 'signature'> & { correlation_id?: string },
  signatureKey: string
): Promise<AuditEntry> {
  const sql = neon(dbUrl);

  // 1. Generate Signature for the trust layer
  const signature = await signData({
    tenant_id: entry.tenant_id,
    user_id: entry.user_id,
    decision: entry.decision,
    correlation_id: entry.correlation_id,
    action_type: entry.action_type
  }, signatureKey);

  const result = await sql`
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
      signature
    ) VALUES (
      ${entry.tenant_id},
      ${entry.action_id || null},
      ${entry.policy_id || null},
      ${entry.user_id},
      ${entry.decision},
      ${entry.reason || null},
      ${entry.action_type || null},
      ${entry.metadata ? JSON.stringify(entry.metadata) : null},
      ${entry.correlation_id || null},
      ${signature}
    )
    RETURNING 
      id, tenant_id, action_id, policy_id, user_id,
      decision, reason, action_type, metadata, created_at, correlation_id, signature
  `;

  return result[0] as AuditEntry;
}

/**
 * Get audit log entries with filtering
 */
export async function getAuditLog(
  dbUrl: string,
  tenant_id: string,
  filters: AuditFilters = { limit: 100, offset: 0 }
): Promise<AuditEntry[]> {
  const sql = neon(dbUrl);
  const limit = filters.limit || 100;
  const offset = filters.offset || 0;

  // Build the query with optional filters
  // For complex dynamic queries, you might want to use a query builder
  // This is a simplified implementation

  if (filters.action_id) {
    const result = await sql`
      SELECT 
        id, tenant_id, action_id, policy_id, user_id,
        decision, reason, action_type, metadata, created_at
      FROM governance_audit_log
      WHERE tenant_id = ${tenant_id}
        AND action_id = ${filters.action_id}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return result as AuditEntry[];
  }

  if (filters.policy_id) {
    const result = await sql`
      SELECT 
        id, tenant_id, action_id, policy_id, user_id,
        decision, reason, action_type, metadata, created_at
      FROM governance_audit_log
      WHERE tenant_id = ${tenant_id}
        AND policy_id = ${filters.policy_id}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return result as AuditEntry[];
  }

  if (filters.user_id) {
    const result = await sql`
      SELECT 
        id, tenant_id, action_id, policy_id, user_id,
        decision, reason, action_type, metadata, created_at
      FROM governance_audit_log
      WHERE tenant_id = ${tenant_id}
        AND user_id = ${filters.user_id}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return result as AuditEntry[];
  }

  if (filters.decision) {
    const result = await sql`
      SELECT 
        id, tenant_id, action_id, policy_id, user_id,
        decision, reason, action_type, metadata, created_at
      FROM governance_audit_log
      WHERE tenant_id = ${tenant_id}
        AND decision = ${filters.decision}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return result as AuditEntry[];
  }

  if (filters.action_type) {
    const result = await sql`
      SELECT 
        id, tenant_id, action_id, policy_id, user_id,
        decision, reason, action_type, metadata, created_at
      FROM governance_audit_log
      WHERE tenant_id = ${tenant_id}
        AND action_type LIKE ${filters.action_type + '%'}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return result as AuditEntry[];
  }

  if (filters.from_date && filters.to_date) {
    const result = await sql`
      SELECT 
        id, tenant_id, action_id, policy_id, user_id,
        decision, reason, action_type, metadata, created_at
      FROM governance_audit_log
      WHERE tenant_id = ${tenant_id}
        AND created_at >= ${filters.from_date}::timestamptz
        AND created_at <= ${filters.to_date}::timestamptz
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    return result as AuditEntry[];
  }

  // Default: return all entries for tenant
  const result = await sql`
    SELECT 
      id, tenant_id, action_id, policy_id, user_id,
      decision, reason, action_type, metadata, created_at
    FROM governance_audit_log
    WHERE tenant_id = ${tenant_id}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return result as AuditEntry[];
}

/**
 * Get audit summary statistics for a tenant
 */
export async function getAuditSummary(
  dbUrl: string,
  tenant_id: string,
  days: number = 30
): Promise<{
  total: number;
  by_decision: Record<string, number>;
  by_action_type: Record<string, number>;
}> {
  const sql = neon(dbUrl);

  const totalResult = await sql`
    SELECT COUNT(*) as count
    FROM governance_audit_log
    WHERE tenant_id = ${tenant_id}
      AND created_at >= NOW() - INTERVAL '1 day' * ${days}
  `;

  const byDecisionResult = await sql`
    SELECT decision, COUNT(*) as count
    FROM governance_audit_log
    WHERE tenant_id = ${tenant_id}
      AND created_at >= NOW() - INTERVAL '1 day' * ${days}
    GROUP BY decision
  `;

  const byActionTypeResult = await sql`
    SELECT action_type, COUNT(*) as count
    FROM governance_audit_log
    WHERE tenant_id = ${tenant_id}
      AND created_at >= NOW() - INTERVAL '1 day' * ${days}
      AND action_type IS NOT NULL
    GROUP BY action_type
    ORDER BY count DESC
    LIMIT 20
  `;

  const byDecision: Record<string, number> = {};
  for (const row of byDecisionResult) {
    byDecision[row.decision] = Number(row.count);
  }

  const byActionType: Record<string, number> = {};
  for (const row of byActionTypeResult) {
    if (row.action_type) {
      byActionType[row.action_type] = Number(row.count);
    }
  }

  return {
    total: Number(totalResult[0]?.count || 0),
    by_decision: byDecision,
    by_action_type: byActionType,
  };
}
