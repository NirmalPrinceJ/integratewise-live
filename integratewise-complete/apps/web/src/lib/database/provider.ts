/**
 * Database Provider - Supabase Only
 * 
 * Works with BOTH:
 * - Local: .env.local file
 * - Production: Doppler secrets injection
 * 
 * No provider abstraction - direct Supabase connection
 */

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Environment variables
// Works with: .env.local (dev) OR Doppler injection (prod)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validate env vars
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Local: Check .env.local file\n' +
    'Doppler: Run "doppler secrets" to verify'
  )
}

/**
 * Create browser client (for client components)
 */
export function createBrowserDbClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Create server client (for server components)
 */
export function createServerDbClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create admin client (bypasses RLS - for admin operations only)
 */
export function createAdminDbClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY missing.\n' +
      'Local: Add to .env.local\n' +
      'Doppler: Run "doppler secrets set SUPABASE_SERVICE_ROLE_KEY"'
    )
  }
  
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Export singleton for convenience
export const supabase = createServerDbClient()

// Re-export types
export type { SupabaseClient }
