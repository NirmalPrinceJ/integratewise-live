/**
 * IntegrateWise V11.11 - IQ Hub Types
 * 
 * IQ Hub is the UNIFIED VIEW LAYER that reads from both Truth (Spine) and Context (Brainstorming).
 * 
 * CRITICAL RULES:
 * - IQ Hub is READ-ONLY
 * - IQ Hub does NOT auto-merge Context into Truth
 * - Human action is required to promote Context → Truth (via Actions)
 */

import type { SpineOrganization, SpinePerson, SpineDeal, SpineTicket, SpineEvent } from '@/lib/spine-root/types';
import type { BrainstormSession, BrainstormAction, BrainstormInsight } from '@/lib/brainstorm/types';

// =============================================================================
// ACCOUNT 360 VIEW
// =============================================================================

/**
 * Unified account view combining Spine (Truth) + Brainstorming (Context)
 * This is a READ-ONLY view
 */
export interface Account360 {
  // From Spine (Truth)
  organization: SpineOrganization;
  
  // Team
  account_team: TeamMemberView[];
  
  // Recent activities (from Spine)
  recent_events: SpineEvent[];
  
  // Tickets (from Spine)
  open_tickets: SpineTicket[];
  open_tickets_count: number;
  
  // Deals (from Spine)
  active_deals: SpineDeal[];
  pipeline_value: number;
  
  // Contacts (from Spine)
  key_contacts: SpinePerson[];
  
  // Context (from Brainstorming - READ ONLY)
  recent_ai_sessions: SessionSummary[];
  
  // Pending Actions (from Brainstorming)
  pending_actions: BrainstormAction[];
  pending_actions_count: number;
  
  // Insights (from Brainstorming)
  recent_insights: BrainstormInsight[];
  
  // Computed
  days_until_renewal?: number;
  risk_signals: RiskSignal[];
}

export interface TeamMemberView {
  person: SpinePerson;
  team_role: string;
  is_primary: boolean;
}

export interface SessionSummary {
  session_id: string;
  title?: string;
  summary?: string;
  key_insights?: string[];
  started_at: string;
}

export interface RiskSignal {
  type: 'health_drop' | 'engagement_decline' | 'ticket_spike' | 'renewal_at_risk' | 'champion_left';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detected_at: string;
  organization_id: string;
}

// =============================================================================
// TEAM DASHBOARD VIEW
// =============================================================================

export interface TeamDashboard {
  // Team member
  person: SpinePerson;
  
  // Portfolio metrics
  accounts_managed: number;
  avg_portfolio_health: number;
  
  // Action items
  pending_actions: number;
  
  // Risk
  at_risk_accounts: number;
  critical_accounts: number;
  
  // Renewals
  upcoming_renewals_30d: number;
  upcoming_renewals_90d: number;
  
  // Performance
  accounts_improved: number; // Health increased
  accounts_declined: number; // Health decreased
}

// =============================================================================
// PENDING ACTIONS QUEUE
// =============================================================================

export interface PendingActionView {
  action: BrainstormAction;
  
  // Session context
  session?: {
    session_id: string;
    title?: string;
    intake_source: string;
  };
  
  // Account context
  organization?: {
    spine_id: string;
    name: string;
    health_status?: string;
  };
  
  // Creator
  created_by_name?: string;
}

// =============================================================================
// SEARCH & FILTERS
// =============================================================================

export interface IQHubSearchQuery {
  workspace_id: string;
  
  // Text search (searches both Truth and Context)
  query?: string;
  
  // Filters
  organization_ids?: string[];
  health_statuses?: ('champion' | 'healthy' | 'at_risk' | 'critical')[];
  segments?: string[];
  csm_ids?: string[];
  tam_ids?: string[];
  
  // Date filters
  renewal_within_days?: number;
  last_qbr_older_than_days?: number;
  
