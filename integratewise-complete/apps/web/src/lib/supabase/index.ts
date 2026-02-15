/**
 * Supabase Integration
 * 
 * Single import for all Supabase utilities and hooks.
 * 
 * @example
 * // Client-side (browser)
 * import { createClient, useAuth, useChats, useContexts } from '@/lib/supabase'
 * 
 * // Server-side (API routes, Server Components)
 * import { createServerClient, createAdminClient } from '@/lib/supabase/server-client'
 */

// Client
export { createClient } from './client'

// Server (import directly from server-client for RSC/API routes)
// export { createServerClient, createAdminClient } from './server-client'

// Types
export * from './types'

// Auth Hooks
export {
  useAuth,
  useSignIn,
  useSignUp,
  useSignOut,
  usePasswordReset,
  type AuthState,
} from './auth-hooks'

// Context Hooks (L1 Workplace)
export {
  useContexts,
  usePreferences,
  useWorkspace,
} from './context-hooks'

// Chat Hooks (L2 Cognitive)
export {
  useChats,
  useChat,
  useQuickChat,
} from './chat-hooks'
