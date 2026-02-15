import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logAuditEvent, extractClientInfo, generateCorrelationId } from '@/lib/audit'
import { parsePaginationOptions, createPaginationResult, getPaginationHeaders, validateSortField, validateSortOrder } from '@/lib/pagination'
import { handleApiError, createAppError, withErrorHandling } from '@/lib/error-handling'

export const GET = withErrorHandling(async (request: NextRequest) => {
  const correlationId = generateCorrelationId()
  const clientInfo = extractClientInfo(request)

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    await logAuditEvent(process.env.DATABASE_URL!, {
      action: 'WEBHOOK_EVENTS_ACCESS_DENIED',
      target_type: 'api',
      target_id: 'webhook-events',
      payload: { error: 'Unauthorized access' },
      ip_address: clientInfo.ipAddress,
      user_agent: clientInfo.userAgent,
      correlation_id: correlationId
    })

    throw createAppError('UNAUTHORIZED', 'Authentication required', 401)
  }

  const url = new URL(request.url)
  const provider = url.searchParams.get('provider') || 'all'
  const eventType = url.searchParams.get('eventType') || 'all'
  const status = url.searchParams.get('status') || 'all'
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100) // Max 100
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0)
  const sortBy = url.searchParams.get('sortBy') || 'received_at'
  const sortOrder = url.searchParams.get('sortOrder') || 'desc'

  // Validate sort parameters
  const validSortFields = ['received_at', 'provider', 'event_type', 'status', 'retry_count']
  const validSortOrders = ['asc', 'desc']

  if (!validSortFields.includes(sortBy) || !validSortOrders.includes(sortOrder)) {
    throw createAppError('VALIDATION_ERROR', 'Invalid sort parameters', 400)
  }

  // Build query for events_log
  let query = supabase
    .from('events_log')
    .select(`
      id,
      provider,
      event_type,
      payload,
      headers,
      received_at,
      processed_at,
      status,
      signature_valid,
      retry_count,
      error_message,
      created_at,
      updated_at
    `, { count: 'exact' })

  // Apply filters
  if (provider !== 'all') {
    query = query.eq('provider', provider)
  }

  if (eventType !== 'all') {
    query = query.eq('event_type', eventType)
  }

  if (status !== 'all') {
    if (status === 'successful') {
      query = query.eq('status', 'processed')
    } else if (status === 'failed') {
      query = query.in('status', ['failed', 'dead_lettered'])
    } else if (status === 'retrying') {
      query = query.eq('status', 'retrying')
    } else if (status === 'received') {
      query = query.eq('status', 'received')
    }
  }

  // Apply sorting
  const orderBy = sortBy === 'received_at' ? 'received_at' : sortBy
  query = query.order(orderBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: events, error: eventsError, count } = await query

  if (eventsError) {
    throw createAppError('DATABASE_ERROR', `Failed to fetch webhook events: ${eventsError.message}`, 500)
  }

  // Get unique providers and event types for filters
  const { data: metadata } = await supabase
    .rpc('get_webhook_events_metadata')

  // Log successful access
  await logAuditEvent(process.env.DATABASE_URL!, {
    actor_user_id: user.id,
    action: 'WEBHOOK_EVENTS_ACCESSED',
    target_type: 'webhook_events',
    target_id: 'list',
    payload: {
      filters: { provider, eventType, status, limit, offset, sortBy, sortOrder },
      results_count: events?.length || 0,
      total_count: count
    },
    ip_address: clientInfo.ipAddress,
    user_agent: clientInfo.userAgent,
    correlation_id: correlationId
  })

  return NextResponse.json({
    success: true,
    data: events || [],
    pagination: {
      limit,
      offset,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((count || 0) / limit)
    },
    metadata: metadata || {
      providers: [],
      eventTypes: [],
      statusCounts: {}
    }
  })
})

export const POST = withErrorHandling(async (request: NextRequest) => {
  const correlationId = generateCorrelationId()
  const clientInfo = extractClientInfo(request)

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    await logAuditEvent(process.env.DATABASE_URL!, {
      action: 'WEBHOOK_RETRY_ACCESS_DENIED',
      target_type: 'api',
      target_id: 'webhook-events',
      payload: { error: 'Unauthorized access' },
      ip_address: clientInfo.ipAddress,
      user_agent: clientInfo.userAgent,
      correlation_id: correlationId
    })

    throw createAppError('UNAUTHORIZED', 'Authentication required', 401)
  }

  const body = await request.json()
  const { eventIds, action } = body

  if (!Array.isArray(eventIds) || eventIds.length === 0) {
    throw createAppError('VALIDATION_ERROR', 'eventIds must be a non-empty array', 400)
  }

  if (!['retry', 'cancel'].includes(action)) {
    throw createAppError('VALIDATION_ERROR', 'action must be either "retry" or "cancel"', 400)
  }

  let updatedCount = 0

  if (action === 'retry') {
    // Reset events for retry
    const { data, error } = await supabase
      .from('events_log')
      .update({
        status: 'retrying',
        retry_count: 0,
        next_retry_at: new Date(Date.now() + 30000).toISOString(), // Retry in 30 seconds
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .in('id', eventIds)
      .in('status', ['failed', 'dead_lettered'])
      .select('id')

    if (error) {
      throw createAppError('DATABASE_ERROR', `Failed to retry events: ${error.message}`, 500)
    }
    updatedCount = data?.length || 0

  } else if (action === 'cancel') {
    // Mark as cancelled
    const { data, error } = await supabase
      .from('events_log')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .in('id', eventIds)
      .in('status', ['retrying', 'failed'])
      .select('id')

    if (error) {
      throw createAppError('DATABASE_ERROR', `Failed to cancel events: ${error.message}`, 500)
    }
    updatedCount = data?.length || 0
  }

  // Log the action
  await logAuditEvent(process.env.DATABASE_URL!, {
    actor_user_id: user.id,
    action: action === 'retry' ? 'WEBHOOK_EVENTS_RETRY_TRIGGERED' : 'WEBHOOK_EVENTS_CANCELLED',
    target_type: 'webhook_events',
    target_id: eventIds.join(','),
    payload: {
      action,
      event_count: eventIds.length,
      updated_count: updatedCount
    },
    ip_address: clientInfo.ipAddress,
    user_agent: clientInfo.userAgent,
    correlation_id: correlationId
  })

  return NextResponse.json({
    success: true,
    message: `${action === 'retry' ? 'Retried' : 'Cancelled'} ${updatedCount} webhook events`,
    updatedCount
  })
})