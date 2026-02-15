/**
 * Supabase Server Client
 * 
 * Use this for server-side operations (API routes, server components).
 * Creates a new client per request with proper cookie handling.
 */
import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./types"

/**
 * Create a Supabase server client with cookie-based auth
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component context - cookies are read-only
          }
        },
      },
    }
  )
}

/**
 * Create a Supabase admin client (bypasses RLS)
 * 
 * ⚠️ ONLY use for admin operations with proper authorization checks
 */
export function createAdminClient() {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for admin client
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Re-export for convenience
export { createServerClient as createClient }
