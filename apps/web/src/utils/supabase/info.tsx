/**
 * Supabase Configuration
 *
 * Reads from Vite env vars (sourced from Doppler at build time).
 * Falls back to hardcoded values for local development.
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

// Fallback values (public anon key — safe to commit)
const FALLBACK_PROJECT_ID = "hrrbciljsqxnmuwwnrnt";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhycmJjaWxqc3F4bm11d3ducm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Mzc0MjUsImV4cCI6MjA4NTIxMzQyNX0.Af158eQ6-KoS-zlKslALN0SiprqkVFeId4iaV2sOXuY";

export const projectId = extractProjectId(envUrl) || FALLBACK_PROJECT_ID;
export const publicAnonKey = envKey || FALLBACK_ANON_KEY;
