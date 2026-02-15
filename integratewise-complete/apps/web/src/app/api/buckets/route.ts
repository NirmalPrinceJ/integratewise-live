// src/app/api/buckets/route.ts

import { getSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = createServerClient()
    const tenantId = session.user.tenant_id

    // Get all buckets for tenant with progress
    const { data: buckets, error } = await db
      .from('v_bucket_status')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('bucket_type', { ascending: true })

    if (error) throw error

    return NextResponse.json({ buckets })
  } catch (error) {
    console.error('Error fetching buckets:', error)
    return NextResponse.json({ error: 'Failed to fetch buckets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bucket_type, seed_method } = await req.json()
    const db = createServerClient()
    const tenantId = session.user.tenant_id

    // Start ingestion pipeline
    const { data: bucket, error: insertError } = await db
      .from('buckets')
      .insert({
        tenant_id: tenantId,
        bucket_type,
        seed_method,
        state: 'ADDING',
        created_by: session.user.id,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Emit event to start Loader on L3
    // (will implement in L3 service)
    const event = new CustomEvent('bucket:add', {
      detail: {
        bucket_id: bucket.bucket_id,
        bucket_type,
        tenant_id: tenantId,
        seed_method,
      }
    })

    // Queue ingestion job
    await db
      .from('bucket_ingestion_logs')
      .insert({
        bucket_id: bucket.bucket_id,
        ingestion_type: seed_method,
        status: 'started',
        created_by: session.user.id,
      })

    return NextResponse.json({ bucket, message: 'Bucket creation started' })
  } catch (error) {
    console.error('Error creating bucket:', error)
    return NextResponse.json({ error: 'Failed to create bucket' }, { status: 500 })
  }
}

// src/app/api/buckets/[bucketType]/route.ts

export async function PATCH(
  req: NextRequest,
  { params }: { params: { bucketType: string } }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { state, connector_config } = await req.json()
    const db = createServerClient()
    const tenantId = session.user.tenant_id

    const { data: bucket, error } = await db
      .from('buckets')
      .update({
        state,
        connector_config: connector_config || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenantId)
      .eq('bucket_type', params.bucketType)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ bucket, message: 'Bucket updated' })
  } catch (error) {
    console.error('Error updating bucket:', error)
    return NextResponse.json({ error: 'Failed to update bucket' }, { status: 500 })
  }
}

// src/app/api/buckets/[bucketType]/connector/route.ts
// NOTE: This function should be moved to the correct route file
// For now, renaming to avoid duplicate export error

async function connectBucketInternal(
  req: NextRequest,
  { params }: { params: { bucketType: string } }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { source, auth_code } = await req.json()
    const db = createServerClient()
    const tenantId = session.user.tenant_id

    // Exchange auth code for connector access
    // (will implement OAuth handler in L3)
    const connectorConfig = await exchangeAuthCode(source, auth_code, tenantId)

    const { data: bucket, error } = await db
      .from('buckets')
      .update({
        connected_source: source,
        connector_status: 'connected',
        connector_config: connectorConfig,
        state: 'ADDING',
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenantId)
      .eq('bucket_type', params.bucketType)
      .select()
      .single()

    if (error) throw error

    // Trigger sync
    await triggerSync(bucket.bucket_id)

    return NextResponse.json({ bucket, message: 'Connector configured' })
  } catch (error) {
    console.error('Error setting up connector:', error)
    return NextResponse.json({ error: 'Failed to setup connector' }, { status: 500 })
  }
}

// Helper: Exchange auth code
async function exchangeAuthCode(
  source: string,
  authCode: string,
  tenantId: string
): Promise<any> {
  // Implementation will depend on source
  // For now, return mock config
  return {
    source,
    auth_token: `token_${Date.now()}`,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  }
}

// Helper: Trigger sync
async function triggerSync(bucketId: string) {
  // Call L3 service to start sync
  // Implementation in phase 4
  console.log(`Sync triggered for bucket: ${bucketId}`)
}
