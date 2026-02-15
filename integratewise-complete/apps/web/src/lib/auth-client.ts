'use client';

/**
 * Client-side Authentication (Cloudflare Access / JWT)
 * 
 * Browser-side auth utilities that work with the auth Worker service.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  workspace_id?: string;
  tenant_id?: string;
  role?: string;
}

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'https://auth.integratewise.ai';

/**
 * Sign in with email/password
 */
export async function signInWithEmail(email: string, password: string) {
  const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Authentication failed');
  }

  return response.json();
}

/**
 * Sign in with OAuth provider via Cloudflare Access
 */
export async function signInWithProvider(provider: 'google' | 'github' | 'microsoft') {
  // Cloudflare Access handles OAuth - redirect to Access login
  const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
  window.location.href = `${AUTH_SERVICE_URL}/oauth/${provider}?redirect_uri=${callbackUrl}`;
}

export async function signInWithGoogle() {
  return signInWithProvider('google');
}

export async function signInWithMicrosoft() {
  return signInWithProvider('microsoft');
}

export async function signInWithGithub() {
  return signInWithProvider('github');
}

/**
 * Sign up new user
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
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Registration failed');
  }

  return response.json();
}

/**
 * Sign out - clear session
 */
export async function signOut() {
  await fetch(`${AUTH_SERVICE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  // Redirect to home
  window.location.href = '/';
}

/**
 * Get current session from API route
 */
export async function getClientSession(): Promise<{ user: AuthUser | null }> {
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include',
    });

    if (!response.ok) {
      return { user: null };
    }

    return response.json();
  } catch {
    return { user: null };
  }
}
