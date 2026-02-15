/**
 * Tenant Context Utilities
 * 
 * Server-side utilities for resolving tenant context
 * Routes through L3 tenants service
 */

import { tenants } from '@/lib/db';
import type { TenantContext } from '@/clients/tenants/src/types';

/**
 * Resolve tenant context from request
 */
export async function getTenantContext(
  request: Request
): Promise<TenantContext | null> {
  // Extract tenant ID from headers
  const tenantId = request.headers.get('x-tenant-id');

  if (!tenantId) {
    return null;
  }

  try {
    // Fetch tenant context from tenants service
    const result = await tenants.get<{
      id: string;
      plan: string;
      status: string;
      settings: Record<string, unknown>;
      subscription_plan?: string;
    }>(`/v1/tenants/${tenantId}/context`);

    if (!result) {
      return null;
    }

    const plan = (result.subscription_plan || result.plan) as 'personal' | 'team' | 'org' | 'enterprise';

    // Get plan limits
    const limits = getPlanLimits(plan);

    // Get workspace ID
    const workspaceId = request.headers.get('x-workspace-id') || 'default';

    // Get enabled features
    const features = (result.settings?.features as string[]) || [];

    return {
      tenantId: result.id,
      workspaceId,
      plan,
      limits,
      features,
      settings: result.settings || {},
    };
  } catch (error) {
    console.error('Error resolving tenant context:', error);
    return null;
  }
}

/**
 * Get plan limits for a given plan
 */
function getPlanLimits(plan: string) {
  const limits = {
    personal: { users: 1, connectors: 3, aiSessions: 1000, storageGb: 5, retentionDays: 7 },
    team: { users: 25, connectors: 15, aiSessions: 10000, storageGb: 50, retentionDays: 30 },
    org: { users: 250, connectors: Infinity, aiSessions: 50000, storageGb: 500, retentionDays: 90 },
    enterprise: { users: Infinity, connectors: Infinity, aiSessions: Infinity, storageGb: Infinity, retentionDays: 2555 }
  };
  return limits[plan as keyof typeof limits] || limits.personal;
}
