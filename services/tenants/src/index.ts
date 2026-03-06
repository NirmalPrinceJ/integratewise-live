/**
 * Tenants Service
 * 
 * Multi-tenant context resolution, tenant CRUD, invitation system,
 * SSO configuration, and tenant management API for IntegrateWise OS.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';
import { resolveTenantContext, extractTenantId, getPlanLimits, getTenantBySlug } from './context';
import type { Env } from './context';
import type { Plan, TenantStatus, UserStatus, WorkspaceType } from './types';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'tenants', version: 'v1.0' });
});

// ============================================================================
// TENANT CONTEXT RESOLUTION
// ============================================================================

/**
 * GET /context
 * Get tenant context for current request
 */
app.get('/context', async (c) => {
  try {
    const context = await resolveTenantContext(c.req.raw, c.env);
    return c.json(context);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

/**
 * GET /resolve/:slug
 * Resolve tenant ID from slug (for subdomain routing)
 */
app.get('/resolve/:slug', async (c) => {
  const slug = c.req.param('slug');
  
  try {
    const tenantId = await getTenantBySlug(slug, c.env);
    
    if (!tenantId) {
      return c.json({ error: 'Tenant not found' }, 404);
    }
    
    return c.json({ tenant_id: tenantId, slug });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /limits/:plan
 * Get plan limits for a specific plan
 */
app.get('/limits/:plan', (c) => {
  const plan = c.req.param('plan') as Plan;
  const validPlans = ['personal', 'team', 'org', 'enterprise'];
  
  if (!validPlans.includes(plan)) {
    return c.json({ error: 'Invalid plan' }, 400);
  }
  
  const limits = getPlanLimits(plan);
  return c.json({ plan, limits });
});

// ============================================================================
// TENANT CRUD
// ============================================================================

/**
 * GET /v1/tenants/:tenantId
 * Get full tenant details
 */
app.get('/v1/tenants/:tenantId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');

  // Tenants can only access their own data
  if (requestingTenantId && requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  try {
    const result = await sql`
      SELECT 
        t.*,
        s.plan as subscription_plan,
        s.status as subscription_status,
        s.current_period_end,
        s.trial_end
      FROM tenants t
      LEFT JOIN subscriptions s ON t.id = s.tenant_id AND s.status IN ('active', 'trialing')
      WHERE t.id = ${tenantId}
    `;

    if (!result || result.length === 0) {
      return c.json({ error: 'Tenant not found' }, 404);
    }

    return c.json({ tenant: result[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * PATCH /v1/tenants/:tenantId
 * Update tenant settings (self-service)
 */
app.patch('/v1/tenants/:tenantId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');
  const body = await c.req.json();

  // Tenants can only update their own data
  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // Self-service updates are limited
  const allowedFields = ['name', 'settings', 'metadata'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = $${values.length + 1}`);
      values.push(key === 'settings' || key === 'metadata' ? JSON.stringify(value) : value);
    }
  }

  if (updates.length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400);
  }

  try {
    updates.push(`updated_at = NOW()`);
    values.push(tenantId);

    const query = `UPDATE tenants SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const result = await sql(query, values);

    return c.json({ success: true, tenant: result[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// WORKSPACE MANAGEMENT
// ============================================================================

/**
 * GET /v1/tenants/:tenantId/workspaces
 * List workspaces for a tenant
 */
app.get('/v1/tenants/:tenantId/workspaces', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  try {
    const workspaces = await sql`
      SELECT * FROM workspaces 
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    return c.json({ workspaces });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /v1/tenants/:tenantId/workspaces
 * Create a new workspace
 */
app.post('/v1/tenants/:tenantId/workspaces', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');
  const body = await c.req.json();

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  const { name, type = 'production' as WorkspaceType, settings = {} } = body;

  if (!name) {
    return c.json({ error: 'name is required' }, 400);
  }

  try {
    const workspaceId = crypto.randomUUID();

    await sql`
      INSERT INTO workspaces (id, tenant_id, name, type, settings)
      VALUES (${workspaceId}, ${tenantId}, ${name}, ${type}, ${JSON.stringify(settings)})
    `;

    return c.json({
      success: true,
      workspace: { id: workspaceId, tenant_id: tenantId, name, type, settings }
    }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DELETE /v1/tenants/:tenantId/workspaces/:workspaceId
 * Delete a workspace
 */
app.delete('/v1/tenants/:tenantId/workspaces/:workspaceId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const workspaceId = c.req.param('workspaceId');
  const requestingTenantId = c.req.header('x-tenant-id');

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  try {
    // Check if it's the only workspace
    const count = await sql`
      SELECT COUNT(*) as total FROM workspaces WHERE tenant_id = ${tenantId}
    `;
    
    if (parseInt(count[0]?.total || '0') <= 1) {
      return c.json({ error: 'Cannot delete the only workspace' }, 400);
    }

    await sql`
      DELETE FROM workspaces 
      WHERE id = ${workspaceId} AND tenant_id = ${tenantId}
    `;

    return c.json({ success: true, deleted: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// USER INVITATION SYSTEM
// ============================================================================

/**
 * GET /v1/tenants/:tenantId/users
 * List users for a tenant
 */
app.get('/v1/tenants/:tenantId/users', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  try {
    const users = await sql`
      SELECT id, email, name, avatar_url, status, last_seen_at, metadata, created_at
      FROM tenant_users 
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    return c.json({ users });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /v1/tenants/:tenantId/invitations
 * Invite a new user to the tenant
 */
app.post('/v1/tenants/:tenantId/invitations', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');
  const body = await c.req.json();

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  const { email, role = 'member', name } = body;

  if (!email) {
    return c.json({ error: 'email is required' }, 400);
  }

  try {
    // Check plan limits
    const context = await resolveTenantContext(c.req.raw, c.env);
    const currentUserCount = await sql`
      SELECT COUNT(*) as total FROM tenant_users WHERE tenant_id = ${tenantId}
    `;
    
    if (parseInt(currentUserCount[0]?.total || '0') >= context.limits.users) {
      return c.json({ 
        error: 'User limit reached for your plan',
        limit: context.limits.users,
        upgrade_url: '/upgrade'
      }, 403);
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM tenant_users WHERE tenant_id = ${tenantId} AND email = ${email}
    `;
    
    if (existing.length > 0) {
      return c.json({ error: 'User already exists in this tenant' }, 409);
    }

    // Create invitation token
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create user with invited status
    const userId = crypto.randomUUID();
    const metadata = { role, invitation_token: invitationToken, invitation_expires_at: expiresAt.toISOString() };

    await sql`
      INSERT INTO tenant_users (id, tenant_id, email, name, status, metadata)
      VALUES (${userId}, ${tenantId}, ${email}, ${name || null}, 'invited', ${JSON.stringify(metadata)})
    `;

    // In production, send invitation email here
    // await sendInvitationEmail(email, invitationToken, tenantId);

    return c.json({
      success: true,
      invitation: {
        id: userId,
        email,
        role,
        status: 'invited',
        expires_at: expiresAt.toISOString(),
        // Include token only for testing; in production, send via email
        token: invitationToken
      }
    }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /v1/invitations/accept
 * Accept an invitation (public endpoint)
 */
app.post('/v1/invitations/accept', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const body = await c.req.json();

  const { token, name } = body;

  if (!token) {
    return c.json({ error: 'token is required' }, 400);
  }

  try {
    // Find user with this invitation token
    const result = await sql`
      SELECT * FROM tenant_users 
      WHERE status = 'invited' 
      AND metadata->>'invitation_token' = ${token}
    `;

    if (!result || result.length === 0) {
      return c.json({ error: 'Invalid or expired invitation' }, 404);
    }

    const user = result[0] as any;
    const expiresAt = new Date(user.metadata?.invitation_expires_at);

    if (expiresAt < new Date()) {
      return c.json({ error: 'Invitation has expired' }, 410);
    }

    // Activate user
    const updatedMetadata = { ...user.metadata };
    delete updatedMetadata.invitation_token;
    delete updatedMetadata.invitation_expires_at;

    await sql`
      UPDATE tenant_users 
      SET status = 'active', 
          name = COALESCE(${name}, name),
          metadata = ${JSON.stringify(updatedMetadata)},
          updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return c.json({
      success: true,
      user: {
        id: user.id,
        tenant_id: user.tenant_id,
        email: user.email,
        status: 'active'
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DELETE /v1/tenants/:tenantId/users/:userId
 * Remove a user from the tenant
 */
app.delete('/v1/tenants/:tenantId/users/:userId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const userId = c.req.param('userId');
  const requestingTenantId = c.req.header('x-tenant-id');
  const requestingUserId = c.req.header('x-user-id');

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // Users cannot remove themselves
  if (requestingUserId === userId) {
    return c.json({ error: 'Cannot remove yourself' }, 400);
  }

  try {
    // Check if user is the owner
    const user = await sql`
      SELECT metadata FROM tenant_users WHERE id = ${userId} AND tenant_id = ${tenantId}
    `;
    
    if (user.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    if ((user[0] as any).metadata?.role === 'owner') {
      return c.json({ error: 'Cannot remove the tenant owner' }, 400);
    }

    await sql`
      DELETE FROM tenant_users WHERE id = ${userId} AND tenant_id = ${tenantId}
    `;

    return c.json({ success: true, deleted: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// SSO CONFIGURATION
// ============================================================================

/**
 * GET /v1/tenants/:tenantId/sso
 * Get SSO configuration for a tenant
 */
app.get('/v1/tenants/:tenantId/sso', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  try {
    const result = await sql`
      SELECT settings->'sso' as sso FROM tenants WHERE id = ${tenantId}
    `;

    if (!result || result.length === 0) {
      return c.json({ error: 'Tenant not found' }, 404);
    }

    const sso = (result[0] as any)?.sso || { enabled: false };
    
    // Mask sensitive data
    if (sso.client_secret) {
      sso.client_secret = '********';
    }

    return c.json({ sso });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * PUT /v1/tenants/:tenantId/sso
 * Configure SSO for a tenant (enterprise feature)
 */
app.put('/v1/tenants/:tenantId/sso', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');
  const body = await c.req.json();

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // Check if plan supports SSO
  try {
    const context = await resolveTenantContext(c.req.raw, c.env);
    if (context.plan !== 'enterprise' && context.plan !== 'org') {
      return c.json({ 
        error: 'SSO is available on Org and Enterprise plans',
        upgrade_url: '/upgrade'
      }, 403);
    }
  } catch {
    return c.json({ error: 'Could not verify plan' }, 500);
  }

  const {
    enabled = false,
    provider, // 'okta', 'azure_ad', 'google', 'saml'
    domain,
    client_id,
    client_secret,
    issuer_url,
    metadata_url,
    enforce = false // Force all users to use SSO
  } = body;

  const ssoConfig = {
    enabled,
    provider,
    domain,
    client_id,
    client_secret,
    issuer_url,
    metadata_url,
    enforce,
    configured_at: new Date().toISOString()
  };

  try {
    await sql`
      UPDATE tenants 
      SET settings = jsonb_set(COALESCE(settings, '{}')::jsonb, '{sso}', ${JSON.stringify(ssoConfig)}::jsonb),
          updated_at = NOW()
      WHERE id = ${tenantId}
    `;

    // Mask secret in response
    const responseConfig = { ...ssoConfig, client_secret: '********' };

    return c.json({ success: true, sso: responseConfig });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// USAGE & LIMITS
// ============================================================================

/**
 * GET /v1/tenants/:tenantId/usage
 * Get usage metrics for a tenant
 */
app.get('/v1/tenants/:tenantId/usage', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const tenantId = c.req.param('tenantId');
  const requestingTenantId = c.req.header('x-tenant-id');

  if (requestingTenantId !== tenantId) {
    return c.json({ error: 'Access denied' }, 403);
  }

  try {
    const context = await resolveTenantContext(c.req.raw, c.env);

    // Get current usage
    const usage = await sql`
      SELECT 
        (SELECT COUNT(*) FROM tenant_users WHERE tenant_id = ${tenantId} AND status = 'active') as users,
        (SELECT COUNT(*) FROM connectors WHERE tenant_id = ${tenantId}) as connectors,
        (SELECT COUNT(*) FROM iq_sessions WHERE tenant_id = ${tenantId} AND created_at > NOW() - INTERVAL '30 days') as ai_sessions_30d
    `;

    const currentUsage = usage[0] as any || { users: 0, connectors: 0, ai_sessions_30d: 0 };

    return c.json({
      plan: context.plan,
      limits: context.limits,
      usage: {
        users: {
          current: parseInt(currentUsage.users),
          limit: context.limits.users,
          percentage: Math.round((parseInt(currentUsage.users) / context.limits.users) * 100)
        },
        connectors: {
          current: parseInt(currentUsage.connectors),
          limit: context.limits.connectors,
          percentage: context.limits.connectors === Infinity ? 0 : Math.round((parseInt(currentUsage.connectors) / context.limits.connectors) * 100)
        },
        ai_sessions: {
          current: parseInt(currentUsage.ai_sessions_30d),
          limit: context.limits.aiSessions,
          percentage: context.limits.aiSessions === Infinity ? 0 : Math.round((parseInt(currentUsage.ai_sessions_30d) / context.limits.aiSessions) * 100)
        }
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================================
// CONNECTOR OAUTH & STATUS (Phase 1 — Token Circuit)
// ============================================================================

/**
 * Supabase client helper — uses service role key for backend access.
 * Writes to the Supabase `connectors` table (which has RLS + service_role policy).
 */
function supabaseAdmin(env: Env) {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    async query(sql: string, params?: Record<string, unknown>) {
      // Use Supabase REST API (PostgREST) for simple ops
      throw new Error('Use rpc/rest helpers below');
    },
    /** SELECT rows from a table with filters */
    async select(table: string, filters: Record<string, string>, columns = '*') {
      const filterParts = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`);
      const qs = filterParts.join('&');
      const res = await fetch(`${url}/rest/v1/${table}?${qs}&select=${columns}`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Supabase select failed: ${res.status} ${await res.text()}`);
      return res.json() as Promise<any[]>;
    },
    /** UPSERT a row (insert or update on conflict) */
    async upsert(table: string, data: Record<string, unknown>, onConflict: string) {
      const res = await fetch(`${url}/rest/v1/${table}?on_conflict=${onConflict}`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Supabase upsert failed: ${res.status} ${await res.text()}`);
      return res.json();
    },
    /** UPDATE rows matching filters */
    async update(table: string, filters: Record<string, string>, data: Record<string, unknown>) {
      const filterParts = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`);
      const qs = filterParts.join('&');
      const res = await fetch(`${url}/rest/v1/${table}?${qs}`, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Supabase update failed: ${res.status} ${await res.text()}`);
      return res.json();
    },
  };
}

/**
 * Token exchange endpoints per provider.
 * Each provider has a slightly different token URL and payload format.
 */
const TOKEN_ENDPOINTS: Record<string, { url: string; getBody: (code: string, redirectUri: string, clientId: string, clientSecret: string) => Record<string, string> }> = {
  hubspot: {
    url: 'https://api.hubapi.com/oauth/v1/token',
    getBody: (code, redirectUri, clientId, clientSecret) => ({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  },
  slack: {
    url: 'https://slack.com/api/oauth.v2.access',
    getBody: (code, redirectUri, clientId, clientSecret) => ({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  },
  github: {
    url: 'https://github.com/login/oauth/access_token',
    getBody: (code, redirectUri, clientId, clientSecret) => ({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  },
  google: {
    url: 'https://oauth2.googleapis.com/token',
    getBody: (code, redirectUri, clientId, clientSecret) => ({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  },
  notion: {
    url: 'https://api.notion.com/v1/oauth/token',
    getBody: (code, redirectUri, clientId, clientSecret) => ({
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    }),
  },
  salesforce: {
    url: 'https://login.salesforce.com/services/oauth2/token',
    getBody: (code, redirectUri, clientId, clientSecret) => ({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  },
};

/**
 * Resolve OAuth client credentials from env for a given provider.
 */
function getOAuthCreds(provider: string, env: Env): { clientId: string; clientSecret: string } | null {
  const map: Record<string, [string, string]> = {
    hubspot: [env.HUBSPOT_CLIENT_ID, env.HUBSPOT_CLIENT_SECRET],
    slack: [env.SLACK_CLIENT_ID, env.SLACK_CLIENT_SECRET],
    github: [env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET],
    google: [env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET],
    notion: [env.NOTION_CLIENT_ID, env.NOTION_CLIENT_SECRET],
    salesforce: [env.SALESFORCE_CLIENT_ID, env.SALESFORCE_CLIENT_SECRET],
  };
  const pair = map[provider];
  if (!pair || !pair[0] || !pair[1]) return null;
  return { clientId: pair[0], clientSecret: pair[1] };
}

/**
 * OAuth Authorization URLs per provider.
 * Used by GET /v1/connectors/:provider/authorize to build the redirect URL.
 */
const AUTH_URLS: Record<string, (clientId: string, redirectUri: string, state: string) => string> = {
  hubspot: (clientId, redirectUri, state) =>
    `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=crm.objects.contacts.read%20crm.objects.deals.read%20crm.objects.companies.read&state=${state}`,
  slack: (clientId, redirectUri, state) =>
    `https://slack.com/oauth/v2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=channels:read,chat:write,users:read&state=${state}`,
  github: (clientId, redirectUri, state) =>
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user,repo&state=${state}`,
  google: (clientId, redirectUri, state) =>
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly')}&access_type=offline&prompt=consent&state=${state}`,
  notion: (clientId, redirectUri, state) =>
    `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&owner=user&state=${state}`,
  salesforce: (clientId, redirectUri, state) =>
    `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`,
};

/**
 * GET /v1/connectors/:provider/authorize
 * Generates OAuth authorization URL and returns it (frontend redirects).
 * Generates a CSRF state token stored ephemerally.
 */
app.get('/v1/connectors/:provider/authorize', async (c) => {
  const provider = c.req.param('provider');
  const origin = c.req.query('origin') || c.req.header('X-Origin') || 'https://app.integratewise.ai';

  const buildUrl = AUTH_URLS[provider];
  if (!buildUrl) {
    return c.json({ error: `Unsupported provider: ${provider}` }, 400);
  }

  const creds = getOAuthCreds(provider, c.env);
  if (!creds) {
    return c.json({ error: `OAuth credentials not configured for ${provider}` }, 500);
  }

  // Generate CSRF state token
  const state = crypto.randomUUID();
  const redirectUri = `${origin}/oauth/callback/${provider}`;
  const authUrl = buildUrl(creds.clientId, redirectUri, state);

  return c.json({ authUrl, state, provider });
});

/**
 * GET /v1/connectors/:provider/callback
 * OAuth callback — exchanges code for tokens, stores in Supabase `connectors` table.
 */
app.get('/v1/connectors/:provider/callback', async (c) => {
  const provider = c.req.param('provider');
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  const origin = c.req.header('X-Origin') || 'https://app.integratewise.ai';
  const expectedState = c.req.header('X-OAuth-State');

  // Error from provider
  if (error) {
    return c.json(
      { error: `OAuth denied: ${error}` },
      { status: 400, headers: { 'X-Redirect-URL': `${origin}/integrations?error=${error}` } }
    );
  }

  if (!code) {
    return c.json({ error: 'Missing authorization code' }, 400);
  }

  // CSRF state verification
  if (expectedState && state !== expectedState) {
    return c.json(
      { error: 'State mismatch — possible CSRF' },
      { status: 403, headers: { 'X-Redirect-URL': `${origin}/integrations?error=state_mismatch` } }
    );
  }

  const tokenConfig = TOKEN_ENDPOINTS[provider];
  if (!tokenConfig) {
    return c.json({ error: `Unsupported provider: ${provider}` }, 400);
  }

  const creds = getOAuthCreds(provider, c.env);
  if (!creds) {
    return c.json({ error: `OAuth credentials not configured for ${provider}` }, 500);
  }

  const redirectUri = `${origin}/api/connectors/${provider}/callback`;

  try {
    // --- Token Exchange ---
    const tokenBody = tokenConfig.getBody(code, redirectUri, creds.clientId, creds.clientSecret);

    const isNotion = provider === 'notion';
    const tokenHeaders: Record<string, string> = {
      'Content-Type': provider === 'github' ? 'application/json' : 'application/x-www-form-urlencoded',
    };
    if (provider === 'github') {
      tokenHeaders['Accept'] = 'application/json';
    }
    if (isNotion) {
      // Notion uses Basic auth
      tokenHeaders['Authorization'] = `Basic ${btoa(`${creds.clientId}:${creds.clientSecret}`)}`;
      tokenHeaders['Content-Type'] = 'application/json';
    }

    const body = provider === 'github' || isNotion
      ? JSON.stringify(tokenBody)
      : new URLSearchParams(tokenBody).toString();

    const tokenRes = await fetch(tokenConfig.url, {
      method: 'POST',
      headers: tokenHeaders,
      body,
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error(`[connectors] Token exchange failed for ${provider}:`, errText);
      return c.json(
        { error: 'Token exchange failed' },
        { status: 502, headers: { 'X-Redirect-URL': `${origin}/integrations?error=token_exchange_failed` } }
      );
    }

    const tokens: any = await tokenRes.json();

    // Normalize token fields (each provider returns different shapes)
    const accessToken = tokens.access_token || tokens.authed_user?.access_token;
    const refreshToken = tokens.refresh_token || null;
    const expiresIn = tokens.expires_in ? Number(tokens.expires_in) : null;
    const tokenType = tokens.token_type || 'bearer';
    const scopes = tokens.scope
      ? (typeof tokens.scope === 'string' ? tokens.scope.split(/[,\s]+/) : tokens.scope)
      : [];

    // Provider-specific identity extraction
    let providerUserId: string | null = null;
    let providerWorkspaceId: string | null = null;
    let providerWorkspaceName: string | null = null;

    if (provider === 'slack') {
      providerUserId = tokens.authed_user?.id;
      providerWorkspaceId = tokens.team?.id;
      providerWorkspaceName = tokens.team?.name;
    } else if (provider === 'notion') {
      providerWorkspaceId = tokens.workspace_id;
      providerWorkspaceName = tokens.workspace_name;
      providerUserId = tokens.owner?.user?.id;
    } else if (provider === 'hubspot') {
      providerUserId = String(tokens.hub_id || tokens.user_id || '');
    } else if (provider === 'github') {
      // Fetch user profile to get ID
      try {
        const userRes = await fetch('https://api.github.com/user', {
          headers: { 'Authorization': `Bearer ${accessToken}`, 'User-Agent': 'IntegrateWise' },
        });
        if (userRes.ok) {
          const user: any = await userRes.json();
          providerUserId = String(user.id);
        }
      } catch { /* optional */ }
    }

    // Extract user_id and tenant_id from request headers (set by auth middleware)
    const userId = c.req.header('x-user-id') || c.req.header('x-spine-context-user-id');
    const tenantId = c.req.header('x-tenant-id') || c.req.header('x-spine-context-tenant-id');

    if (!userId) {
      return c.json(
        { error: 'User not authenticated' },
        { status: 401, headers: { 'X-Redirect-URL': `${origin}/integrations?error=not_authenticated` } }
      );
    }

    // --- Store Tokens ---
    const sb = supabaseAdmin(c.env);
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    await sb.upsert('connectors', {
      user_id: userId,
      tenant_id: tenantId || null,
      provider,
      status: 'connected',
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      expires_at: expiresAt,
      provider_user_id: providerUserId,
      provider_workspace_id: providerWorkspaceId,
      provider_workspace_name: providerWorkspaceName,
      scopes,
      sync_enabled: true,
      metadata: {
        connected_at: new Date().toISOString(),
        raw_scopes: tokens.scope,
      },
    }, 'user_id,provider');

    console.log(`[connectors] ✅ ${provider} connected for user ${userId}`);

    // Redirect back to integrations page with success
    return c.json(
      { success: true, provider },
      { headers: { 'X-Redirect-URL': `${origin}/integrations?connected=${provider}` } }
    );

  } catch (err: any) {
    console.error(`[connectors] callback error for ${provider}:`, err);
    return c.json(
      { error: err.message },
      { status: 500, headers: { 'X-Redirect-URL': `${origin}/integrations?error=internal` } }
    );
  }
});

/**
 * POST /v1/connectors/:provider/disconnect
 * Revokes connection — clears tokens, sets status to 'disconnected'.
 */
app.post('/v1/connectors/:provider/disconnect', async (c) => {
  const provider = c.req.param('provider');
  const userId = c.req.header('x-user-id') || c.req.header('x-spine-context-user-id');

  if (!userId) {
    return c.json({ error: 'User not authenticated' }, 401);
  }

  try {
    const sb = supabaseAdmin(c.env);
    await sb.update('connectors', { user_id: userId, provider }, {
      status: 'disconnected',
      access_token: null,
      refresh_token: null,
      expires_at: null,
      sync_enabled: false,
      metadata: { disconnected_at: new Date().toISOString() },
    });

    return c.json({ success: true, provider, status: 'disconnected' });
  } catch (err: any) {
    console.error(`[connectors] disconnect error for ${provider}:`, err);
    return c.json({ error: err.message }, 500);
  }
});

/**
 * GET /v1/connectors/:provider/status
 * Returns current connection status for a single provider.
 */
app.get('/v1/connectors/:provider/status', async (c) => {
  const provider = c.req.param('provider');
  const userId = c.req.header('x-user-id') || c.req.header('x-spine-context-user-id');

  if (!userId) {
    return c.json({ error: 'User not authenticated' }, 401);
  }

  try {
    const sb = supabaseAdmin(c.env);
    const rows = await sb.select('connectors', { user_id: userId, provider });

    if (!rows || rows.length === 0) {
      return c.json({ provider, status: 'not_connected' });
    }

    const conn = rows[0];
    return c.json({
      provider,
      status: conn.status,
      provider_workspace_name: conn.provider_workspace_name,
      last_sync_at: conn.last_sync_at,
      sync_enabled: conn.sync_enabled,
      sync_error: conn.sync_error,
      connected_at: conn.metadata?.connected_at,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * GET /v1/connectors/list
 * Returns all connectors for the authenticated user.
 */
app.get('/v1/connectors/list', async (c) => {
  const userId = c.req.header('x-user-id') || c.req.header('x-spine-context-user-id');

  if (!userId) {
    return c.json({ error: 'User not authenticated' }, 401);
  }

  try {
    const sb = supabaseAdmin(c.env);
    const rows = await sb.select(
      'connectors',
      { user_id: userId },
      'provider,status,provider_workspace_name,last_sync_at,sync_enabled,sync_error,metadata'
    );

    return c.json({ connectors: rows || [] });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ============================================================================
// MIDDLEWARE EXPORT (for Gateway)
// ============================================================================

/**
 * Middleware to resolve tenant context
 * Used by the Gateway service for request routing
 */
export async function tenantMiddleware(
  request: Request,
  env: Env
): Promise<Response | null> {
  try {
    const context = await resolveTenantContext(request, env);
    
    // Add tenant context to request headers for downstream services
    const newHeaders = new Headers(request.headers);
    newHeaders.set('x-tenant-id', context.tenantId);
    newHeaders.set('x-workspace-id', context.workspaceId);
    newHeaders.set('x-tenant-plan', context.plan);
    newHeaders.set('x-tenant-features', context.features.join(','));
    
    return null; // Continue to next handler
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export default app;
