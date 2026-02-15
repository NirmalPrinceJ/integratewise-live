/**
 * Admin Service
 * 
 * Full CRUD API for tenant management, user management, system health,
 * and administrative operations for IntegrateWise OS.
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'

type Bindings = {
  DATABASE_URL: string
  ENVIRONMENT: string
  ADMIN_API_KEY?: string
}

type Variables = {
  isAdmin: boolean
  adminId?: string
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// CORS middleware
app.use('*', cors())

// Admin auth middleware
app.use('/v1/*', async (c, next) => {
  const apiKey = c.req.header('x-admin-api-key')
  const adminToken = c.req.header('authorization')?.replace('Bearer ', '')
  
  // In production, validate against stored API keys or JWT
  if (c.env.ADMIN_API_KEY && apiKey === c.env.ADMIN_API_KEY) {
    c.set('isAdmin', true)
    c.set('adminId', 'system')
  } else if (adminToken) {
    // TODO: Validate JWT token for admin role
    c.set('isAdmin', true)
    c.set('adminId', 'jwt-user')
  } else {
    return c.json({ error: 'Unauthorized - Admin access required' }, 401)
  }
  
  await next()
})

// Health & Status
app.get('/', (c) => c.json({ 
  service: 'Admin Service', 
  version: 'v1.0',
  status: 'operational' 
}))

app.get('/health', async (c) => {
  const services = {
    admin: 'healthy',
    database: 'unknown',
    spine: 'unknown',
    think: 'unknown',
    act: 'unknown',
    knowledge: 'unknown',
    loader: 'unknown',
    normalizer: 'unknown',
    gateway: 'unknown',
    billing: 'unknown'
  }

  // Check database connection
  try {
    const sql = neon(c.env.DATABASE_URL)
    await sql`SELECT 1`
    services.database = 'healthy'
  } catch {
    services.database = 'unhealthy'
  }

  const allHealthy = Object.values(services).every(s => s === 'healthy' || s === 'unknown')
  
  return c.json({
    status: allHealthy ? 'healthy' : 'degraded',
    services,
    timestamp: new Date().toISOString()
  })
})

// ============================================================================
// TENANT MANAGEMENT
// ============================================================================

/**
 * GET /v1/tenants
 * List all tenants with pagination and filtering
 */
