/**
 * Audit Service - logs audit events via the Govern service
 */
import { govern } from '@/lib/db';

export type ClientInfo = {
  ipAddress?: string;
  userAgent?: string;
};

export type AuditEvent = {
  actor_user_id?: string;
  org_id?: string;
  workspace_id?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  payload?: unknown;
  ip_address?: string;
  user_agent?: string;
  correlation_id?: string;
  created_at?: string;
};

export function generateCorrelationId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function extractClientInfo(request: Request): ClientInfo {
  const headers = request.headers;

  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');

  return {
    ipAddress: (forwardedFor?.split(',')[0] || realIp || undefined)?.trim() || undefined,
    userAgent: headers.get('user-agent') || undefined,
  };
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await govern.post('/audit/log', {
      actor_user_id: event.actor_user_id ?? null,
      org_id: event.org_id ?? null,
      workspace_id: event.workspace_id ?? null,
      action: event.action,
      target_type: event.target_type ?? null,
      target_id: event.target_id ?? null,
      payload: event.payload ?? null,
      ip_address: event.ip_address ?? null,
      user_agent: event.user_agent ?? null,
      correlation_id: event.correlation_id ?? null,
      created_at: event.created_at ?? new Date().toISOString(),
    });
  } catch (error) {
    // Audit logging must never block core flows
    console.warn('audit log failed', error);
  }
}
