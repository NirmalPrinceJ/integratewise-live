/**
 * IntegrateWise V11.11 - Brainstorming Layer Types
 * 
 * LOOP A: Context-to-Truth (Human Governed)
 * The Brainstorming Layer captures AI context for TRACEABILITY and TRIGGERS ACTIONS.
 * It NEVER writes directly to Spine. Context → Action → Tool → Loader → Normalizer → Spine.
 */

// =============================================================================
// INTAKE SOURCES (Loop A Entry Points)
// =============================================================================

export type IntakeSource = 
  | 'slack'
  | 'whatsapp'
  | 'telegram'
  | 'custom_gpt'
  | 'web_chat'
  | 'api'
  | 'discord';

// =============================================================================
// BRAINSTORMING SESSION
// =============================================================================

export interface BrainstormSession {
  session_id: string;
  workspace_id: string;
  organization_id?: string; // Optional account context
  user_id: string;
  
  // Session metadata
  title?: string;
  session_type: SessionType;
  
  // Intake source (Loop A entry points)
  intake_source: IntakeSource;
  intake_channel_id?: string; // Channel/thread ID from source
  
  // AI context
  model_used?: string; // 'gpt-4', 'claude-3', etc.
  total_tokens?: number;
  
  // Timestamps
  started_at: string;
  ended_at?: string;
  
  // Searchable summary
  summary?: string;
  key_insights?: string[];
  action_items?: string[];
  
  // Status
  status: 'active' | 'archived' | 'completed';
  
  created_at: string;
}

export type SessionType = 
  | 'strategy'
  | 'problem_solving'
  | 'planning'
  | 'analysis'
  | 'triage'
  | 'support'
  | 'sales'
  | 'general';

// =============================================================================
// BRAINSTORMING MESSAGE
// =============================================================================

export interface BrainstormMessage {
  message_id: string;
  session_id: string;
  
  // Message content
  role: 'user' | 'assistant' | 'system';
  content: string;
  
  // Metadata
  tokens?: number;
  
  created_at: string;
}

// =============================================================================
// BRAINSTORMING INSIGHT
// =============================================================================

export interface BrainstormInsight {
  insight_id: string;
  workspace_id: string;
  organization_id?: string;
  session_id?: string;
  
  // Insight content
  insight_type: InsightType;
  title: string;
  description: string;
  confidence?: number; // 0.00 to 1.00
  
  // Validation (human governance)
  validated_by?: string;
  validated_at?: string;
  outcome?: 'applied' | 'rejected' | 'pending';
  
  created_at: string;
}

export type InsightType = 
  | 'learning'
  | 'pattern'
  | 'recommendation'
  | 'risk'
  | 'opportunity';

// =============================================================================
// BRAINSTORMING ACTION (Bridge to Truth)
// =============================================================================

/**
 * Actions are the CRITICAL bridge from Context → Tools.
 * Actions are the ONLY way Context can influence Truth.
 * 
 * Flow: Action → Tool update → Loader → Normalizer → Spine (Truth)
 */
export interface BrainstormAction {
  action_id: string;
  workspace_id: string;
  session_id?: string;
  insight_id?: string;
  
  // Action details
  action_type: ActionType;
  target_tool: TargetTool;
  payload: ActionPayload;
  
  // Human governance
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  
  // Execution status
  status: ActionStatus;
  executed_at?: string;
  error_message?: string;
  
  // Result tracking (links back to Spine once ingested)
  result_spine_id?: string; // The spine record created/updated after tool sync
  result_type?: SpineEntityType;
  
  // Audit
  created_by: string;
  created_at: string;
}

export type ActionType = 
  | 'create_task'
  | 'update_crm'
  | 'send_message'
  | 'log_note'
  | 'create_ticket'
  | 'update_deal'
  | 'schedule_meeting'
  | 'send_email';

export type TargetTool = 
  | 'asana'
  | 'salesforce'
  | 'hubspot'
  | 'slack'
  | 'notion'
  | 'zendesk'
  | 'intercom'
  | 'jira'
  | 'linear'
  | 'google_calendar'
  | 'gmail';

