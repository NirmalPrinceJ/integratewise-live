/**
 * Universal Entities API Route
 * 
 * Single API endpoint for all entity types
 * Context (category, scope) determines what data is returned
 * 
 * Examples:
 * - GET /api/entities/tasks?category=personal → My personal tasks
 * - GET /api/entities/tasks?category=csm&account_id=123 → Tasks for Account 123
 * - GET /api/entities/accounts?category=business → All portfolio accounts
 */

import { NextRequest, NextResponse } from "next/server"
import {
    UniversalEntityService,
    EntityType,
    EntityCategory,
    QueryContext,
    EntityFilters
} from "@/lib/spine/universal-entity-service"

/**
 * Extract context from middleware headers
 * The middleware has already validated access and attached headers
 */
function getQueryContext(request: NextRequest): QueryContext {
    return {
        tenant_id: request.headers.get('x-spine-context-tenant-id') || 'default',
        user_id: request.headers.get('x-spine-context-user-id') || 'anonymous',
        user_role: (request.headers.get('x-spine-context-user-role') || 'personal') as 'personal' | 'csm' | 'executive' | 'admin',
        category: (request.headers.get('x-spine-context-category') || 'personal') as EntityCategory,
        account_id: request.headers.get('x-spine-context-account-id') || undefined,
        team_id: request.headers.get('x-spine-context-team-id') || undefined
    }
}


// Extract filters from query params
function getFilters(request: NextRequest): EntityFilters {
    const searchParams = request.nextUrl.searchParams
    return {
        status: searchParams.get('status') || undefined,
        due_before: searchParams.get('due_before') || undefined,
        due_after: searchParams.get('due_after') || undefined,
        priority: searchParams.get('priority') || undefined,
        type: searchParams.get('type') || undefined,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
        offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }
}

// GET /api/entities/[entityType]
export async function GET(
    request: NextRequest,
    { params }: { params: { entityType: string } }
) {
    try {
        const entityType = params.entityType as EntityType
        const context = getQueryContext(request)
        const filters = getFilters(request)

        const entities = await UniversalEntityService.getEntities(
            entityType,
            context,
            filters
        )

        return NextResponse.json({
            success: true,
            data: entities,
            meta: {
                count: entities.length,
                context: {
                    category: context.category,
                    account_id: context.account_id,
                    team_id: context.team_id
                }
            }
        })
    } catch (error) {
        console.error(`Error in GET /api/entities/${params.entityType}:`, error)
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}

// POST /api/entities/[entityType]
export async function POST(
    request: NextRequest,
    { params }: { params: { entityType: string } }
) {
    try {
        const entityType = params.entityType as EntityType
        const context = getQueryContext(request)
        const body = await request.json()

        const entity = await UniversalEntityService.createEntity(
            entityType,
            context,
            body.data,
            body.relationships
        )

        return NextResponse.json({
            success: true,
            data: entity
        }, { status: 201 })
    } catch (error) {
        console.error(`Error in POST /api/entities/${params.entityType}:`, error)
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}