app.get('/v1/tenants', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')
  const status = c.req.query('status')
  const plan = c.req.query('plan')
  const search = c.req.query('search')

  try {
    let query = `
      SELECT 
        t.*,
        s.plan as subscription_plan,
        s.status as subscription_status,
        s.current_period_end,
        COUNT(DISTINCT tu.id) as user_count
      FROM tenants t
      LEFT JOIN subscriptions s ON t.id = s.tenant_id AND s.status = 'active'
      LEFT JOIN tenant_users tu ON t.id = tu.tenant_id AND tu.status = 'active'
      WHERE 1=1
    `
    
    const params: any[] = []
    
    if (status) {
      query += ` AND t.status = $${params.length + 1}`
      params.push(status)
    }
    
    if (plan) {
      query += ` AND (t.plan = $${params.length + 1} OR s.plan = $${params.length + 1})`
      params.push(plan)
    }
    
    if (search) {
      query += ` AND (t.name ILIKE $${params.length + 1} OR t.slug ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }
    
    query += ` GROUP BY t.id, s.id ORDER BY t.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const tenants = await sql(query, params)
    
    // Get total count
    const countResult = await sql`SELECT COUNT(*) as total FROM tenants`
    const total = countResult[0]?.total || 0

    return c.json({
      tenants,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (err: any) {
    console.error('Failed to list tenants:', err)
    return c.json({ error: 'Failed to list tenants', message: err.message }, 500)
  }
})

/**
 * GET /v1/tenants/:tenantId
 * Get a specific tenant with full details
 */
app.get('/v1/tenants/:tenantId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')

  try {
    const result = await sql`
      SELECT 
        t.*,
        s.id as subscription_id,
        s.plan as subscription_plan,
        s.status as subscription_status,
        s.stripe_subscription_id,
        s.stripe_customer_id,
        s.current_period_start,
        s.current_period_end,
        s.trial_start,
        s.trial_end
      FROM tenants t
      LEFT JOIN subscriptions s ON t.id = s.tenant_id AND s.status = 'active'
      WHERE t.id = ${tenantId}
    `

    if (!result || result.length === 0) {
      return c.json({ error: 'Tenant not found' }, 404)
    }

    const tenant = result[0]

    // Get users
    const users = await sql`
      SELECT id, email, name, avatar_url, status, last_seen_at, created_at
      FROM tenant_users
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `

    // Get workspaces
    const workspaces = await sql`
      SELECT id, name, type, settings, created_at
      FROM workspaces
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `

    // Get usage metrics
    const usage = await sql`
      SELECT 
        COUNT(DISTINCT tu.id) as user_count,
        (SELECT COUNT(*) FROM connectors WHERE tenant_id = ${tenantId}) as connector_count,
        (SELECT COUNT(*) FROM iq_sessions WHERE tenant_id = ${tenantId} AND created_at > NOW() - INTERVAL '30 days') as ai_sessions_30d
      FROM tenant_users tu
      WHERE tu.tenant_id = ${tenantId}
    `

    return c.json({
      tenant,
      users,
      workspaces,
      usage: usage[0] || {}
    })
  } catch (err: any) {
    console.error('Failed to get tenant:', err)
    return c.json({ error: 'Failed to get tenant', message: err.message }, 500)
  }
})

/**
 * POST /v1/tenants
 * Create a new tenant
 */
app.post('/v1/tenants', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const body = await c.req.json()

  const {
    name,
    slug,
    plan = 'personal',
    status = 'trial',
    settings = {},
    metadata = {},
    data_region = 'us-west',
    demo_mode = false,
    owner_email,
    owner_name
  } = body

  if (!name || !slug) {
    return c.json({ error: 'name and slug are required' }, 400)
  }

  try {
    // Check slug uniqueness
    const existing = await sql`SELECT id FROM tenants WHERE slug = ${slug}`
    if (existing.length > 0) {
      return c.json({ error: 'Slug already in use' }, 409)
    }

    const tenantId = crypto.randomUUID()
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days

    // Create tenant
    await sql`
      INSERT INTO tenants (id, name, slug, plan, status, trial_ends_at, settings, metadata, data_region, demo_mode)
      VALUES (${tenantId}, ${name}, ${slug}, ${plan}, ${status}, ${trialEndsAt}, ${JSON.stringify(settings)}, ${JSON.stringify(metadata)}, ${data_region}, ${demo_mode})
    `

    // Create default workspace
    const workspaceId = crypto.randomUUID()
    await sql`
      INSERT INTO workspaces (id, tenant_id, name, type, settings)
      VALUES (${workspaceId}, ${tenantId}, 'Default', 'production', '{}')
    `

    // Create owner user if provided
    if (owner_email) {
      const userId = crypto.randomUUID()
      await sql`
        INSERT INTO tenant_users (id, tenant_id, email, name, status, metadata)
        VALUES (${userId}, ${tenantId}, ${owner_email}, ${owner_name || null}, 'active', '{"role": "owner"}')
      `
    }

    // Create trial subscription
    await sql`
      INSERT INTO subscriptions (id, tenant_id, plan, status, trial_start, trial_end)
      VALUES (${crypto.randomUUID()}, ${tenantId}, ${plan}, 'trialing', NOW(), ${trialEndsAt})
    `

    return c.json({
      success: true,
      tenant: {
        id: tenantId,
        name,
        slug,
        plan,
        status,
        workspace_id: workspaceId
      }
    }, 201)
  } catch (err: any) {
    console.error('Failed to create tenant:', err)
    return c.json({ error: 'Failed to create tenant', message: err.message }, 500)
  }
})

/**
 * PATCH /v1/tenants/:tenantId
 * Update tenant details
 */