export type ActionStatus = 
  | 'pending'
  | 'approved'
  | 'executing'
  | 'executed'
  | 'failed'
  | 'cancelled';

export type SpineEntityType = 
  | 'organization'
  | 'person'
  | 'deal'
  | 'ticket'
  | 'event'
  | 'document';

// =============================================================================
// ACTION PAYLOADS
// =============================================================================

export type ActionPayload = 
  | CreateTaskPayload
  | UpdateCrmPayload
  | SendMessagePayload
  | LogNotePayload
  | CreateTicketPayload
  | UpdateDealPayload;

export interface CreateTaskPayload {
  type: 'create_task';
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  project_id?: string;
  tags?: string[];
}

export interface UpdateCrmPayload {
  type: 'update_crm';
  record_type: 'account' | 'contact' | 'opportunity';
  record_id?: string; // External ID in CRM
  spine_id?: string; // Spine ID for reference
  fields: Record<string, unknown>;
}

export interface SendMessagePayload {
  type: 'send_message';
  channel_id: string;
  message: string;
  thread_ts?: string; // For threaded replies
  mentions?: string[];
}

export interface LogNotePayload {
  type: 'log_note';
  title: string;
  content: string;
  parent_id?: string;
  tags?: string[];
}

export interface CreateTicketPayload {
  type: 'create_ticket';
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  requester_email?: string;
  tags?: string[];
}

export interface UpdateDealPayload {
  type: 'update_deal';
  deal_id?: string;
  spine_id?: string;
  stage?: string;
  amount?: number;
  close_date?: string;
  notes?: string;
}

// =============================================================================
// ACTION CREATION HELPERS
// =============================================================================

export interface CreateActionInput {
  workspace_id: string;
  session_id?: string;
  insight_id?: string;
  action_type: ActionType;
  target_tool: TargetTool;
  payload: ActionPayload;
  created_by: string;
  requires_approval?: boolean;
}

export interface ExecuteActionInput {
  action_id: string;
  approved_by?: string;
}

export interface ActionResult {
  success: boolean;
  spine_id?: string;
  spine_type?: SpineEntityType;
  error?: string;
  external_id?: string; // ID in the target tool
}

// =============================================================================
// CONTEXT SEARCH
// =============================================================================

export interface ContextSearchQuery {
  workspace_id: string;
  organization_id?: string;
  user_id?: string;
  
  // Text search
  query: string;
  
  // Filters
  session_types?: SessionType[];
  intake_sources?: IntakeSource[];
  date_from?: string;
  date_to?: string;
  
  // Pagination
  limit?: number;
  offset?: number;
}

export interface ContextSearchResult {
  sessions: BrainstormSession[];
  insights: BrainstormInsight[];
  messages: BrainstormMessage[];
  total_count: number;
}

// =============================================================================
// INTAKE HANDLERS
// =============================================================================

/**
 * Standardized intake message from any source (Slack, WhatsApp, etc.)
 */
export interface IntakeMessage {
  source: IntakeSource;
  channel_id: string;
  thread_id?: string;
  user_id: string;
  user_name?: string;
  
  // Content
  text: string;
  attachments?: IntakeAttachment[];
  
  // Context (for account matching)
  organization_hint?: string; // Domain, name, or external ID
  
  // Original event
  raw_event: Record<string, unknown>;
  
  received_at: string;
}

export interface IntakeAttachment {
  type: 'file' | 'image' | 'link';
  url: string;
  name?: string;
  mime_type?: string;
}

/**
 * Response to send back to the intake source
 */
export interface IntakeResponse {
  text: string;
  thread_id?: string;
  
  // Suggested actions
  suggested_actions?: SuggestedAction[];
  
  // Account context found
  matched_organization?: {
    spine_id: string;
    name: string;
    health_status?: string;
  };
}

export interface SuggestedAction {
  action_type: ActionType;
  target_tool: TargetTool;
  label: string;
  payload: ActionPayload;
}
