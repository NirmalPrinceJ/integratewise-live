/**
 * IntegrateWise Normalizer Service - Type Definitions
 * 
 * Best Practice: All types include correlation_id for end-to-end tracing
 */

// =============================================================================
// ENTITY TYPES
// =============================================================================

export type EntityType =
  | 'client' | 'deal' | 'ticket' | 'subscription' | 'event'
  | 'account_master' | 'people_team' | 'business_context' | 'strategic_objective'
  | 'capability' | 'value_stream' | 'api_portfolio' | 'account_metric'
  | 'initiative' | 'risk_register' | 'platform_health' | 'stakeholder_outcome'
  | 'engagement_log' | 'success_plan' | 'task' | 'insight';

// =============================================================================
// NORMALIZATION REQUEST/RESPONSE
// =============================================================================

export interface NormalizeRequest {
  tenant_id: string;
  category?: 'personal' | 'csm' | 'business' | 'team';
  user_id?: string;
  account_id?: string;
  team_id?: string;
  user_role?: string;
  entity_type: EntityType;
  raw_data: Record<string, unknown>;
  source_system?: string;
  idempotency_key?: string;
  correlation_id?: string; // Best Practice: Correlation ID for tracing
}

export interface NormalizeResponse {
  success: boolean;
  entity_type: EntityType;
  dedup_key: string;
  version: number;
  normalized_data?: Record<string, unknown>;
  errors?: ValidationError[];
  dlq_id?: string;
  correlation_id?: string; // Best Practice: Echo back correlation ID
  is_duplicate?: boolean; // Best Practice: Indicate if this was a duplicate
  trust_metrics?: TrustMetrics; // Trust Layer: Verifiability score
}

export interface TrustMetrics {
  score: number; // 0-100
  reasoning: string[];
  provenance: {
    source: string;
    verified: boolean;
    hops: number;
  };
}

export interface BatchNormalizeRequest {
  tenant_id: string;
  entity_type: EntityType;
  items: Record<string, unknown>[];
  source_system?: string;
}

export interface BatchNormalizeResponse {
  success: boolean;
  total: number;
  succeeded: number;
  failed: number;
  results: NormalizeResponse[];
}

// =============================================================================
// VALIDATION
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: ErrorCode;
  value?: unknown;
}

export type ErrorCode =
  | 'validation_error'
  | 'format_error'
  | 'missing_field'
  | 'invalid_type'
  | 'invalid_enum'
  | 'constraint_violation'
  | 'schema_not_found'
  | 'unknown_error';

export interface ValidateRequest {
  entity_type: EntityType;
  data: Record<string, unknown>;
}

export interface ValidateResponse {
  valid: boolean;
  errors: ValidationError[];
}

// =============================================================================
// DLQ (Dead Letter Queue)
// =============================================================================

export interface DLQEntry {
  id: string;
  tenant_id: string;
  entity_type: EntityType;
  raw_data: Record<string, unknown>;
  errors: ValidationError[];
  error_classification: ErrorClassification;
  source_system?: string;
  occurred_at: string;
  resolved: boolean;
  resolved_at?: string;
  retry_count: number;
}

export type ErrorClassification =
  | 'validation'      // Schema validation failed
  | 'format'          // Data format issues (dates, UUIDs, etc.)
  | 'missing_field'   // Required field missing
  | 'transform'       // Transformation/mapping error
  | 'system';         // System/database error

export interface DLQWriteResult {
  success: boolean;
  dlq_id?: string;
  error?: string;
}

// =============================================================================
// CANONICAL VERSION MANAGEMENT
// =============================================================================

export interface VersionInfo {
  dedup_key: string;
  version: number;
  updated_at: string;
}

// =============================================================================
// SCHEMA REGISTRY
// =============================================================================

export interface SchemaInfo {
  entity_type: EntityType;
  schema_id: string;
  title: string;
  description: string;
  required_fields: string[];
  version: string;
}

// =============================================================================
// ENVIRONMENT BINDINGS
// =============================================================================

export interface Env {
  ENVIRONMENT: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_KEY?: string;
  DATABASE_URL?: string;
  DB: D1Database;
  FILES: R2Bucket;
}