app.patch('/v1/tenants/:tenantId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const body = await c.req.json()

  const allowedFields = ['name', 'slug', 'plan', 'status', 'settings', 'metadata', 'data_region', 'demo_mode']
  const updates: string[] = []
  const values: any[] = []

  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = $${values.length + 1}`)
      values.push(key === 'settings' || key === 'metadata' ? JSON.stringify(value) : value)
    }
  }

  if (updates.length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400)
  }

  try {
    updates.push(`updated_at = NOW()`)
    values.push(tenantId)

    const query = `UPDATE tenants SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`
    const result = await sql(query, values)

    if (!result || result.length === 0) {
      return c.json({ error: 'Tenant not found' }, 404)
    }

    return c.json({ success: true, tenant: result[0] })
  } catch (err: any) {
    console.error('Failed to update tenant:', err)
    return c.json({ error: 'Failed to update tenant', message: err.message }, 500)
  }
})

/**
 * DELETE /v1/tenants/:tenantId
 * Soft delete a tenant (sets status to 'churned')
 */
app.delete('/v1/tenants/:tenantId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const hardDelete = c.req.query('hard') === 'true'

  try {
    if (hardDelete) {
      // Hard delete - remove all data (dangerous!)
      await sql`DELETE FROM tenant_users WHERE tenant_id = ${tenantId}`
      await sql`DELETE FROM workspaces WHERE tenant_id = ${tenantId}`
      await sql`DELETE FROM subscriptions WHERE tenant_id = ${tenantId}`
      await sql`DELETE FROM tenants WHERE id = ${tenantId}`

      return c.json({ success: true, deleted: true })
    } else {
      // Soft delete - mark as churned
      const result = await sql`
        UPDATE tenants 
        SET status = 'churned', updated_at = NOW() 
        WHERE id = ${tenantId} 
        RETURNING id
      `

      if (!result || result.length === 0) {
        return c.json({ error: 'Tenant not found' }, 404)
      }

      return c.json({ success: true, status: 'churned' })
    }
  } catch (err: any) {
    console.error('Failed to delete tenant:', err)
    return c.json({ error: 'Failed to delete tenant', message: err.message }, 500)
  }
})

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * GET /v1/tenants/:tenantId/users
 * List users for a tenant
 */
app.get('/v1/tenants/:tenantId/users', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const status = c.req.query('status')

  try {
    let users
    if (status) {
      users = await sql`
        SELECT * FROM tenant_users 
        WHERE tenant_id = ${tenantId} AND status = ${status}
        ORDER BY created_at DESC
      `
    } else {
      users = await sql`
        SELECT * FROM tenant_users 
        WHERE tenant_id = ${tenantId}
        ORDER BY created_at DESC
      `
    }

    return c.json({ users })
  } catch (err: any) {
    console.error('Failed to list users:', err)
    return c.json({ error: 'Failed to list users', message: err.message }, 500)
  }
})

/**
 * POST /v1/tenants/:tenantId/users
 * Add a user to a tenant
 */
app.post('/v1/tenants/:tenantId/users', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const body = await c.req.json()

  const { email, name, role = 'member', status = 'invited' } = body

  if (!email) {
    return c.json({ error: 'email is required' }, 400)
  }

  try {
    // Check if user already exists in tenant
    const existing = await sql`
      SELECT id FROM tenant_users 
      WHERE tenant_id = ${tenantId} AND email = ${email}
    `
    if (existing.length > 0) {
      return c.json({ error: 'User already exists in this tenant' }, 409)
    }

    const userId = crypto.randomUUID()
    const metadata = { role }

    await sql`
      INSERT INTO tenant_users (id, tenant_id, email, name, status, metadata)
      VALUES (${userId}, ${tenantId}, ${email}, ${name || null}, ${status}, ${JSON.stringify(metadata)})
    `

    return c.json({
      success: true,
      user: { id: userId, email, name, status, role }
    }, 201)
  } catch (err: any) {
    console.error('Failed to add user:', err)
    return c.json({ error: 'Failed to add user', message: err.message }, 500)
  }
})

/**
 * PATCH /v1/tenants/:tenantId/users/:userId
 * Update a user
 */
app.patch('/v1/tenants/:tenantId/users/:userId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const userId = c.req.param('userId')
  const body = await c.req.json()

  const { name, status, metadata } = body

  try {
    const result = await sql`
      UPDATE tenant_users 
      SET 
        name = COALESCE(${name}, name),
        status = COALESCE(${status}, status),
        metadata = COALESCE(${metadata ? JSON.stringify(metadata) : null}, metadata),
        updated_at = NOW()
      WHERE id = ${userId} AND tenant_id = ${tenantId}
      RETURNING *
    `

    if (!result || result.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ success: true, user: result[0] })
  } catch (err: any) {
    console.error('Failed to update user:', err)
    return c.json({ error: 'Failed to update user', message: err.message }, 500)
  }
})

/**
 * DELETE /v1/tenants/:tenantId/users/:userId
 * Remove a user from a tenant
 */
app.delete('/v1/tenants/:tenantId/users/:userId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const userId = c.req.param('userId')

  try {
    const result = await sql`
      DELETE FROM tenant_users 
      WHERE id = ${userId} AND tenant_id = ${tenantId}
      RETURNING id
    `

    if (!result || result.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ success: true, deleted: true })
  } catch (err: any) {
    console.error('Failed to delete user:', err)
    return c.json({ error: 'Failed to delete user', message: err.message }, 500)
  }
})

// ============================================================================
// WORKSPACE MANAGEMENT
// ============================================================================

/**
 * GET /v1/tenants/:tenantId/workspaces
 * List workspaces for a tenant
 */
app.get('/v1/tenants/:tenantId/workspaces', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')

  try {
    const workspaces = await sql`
      SELECT * FROM workspaces 
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `

    return c.json({ workspaces })
  } catch (err: any) {
    console.error('Failed to list workspaces:', err)
    return c.json({ error: 'Failed to list workspaces', message: err.message }, 500)
  }
})

/**
 * POST /v1/tenants/:tenantId/workspaces
 * Create a new workspace
 */
app.post('/v1/tenants/:tenantId/workspaces', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.param('tenantId')
  const body = await c.req.json()

  const { name, type = 'production', settings = {} } = body

  if (!name) {
    return c.json({ error: 'name is required' }, 400)
  }

  try {
    const workspaceId = crypto.randomUUID()

    await sql`
      INSERT INTO workspaces (id, tenant_id, name, type, settings)
      VALUES (${workspaceId}, ${tenantId}, ${name}, ${type}, ${JSON.stringify(settings)})
    `

    return c.json({
      success: true,
      workspace: { id: workspaceId, tenant_id: tenantId, name, type, settings }
    }, 201)
  } catch (err: any) {
    console.error('Failed to create workspace:', err)
    return c.json({ error: 'Failed to create workspace', message: err.message }, 500)
  }
})

// ============================================================================
// SYSTEM ADMINISTRATION
// ============================================================================

/**
 * GET /v1/system/stats
 * Get system-wide statistics
 */
app.get('/v1/system/stats', async (c) => {
  const sql = neon(c.env.DATABASE_URL)

  try {
    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM tenants) as total_tenants,
        (SELECT COUNT(*) FROM tenants WHERE status = 'active') as active_tenants,
        (SELECT COUNT(*) FROM tenants WHERE status = 'trial') as trial_tenants,
        (SELECT COUNT(*) FROM tenant_users) as total_users,
        (SELECT COUNT(*) FROM tenant_users WHERE status = 'active') as active_users,
        (SELECT COUNT(*) FROM workspaces) as total_workspaces,
        (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
        (SELECT COUNT(*) FROM iq_sessions WHERE created_at > NOW() - INTERVAL '24 hours') as ai_sessions_24h,
        (SELECT COUNT(*) FROM iq_sessions WHERE created_at > NOW() - INTERVAL '7 days') as ai_sessions_7d
    `

    return c.json({
      stats: stats[0] || {},
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    console.error('Failed to get system stats:', err)
    return c.json({ error: 'Failed to get system stats', message: err.message }, 500)
  }
})

