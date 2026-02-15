/**
 * Next.js Middleware - RBAC Protection
 * 
 * Protects routes based on user role and permissions.
 * Runs on edge before page renders.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';
import { getRoleConfig } from '@/lib/rbac/roles';

// Public routes that don't require auth
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/auth/error',
  '/api/auth',
  '/legal',
  '/privacy',
  '/terms',
];

// Role-based route access
const ROLE_ROUTES: Record<string, string[]> = {
  // Admin routes
  'admin': ['/admin', '/api/admin'],
  
  // CS routes
  'cs-chief': ['/cs', '/accounts', '/health', '/risks', '/api/accounts'],
  'cs-vp': ['/cs', '/accounts', '/health', '/risks', '/api/accounts'],
  'cs-director': ['/cs', '/accounts', '/health', '/risks', '/api/accounts'],
  'cs-manager': ['/cs', '/accounts', '/health', '/api/accounts'],
  'cs-senior': ['/cs', '/accounts', '/health', '/api/accounts'],
  'csm': ['/cs', '/accounts', '/health', '/api/accounts'],
  'cs-associate': ['/cs', '/accounts', '/api/accounts'],
  
  // Sales routes
  'cro': ['/sales', '/pipeline', '/deals', '/forecasts', '/api/pipeline', '/api/deals'],
  'sales-vp': ['/sales', '/pipeline', '/deals', '/forecasts', '/api/pipeline'],
  'sales-director': ['/sales', '/pipeline', '/deals', '/api/pipeline'],
  'sales-manager': ['/sales', '/pipeline', '/deals', '/api/pipeline'],
  'ae-enterprise': ['/sales', '/pipeline', '/deals', '/api/pipeline'],
  'ae-midmarket': ['/sales', '/pipeline', '/deals', '/api/pipeline'],
  'ae-smb': ['/sales', '/pipeline', '/deals', '/api/pipeline'],
  
  // RevOps routes
  'revops-chief': ['/revops', '/forecasts', '/analytics', '/api/forecasts'],
  'revops-vp': ['/revops', '/forecasts', '/analytics', '/api/forecasts'],
  'revops-director': ['/revops', '/forecasts', '/analytics', '/api/forecasts'],
  'revops-manager': ['/revops', '/forecasts', '/analytics'],
  'revops-analyst': ['/revops', '/forecasts', '/analytics'],
  
  // Personal routes (all users)
  'personal-pro': ['/personal', '/tasks', '/calendar', '/notes'],
  'personal-student': ['/personal', '/tasks', '/calendar', '/notes'],
  'personal-freelancer': ['/personal', '/tasks', '/calendar', '/projects'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Create Supabase client
  const { supabase, response } = createClient(request);
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Not authenticated - redirect to login
  if (authError || !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Get user role from profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, tenant_id')
    .eq('id', user.id)
    .single();
  
  // No profile found - redirect to onboarding
  if (profileError || !profile) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  
  const role = profile.role || 'personal-pro';
  const roleConfig = getRoleConfig(role);
  
  // Get allowed routes for this role
  const allowedRoutes = ROLE_ROUTES[role] || ROLE_ROUTES['personal-pro'] || [];
  const shellBaseRoute = `/${roleConfig?.shell?.replace('-ops', '')?.replace('account-success', 'cs')}`;
  
  // Check if user can access this route
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route)) ||
                   pathname.startsWith(shellBaseRoute) ||
                   pathname.startsWith('/api'); // API routes handled separately
  
  if (!hasAccess && !pathname.startsWith('/api')) {
    // Log unauthorized access attempt
    await supabase.from('permission_audit_log').insert({
      tenant_id: profile.tenant_id,
      user_id: user.id,
      permission: 'route:access',
      resource_type: 'route',
      resource_id: null,
      allowed: false,
      matched_role: role,
      ip_address: request.ip,
      user_agent: request.headers.get('user-agent'),
    });
    
    // Redirect to unauthorized or their home
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // Add user context to headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-role', role);
  requestHeaders.set('x-tenant-id', profile.tenant_id);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
