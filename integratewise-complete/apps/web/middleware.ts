import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/auth",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/public",
]

// Routes that skip onboarding check
const ONBOARDING_EXEMPT = [
  "/onboarding",
  "/api",
  "/_next",
  "/favicon.ico",
]

// User roles and their allowed context categories
const ROLE_ALLOWED_CONTEXTS: Record<string, string[]> = {
  personal: ['personal', 'team'],
  csm: ['personal', 'csm', 'team'],
  executive: ['personal', 'csm', 'business', 'team'],
  admin: ['personal', 'csm', 'business', 'team']
}

type EntityCategory = 'personal' | 'csm' | 'business' | 'team'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Skip auth if Supabase is not configured (dev mode without env vars)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('[middleware] Supabase not configured, skipping auth check')
    return NextResponse.next()
  }

  // Create Supabase client
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users to login
  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/auth/login"
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // =============================================================================
  // CONTEXT MIDDLEWARE: Attach context headers for all API routes
  // =============================================================================
  if (pathname.startsWith('/api')) {
    // Extract requested context from request
    const requestedCategory = extractCategory(request)
    const requestedAccountId = request.nextUrl.searchParams.get('account_id')
    const requestedTeamId = request.nextUrl.searchParams.get('team_id')

    // Get user's role and tenant from metadata
    const userRole = (user.user_metadata?.role as string) || 'personal'
    const tenantId = (user.user_metadata?.tenant_id as string) || 'default'

    // Validate context access
    const allowedContexts = ROLE_ALLOWED_CONTEXTS[userRole] || ['personal']
    const category = allowedContexts.includes(requestedCategory)
      ? requestedCategory
      : 'personal'

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
  }

  // Skip onboarding check for exempt routes
  if (ONBOARDING_EXEMPT.some((route) => pathname.startsWith(route))) {
    return response
  }

  // Check if user needs onboarding
  // We check user metadata for onboarding_complete flag
  const onboardingComplete = user.user_metadata?.onboarding_complete === true

  // Also check if they have any integrations (backup check)
  if (!onboardingComplete) {
    try {
      const { count } = await supabase
        .from("integrations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active")

      // If no active integrations and onboarding not marked complete, redirect
      if ((count ?? 0) === 0) {
        // Check localStorage fallback via cookie
        const onboardingCookie = request.cookies.get("integratewise_onboarding_complete")
        if (!onboardingCookie?.value) {
          const onboardingUrl = request.nextUrl.clone()
          onboardingUrl.pathname = "/onboarding"
          return NextResponse.redirect(onboardingUrl)
        }
      }
    } catch (error) {
      // If check fails, let user through to avoid blocking
      console.error("Onboarding check error:", error)
    }
  }

  return response
}

/**
 * Extract category from request
 * Priority: Header > Query Param > Default
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

  // Default to personal
  return 'personal'
}

function isValidCategory(category: string): boolean {
  return ['personal', 'csm', 'business', 'team'].includes(category)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