/**
 * GET /v1/system/audit-log
 * Get system audit log
 */
app.get('/v1/system/audit-log', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const limit = parseInt(c.req.query('limit') || '100')
  const tenantId = c.req.query('tenant_id')
  const action = c.req.query('action')

  try {
    let query = `
      SELECT * FROM audit_log 
      WHERE 1=1
    `
    const params: any[] = []

    if (tenantId) {
      query += ` AND tenant_id = $${params.length + 1}`
      params.push(tenantId)
    }

    if (action) {
      query += ` AND action = $${params.length + 1}`
      params.push(action)
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const logs = await sql(query, params)

    return c.json({ logs })
  } catch (err: any) {
    console.error('Failed to get audit log:', err)
    return c.json({ error: 'Failed to get audit log', message: err.message }, 500)
  }
})

/**
 * POST /v1/system/maintenance
 * Trigger system maintenance tasks
 */
app.post('/v1/system/maintenance', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const body = await c.req.json()
  const { task } = body

  const validTasks = ['cleanup_expired_trials', 'cleanup_churned_tenants', 'vacuum_database', 'refresh_stats']

  if (!task || !validTasks.includes(task)) {
    return c.json({ error: `Invalid task. Valid tasks: ${validTasks.join(', ')}` }, 400)
  }

  try {
    let result: any = { task, status: 'completed' }

    switch (task) {
      case 'cleanup_expired_trials':
        const expiredTrials = await sql`
          UPDATE tenants 
          SET status = 'suspended' 
          WHERE status = 'trial' AND trial_ends_at < NOW()
          RETURNING id
        `
        result.affected = expiredTrials.length
        break

      case 'cleanup_churned_tenants':
        // Mark subscriptions as cancelled for churned tenants
        const churned = await sql`
          UPDATE subscriptions s
          SET status = 'canceled', canceled_at = NOW()
          FROM tenants t
          WHERE s.tenant_id = t.id AND t.status = 'churned' AND s.status = 'active'
          RETURNING s.id
        `
        result.affected = churned.length
        break

      case 'refresh_stats':
        // Trigger any stat refresh materialized views
        result.message = 'Stats refresh triggered'
        break

      default:
        result.message = 'Task acknowledged'
    }

    return c.json(result)
  } catch (err: any) {
    console.error('Maintenance task failed:', err)
    return c.json({ error: 'Maintenance task failed', message: err.message }, 500)
  }
})

export default app
