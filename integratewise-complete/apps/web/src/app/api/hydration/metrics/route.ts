import { NextRequest, NextResponse } from 'next/server'
import type { TenantHydrationMetrics } from '@/types/hydration-buckets'

/**
 * GET /api/hydration/metrics
 * Returns hydration metrics for bucket calculation
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenant_id')

    if (!tenantId) {
        return NextResponse.json(
            { error: 'tenant_id is required' },
            { status: 400 }
        )
    }

    try {
        // TODO: In production, fetch from Spine/D1
        // For now, return estimated metrics based on mock data
        const metrics: TenantHydrationMetrics = {
            users: 1,
            entities: 25, // Some manual entries
            documents: 5,
            embeddings: 10,
            tools: 2, // Calendar + CRM assumed
            synced_entities: 50,
            accounts: 10,
            policies: 0,
            governance_enabled: false,
            automation_enabled: false,
        }

        return NextResponse.json(metrics)
    } catch (error) {
        console.error('Failed to fetch hydration metrics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch hydration metrics' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/hydration/metrics
 * Update hydration metrics after data sync
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tenant_id, metrics } = body

        if (!tenant_id || !metrics) {
            return NextResponse.json(
                { error: 'tenant_id and metrics are required' },
                { status: 400 }
            )
        }

        // TODO: In production, update Spine/D1
        // For now, just acknowledge
        return NextResponse.json({
            success: true,
            message: 'Metrics updated',
            tenant_id,
        })
    } catch (error) {
        console.error('Failed to update hydration metrics:', error)
        return NextResponse.json(
            { error: 'Failed to update hydration metrics' },
            { status: 500 }
        )
    }
}
