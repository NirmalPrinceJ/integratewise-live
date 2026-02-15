/**
 * Browser/Web Client
 * 
 * For Next.js, React web apps running in the browser.
 * Uses singleton pattern for client reuse.
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export type { Database }
export type SupabaseClient = ReturnType<typeof createSupabaseClient<Database>>

let browserClient: SupabaseClient | null = null

export interface ClientConfig {
  supabaseUrl?: string
  supabaseAnonKey?: string
}

/**
 * Create or get browser Supabase client (singleton)
 */
export function createClient(config?: ClientConfig): SupabaseClient {
  if (browserClient) return browserClient
  
  const url = config?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = config?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }
  
  browserClient = createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  
  return browserClient
}

/**
 * Reset client (useful for testing)
 */
export function resetClient(): void {
  browserClient = null
}

// Re-export for convenience
export { createClient as createBrowserClient }
