/**
 * Supabase Database Client
 * 
 * Replaces Neon with Supabase PostgreSQL
 * Uses connection pooling for serverless environments
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Database schema for Spine
const SCHEMA = 'hub'

export interface DatabaseConfig {
  url: string
  serviceRoleKey: string
  schema?: string
}

/**
 * Create a Supabase admin client (bypasses RLS)
 * Use for: Server-side operations, migrations, admin functions
 */
export function createAdminClient(
  url: string = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY!
): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    db: { schema: SCHEMA },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create a Supabase client with schema set
 * Use for: Cloudflare Workers, Edge functions
 */
export function createDbClient(config?: Partial<DatabaseConfig>): SupabaseClient {
  const url = config?.url || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = config?.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY!
  const schema = config?.schema || SCHEMA

  return createClient(url, key, {
    db: { schema },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Raw SQL query helper for complex queries
 * Uses Supabase's rpc for custom SQL functions
 */
export async function query<T = any>(
  client: SupabaseClient,
  sql: string,
  params?: Record<string, any>
): Promise<T[]> {
  // For complex queries, use a stored procedure or rpc
  // This is a wrapper that can be extended with custom rpc calls
  const { data, error } = await client.rpc('exec_sql', { sql, params })
  
  if (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
  
  return data || []
}

/**
 * Check database connection health
 */
export async function checkHealth(client: SupabaseClient): Promise<{ healthy: boolean; latency: number }> {
  const start = Date.now()
  
  try {
    const { error } = await client.from('health_check').select('*').limit(1)
    const latency = Date.now() - start
    
    // Table might not exist, that's ok - connection worked
    return { healthy: !error || error.code !== 'PGRST301', latency }
  } catch (e) {
    return { healthy: false, latency: Date.now() - start }
  }
}

export { createClient, SupabaseClient }
