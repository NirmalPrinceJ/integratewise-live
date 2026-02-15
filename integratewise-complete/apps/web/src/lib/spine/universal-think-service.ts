/**
 * Universal Think Service
 * 
 * Same AI engine, same logic, different data scope based on context
 * 
 * - Personal: Insights about YOUR patterns
 * - CSM: Insights about specific account
 * - Business: Portfolio-wide trends
 * 
 * All operations route through L3 Workers (think, act, govern)
 */
import { think, act, govern } from '@/lib/db';
import { QueryContext } from './universal-entity-service';

export interface Situation {
    id: string;
    title: string;
    summary: string;
    severity: 'info' | 'warning' | 'critical';
    entity_type?: string;
    entity_id?: string;
    signals: SignalReference[];
    suggested_actions: SuggestedAction[];
    status: 'active' | 'acknowledged' | 'resolved';
    created_at: string;
}

export interface SignalReference {
    signal_type: string;
    source: 'spine' | 'context' | 'knowledge';
    value: unknown;
    confidence: number;
}

export interface SuggestedAction {
    id: string;
    action_type: string;
    description: string;
    priority: number;
    estimated_impact: string;
}

/**
 * Build context headers for direct fetch calls
 */
function buildContextHeaders(context: QueryContext): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        'x-tenant-id': context.tenant_id,
        'x-user-id': context.user_id,
        'x-user-role': context.user_role,
        'x-context-category': context.category,
        'x-account-id': context.account_id || '',
        'x-team-id': context.team_id || '',
    };
}

/**
 * Universal Think Service
 * Generates AI insights with context-aware data scope via Think Worker
 */
export class UniversalThinkService {
    /**
     * Get active situations based on context
     * Same engine, different scope
     */
    static async getSituations(
        context: QueryContext,
        options: { limit?: number; severity?: string } = {}
    ): Promise<Situation[]> {
        try {
            const queryParams: Record<string, string> = {
                category: context.category,
            };
            if (options.limit) queryParams.limit = options.limit.toString();
            if (options.severity) queryParams.severity = options.severity;

            const url = new URL('http://dummy/v1/situations'); // Base URL is ignored by serviceRequest
            Object.entries(queryParams).forEach(([k, v]) => url.searchParams.append(k, v));
            const path = `${url.pathname}${url.search}`;

            const result = await think.get<{ data?: Situation[] }>(path, buildContextHeaders(context));
            return result.data || (result as unknown as Situation[]);
        } catch (err) {
            console.error('Error fetching situations:', err);
            return [];
        }
    }

    /**
     * Get AI insights summary based on context
     * Personal: "You've been most productive on Mondays"
     * CSM: "Account health correlates with feature adoption"
     * Business: "Q4 churn risk is 15% higher than Q3"
     */
    static async getInsightsSummary(context: QueryContext): Promise<InsightsSummary> {
        try {
            return await think.get<InsightsSummary>('/v1/insights/summary', buildContextHeaders(context));
        } catch (err) {
            console.error('Error fetching insights summary:', err);
        }

        // Fallback summary
        return this.generateFallbackSummary(context);
    }

    private static generateFallbackSummary(context: QueryContext): InsightsSummary {
        const baseLabels: Record<string, ContextLabel> = {
            personal: {
                category: 'personal',
                headline: 'Your Productivity Insights',
                description: 'AI analysis of your work patterns',
                icon: 'user',
            },
            csm: {
                category: 'csm',
                headline: 'Account Intelligence',
                description: 'AI analysis of customer health & signals',
                icon: 'building',
            },
            business: {
                category: 'business',
                headline: 'Portfolio Insights',
                description: 'AI analysis of business-wide trends',
                icon: 'trending-up',
            },
            team: {
                category: 'team',
                headline: 'Team Performance',
                description: 'AI analysis of team patterns',
                icon: 'users',
            },
        };

        return {
            context: baseLabels[context.category] || baseLabels.personal,
            total_insights: 0,
            key_findings: [],
            last_updated: new Date().toISOString(),
        };
    }
}

interface ContextLabel {
    category: string;
    headline: string;
    description: string;
    icon: string;
}

interface InsightsSummary {
    context: ContextLabel;
    total_insights: number;
    key_findings: Array<{
        title: string;
        summary: string;
        confidence: number;
    }>;
    last_updated: string;
}

// =============================================================================
// UNIVERSAL ACT SERVICE
// Same action engine, context-aware approval & execution via Act Worker
// =============================================================================

export interface ActionProposal {
    id: string;
    action_type: string;
    title: string;
    description: string;
    entity_type?: string;
    entity_id?: string;
    scope: {
        category: string;
        owner_id?: string;
        account_id?: string;
        team_id?: string;
    };
    payload: Record<string, unknown>;
    requires_approval: boolean;
    approval_status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
    created_at: string;
}

export class UniversalActService {
    /**
     * Get pending action proposals for current context
     */
    static async getPendingActions(
        context: QueryContext,
        options: { limit?: number } = {}
    ): Promise<ActionProposal[]> {
        try {
            const url = new URL('http://dummy/v1/proposals/pending');
            url.searchParams.append('category', context.category);
            if (options.limit) url.searchParams.append('limit', options.limit.toString());
            const path = `${url.pathname}${url.search}`;
            
            const result = await act.get<{ data?: ActionProposal[] }>(path, buildContextHeaders(context));
            return result.data || (result as unknown as ActionProposal[]);
        } catch (err) {
            console.error('Error fetching pending actions:', err);
            return [];
        }
    }

    /**
     * Create an action proposal with proper scoping
     */
    static async createActionProposal(
        context: QueryContext,
        action: Omit<ActionProposal, 'id' | 'scope' | 'approval_status' | 'created_at'>
    ): Promise<ActionProposal> {
        return act.post<ActionProposal>('/v1/proposals', action, buildContextHeaders(context));
    }

    /**
     * Approve or reject an action
     */
    static async updateApprovalStatus(
        context: QueryContext,
        actionId: string,
        status: 'approved' | 'rejected',
        reason?: string
    ): Promise<boolean> {
        await act.patch(`/v1/proposals/${actionId}/status`, { status, reason }, buildContextHeaders(context));

        // Log audit trail via govern service
        try {
            await govern.post('/audit/log', {
                tenant_id: context.tenant_id,
                entity_type: 'action_proposal',
                entity_id: actionId,
                action: status === 'approved' ? 'approve_action' : 'reject_action',
                actor_id: context.user_id,
                metadata: { reason },
            });
        } catch (auditErr) {
            console.warn('Audit logging failed:', auditErr);
        }

        return true;
    }
}
