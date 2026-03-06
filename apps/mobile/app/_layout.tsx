/**
 * Root Layout
 */
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SupabaseProvider } from '../lib/supabase-provider'

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <StatusBar style="auto" />
      <Slot />
    </SupabaseProvider>
  )
}
