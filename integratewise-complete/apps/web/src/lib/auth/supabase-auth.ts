/**
 * Supabase Authentication Service
 *
 * Production-ready auth using Supabase Auth
 * Supports: Email/Password, OAuth, Magic Links
 */

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Create Supabase client for server-side operations
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: async (key: string) => {
          return cookieStore.get(key)?.value ?? null
        },
        setItem: async (key: string, value: string) => {
          cookieStore.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
          })
        },
        removeItem: async (key: string) => {
          cookieStore.delete(key)
        },
      },
    },
  })
}

/**
 * Create Supabase client for client-side operations
 */
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

/**
 * Get current session from server
 */
export async function getSession() {
  const supabase = await createServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    return null
  }

  return session
}

/**
 * Get current user from server
 */
export async function getUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  return user
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, session: null, error: error.message }
  }

  return { user: data.user, session: data.session, error: null }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { user: null, session: null, error: error.message }
  }

  return { user: data.user, session: data.session, error: null }
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
