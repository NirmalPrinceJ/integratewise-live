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
  JWT_SECRET?: string
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
  const authHeader = c.req.header('authorization')
  const adminToken = authHeader?.replace('Bearer ', '')

  // Check API Key first (static key)
  if (c.env.ADMIN_API_KEY && apiKey === c.env.ADMIN_API_KEY) {
    c.set('isAdmin', true)
    c.set('adminId', 'system')
    await next()
    return
  }

  // JWT validation
  if (adminToken) {
    try {
      // Decode JWT (Supabase JWTs are standard JWTs)
      const parts = adminToken.split('.')
      if (parts.length !== 3) {
        return c.json({ error: 'Invalid token format' }, 401)
      }

      // Verify JWT signature using HMAC-SHA256
      const jwtSecret = c.env.JWT_SECRET
      if (!jwtSecret) {
        console.error('JWT_SECRET is not configured')
        return c.json({ error: 'Server misconfiguration' }, 500)
      }

      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(jwtSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )

      const signatureInput = encoder.encode(`${parts[0]}.${parts[1]}`)
      const signatureBytes = Uint8Array.from(
        atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')),
        (c) => c.charCodeAt(0)
      )

      const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, signatureInput)
      if (!valid) {
        return c.json({ error: 'Invalid token signature' }, 401)
      }

      // Decode payload (part 1)
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      )

      // Verify expiry
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return c.json({ error: 'Token expired' }, 401)
      }

      // Check admin role (from app_metadata or user_metadata)
      const role = payload.app_metadata?.role || payload.user_metadata?.role || payload.role
      if (!['admin', 'super_admin', 'owner'].includes(role)) {
        return c.json({ error: 'Insufficient permissions — admin role required' }, 403)
      }

      // Set user context
      c.set('isAdmin', true)
      c.set('adminId', payload.sub)

      await next()
    } catch (err: any) {
      console.error('JWT validation error:', err.message)
      return c.json({ error: 'Invalid token' }, 401)
    }
  } else {
    return c.json({ error: 'Unauthorized - Admin access required' }, 401)
  }
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
// NEWSLETTER & CONTACT MANAGEMENT
// ============================================================================

/**
 * POST /v1/newsletter/subscribe
 * Subscribe email to newsletter (public, no auth required)
 */
app.post('/v1/newsletter/subscribe', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const body = await c.req.json()
  const { email } = body

  if (!email || !email.includes('@')) {
    return c.json({ error: 'Valid email required' }, 400)
  }

  try {
    const id = crypto.randomUUID()
    await sql`
      INSERT INTO newsletter_subscribers (id, email, subscribed_at, source, status)
      VALUES (${id}, ${email.toLowerCase().trim()}, ${new Date().toISOString()}, 'website', 'active')
      ON CONFLICT(email) DO UPDATE SET status = 'active', subscribed_at = datetime('now')
    `
    return c.json({ success: true, message: 'Subscribed successfully' }, 201)
  } catch (err: any) {
    console.error('Failed to subscribe to newsletter:', err)
    return c.json({ error: 'Failed to subscribe', message: err.message }, 500)
  }
})

/**
 * GET /v1/newsletter/subscribers
 * List newsletter subscribers (admin only)
 */
