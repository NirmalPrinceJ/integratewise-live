/**
 * @integratewise/supabase
 * 
 * Cross-platform Supabase integration for IntegrateWise OS.
 * Works on Web, Mobile (React Native), and Desktop (Electron).
 * 
 * @example Web (Next.js)
 * ```ts
 * import { createClient, useAuth, useChats } from '@integratewise/supabase'
 * 
 * const client = createClient()
 * const { user } = useAuth(client)
 * ```
 * 
 * @example Mobile (React Native / Expo)
 * ```ts
 * import { createNativeClient, useAuth } from '@integratewise/supabase'
 * import * as SecureStore from 'expo-secure-store'
 * 
 * const client = createNativeClient({
 *   supabaseUrl: 'https://xxx.supabase.co',
 *   supabaseAnonKey: 'xxx',
 *   storage: {
 *     getItem: SecureStore.getItemAsync,
 *     setItem: SecureStore.setItemAsync,
 *     removeItem: SecureStore.deleteItemAsync,
 *   },
 * })
 * const { user } = useAuth(client)
 * ```
 * 
 * @example Server (API routes)
 * ```ts
 * import { createServerClient } from '@integratewise/supabase/server'
 * 
 * const client = createServerClient()
 * const { data } = await client.from('profiles').select()
 * ```
 */

// Types
export * from './types'

// Browser/Web client
export { createClient, createBrowserClient, resetClient } from './client'

// Native client (React Native / Electron)
export { createNativeClient, getNativeClient, resetNativeClient } from './native'
export type { SecureStorage, NativeClientConfig } from './native'

// Hooks (platform-agnostic)
export {
  useAuth,
  useContexts,
  useChats,
  useChat,
  type AuthState,
} from './hooks'
