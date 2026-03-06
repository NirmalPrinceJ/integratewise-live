/**
 * Tenant Context Resolver
 * 
 * Resolves tenant context from request headers, subdomain, or JWT claims
 */

import { neon } from '@neondatabase/serverless';
import type { TenantContext, PlanLimits, Plan } from './types';

export interface Env {
  DATABASE_URL: string;
  ENVIRONMENT: string;
  // Supabase (for connectors table — holds OAuth tokens)
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  // OAuth client credentials per provider
  HUBSPOT_CLIENT_ID: string;
  HUBSPOT_CLIENT_SECRET: string;
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  NOTION_CLIENT_ID: string;
  NOTION_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SALESFORCE_CLIENT_ID: string;
  SALESFORCE_CLIENT_SECRET: string;
}

/**
 * Extract tenant ID from request
 * Priority: 1. x-tenant-id header, 2. Subdomain, 3. JWT claim
 */
export function extractTenantId(request: Request): string | null {
  // 1. Check header
  const headerTenantId = request.headers.get('x-tenant-id');
  if (headerTenantId) {
    return headerTenantId;
  }

  // 2. Check subdomain (tenant.integratewise.ai)
  const url = new URL(request.url);
  const hostname = url.hostname;
  const subdomainMatch = hostname.match(/^([^.]+)\.integratewise\.ai$/);
  if (subdomainMatch) {
    return subdomainMatch[1]; // This would need to be resolved to tenant ID via lookup
  }

  // 3. JWT claim (would be implemented with actual JWT parsing)
  // const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
  // if (jwt) {
  //   const decoded = decodeJWT(jwt);
  //   return decoded.tenant_id;
  // }

  return null;
}

/**
 * Get plan limits for a given plan
 */
export function getPlanLimits(plan: Plan): PlanLimits {
  const limits: Record<Plan, PlanLimits> = {
    personal: {
      users: 1,
      connectors: 3,
      aiSessions: 1000,
      storageGb: 5,
      retentionDays: 7,
    },
    team: {
      users: 25,
      connectors: 15,
      aiSessions: 10000,
      storageGb: 50,
      retentionDays: 30,
    },
    org: {
      users: 250,
      connectors: Infinity,
      aiSessions: 50000,
      storageGb: 500,
      retentionDays: 90,
    },
    enterprise: {
      users: Infinity,
      connectors: Infinity,
      aiSessions: Infinity,
      storageGb: Infinity,
      retentionDays: 2555, // 7 years
    },
  };

  return limits[plan] || limits.personal;
}

/**
 * Resolve tenant context from request
 */
export async function resolveTenantContext(
  request: Request,
  env: Env
): Promise<TenantContext> {
  const tenantId = extractTenantId(request);
  
  if (!tenantId) {
    throw new Error('Tenant ID not found in request');
  }

  const sql = neon(env.DATABASE_URL);

  // Fetch tenant + subscription
  const result = await sql`
    SELECT 
      t.id,
      t.plan,
      t.status,
      t.settings,
      s.plan as subscription_plan,
      s.status as subscription_status,
      s.current_period_end
    FROM tenants t
    LEFT JOIN subscriptions s ON t.id = s.tenant_id AND s.status = 'active'
    WHERE t.id = ${tenantId}
    LIMIT 1
  `;

  if (!result || result.length === 0) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }

  const tenant = result[0] as any;
  const plan = (tenant.subscription_plan || tenant.plan) as Plan;
  const limits = getPlanLimits(plan);

  // Get default workspace ID (or from header)
  const workspaceId = request.headers.get('x-workspace-id') || 'default';

  // Get enabled features from settings
  const features = tenant.settings?.features || [];

  return {
    tenantId: tenant.id,
    workspaceId,
    plan,
    limits,
    features,
    settings: tenant.settings || {},
  };
}

/**
 * Get tenant by slug (for subdomain resolution)
 */
export async function getTenantBySlug(
  slug: string,
  env: Env
): Promise<string | null> {
  const sql = neon(env.DATABASE_URL);

  const result = await sql`
    SELECT id FROM tenants WHERE slug = ${slug} LIMIT 1
  `;

  if (!result || result.length === 0) {
    return null;
  }

  return (result[0] as any).id;
}
