/**
 * IntegrateWise V11.11 - IQ Hub Service
 * 
 * IQ Hub is the UNIFIED VIEW LAYER that reads from both Truth (Spine) and Context (Brainstorming).
 * 
 * CRITICAL RULES:
 * - IQ Hub is READ-ONLY
 * - IQ Hub does NOT auto-merge Context into Truth
 * - Human action is required to promote Context → Truth (via Actions)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Account360,
  IQHubSearchQuery,
  IQHubSearchResult,
  IQHubDashboardMetrics,
  PendingActionView,
  AccountTimeline,
  TimelineEvent,
  RiskSignal,
  ActionRecommendation,
} from './types';
import type { SpineOrganization, SpineEvent, SpineTicket, SpineDeal, SpinePerson } from '@/lib/spine-root/types';
import type { BrainstormSession, BrainstormAction, BrainstormInsight } from '@/lib/brainstorm/types';

export class IQHubService {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  // =============================================================================
  // ACCOUNT 360 VIEW
  // =============================================================================

  /**
   * Get unified account view combining Spine (Truth) + Brainstorming (Context)
   * This is a READ-ONLY operation
   */
  async getAccount360(organizationId: string): Promise<Account360 | null> {
    // Fetch organization from Spine (Truth)
    const { data: org, error: orgError } = await this.client
      .from('spine.organization')
      .select('*')
      .eq('spine_id', organizationId)
      .single();

    if (orgError || !org) {
      console.error('Failed to fetch organization:', orgError);
      return null;
    }

    // Fetch related data in parallel
    const [
      teamResult,
      eventsResult,
      ticketsResult,
      dealsResult,
      contactsResult,
      sessionsResult,
      actionsResult,
      insightsResult,
    ] = await Promise.all([
      // Account team (Truth)
      this.client
        .from('spine.account_team')
        .select('*, person:person_id(*)')
        .eq('organization_id', organizationId),
      
      // Recent events (Truth)
      this.client
        .from('spine.event')
        .select('*')
        .eq('organization_id', organizationId)
        .order('occurred_at', { ascending: false })
        .limit(10),
      
      // Open tickets (Truth)
      this.client
        .from('spine.ticket')
        .select('*')
        .eq('organization_id', organizationId)
        .not('status', 'in', '("resolved","closed")'),
      
      // Active deals (Truth)
      this.client
        .from('spine.deal')
        .select('*')
        .eq('organization_id', organizationId)
        .not('stage', 'in', '("closed_won","closed_lost")'),
      
      // Key contacts (Truth)
      this.client
        .from('spine.person')
        .select('*')
        .eq('organization_id', organizationId)
        .in('role_type', ['champion', 'decision_maker', 'economic_buyer'])
        .limit(10),
      
      // Recent AI sessions (Context - READ ONLY)
      this.client
        .from('brainstorm.session')
        .select('session_id, title, summary, key_insights, started_at')
        .eq('organization_id', organizationId)
        .neq('status', 'archived')
        .order('started_at', { ascending: false })
        .limit(5),
      
      // Pending actions (Context - READ ONLY)
      this.client
        .from('brainstorm.action')
        .select('*')
        .eq('status', 'pending'),
      
      // Recent insights (Context - READ ONLY)
      this.client
        .from('brainstorm.insight')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    // Calculate pipeline value
    const pipelineValue = (dealsResult.data || [])
      .reduce((sum, deal) => sum + (deal.amount || 0), 0);

    // Calculate days until renewal
    const daysUntilRenewal = org.renewal_date
      ? Math.ceil((new Date(org.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : undefined;

    // Detect risk signals
    const riskSignals = this.detectRiskSignals(
      org,
      ticketsResult.data || [],
      daysUntilRenewal
    );

    return {
      organization: org as SpineOrganization,
      account_team: (teamResult.data || []).map(t => ({
        person: t.person as SpinePerson,
        team_role: t.team_role,
        is_primary: t.is_primary,
      })),
      recent_events: (eventsResult.data || []) as SpineEvent[],
      open_tickets: (ticketsResult.data || []) as SpineTicket[],
      open_tickets_count: (ticketsResult.data || []).length,
      active_deals: (dealsResult.data || []) as SpineDeal[],
      pipeline_value: pipelineValue,
      key_contacts: (contactsResult.data || []) as SpinePerson[],
      recent_ai_sessions: (sessionsResult.data || []).map(s => ({
        session_id: s.session_id,
        title: s.title,
        summary: s.summary,
        key_insights: s.key_insights,
        started_at: s.started_at,
      })),
      pending_actions: (actionsResult.data || []) as BrainstormAction[],
      pending_actions_count: (actionsResult.data || []).length,
      recent_insights: (insightsResult.data || []) as BrainstormInsight[],
      days_until_renewal: daysUntilRenewal,
      risk_signals: riskSignals,
    };
  }

  // =============================================================================
  // SEARCH
  // =============================================================================

  /**
   * Search accounts with optional context from Brainstorming
   * Returns READ-ONLY view of Truth + Context
   */
  async searchAccounts(query: IQHubSearchQuery): Promise<IQHubSearchResult> {
    let builder = this.client
      .from('spine.organization')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query.organization_ids?.length) {
      builder = builder.in('spine_id', query.organization_ids);
    }
    if (query.health_statuses?.length) {
      builder = builder.in('health_status', query.health_statuses);
    }
    if (query.segments?.length) {
      builder = builder.in('segment', query.segments);
    }
    if (query.csm_ids?.length) {
      builder = builder.in('primary_csm_id', query.csm_ids);
    }
    if (query.tam_ids?.length) {
      builder = builder.in('primary_tam_id', query.tam_ids);
    }
    if (query.renewal_within_days) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + query.renewal_within_days);
      builder = builder.lte('renewal_date', futureDate.toISOString());
    }
    if (query.query) {
      builder = builder.textSearch('name', query.query, { type: 'websearch' });
    }

    // Sorting
    const sortField = query.sort_by || 'name';
    const sortOrder = query.sort_order === 'desc' ? { ascending: false } : { ascending: true };
    builder = builder.order(sortField, sortOrder);

    // Pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    builder = builder.range(offset, offset + limit - 1);

    const { data: orgs, count, error } = await builder;

    if (error) {
      console.error('Search error:', error);
      return {
        accounts: [],
        total_count: 0,
        health_distribution: { champion: 0, healthy: 0, at_risk: 0, critical: 0 },
        total_arr: 0,
        total_pipeline: 0,
      };
    }

    // Fetch full Account360 for each organization
    const accounts = await Promise.all(
      (orgs || []).map(org => this.getAccount360(org.spine_id))
    );

    // Calculate aggregations
    const healthDistribution = {
      champion: 0,
      healthy: 0,
      at_risk: 0,
      critical: 0,
    };
    let totalArr = 0;
    let totalPipeline = 0;

    for (const account of accounts) {
      if (!account) continue;
      
      const status = account.organization.health_status;
      if (status && status in healthDistribution) {
        healthDistribution[status as keyof typeof healthDistribution]++;
      }
      
      totalArr += account.organization.arr || 0;
      totalPipeline += account.pipeline_value;
    }

    return {
      accounts: accounts.filter(Boolean) as Account360[],
      total_count: count || 0,
      health_distribution: healthDistribution,
      total_arr: totalArr,
      total_pipeline: totalPipeline,
    };
  }

  // =============================================================================
  // DASHBOARD METRICS
  // =============================================================================

  async getDashboardMetrics(workspaceId: string): Promise<IQHubDashboardMetrics> {
    // Fetch aggregations from Spine
    const [
      orgsResult,
      healthResult,
      renewalsThisMonth,
      renewalsNextQuarter,
      actionsResult,
      sessionsResult,
      insightsResult,
    ] = await Promise.all([
      // Total accounts and ARR
      this.client
        .from('spine.organization')
        .select('spine_id, arr, mrr, health_status')
        .eq('workspace_id', workspaceId),
      
      // Health distribution (already in orgsResult)
      Promise.resolve(null),
      
      // Renewals this month
      this.client
        .from('spine.organization')
        .select('spine_id, name, renewal_date, arr, health_status, primary_csm_id')
        .eq('workspace_id', workspaceId)
        .gte('renewal_date', new Date().toISOString())
        .lte('renewal_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Renewals next quarter
      this.client
        .from('spine.organization')
        .select('spine_id, name, renewal_date, arr, health_status, primary_csm_id')
        .eq('workspace_id', workspaceId)
        .gte('renewal_date', new Date().toISOString())
        .lte('renewal_date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Pending actions count
      this.client
        .from('brainstorm.action')
        .select('action_id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending'),
      
      // Sessions this week
      this.client
        .from('brainstorm.session')
        .select('session_id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .gte('started_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Insights this week
      this.client
        .from('brainstorm.insight')
        .select('insight_id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const orgs = orgsResult.data || [];
    
    // Calculate health distribution
    const healthDistribution = {
      champion: 0,
      healthy: 0,
      at_risk: 0,
      critical: 0,
    };
    
    let totalArr = 0;
    let totalMrr = 0;
    
    for (const org of orgs) {
      const status = org.health_status;
      if (status && status in healthDistribution) {
        healthDistribution[status as keyof typeof healthDistribution]++;
      }
      totalArr += org.arr || 0;
      totalMrr += org.mrr || 0;
    }

    // Identify at-risk renewals
    const atRiskRenewals = (renewalsNextQuarter.data || [])
      .filter(r => r.health_status === 'at_risk' || r.health_status === 'critical')
      .map(r => ({
        organization_id: r.spine_id,
        organization_name: r.name,
        renewal_date: r.renewal_date,
        arr: r.arr || 0,
        health_status: r.health_status,
        primary_csm: r.primary_csm_id,
      }));

    // Detect critical risks
    const criticalRisks = orgs
      .filter(o => o.health_status === 'critical')
      .map(o => ({
        type: 'health_drop' as const,
        severity: 'critical' as const,
        message: `Account health is critical`,
        detected_at: new Date().toISOString(),
        organization_id: o.spine_id,
      }));

    return {
      workspace_id: workspaceId,
      total_accounts: orgs.length,
      total_arr: totalArr,
      total_mrr: totalMrr,
      health_distribution: healthDistribution,
      health_trend: [], // TODO: Implement trend calculation
      arr_trend: [], // TODO: Implement trend calculation
      active_risk_signals: criticalRisks.length,
      critical_risks: criticalRisks,
      renewals_this_month: (renewalsThisMonth.data || []).map(r => ({
        organization_id: r.spine_id,
        organization_name: r.name,
        renewal_date: r.renewal_date,
        arr: r.arr || 0,
        health_status: r.health_status,
        primary_csm: r.primary_csm_id,
      })),
      renewals_next_quarter: (renewalsNextQuarter.data || []).map(r => ({
        organization_id: r.spine_id,
        organization_name: r.name,
        renewal_date: r.renewal_date,
        arr: r.arr || 0,
        health_status: r.health_status,
        primary_csm: r.primary_csm_id,
      })),
      at_risk_renewals: atRiskRenewals,
      pending_actions_count: actionsResult.count || 0,
      sessions_this_week: sessionsResult.count || 0,
      insights_this_week: insightsResult.count || 0,
      team_performance: [], // TODO: Implement team performance
    };
  }

  // =============================================================================
  // PENDING ACTIONS
  // =============================================================================

  /**
   * Get pending actions queue with context
   * These are actions waiting for human approval before executing
   */
  async getPendingActions(workspaceId: string): Promise<PendingActionView[]> {
    const { data: actions, error } = await this.client
      .from('brainstorm.action')
      .select(`
        *,
        session:session_id (
          session_id,
          title,
          intake_source,
          organization_id
        )
      `)
      .eq('workspace_id', workspaceId)
      .in('status', ['pending', 'approved'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch pending actions:', error);
      return [];
    }

    // Fetch organization names for context
    const orgIds = [...new Set(
      (actions || [])
        .map(a => a.session?.organization_id)
        .filter(Boolean)
    )];

    const { data: orgs } = await this.client
      .from('spine.organization')
      .select('spine_id, name, health_status')
      .in('spine_id', orgIds);

    const orgMap = new Map((orgs || []).map(o => [o.spine_id, o]));

    return (actions || []).map(action => ({
      action: action as BrainstormAction,
      session: action.session ? {
        session_id: action.session.session_id,
        title: action.session.title,
        intake_source: action.session.intake_source,
      } : undefined,
      organization: action.session?.organization_id && orgMap.has(action.session.organization_id)
        ? {
            spine_id: action.session.organization_id,
            name: orgMap.get(action.session.organization_id)!.name,
            health_status: orgMap.get(action.session.organization_id)!.health_status,
          }
        : undefined,
    }));
  }

  // =============================================================================
  // TIMELINE
  // =============================================================================

  /**
   * Get unified timeline for an account
   * Combines events from Spine (Truth) and sessions from Brainstorming (Context)
   */
  async getAccountTimeline(
    organizationId: string,
    options: { limit?: number; cursor?: string } = {}
  ): Promise<AccountTimeline> {
    const limit = options.limit || 50;

    // Fetch events from Spine (Truth)
    const { data: spineEvents } = await this.client
      .from('spine.event')
      .select('*')
      .eq('organization_id', organizationId)
      .order('occurred_at', { ascending: false })
      .limit(limit);

    // Fetch sessions from Brainstorming (Context)
    const { data: sessions } = await this.client
      .from('brainstorm.session')
      .select('*')
      .eq('organization_id', organizationId)
      .order('started_at', { ascending: false })
      .limit(limit);

    // Convert to timeline events
    const events: TimelineEvent[] = [];

    // Add spine events
    for (const event of spineEvents || []) {
      events.push({
        id: event.spine_id,
        type: 'spine_event',
        title: event.subject || `${event.event_type} event`,
        description: event.description,
        actor_id: event.created_by,
        organization_id: organizationId,
        source: 'truth',
        occurred_at: event.occurred_at,
        metadata: event.metadata,
      });
    }

    // Add brainstorming sessions (Context)
    for (const session of sessions || []) {
      events.push({
        id: session.session_id,
        type: 'ai_session',
        title: session.title || 'AI Session',
        description: session.summary,
        actor_id: session.user_id,
        organization_id: organizationId,
        source: 'context',
        occurred_at: session.started_at,
        metadata: {
          intake_source: session.intake_source,
          key_insights: session.key_insights,
        },
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());

    return {
      organization_id: organizationId,
      events: events.slice(0, limit),
      has_more: events.length > limit,
    };
  }

  // =============================================================================
  // RISK DETECTION
  // =============================================================================

  private detectRiskSignals(
    org: SpineOrganization,
    tickets: SpineTicket[],
    daysUntilRenewal?: number
  ): RiskSignal[] {
    const signals: RiskSignal[] = [];
    const now = new Date().toISOString();

    // Health drop
    if (org.health_status === 'critical') {
      signals.push({
        type: 'health_drop',
        severity: 'critical',
        message: 'Account health score is in critical range',
        detected_at: now,
        organization_id: org.spine_id,
      });
    } else if (org.health_status === 'at_risk') {
      signals.push({
        type: 'health_drop',
        severity: 'high',
        message: 'Account health score is at risk',
        detected_at: now,
        organization_id: org.spine_id,
      });
    }

    // Ticket spike
    const urgentTickets = tickets.filter(t => t.priority === 'urgent' || t.priority === 'high');
    if (urgentTickets.length >= 3) {
      signals.push({
        type: 'ticket_spike',
        severity: 'high',
        message: `${urgentTickets.length} high-priority tickets open`,
        detected_at: now,
        organization_id: org.spine_id,
      });
    }

    // Renewal at risk
    if (daysUntilRenewal !== undefined && daysUntilRenewal <= 30) {
      const severity = org.health_status === 'at_risk' || org.health_status === 'critical' 
        ? 'critical' 
        : 'medium';
      signals.push({
        type: 'renewal_at_risk',
        severity,
        message: `Renewal in ${daysUntilRenewal} days with ${org.health_status} health`,
        detected_at: now,
        organization_id: org.spine_id,
      });
    }

    return signals;
  }

  // =============================================================================
  // ACTION RECOMMENDATIONS (Suggestions only - no auto-execute)
  // =============================================================================

  /**
   * Generate action recommendations based on account context
   * NOTE: These are SUGGESTIONS only. Human approval required to execute.
   */
  async generateRecommendations(organizationId: string): Promise<ActionRecommendation[]> {
    const account = await this.getAccount360(organizationId);
    if (!account) return [];

    const recommendations: ActionRecommendation[] = [];
    const org = account.organization;

    // Low health → suggest outreach
    if (org.health_score && org.health_score < 50) {
      recommendations.push({
        recommendation_id: `rec-health-${organizationId}`,
        organization_id: organizationId,
        organization_name: org.name,
        action_type: 'create_task',
        target_tool: 'asana',
        reason: `Account health (${org.health_score}) is below threshold. Schedule check-in call.`,
        confidence: 0.85,
        suggested_payload: {
          type: 'create_task',
          title: `Health Check: ${org.name}`,
          description: `Account health is ${org.health_score}. Schedule a check-in call to understand concerns.`,
          priority: 'high',
        },
        source: 'health_model',
        created_at: new Date().toISOString(),
      });
    }

    // Open high-priority tickets → suggest escalation
    const urgentTickets = account.open_tickets.filter(t => t.priority === 'urgent');
    if (urgentTickets.length > 0) {
      recommendations.push({
        recommendation_id: `rec-ticket-${organizationId}`,
        organization_id: organizationId,
        organization_name: org.name,
        action_type: 'send_message',
        target_tool: 'slack',
        reason: `${urgentTickets.length} urgent ticket(s) open. Consider escalation.`,
        confidence: 0.90,
        suggested_payload: {
          type: 'send_message',
          channel_id: '#cs-escalations',
          message: `🚨 ${org.name} has ${urgentTickets.length} urgent ticket(s). Health: ${org.health_score}`,
        },
        source: 'risk_alert',
        created_at: new Date().toISOString(),
      });
    }

    // Upcoming renewal → suggest QBR
    if (account.days_until_renewal && account.days_until_renewal <= 60 && !org.next_qbr_date) {
      recommendations.push({
        recommendation_id: `rec-qbr-${organizationId}`,
        organization_id: organizationId,
        organization_name: org.name,
        action_type: 'schedule_meeting',
        target_tool: 'google_calendar',
        reason: `Renewal in ${account.days_until_renewal} days. QBR not scheduled.`,
        confidence: 0.80,
        suggested_payload: {
          type: 'schedule_meeting',
          title: `QBR: ${org.name}`,
          description: `Quarterly business review ahead of renewal`,
          duration_minutes: 60,
        },
        source: 'renewal_playbook',
        created_at: new Date().toISOString(),
      });
    }

    return recommendations;
  }
}

// =============================================================================
// FACTORY
// =============================================================================

let iqHubInstance: IQHubService | null = null;

export function getIQHubService(): IQHubService {
  if (!iqHubInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    iqHubInstance = new IQHubService(supabaseUrl, supabaseKey);
  }
  return iqHubInstance;
}
