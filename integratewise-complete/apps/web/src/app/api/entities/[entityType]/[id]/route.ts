/**
 * Universal Entity by ID API Route
 * 
 * GET/PUT/DELETE operations on specific entity
 * Context determines access validation
 */

import { NextRequest, NextResponse } from "next/server"
import {
    UniversalEntityService,
    EntityType,
    EntityCategory,
    QueryContext
} from "@/lib/spine/universal-entity-service"

/**
 * Extract context from middleware headers
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

// GET /api/entities/[entityType]/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { entityType: string; id: string } }
) {
    try {
        const entityType = params.entityType as EntityType
        const entityId = params.id
        const context = getQueryContext(request)

        const entity = await UniversalEntityService.getEntityById(
            entityType,
            entityId,
            context
        )

        if (!entity) {
            return NextResponse.json(
                { success: false, error: 'Entity not found or access denied' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: entity
        })
    } catch (error) {
        console.error(`Error in GET /api/entities/${params.entityType}/${params.id}:`, error)
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}

// PUT /api/entities/[entityType]/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { entityType: string; id: string } }
) {
    try {
        const entityType = params.entityType as EntityType
        const entityId = params.id
        const context = getQueryContext(request)
        const body = await request.json()

        const entity = await UniversalEntityService.updateEntity(
            entityType,
            entityId,
            context,
            body.data,
            body.relationships
        )

        return NextResponse.json({
            success: true,
            data: entity
        })
    } catch (error) {
        console.error(`Error in PUT /api/entities/${params.entityType}/${params.id}:`, error)
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}

// DELETE /api/entities/[entityType]/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { entityType: string; id: string } }
) {
    try {
        const entityType = params.entityType as EntityType
        const entityId = params.id
        const context = getQueryContext(request)

        await UniversalEntityService.deleteEntity(
            entityType,
            entityId,
            context
        )

        return NextResponse.json({
            success: true,
            message: 'Entity deleted'
        })
    } catch (error) {
        console.error(`Error in DELETE /api/entities/${params.entityType}/${params.id}:`, error)
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}
