/**
 * AI Webhook Service - handles AI-powered webhook processing
 * Routes through L3 services (loader, iq-hub, think)
 */
import { iqHub, loader, think } from '@/lib/db';

interface WebhookEvent {
  id: string;
  provider: string;
  event_type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

interface AIAnalysisResult {
  summary: string;
  entities: Array<{ type: string; id: string; name: string }>;
  suggestedActions: string[];
  confidence: number;
}

export async function processWebhookWithAI(event: WebhookEvent): Promise<AIAnalysisResult> {
  try {
    return await iqHub.post<AIAnalysisResult>('/analyze', event);
  } catch (error) {
    console.warn('AI analysis failed, using fallback', error);
  }

  // Fallback response
  return {
    summary: `Processed ${event.provider} ${event.event_type} event`,
    entities: [],
    suggestedActions: [],
    confidence: 0.9,
  };
}

export async function storeWebhookEvent(event: WebhookEvent): Promise<void> {
  await loader.post('/webhook-events', {
    provider: event.provider,
    event_type: event.event_type,
    payload: event.payload,
    processed_at: new Date().toISOString(),
  });
}

export async function getRecentWebhooks(limit = 50): Promise<WebhookEvent[]> {
  try {
    return await loader.get<WebhookEvent[]>(`/webhook-events?limit=${limit}`);
  } catch (error) {
    console.warn('Failed to fetch webhooks', error);
  }
  return [];
}

export const aiWebhookService = {
  processWebhookWithAI,
  storeWebhookEvent,
  getRecentWebhooks,
};

// Business metrics for cron jobs
export interface BusinessMetrics {
  mrr: number;
  pipeline: number;
  activeClients: number;
  openTasks: number;
  webhooksProcessed: number;
}

export async function fetchBusinessMetrics(): Promise<BusinessMetrics> {
  try {
    return await iqHub.get<BusinessMetrics>('/metrics/business');
  } catch (error) {
    console.warn('Failed to fetch business metrics', error);
  }

  // Fallback metrics
  return {
    mrr: 0,
    pipeline: 0,
    activeClients: 0,
    openTasks: 0,
    webhooksProcessed: 0,
  };
}

export interface AIInsight {
  type: 'opportunity' | 'risk' | 'action' | 'trend';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export async function generateAIInsights(metrics: BusinessMetrics): Promise<AIInsight[]> {
  try {
    return await think.post<AIInsight[]>('/insights/generate', { metrics });
  } catch (error) {
    console.warn('AI insights generation failed, using fallback', error);
  }

  // Fallback insights based on simple rules
  const insights: AIInsight[] = [];

  if (metrics.pipeline > metrics.mrr * 3) {
    insights.push({
      type: 'opportunity',
      title: 'Strong Pipeline',
      description: `Pipeline (${metrics.pipeline}) exceeds 3x MRR - good growth potential`,
      priority: 'medium',
    });
  }

  if (metrics.openTasks > 20) {
    insights.push({
      type: 'action',
      title: 'Task Backlog Growing',
      description: `${metrics.openTasks} open tasks - consider prioritizing or delegating`,
      priority: 'high',
    });
  }

  return insights;
}

export async function sendWebhookNotification(insights: AIInsight[]): Promise<void> {
  // Route through notification service
  try {
    await iqHub.post('/notifications/insights', { insights });
  } catch (error) {
    console.warn('[AI Insights] Notification failed', error);
    console.log('[AI Insights]', JSON.stringify(insights, null, 2));
  }
}

export default aiWebhookService;
