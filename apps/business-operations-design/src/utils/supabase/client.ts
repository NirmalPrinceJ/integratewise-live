/**
 * Supabase Client Singleton — Frontend
 * 
 * Uses PKCE auth flow to avoid conflicts with hash-based routing.
 * Tokens come back as ?code=xxx query params, not hash fragments.
 */
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export { supabaseUrl };
