/**
 * Server Client
 * 
 * For Node.js server-side usage (API routes, SSR, etc.)
 * Uses service role key for admin operations.
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export type { Database }
export type SupabaseClient = ReturnType<typeof createSupabaseClient<Database>>

export interface ServerClientConfig {
  supabaseUrl?: string
  supabaseServiceKey?: string
}

/**
 * Create server-side Supabase client
 * Uses service role key for full access (bypasses RLS)
 */
export function createServerClient(config?: ServerClientConfig): SupabaseClient {
  const url = config?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = config?.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase server configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    )
  }
  
  return createSupabaseClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create admin client (alias for server client)
 */
export const createAdminClient = createServerClient
