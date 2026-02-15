/**
 * IntegrateWise OS - Root Type Definitions
 * 
 * Note: For UUID branded types, import from ./src/types/uuid
 * These types use string for backward compatibility but should
 * be treated as UUIDs in all new code.
 */

// Re-export UUID types for convenience
export type {
  UUID,
  TenantId,
  UserId,
  SessionId,
  TopicId,
  AccountId,
  SignalId,
  ExecutionId,
  ConnectorId,
} from './src/types/uuid';

export type Provider = 'chatgpt' | 'claude' | 'grok' | 'gemini' | 'other';

export type Cadence = 'weekly' | 'biweekly';

export interface Attachment {
  name: string;
  gcs_path: string;
}

/**
 * AI Session record
 * @property id - Session UUID (SessionId)
 * @property tenant_id - Tenant UUID (TenantId)
 * @property user_id - User UUID (UserId)
 */
export interface Session {
  id: string; // SessionId
  tenant_id: string; // TenantId
  user_id: string; // UserId
  provider: Provider;
  started_at: string; // ISO-8601
  ended_at: string; // ISO-8601
  summary_md: string;
  topics: string[];
  attachments?: Attachment[];
  project?: string;
}

/**
 * Knowledge Topic
 * @property id - Topic UUID (TopicId)
 */
export interface Topic {
  id: string; // TopicId
  name: string;
  cadence: Cadence;
  last_synced_at?: string; // ISO-8601
}

export type Page = 'inbox' | 'search' | 'topics' | 'demo' | 'spine';
