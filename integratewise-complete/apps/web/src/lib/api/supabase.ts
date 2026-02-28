/**
 * Supabase Client
 * 
 * Database connection for L3 Spine
 * 
 * NOTE: Environment variables are injected by Doppler at runtime.
 * NO .env files are used. Secrets are managed centrally via Doppler.
 * 
 * Development: doppler run -- npm run dev
 * Production: doppler run -- npm run build
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials not found. " +
    "Ensure Doppler is configured: doppler run -- npm run dev"
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key"
);

// Type for database tables
export type Database = {
  public: {
    Tables: {
      spine_entities: {
        Row: {
          id: string;
          tenant_id: string;
          entity_type: string;
          name: string;
          status: string;
          data: Record<string, any>;
          completeness_score: number;
          health_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Tables["spine_entities"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Tables["spine_entities"]["Row"]>;
      };
      ai_insights: {
        Row: {
          id: string;
          tenant_id: string;
          entity_id: string;
          insight_type: string;
          title: string;
          description: string;
          confidence: number;
          status: string;
          created_at: string;
        };
      };
      actions: {
        Row: {
          id: string;
          tenant_id: string;
          entity_id: string;
          action_type: string;
          title: string;
          description: string;
          status: string;
          created_at: string;
        };
      };
    };
  };
};
