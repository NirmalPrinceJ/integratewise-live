/**
 * Native Client (React Native / Electron)
 * 
 * For mobile apps (Expo/React Native) and desktop apps (Electron).
 * Uses secure storage for token persistence.
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export type { Database }
export type SupabaseClient = ReturnType<typeof createSupabaseClient<Database>>

/**
 * Storage interface for native platforms
 */
export interface SecureStorage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

export interface NativeClientConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  storage: SecureStorage
}

let nativeClient: SupabaseClient | null = null

/**
 * Create Supabase client for native platforms
 * 
 * @example React Native with expo-secure-store:
 * ```ts
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
 * ```
 * 
 * @example Electron with electron-store:
 * ```ts
 * import Store from 'electron-store'
 * const store = new Store()
 * 
 * const client = createNativeClient({
 *   supabaseUrl: 'https://xxx.supabase.co',
 *   supabaseAnonKey: 'xxx',
 *   storage: {
 *     getItem: async (key) => store.get(key) ?? null,
 *     setItem: async (key, value) => store.set(key, value),
 *     removeItem: async (key) => store.delete(key),
 *   },
 * })
 * ```
 */
export function createNativeClient(config: NativeClientConfig): SupabaseClient {
  if (nativeClient) return nativeClient
  
  const { supabaseUrl, supabaseAnonKey, storage } = config
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  nativeClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key: string) => {
          return storage.getItem(key)
        },
        setItem: async (key: string, value: string) => {
          await storage.setItem(key, value)
        },
        removeItem: async (key: string) => {
          await storage.removeItem(key)
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disable URL detection on native
    },
  })
  
  return nativeClient
}

/**
 * Get existing native client (throws if not initialized)
 */
export function getNativeClient(): SupabaseClient {
  if (!nativeClient) {
    throw new Error('Native client not initialized. Call createNativeClient first.')
  }
  return nativeClient
}

/**
 * Reset client (useful for logout or testing)
 */
export function resetNativeClient(): void {
  nativeClient = null
}

// Re-export types
export type { SecureStorage as NativeStorage }
