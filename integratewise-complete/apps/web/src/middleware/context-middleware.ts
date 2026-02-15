/**
 * Context Middleware
 * 
 * Runs on EVERY request to extract and validate context
 * Sets context headers that downstream services use for filtering
 * 
 * Flow:
 * 1. Extract user from session
 * 2. Parse category from request (query param or header or cookie)
 * 3. Validate user has access to requested category
 * 4. Attach context to request headers for downstream services
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Context categories
type EntityCategory = 'personal' | 'csm' | 'business' | 'team'

// User roles and their allowed contexts
const ROLE_ALLOWED_CONTEXTS: Record<string, EntityCategory[]> = {
    personal: ['personal', 'team'],
    csm: ['personal', 'csm', 'team'],
    executive: ['personal', 'csm', 'business', 'team'],
    admin: ['personal', 'csm', 'business', 'team']
}

/**
 * Context Middleware - extracts and validates context for every API request
 */
export async function contextMiddleware(request: NextRequest) {
    // Only process API routes or specific pages if needed, but here usually API
    // Note: If we want this for Server Components (pages), we should check pathname
    // But typically pages don't read these custom headers set here effectively unless middleware rewrites.
    // However, we are setting headers on the *request* passed to the handler.

    // For API routes
    if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/auth')) {
        // proceed
    } else {
        // Validation for normal pages is usually done in the component or via layout
        // But we can still set headers for convenience
        // return NextResponse.next() 
        // For now, let's stick to API routes mostly, but headers on request might help SCs.
    }

    // Create response to modify headers
    const response = NextResponse.next()

    try {
        // Create Supabase client for session
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            // No user - set anonymous context
            response.headers.set('x-spine-context-category', 'personal')
            response.headers.set('x-spine-context-user-id', 'anonymous')
            response.headers.set('x-spine-context-valid', 'false')
            return response
        }

        // Extract context from request (Headers > Query > Cookies)
        const requestedCategory = extractCategory(request)

        let requestedAccountId = request.nextUrl.searchParams.get('account_id')
        if (!requestedAccountId && requestedCategory === 'csm') {
            requestedAccountId = request.cookies.get('spine-context-account-id')?.value || null
        }

        let requestedTeamId = request.nextUrl.searchParams.get('team_id')
        if (!requestedTeamId && (requestedCategory === 'team' || requestedCategory === 'personal')) {
            requestedTeamId = request.cookies.get('spine-context-team-id')?.value || null
        }

        // Get user's role and tenant from metadata or database
        const userRole = (user.user_metadata?.role as string) || 'personal'
        const tenantId = (user.user_metadata?.tenant_id as string) || 'default'

        // Validate context access
        const allowedContexts = ROLE_ALLOWED_CONTEXTS[userRole] || ['personal']
        const category = allowedContexts.includes(requestedCategory)
            ? requestedCategory
            : 'personal' // Fall back to personal if not authorized

        // For CSM context, validate account access
        if (category === 'csm' && requestedAccountId) {
            const hasAccess = await validateAccountAccess(supabase, user.id, requestedAccountId)
            if (!hasAccess) {
                // Return json error for API, redirect for pages?
                if (request.nextUrl.pathname.startsWith('/api')) {
                    return NextResponse.json(
                        { error: 'Access denied to requested account' },
                        { status: 403 }
                    )
                }
            }
        }

        // Set context headers for downstream services
        response.headers.set('x-spine-context-category', category)
        response.headers.set('x-spine-context-user-id', user.id)
        response.headers.set('x-spine-context-user-role', userRole)
        response.headers.set('x-spine-context-tenant-id', tenantId)
        response.headers.set('x-spine-context-valid', 'true')

        if (requestedAccountId && category === 'csm') {
            response.headers.set('x-spine-context-account-id', requestedAccountId)
        }

        if (requestedTeamId) {
            response.headers.set('x-spine-context-team-id', requestedTeamId)
        }

        return response

    } catch (error) {
        console.error('Context middleware error:', error)
        // On error, allow request but mark context as invalid
        response.headers.set('x-spine-context-valid', 'false')
        return response
    }
}

/**
 * Extract category from request
 * Priority: Header > Query Param > Cookie > Default
 */
function extractCategory(request: NextRequest): EntityCategory {
    // Check header first
    const headerCategory = request.headers.get('x-spine-category')
    if (headerCategory && isValidCategory(headerCategory)) {
        return headerCategory as EntityCategory
    }

    // Check query param
    const queryCategory = request.nextUrl.searchParams.get('category')
    if (queryCategory && isValidCategory(queryCategory)) {
        return queryCategory as EntityCategory
    }

    // Check cookie
    const cookieCategory = request.cookies.get('spine-context-category')?.value
    if (cookieCategory && isValidCategory(cookieCategory)) {
        return cookieCategory as EntityCategory
    }

    // Default to personal
    return 'personal'
}

function isValidCategory(category: string): boolean {
    return ['personal', 'csm', 'business', 'team'].includes(category)
}

/**
 * Validate user has access to specific account
 */
async function validateAccountAccess(
    supabase: any,
    userId: string,
    accountId: string
): Promise<boolean> {
    // Check if user is assigned to this account
    const { data, error } = await supabase
        .from('spine_accounts')
        .select('id')
        .eq('id', accountId)
        .or(`scope->>assigned_csm_id.eq.${userId},scope->>assigned_am_id.eq.${userId}`)
        .single()

    // If table doesn't exist yet (migration pending), allow for now to avoid blocking
    if (error && error.code === '42P01') return true;

    return !error && !!data
}

// =============================================================================
// HELPER: Extract context from request headers (for use in API routes)
// =============================================================================

export interface RequestContext {
    category: EntityCategory
    userId: string
    userRole: string
    tenantId: string
    accountId?: string
    teamId?: string
    isValid: boolean
}

/**
 * Extract spine context from request headers
 * Use this in API route handlers
 */
export function getRequestContext(request: NextRequest): RequestContext {
    return {
        category: (request.headers.get('x-spine-context-category') || 'personal') as EntityCategory,
        userId: request.headers.get('x-spine-context-user-id') || 'anonymous',
        userRole: request.headers.get('x-spine-context-user-role') || 'personal',
        tenantId: request.headers.get('x-spine-context-tenant-id') || 'default',
        accountId: request.headers.get('x-spine-context-account-id') || undefined,
        teamId: request.headers.get('x-spine-context-team-id') || undefined,
        isValid: request.headers.get('x-spine-context-valid') === 'true'
    }
}

/**
 * Convert RequestContext to QueryContext for service calls
 */
export function toQueryContext(reqContext: RequestContext) {
    return {
        tenant_id: reqContext.tenantId,
        user_id: reqContext.userId,
        user_role: reqContext.userRole as 'personal' | 'csm' | 'executive' | 'admin',
        category: reqContext.category,
        account_id: reqContext.accountId,
        team_id: reqContext.teamId
    }
}
