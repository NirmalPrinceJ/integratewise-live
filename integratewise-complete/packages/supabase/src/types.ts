/**
 * Cross-Platform Supabase Types
 * 
 * Database schema types shared across Web, Mobile, and Desktop.
 * Run `npx supabase gen types typescript` to regenerate from live schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * IntegrateWise OS Database Schema
 * 
 * Organized by layer:
 * - P0: Governance Plane (tenants, profiles, audit)
 * - L0: Onboarding (buckets, connectors)
 * - L3: Adaptive Spine (entities, schema registry)
 * - L2: Cognitive Brain (ai_chats, decisions, signals)
 * - L1: Workplace (contexts, tasks)
 */
export interface Database {
  public: {
    Tables: {
      // ═══════════════════════════════════════════════════════════════
      // P0 — GOVERNANCE PLANE
      // ═══════════════════════════════════════════════════════════════
      
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          plan: 'personal' | 'team' | 'org' | 'enterprise'
          created_at: string
          updated_at: string
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: 'personal' | 'team' | 'org' | 'enterprise'
          created_at?: string
          updated_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: 'personal' | 'team' | 'org' | 'enterprise'
          updated_at?: string
          settings?: Json
        }
      }
      
      profiles: {
        Row: {
          id: string
          tenant_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'owner' | 'admin' | 'manager' | 'practitioner' | 'readonly'
          department: string | null
          created_at: string
          updated_at: string
          preferences: Json
        }
        Insert: {
          id: string
          tenant_id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'owner' | 'admin' | 'manager' | 'practitioner' | 'readonly'
          department?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          role?: 'owner' | 'admin' | 'manager' | 'practitioner' | 'readonly'
          department?: string | null
          updated_at?: string
          preferences?: Json
        }
      }
      
      audit_log: {
        Row: {
          id: string
          tenant_id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          metadata: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
      
      // ═══════════════════════════════════════════════════════════════
      // L0 — ONBOARDING LAYER
      // ═══════════════════════════════════════════════════════════════
      
      base_buckets: {
        Row: {
          id: string
          tenant_id: string
          bucket_type: string
          state: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE'
          connected_source: string | null
          connector_status: 'disconnected' | 'connecting' | 'connected' | 'error'
          connector_config: Json | null
          seed_method: 'oauth' | 'csv' | 'api' | 'manual' | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          bucket_type: string
          state?: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE'
          connected_source?: string | null
          connector_status?: 'disconnected' | 'connecting' | 'connected' | 'error'
          connector_config?: Json | null
          seed_method?: 'oauth' | 'csv' | 'api' | 'manual' | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          state?: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE'
          connected_source?: string | null
          connector_status?: 'disconnected' | 'connecting' | 'connected' | 'error'
          connector_config?: Json | null
          seed_method?: 'oauth' | 'csv' | 'api' | 'manual' | null
          updated_at?: string
        }
      }
      
      department_buckets: {
        Row: {
          id: string
          tenant_id: string
          department_key: string
          state: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE'
          required_base_buckets: string[]
          optional_base_buckets: string[]
          unlocked_modules: string[]
          unlocked_routes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          department_key: string
          state?: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE'
          required_base_buckets?: string[]
          optional_base_buckets?: string[]
          unlocked_modules?: string[]
          unlocked_routes?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          state?: 'OFF' | 'ADDING' | 'SEEDED' | 'LIVE'
          unlocked_modules?: string[]
          unlocked_routes?: string[]
          updated_at?: string
        }
      }
      
      // ═══════════════════════════════════════════════════════════════
      // L3 — ADAPTIVE SPINE
      // ═══════════════════════════════════════════════════════════════
      
      spine_entities: {
        Row: {
          id: string
          tenant_id: string
          entity_type: string
          external_id: string | null
          source_system: string
          data: Json
          lineage: Json
          confidence: number
          maturity_level: number
          completeness_score: number
          created_at: string
          updated_at: string
          last_observed_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          entity_type: string
          external_id?: string | null
          source_system: string
          data: Json
          lineage?: Json
          confidence?: number
          maturity_level?: number
          completeness_score?: number
          created_at?: string
          updated_at?: string
          last_observed_at?: string
        }
        Update: {
          data?: Json
          lineage?: Json
          confidence?: number
          maturity_level?: number
          completeness_score?: number
          updated_at?: string
          last_observed_at?: string
        }
      }
      
      // ═══════════════════════════════════════════════════════════════
      // L2 — COGNITIVE BRAIN
      // ═══════════════════════════════════════════════════════════════
      
      ai_chats: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          title: string | null
          surface: string
          context_entity_type: string | null
          context_entity_id: string | null
          model: string
          created_at: string
          updated_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          title?: string | null
          surface: string
          context_entity_type?: string | null
          context_entity_id?: string | null
          model?: string
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Update: {
          title?: string | null
          updated_at?: string
          archived_at?: string | null
        }
      }
      
      ai_chat_messages: {
        Row: {
          id: string
          chat_id: string
          role: 'user' | 'assistant' | 'system' | 'tool'
          content: string
          tool_calls: Json | null
          tool_results: Json | null
          evidence_refs: string[]
          tokens_input: number | null
          tokens_output: number | null
          latency_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          role: 'user' | 'assistant' | 'system' | 'tool'
          content: string
          tool_calls?: Json | null
          tool_results?: Json | null
          evidence_refs?: string[]
          tokens_input?: number | null
          tokens_output?: number | null
          latency_ms?: number | null
          created_at?: string
        }
        Update: never
      }
      
      signals: {
        Row: {
          id: string
          tenant_id: string
          signal_type: string
          severity: 'info' | 'warning' | 'critical'
          source: string
          entity_type: string | null
          entity_id: string | null
          title: string
          description: string | null
          metadata: Json
          acknowledged_by: string | null
          acknowledged_at: string | null
          resolved_at: string | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          signal_type: string
          severity?: 'info' | 'warning' | 'critical'
          source: string
          entity_type?: string | null
          entity_id?: string | null
          title: string
          description?: string | null
          metadata?: Json
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          resolved_at?: string | null
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          resolved_at?: string | null
        }
      }
      
      // ═══════════════════════════════════════════════════════════════
      // L1 — THE WORKPLACE
      // ═══════════════════════════════════════════════════════════════
      
      contexts: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          context_type: 'workspace' | 'entity' | 'session' | 'preference'
          key: string
          value: Json
          entity_type: string | null
          entity_id: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          context_type: 'workspace' | 'entity' | 'session' | 'preference'
          key: string
          value: Json
          entity_type?: string | null
          entity_id?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          value?: Json
          expires_at?: string | null
          updated_at?: string
        }
      }
      
      tasks: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done' | 'blocked'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          entity_type: string | null
          entity_id: string | null
          department: string | null
          source: string
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          entity_type?: string | null
          entity_id?: string | null
          department?: string | null
          source?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          updated_at?: string
          completed_at?: string | null
        }
      }
    }
    
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Tenant = Tables<'tenants'>
export type Profile = Tables<'profiles'>
export type BaseBucket = Tables<'base_buckets'>
export type SpineEntity = Tables<'spine_entities'>
export type AIChat = Tables<'ai_chats'>
export type AIChatMessage = Tables<'ai_chat_messages'>
export type Context = Tables<'contexts'>
export type Task = Tables<'tasks'>
export type Signal = Tables<'signals'>