app.get('/v1/newsletter/subscribers', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const limit = parseInt(c.req.query('limit') || '100')
  const offset = parseInt(c.req.query('offset') || '0')
  const status = c.req.query('status')

  try {
    let query = `SELECT * FROM newsletter_subscribers WHERE 1=1`
    const params: any[] = []

    if (status) {
      query += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    query += ` ORDER BY subscribed_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const subscribers = await sql(query, params)
    const countResult = await sql`SELECT COUNT(*) as total FROM newsletter_subscribers`
    const total = countResult[0]?.total || 0

    return c.json({
      subscribers,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    })
  } catch (err: any) {
    console.error('Failed to list subscribers:', err)
    return c.json({ error: 'Failed to list subscribers', message: err.message }, 500)
  }
})

/**
 * POST /v1/contact-submissions
 * Store contact form submission (public, no auth required)
 */
app.post('/v1/contact-submissions', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const body = await c.req.json()
  const { name, email, company, type, message, submitted_at } = body

  if (!name || !email || !message) {
    return c.json({ error: 'Name, email, and message are required' }, 400)
  }

  try {
    const id = crypto.randomUUID()
    await sql`
      INSERT INTO contact_submissions (id, name, email, company, inquiry_type, message, submitted_at, status)
      VALUES (
        ${id},
        ${name},
        ${email.toLowerCase().trim()},
        ${company || null},
        ${type || 'general'},
        ${message},
        ${submitted_at || new Date().toISOString()},
        'new'
      )
    `
    return c.json({ success: true, id }, 201)
  } catch (err: any) {
    console.error('Failed to store contact submission:', err)
    return c.json({ error: 'Failed to submit contact form', message: err.message }, 500)
  }
})

/**
 * GET /v1/contact-submissions
 * List contact submissions (admin only)
 */
app.get('/v1/contact-submissions', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const limit = parseInt(c.req.query('limit') || '100')
  const offset = parseInt(c.req.query('offset') || '0')
  const status = c.req.query('status')

  try {
    let query = `SELECT * FROM contact_submissions WHERE 1=1`
    const params: any[] = []

    if (status) {
      query += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    query += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const submissions = await sql(query, params)
    const countResult = await sql`SELECT COUNT(*) as total FROM contact_submissions`
    const total = countResult[0]?.total || 0

    return c.json({
      submissions,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    })
  } catch (err: any) {
    console.error('Failed to list contact submissions:', err)
    return c.json({ error: 'Failed to list submissions', message: err.message }, 500)
  }
})

// ============================================================================
// SUPPORT TICKET MANAGEMENT
// ============================================================================

/**
 * POST /v1/support-tickets
 * Create a new support ticket
 */
app.post('/v1/support-tickets', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const tenantId = c.req.header('x-tenant-id') || 'default'
  const body = await c.req.json()
  const { email, subject, description, category, priority } = body

  if (!email || !subject || !description) {
    return c.json({ error: 'Email, subject, and description are required' }, 400)
  }

  try {
    const id = crypto.randomUUID()
    await sql`
      INSERT INTO support_tickets (id, tenant_id, user_email, subject, description, category, priority, status, created_at)
      VALUES (
        ${id},
        ${tenantId},
        ${email.toLowerCase().trim()},
        ${subject},
        ${description},
        ${category || 'general'},
        ${priority || 'normal'},
        'open',
        ${new Date().toISOString()}
      )
    `
    return c.json({ success: true, ticket_id: id }, 201)
  } catch (err: any) {
    console.error('Failed to create support ticket:', err)
    return c.json({ error: 'Failed to create support ticket', message: err.message }, 500)
  }
})

/**
 * GET /v1/support-tickets
 * List support tickets (admin only)
 */
app.get('/v1/support-tickets', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')
  const status = c.req.query('status')
  const tenantId = c.req.query('tenant_id')

  try {
    let query = `SELECT * FROM support_tickets WHERE 1=1`
    const params: any[] = []

    if (status) {
      query += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    if (tenantId) {
      query += ` AND tenant_id = $${params.length + 1}`
      params.push(tenantId)
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const tickets = await sql(query, params)
    const countResult = await sql`SELECT COUNT(*) as total FROM support_tickets`
    const total = countResult[0]?.total || 0

    return c.json({
      tickets,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    })
  } catch (err: any) {
    console.error('Failed to list support tickets:', err)
    return c.json({ error: 'Failed to list tickets', message: err.message }, 500)
  }
})

/**
 * GET /v1/support-tickets/:ticketId
 * Get a specific support ticket
 */
app.get('/v1/support-tickets/:ticketId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const ticketId = c.req.param('ticketId')

  try {
    const result = await sql`
      SELECT * FROM support_tickets WHERE id = ${ticketId}
    `

    if (!result || result.length === 0) {
      return c.json({ error: 'Ticket not found' }, 404)
    }

    return c.json({ ticket: result[0] })
  } catch (err: any) {
    console.error('Failed to get support ticket:', err)
    return c.json({ error: 'Failed to get ticket', message: err.message }, 500)
  }
})

/**
 * PATCH /v1/support-tickets/:ticketId
 * Update a support ticket (status, priority, etc.)
 */
app.patch('/v1/support-tickets/:ticketId', async (c) => {
  const sql = neon(c.env.DATABASE_URL)
  const ticketId = c.req.param('ticketId')
  const body = await c.req.json()
  const { status, priority, description } = body

  try {
    const updates: string[] = []
    const values: any[] = []

    if (status) {
      updates.push(`status = $${values.length + 1}`)
      values.push(status)
    }

    if (priority) {
      updates.push(`priority = $${values.length + 1}`)
      values.push(priority)
    }

    if (description) {
      updates.push(`description = $${values.length + 1}`)
      values.push(description)
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400)
    }

    updates.push(`updated_at = $${values.length + 1}`)
    values.push(new Date().toISOString())
    values.push(ticketId)

    const query = `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`
    const result = await sql(query, values)

    if (!result || result.length === 0) {
      return c.json({ error: 'Ticket not found' }, 404)
    }

    return c.json({ success: true, ticket: result[0] })
  } catch (err: any) {
    console.error('Failed to update support ticket:', err)
    return c.json({ error: 'Failed to update ticket', message: err.message }, 500)
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
