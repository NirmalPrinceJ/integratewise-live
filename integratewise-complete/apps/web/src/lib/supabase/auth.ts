'use client';

/**
 * Direct Supabase Authentication
 * 
 * For testing and local development without Cloudflare Access
 */

import { createBrowserDbClient } from '@/lib/database/provider';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  workspace_id?: string;
  tenant_id?: string;
  role?: string;
}

/**
 * Sign in with email/password (direct Supabase)
 */
export async function signInWithSupabaseEmail(email: string, password: string) {
  const supabase = createBrowserDbClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign up with email/password (direct Supabase)
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata?: { name?: string; workspace?: string }
) {
  const supabase = createBrowserDbClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign in with OAuth provider (direct Supabase)
 */
export async function signInWithSupabaseOAuth(provider: 'google' | 'github' | 'microsoft') {
  const supabase = createBrowserDbClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // OAuth redirects automatically
  if (data.url) {
    window.location.href = data.url;
  }
}

/**
 * Sign out (direct Supabase)
 */
export async function signOutSupabase() {
  const supabase = createBrowserDbClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
  }
  
  window.location.href = '/';
}

/**
 * Get current session (direct Supabase)
 */
export async function getSupabaseSession() {
  const supabase = createBrowserDbClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Session error:', error);
    return null;
  }
  
  return session;
}

/**
 * Get current user (direct Supabase)
 */
export async function getSupabaseUser() {
  const supabase = createBrowserDbClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('User error:', error);
    return null;
  }
  
  return user;
}