  // Include context
  include_ai_sessions?: boolean;
  include_insights?: boolean;
  include_pending_actions?: boolean;
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Sort
  sort_by?: 'name' | 'health_score' | 'arr' | 'renewal_date' | 'last_activity';
  sort_order?: 'asc' | 'desc';
}

export interface IQHubSearchResult {
  accounts: Account360[];
  total_count: number;
  
  // Aggregations
  health_distribution: {
    champion: number;
    healthy: number;
    at_risk: number;
    critical: number;
  };
  
  total_arr: number;
  total_pipeline: number;
}

// =============================================================================
// DASHBOARD METRICS
// =============================================================================

export interface IQHubDashboardMetrics {
  workspace_id: string;
  
  // Portfolio overview
  total_accounts: number;
  total_arr: number;
  total_mrr: number;
  
  // Health distribution
  health_distribution: {
    champion: number;
    healthy: number;
    at_risk: number;
    critical: number;
  };
  
  // Trends
  health_trend: TrendPoint[];
  arr_trend: TrendPoint[];
  
  // Risk signals
  active_risk_signals: number;
  critical_risks: RiskSignal[];
  
  // Renewals
  renewals_this_month: RenewalSummary[];
  renewals_next_quarter: RenewalSummary[];
  at_risk_renewals: RenewalSummary[];
  
  // Activity
  pending_actions_count: number;
  sessions_this_week: number;
  insights_this_week: number;
  
  // Team
  team_performance: TeamPerformanceSummary[];
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface RenewalSummary {
  organization_id: string;
  organization_name: string;
  renewal_date: string;
  arr: number;
  health_status: string;
  primary_csm?: string;
}

export interface TeamPerformanceSummary {
  person_id: string;
  person_name: string;
  team_role: string;
  accounts_count: number;
  avg_health: number;
  at_risk_count: number;
  pending_actions: number;
}

// =============================================================================
// ACTION RECOMMENDATIONS
// =============================================================================

/**
 * IQ Hub can SUGGEST actions, but cannot AUTO-EXECUTE them.
 * Human approval is required to promote suggestions → actions.
 */
export interface ActionRecommendation {
  recommendation_id: string;
  
  // Context
  organization_id: string;
  organization_name: string;
  
  // Recommendation
  action_type: string;
  target_tool: string;
  reason: string;
  confidence: number; // 0.0 to 1.0
  
  // Suggested payload
  suggested_payload: Record<string, unknown>;
  
  // Source
  source: 'health_model' | 'pattern_detection' | 'renewal_playbook' | 'risk_alert';
  
  created_at: string;
}

// =============================================================================
// TIMELINE VIEW
// =============================================================================

export interface TimelineEvent {
  id: string;
  type: 'spine_event' | 'ai_session' | 'action' | 'insight' | 'metric_change';
  
  // Content
  title: string;
  description?: string;
  
  // Actor
  actor_id?: string;
  actor_name?: string;
  
  // Context
  organization_id?: string;
  organization_name?: string;
  
  // Source
  source: 'truth' | 'context';
  
  occurred_at: string;
  
  // Metadata
  metadata?: Record<string, unknown>;
}

export interface AccountTimeline {
  organization_id: string;
  events: TimelineEvent[];
  
  // Filters applied
  from_date?: string;
  to_date?: string;
  event_types?: string[];
  
  // Pagination
  has_more: boolean;
  next_cursor?: string;
}

// =============================================================================
// EXPORT TYPES
// =============================================================================

export interface ExportRequest {
  workspace_id: string;
  
  // What to export
  export_type: 'accounts' | 'timeline' | 'health_report' | 'renewal_report';
  
  // Filters
  organization_ids?: string[];
  date_from?: string;
  date_to?: string;
  
  // Format
  format: 'csv' | 'json' | 'pdf';
  
  // Include context? (Brainstorming data)
  include_context?: boolean;
}

export interface ExportResult {
  export_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: string;
  error?: string;
}
