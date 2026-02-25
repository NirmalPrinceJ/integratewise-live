/**
 * IntegrateWise Database Package
 * 
 * Supabase-only implementation (Neon removed)
 * Provides database clients for Workers and server environments
 */

// Supabase client exports
export {
  createAdminClient,
  createDbClient,
  query,
  checkHealth,
  createClient,
  SupabaseClient,
  type DatabaseConfig,
} from './supabase'

// Backward compatibility - redirects to Supabase
export function createDb(connectionString?: string) {
  console.warn('createDb() is deprecated, use createDbClient() from @integratewise/db')
  const { createDbClient } = require('./supabase')
  return createDbClient()
}
