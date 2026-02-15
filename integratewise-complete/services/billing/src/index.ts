/**
 * IntegrateWise Billing Service
 * Cloudflare Worker entry point
 * 
 * Handles subscription management, usage tracking, and Stripe/RazorPay integration
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PLANS, type Plan, type Subscription, type Invoice, type UsageRecord } from './billing-service'

interface Env {
  DB: D1Database
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  RAZORPAY_KEY_ID?: string
  RAZORPAY_KEY_SECRET?: string
  RAZORPAY_WEBHOOK_SECRET?: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS
app.use('*', cors({
  origin: ['https://integratewise.ai', 'https://app.integratewise.ai', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
}))

// Health check
app.get('/', (c) => c.json({ 
  service: 'integratewise-billing',
  status: 'healthy',
  version: '1.0.0',
  environment: c.env.ENVIRONMENT
}))

app.get('/health', (c) => c.json({ status: 'ok' }))

// ============================================================================
// PLANS
// ============================================================================

app.get('/v1/plans', (c) => {
  return c.json({ plans: PLANS.filter(p => p.isActive) })
})

app.get('/v1/plans/:planId', (c) => {
  const plan = PLANS.find(p => p.id === c.req.param('planId'))
  if (!plan) {
    return c.json({ error: 'Plan not found' }, 404)
  }
  return c.json({ plan })
})

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

app.get('/v1/subscriptions/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId')
  
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM subscriptions WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1
    `).bind(tenantId).first()
    
    if (!result) {
      // Return free plan by default
      return c.json({
        subscription: {
          tenantId,
          planId: 'free',
          status: 'active',
          billingInterval: 'monthly',
          plan: PLANS.find(p => p.id === 'free')
        }
      })
    }
    
    const plan = PLANS.find(p => p.id === result.plan_id)
    return c.json({ subscription: { ...result, plan } })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return c.json({ error: 'Failed to fetch subscription' }, 500)
  }
})

app.post('/v1/subscriptions', async (c) => {
  const body = await c.req.json()
  const { tenantId, planId, billingInterval, stripeCustomerId, stripeSubscriptionId } = body
  
  if (!tenantId || !planId) {
    return c.json({ error: 'tenantId and planId are required' }, 400)
  }
  
  const plan = PLANS.find(p => p.id === planId)
  if (!plan) {
    return c.json({ error: 'Invalid plan' }, 400)
  }
  
  try {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    
    await c.env.DB.prepare(`
      INSERT INTO subscriptions (id, tenant_id, plan_id, status, billing_interval, 
        current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id, created_at, updated_at)
      VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, tenantId, planId, billingInterval || 'monthly', now, periodEnd, 
      stripeCustomerId || null, stripeSubscriptionId || null, now, now).run()
    
    return c.json({ 
      subscription: { id, tenantId, planId, status: 'active', plan },
      message: 'Subscription created'
    }, 201)
  } catch (error) {
    console.error('Error creating subscription:', error)
    return c.json({ error: 'Failed to create subscription' }, 500)
  }
})

app.put('/v1/subscriptions/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId')
  const body = await c.req.json()
  const { planId, status, cancelAtPeriodEnd } = body
  
  try {
    const updates: string[] = []
    const values: any[] = []
    
    if (planId) {
      updates.push('plan_id = ?')
      values.push(planId)
    }
    if (status) {
      updates.push('status = ?')
      values.push(status)
    }
    if (cancelAtPeriodEnd !== undefined) {
      updates.push('cancel_at_period_end = ?')
      values.push(cancelAtPeriodEnd ? 1 : 0)
    }
    
    updates.push('updated_at = ?')
    values.push(new Date().toISOString())
    values.push(tenantId)
    
    await c.env.DB.prepare(`
      UPDATE subscriptions SET ${updates.join(', ')} WHERE tenant_id = ?
    `).bind(...values).run()
    
    return c.json({ message: 'Subscription updated' })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return c.json({ error: 'Failed to update subscription' }, 500)
  }
})

// ============================================================================
// USAGE TRACKING
// ============================================================================

app.post('/v1/usage', async (c) => {
  const body = await c.req.json()
  const { tenantId, metricKey, quantity, metadata } = body
  
  if (!tenantId || !metricKey || quantity === undefined) {
    return c.json({ error: 'tenantId, metricKey, and quantity are required' }, 400)
  }
  
  try {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    await c.env.DB.prepare(`
      INSERT INTO usage_records (id, tenant_id, metric_key, quantity, metadata, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, tenantId, metricKey, quantity, JSON.stringify(metadata || {}), now).run()
    
    return c.json({ id, message: 'Usage recorded' }, 201)
  } catch (error) {
    console.error('Error recording usage:', error)
    return c.json({ error: 'Failed to record usage' }, 500)
  }
})

app.get('/v1/usage/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId')
  const metricKey = c.req.query('metric')
  const startDate = c.req.query('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const endDate = c.req.query('end') || new Date().toISOString()
  
  try {
    let query = `
      SELECT metric_key, SUM(quantity) as total, COUNT(*) as count
      FROM usage_records 
      WHERE tenant_id = ? AND timestamp >= ? AND timestamp <= ?
    `
    const params: any[] = [tenantId, startDate, endDate]
    
    if (metricKey) {
      query += ' AND metric_key = ?'
      params.push(metricKey)
    }
    
    query += ' GROUP BY metric_key'
    
    const result = await c.env.DB.prepare(query).bind(...params).all()
    
    return c.json({ usage: result.results })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return c.json({ error: 'Failed to fetch usage' }, 500)
  }
})

// ============================================================================
// INVOICES
// ============================================================================

app.get('/v1/invoices/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId')
  const limit = parseInt(c.req.query('limit') || '10')
  
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM invoices WHERE tenant_id = ? ORDER BY created_at DESC LIMIT ?
    `).bind(tenantId, limit).all()
    
    return c.json({ invoices: result.results })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return c.json({ error: 'Failed to fetch invoices' }, 500)
  }
})

// ============================================================================
// STRIPE WEBHOOKS
// ============================================================================

app.post('/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature')
  const body = await c.req.text()
  
  // Verify signature (simplified - use stripe library in production)
  if (!signature || !c.env.STRIPE_WEBHOOK_SECRET) {
    return c.json({ error: 'Missing signature or secret' }, 400)
  }
  
  try {
    const event = JSON.parse(body)
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Handle subscription changes
        console.log('Subscription event:', event.type)
        break
        
      case 'invoice.paid':
        // Record invoice
        console.log('Invoice paid:', event.data.object.id)
        break
        
      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id)
        break
    }
    
    return c.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return c.json({ error: 'Webhook processing failed' }, 500)
  }
})

// ============================================================================
// RAZORPAY WEBHOOKS
// ============================================================================

app.post('/webhooks/razorpay', async (c) => {
  const signature = c.req.header('x-razorpay-signature')
  const body = await c.req.text()
  
  if (!signature || !c.env.RAZORPAY_WEBHOOK_SECRET) {
    return c.json({ error: 'Missing signature or secret' }, 400)
  }
  
  try {
    const event = JSON.parse(body)
    
    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.charged':
        console.log('RazorPay subscription event:', event.event)
        break
        
      case 'payment.captured':
        console.log('RazorPay payment captured:', event.payload.payment.entity.id)
        break
    }
    
    return c.json({ received: true })
  } catch (error) {
    console.error('RazorPay webhook error:', error)
    return c.json({ error: 'Webhook processing failed' }, 500)
  }
})

// ============================================================================
// ENTITLEMENTS CHECK
// ============================================================================

app.get('/v1/entitlements/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId')
  
  try {
    // Get current subscription
    const subscription = await c.env.DB.prepare(`
      SELECT plan_id, status FROM subscriptions WHERE tenant_id = ? AND status = 'active' LIMIT 1
    `).bind(tenantId).first()
    
    const planId = subscription?.plan_id || 'free'
    const plan = PLANS.find(p => p.id === planId) || PLANS[0]
    
    // Get current usage
    const usageResult = await c.env.DB.prepare(`
      SELECT metric_key, SUM(quantity) as total
      FROM usage_records 
      WHERE tenant_id = ? AND timestamp >= date('now', '-30 days')
      GROUP BY metric_key
    `).bind(tenantId).all()
    
    const usage: Record<string, number> = {}
    for (const row of usageResult.results as any[]) {
      usage[row.metric_key] = row.total
    }
    
    // Calculate remaining
    const entitlements = {
      plan: plan.id,
      planName: plan.name,
      limits: plan.limits,
      usage,
      remaining: {
        apiCallsPerMonth: plan.limits.apiCallsPerMonth - (usage.api_calls || 0),
        aiQueriesPerMonth: plan.limits.aiQueriesPerMonth - (usage.ai_queries || 0),
        users: plan.limits.users,
        integrations: plan.limits.integrations,
        storageGb: plan.limits.storageGb - ((usage.storage_bytes || 0) / 1024 / 1024 / 1024),
      },
      features: plan.features.filter(f => f.included).map(f => f.key)
    }
    
    return c.json({ entitlements })
  } catch (error) {
    console.error('Error fetching entitlements:', error)
    return c.json({ error: 'Failed to fetch entitlements' }, 500)
  }
})

export default app
