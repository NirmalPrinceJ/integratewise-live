import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AppEnv {
    DATABASE_URL: string;
    DB: D1Database;
    AI?: Ai; // Cloudflare Workers AI binding
    OPENAI_API_KEY?: string;
    OPENROUTER_API_KEY?: string;
    CLAUDE_API_KEY?: string;
    DEEPSEEK_API_KEY?: string;
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    KNOWLEDGE_SERVICE_URL?: string;
    FIRESTORE_PROJECT_ID?: string;
    ENVIRONMENT: string;
}

/**
 * Creates a standard Supabase client for use in Cloudflare Workers
 */
export function getSupabaseClient(env: AppEnv): SupabaseClient | null {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        return null;
    }
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Utility to get API keys from env
 */
export function getApiKey(env: AppEnv, provider: 'openai' | 'claude' | 'deepseek'): string | undefined {
    switch (provider) {
        case 'openai': return env.OPENAI_API_KEY;
        case 'claude': return env.CLAUDE_API_KEY;
        case 'deepseek': return env.DEEPSEEK_API_KEY;
        default: return undefined;
    }
}
