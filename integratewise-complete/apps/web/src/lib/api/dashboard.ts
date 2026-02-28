/**
 * Dashboard API - Business metrics and domain-specific data
 * L3: Spine SSOT + Domain Accelerators
 * Supports all 12 domain views
 */

import { supabase } from './supabase';

export type DomainId = 
  | 'customer-success' 
  | 'sales' 
  | 'revops' 
  | 'marketing'
  | 'product-eng'
  | 'finance'
  | 'service'
  | 'procurement'
  | 'it-admin'
  | 'education'
  | 'personal'
  | 'bizops';

export interface DashboardStats {
  totalAccounts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
  activeDeals: number;
  pipelineValue: number;
  churnRisk: number;
  healthScore: number;
  tasksCompleted: number;
  tasksPending: number;
  eventsToday: number;
  upcomingEvents: number;
}

export interface DomainEntity {
  id: string;
  name: string;
  entityType?: string;
  value?: number;
  status: 'good' | 'warning' | 'critical' | 'active' | 'pending' | 'stalled';
  stage?: string;
  engagement?: string;
  healthScore?: number;
  lastActivity?: string;
  metadata?: Record<string, any>;
}

export interface RecentActivity {
  id: string;
  type: 'entity' | 'insight' | 'action' | 'task' | 'event';
  title: string;
  description: string;
  timestamp: string;
  entityId?: string;
  status?: 'completed' | 'pending' | 'failed';
}

export interface DomainSignal {
  id: string;
  type: 'revenue' | 'churn' | 'compliance' | 'deal' | 'upsell' | 'competitor' | 
         'machine' | 'supply' | 'quality' | 'mismatch' | 'overdue' | 'tax' | 'general';
  label: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  summary: string;
  detail: string;
  actions: string[];
  entityId?: string;
  createdAt: string;
}

// Domain to entity type mapping for all 12 domains
const domainEntityTypeMap: Record<DomainId, string[]> = {
  'customer-success': ['account', 'contact', 'subscription', 'contract'],
  'sales': ['opportunity', 'deal', 'lead', 'quote', 'proposal'],
  'revops': ['metric', 'forecast', 'territory', 'quota', 'attribution'],
  'marketing': ['campaign', 'lead', 'content', 'event', 'landing_page'],
  'product-eng': ['feature', 'bug', 'story', 'epic', 'sprint', 'release'],
  'finance': ['invoice', 'transaction', 'expense', 'budget', 'forecast'],
  'service': ['ticket', 'case', 'article', 'work_order', 'sla'],
  'procurement': ['vendor', 'purchase_order', 'contract', 'rfp', 'invoice'],
  'it-admin': ['asset', 'user', 'license', 'access_policy', 'device'],
  'education': ['student', 'course', 'enrollment', 'assignment', 'grade'],
  'personal': ['task', 'goal', 'habit', 'reminder', 'note'],
  'bizops': ['project', 'process', 'kpi', 'initiative', 'workflow'],
};

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get entity counts
    const { data: entities, error: entityError } = await supabase
      .from('spine_entities')
      .select('id, health_score, arr_value, status');
    
    if (entityError) throw entityError;
    
    // Get task counts
    const { data: tasks, error: taskError } = await supabase
      .from('spine_tasks')
      .select('status');
    
    if (taskError) throw taskError;
    
    // Get today's events
    const today = new Date().toISOString().split('T')[0];
    const { data: events, error: eventError } = await supabase
      .from('spine_events')
      .select('id, start_time')
      .gte('start_time', today);
    
    if (eventError) throw eventError;
    
    // Calculate stats
    const totalAccounts = entities?.length || 0;
    const totalRevenue = entities?.reduce((sum, e) => sum + (e.arr_value || 0), 0) || 0;
    const avgHealth = totalAccounts > 0 
      ? entities!.reduce((sum, e) => sum + (e.health_score || 0), 0) / totalAccounts 
      : 0;
    const atRiskCount = entities?.filter(e => e.health_score && e.health_score < 50).length || 0;
    
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
    const pendingTasks = tasks?.filter(t => t.status !== 'completed').length || 0;
    
    return {
      totalAccounts,
      totalRevenue,
      monthlyRevenue: Math.round(totalRevenue / 12),
      growthRate: 12,
      activeDeals: entities?.filter(e => e.status === 'opportunity').length || 0,
      pipelineValue: totalRevenue * 0.3,
      churnRisk: Math.round((atRiskCount / (totalAccounts || 1)) * 100),
      healthScore: Math.round(avgHealth),
      tasksCompleted: completedTasks,
      tasksPending: pendingTasks,
      eventsToday: events?.filter(e => e.start_time?.startsWith(today)).length || 0,
      upcomingEvents: events?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return getDefaultStats();
  }
}

/**
 * Get entities filtered by domain type - supports all 12 domains
 */
export async function getDomainEntities(domain: DomainId): Promise<DomainEntity[]> {
  try {
    const entityTypes = domainEntityTypeMap[domain];
    
    let query = supabase
      .from('spine_entities')
      .select('id, name, health_score, status, entity_type, arr_value, metadata, updated_at');
    
    // Filter by entity types if specified
    if (entityTypes && entityTypes.length > 0) {
      query = query.in('entity_type', entityTypes);
    }
    
    const { data: entities, error } = await query.limit(20);
    
    if (error) throw error;
    
    // Transform to domain entities
    return entities?.map(entity => ({
      id: entity.id,
      name: entity.name,
      entityType: entity.entity_type,
      status: mapStatusToDomainStatus(entity.health_score, entity.status),
      healthScore: entity.health_score,
      value: entity.arr_value,
      lastActivity: entity.updated_at,
      metadata: entity.metadata || {},
    })) || [];
  } catch (error) {
    console.error(`Error fetching ${domain} entities:`, error);
    return [];
  }
}

