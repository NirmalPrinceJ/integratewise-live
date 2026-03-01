/**
 * Supabase Client Singleton — Frontend
 *
 * Configuration priority:
 *   1. Doppler-injected VITE_* env vars (production / staging)
 *   2. Hardcoded fallback values from Figma setup (local dev)
 *
 * Auth: PKCE flow — tokens return as ?code= query params, not hash fragments.
 * SSO: Google OAuth + GitHub OAuth already configured in Supabase dashboard.
 */
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey;

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
