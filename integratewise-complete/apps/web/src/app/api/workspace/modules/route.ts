import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/workspace/modules
 * Enable modules for a user based on bucket status
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tenant_id, user_id, modules } = body

        if (!user_id || !modules) {
            return NextResponse.json(
                { error: 'user_id and modules are required' },
                { status: 400 }
            )
        }

        // TODO: In production, update D1 with enabled modules
        // For now, just acknowledge the request

        console.log(`Enabling modules for user ${user_id}:`, modules)

        return NextResponse.json({
            success: true,
            user_id,
            enabled_modules: modules,
            message: `Enabled ${modules.length} modules`,
        })
    } catch (error) {
        console.error('Failed to enable modules:', error)
        return NextResponse.json(
            { error: 'Failed to enable modules' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/workspace/modules
 * Get available modules for a user based on their bucket status
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
        return NextResponse.json(
            { error: 'user_id is required' },
            { status: 400 }
        )
    }

    try {
        // TODO: In production, fetch from D1 based on bucket status
        // For now, return default available modules
        const modules = [
            'home',
            'projects',
            'tasks',
            'notes',
            'docs',
            'meetings',
            'calendar',
            'accounts',
            'contacts',
            'pipeline',
            'team',
        ]

        return NextResponse.json({
            user_id: userId,
            modules,
        })
    } catch (error) {
        console.error('Failed to fetch modules:', error)
        return NextResponse.json(
            { error: 'Failed to fetch modules' },
            { status: 500 }
        )
    }
}