/**
 * Get recent activity feed
 */
export async function getRecentActivity(limit: number = 20): Promise<RecentActivity[]> {
  try {
    // Get recent entities
    const { data: entities } = await supabase
      .from('spine_entities')
      .select('id, name, entity_type, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit / 2);
    
    // Get recent insights
    const { data: insights } = await supabase
      .from('knowledge_insights')
      .select('id, title, content, insight_type, created_at')
      .order('created_at', { ascending: false })
      .limit(limit / 2);
    
    // Combine and sort
    const activities: RecentActivity[] = [
      ...(entities?.map(e => ({
        id: `entity-${e.id}`,
        type: 'entity' as const,
        title: `${e.entity_type?.charAt(0).toUpperCase()}${e.entity_type?.slice(1)} Updated`,
        description: e.name,
        timestamp: e.updated_at,
        entityId: e.id,
      })) || []),
      ...(insights?.map(i => ({
        id: `insight-${i.id}`,
        type: 'insight' as const,
        title: i.title,
        description: i.content?.slice(0, 100) || '',
        timestamp: i.created_at,
      })) || []),
    ];
    
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

/**
 * Get signals/alerts for a domain - all 12 domains
 */
export async function getDomainSignals(domain: DomainId): Promise<DomainSignal[]> {
  try {
    // Get insights flagged as signals
    const { data: insights } = await supabase
      .from('knowledge_insights')
      .select('id, title, content, insight_type, severity, metadata, created_at')
      .in('insight_type', ['alert', 'signal', 'risk', 'opportunity'])
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Get high-risk entities as signals
    const { data: riskEntities } = await supabase
      .from('spine_entities')
      .select('id, name, health_score, status, entity_type, arr_value')
      .lt('health_score', 50)
      .in('entity_type', domainEntityTypeMap[domain] || [])
      .limit(5);
    
    const signals: DomainSignal[] = [];
    
    // Add insight signals
    insights?.forEach(insight => {
      signals.push({
        id: `insight-${insight.id}`,
        type: mapInsightTypeToSignal(insight.insight_type),
        label: insight.title,
        severity: (insight.severity as DomainSignal['severity']) || 'info',
        summary: insight.title,
        detail: insight.content || '',
        actions: insight.metadata?.actions || ['Review', 'Dismiss'],
        createdAt: insight.created_at,
      });
    });
    
    // Add risk entity signals
    riskEntities?.forEach(entity => {
      signals.push({
        id: `entity-${entity.id}`,
        type: 'general',
        label: 'Health Alert',
        severity: entity.health_score && entity.health_score < 30 ? 'emergency' : 'warning',
        summary: `${entity.name} — Health score ${entity.health_score}%`,
        detail: `${entity.entity_type} status: ${entity.status}. ARR at risk: $${entity.arr_value?.toLocaleString()}.`,
        actions: ['Review', 'Schedule Check-in'],
        entityId: entity.id,
        createdAt: new Date().toISOString(),
      });
    });
    
    return signals.sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity));
  } catch (error) {
    console.error('Error fetching domain signals:', error);
    return [];
  }
}

/**
 * Get connector statuses
 */
export async function getConnectorStatuses(): Promise<{ name: string; status: 'active' | 'error' | 'syncing'; lastSync?: string }[]> {
  try {
    return [
      { name: 'Salesforce', status: 'active', lastSync: new Date().toISOString() },
      { name: 'HubSpot', status: 'active', lastSync: new Date().toISOString() },
      { name: 'Stripe', status: 'active', lastSync: new Date().toISOString() },
      { name: 'Slack', status: 'active', lastSync: new Date().toISOString() },
      { name: 'Jira', status: 'active', lastSync: new Date().toISOString() },
      { name: 'Notion', status: 'syncing', lastSync: new Date().toISOString() },
    ];
  } catch (error) {
    console.error('Error fetching connector statuses:', error);
    return [];
  }
}

// Helper functions
function getDefaultStats(): DashboardStats {
  return {
    totalAccounts: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    activeDeals: 0,
    pipelineValue: 0,
    churnRisk: 0,
    healthScore: 0,
    tasksCompleted: 0,
    tasksPending: 0,
    eventsToday: 0,
    upcomingEvents: 0,
  };
}

function mapStatusToDomainStatus(healthScore: number | null, status: string): DomainEntity['status'] {
  if (!healthScore) return 'warning';
  if (healthScore >= 80) return 'good';
  if (healthScore >= 50) return 'warning';
  return 'critical';
}

function mapInsightTypeToSignal(type: string): DomainSignal['type'] {
  switch (type) {
    case 'alert': return 'general';
    case 'risk': return 'churn';
    case 'opportunity': return 'upsell';
    default: return 'general';
  }
}

function severityWeight(severity: string): number {
  switch (severity) {
    case 'emergency': return 4;
    case 'critical': return 3;
    case 'warning': return 2;
    case 'info': return 1;
    default: return 0;
  }
}
