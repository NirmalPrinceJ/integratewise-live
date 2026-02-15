/**
 * Multi-Platform Database Abstraction
 * 
 * Unified interface for multiple database providers:
 * - Supabase (PostgreSQL + Auth + Realtime)
 * - Neon (Serverless PostgreSQL)
 * - PlanetScale (MySQL-compatible)
 * - Direct PostgreSQL
 * 
 * Auto-detects provider from environment variables.
 */

export type DatabaseProvider = 'supabase' | 'neon' | 'planetscale' | 'postgres' | 'unknown'

export interface DatabaseConfig {
  provider: DatabaseProvider
  connectionString?: string
  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
  ssl?: boolean
  pooling?: boolean
}

/**
 * Detect which database provider is configured
 */
export function detectProvider(): DatabaseProvider {
  // Check Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return 'supabase'
  }
  
  // Check Neon
  if (process.env.DATABASE_URL?.includes('neon.tech') || process.env.NEON_DATABASE_URL) {
    return 'neon'
  }
  
  // Check PlanetScale
  if (process.env.DATABASE_URL?.includes('planetscale') || process.env.PLANETSCALE_DATABASE_URL) {
    return 'planetscale'
  }
  
  // Check generic PostgreSQL
  if (process.env.DATABASE_URL?.includes('postgres')) {
    return 'postgres'
  }
  
  return 'unknown'
}

/**
 * Get database configuration from environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  const provider = detectProvider()
  
  switch (provider) {
    case 'supabase':
      return {
        provider,
        connectionString: process.env.DATABASE_URL,
        host: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '.supabase.co'),
        ssl: true,
        pooling: true,
      }
      
    case 'neon':
      return {
        provider,
        connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
        ssl: true,
        pooling: true, // Neon uses connection pooling
      }
      
    case 'planetscale':
      return {
        provider,
        connectionString: process.env.PLANETSCALE_DATABASE_URL || process.env.DATABASE_URL,
        ssl: true,
        pooling: false, // PlanetScale handles pooling
      }
      
    case 'postgres':
      return {
        provider,
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL !== 'false',
        pooling: process.env.DATABASE_POOLING !== 'false',
      }
      
    default:
      return { provider: 'unknown' }
  }
}

/**
 * Check if a specific feature is supported by current provider
 */
export function supportsFeature(feature: 'auth' | 'realtime' | 'storage' | 'edge-functions' | 'rls'): boolean {
  const provider = detectProvider()
  
  const featureMatrix: Record<DatabaseProvider, Record<string, boolean>> = {
    supabase: {
      auth: true,
      realtime: true,
      storage: true,
      'edge-functions': true,
      rls: true,
    },
    neon: {
      auth: false,
      realtime: false,
      storage: false,
      'edge-functions': false,
      rls: true,
    },
    planetscale: {
      auth: false,
      realtime: false,
      storage: false,
      'edge-functions': false,
      rls: false, // MySQL doesn't have native RLS
    },
    postgres: {
      auth: false,
      realtime: false,
      storage: false,
      'edge-functions': false,
      rls: true,
    },
    unknown: {
      auth: false,
      realtime: false,
      storage: false,
      'edge-functions': false,
      rls: false,
    },
  }
  
  return featureMatrix[provider][feature] ?? false
}

/**
 * Get the appropriate auth provider based on database
 */
export function getAuthProvider(): 'supabase' | 'clerk' | 'nextauth' | 'custom' {
  const provider = detectProvider()
  
  if (provider === 'supabase') {
    return 'supabase'
  }
  
  // Check for Clerk
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return 'clerk'
  }
  
  // Check for NextAuth
  if (process.env.NEXTAUTH_SECRET) {
    return 'nextauth'
  }
  
  return 'custom'
}

export const dbConfig = {
  provider: detectProvider,
  config: getDatabaseConfig,
  supports: supportsFeature,
  authProvider: getAuthProvider,
}
