/**
 * Server-side Authentication (Cloudflare Access / JWT)
 * 
 * In Cloudflare-native architecture, auth is handled by:
 * - Cloudflare Access for SSO/identity
 * - JWT tokens validated by Workers
 * - Session stored in encrypted cookies
 */

import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  workspace_id?: string;
  tenant_id?: string;
  role?: string;
}

interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  workspace_id?: string;
  tenant_id?: string;
  role?: string;
  exp: number;
  iat: number;
}

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'https://auth.integratewise.ai';
const SESSION_COOKIE = 'iw_session';

/**
 * Get current session from cookie/JWT
 */
export async function getSession(): Promise<{ user: AuthUser | null }> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return { user: null };
    }

    // Validate token with auth service
    const response = await fetch(`${AUTH_SERVICE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      return { user: null };
    }

    const payload: JWTPayload = await response.json();

    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        workspace_id: payload.workspace_id,
        tenant_id: payload.tenant_id,
        role: payload.role || 'member',
      },
    };
  } catch {
    return { user: null };
  }
}

/**
 * Require authenticated user or throw
 */
export async function requireAuth(): Promise<AuthUser> {
  const { user } = await getSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Sign in with email/password via auth service
 */
export async function signInWithPassword(email: string, password: string) {
  const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Authentication failed');
  }

  return response.json();
}

/**
 * Sign up via auth service
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  const response = await fetch(`${AUTH_SERVICE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, ...metadata }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Registration failed');
  }

  return response.json();
}

/**
 * Sign out - clear session cookie
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  // Also invalidate on server
  try {
    await fetch(`${AUTH_SERVICE_URL}/logout`, { method: 'POST' });
  } catch {
    // Silent fail - cookie already cleared
  }
}
