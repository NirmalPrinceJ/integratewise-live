/**
 * Supabase Configuration
 *
 * Reads from Vite env vars (sourced from Doppler at build time).
 *
 * Doppler keys: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 */

const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Extract project ID from URL (https://<projectId>.supabase.co)
function extractProjectId(url: string): string {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : "";
}

if (!envUrl || !envKey) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. " +
    "Run with Doppler: doppler run --config dev_web-unified -- pnpm dev"
  );
}

export const projectId = extractProjectId(envUrl);
export const publicAnonKey = envKey;
