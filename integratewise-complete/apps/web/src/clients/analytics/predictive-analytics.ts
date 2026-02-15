// src/services/analytics/predictive-analytics.ts
// Predictive Analytics Service with Custom Dashboards

interface MetricData {
  timestamp: number;
  value: number;
  metadata?: Record<string, any>;
}

interface PredictionResult {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: Array<{
    factor: string;
    impact: number; // -1 to 1
    explanation: string;
  }>;
  timeHorizon: number; // days
}

export interface DashboardConfig {
  id: string;
  name: string;
  owner: string;
  context: 'personal' | 'csm' | 'business';
  widgets: DashboardWidget[];
  createdAt: number;
  updatedAt: number;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'prediction' | 'alert';
  title: string;
  dataSource: string; // e.g., 'spine.tasks', 'analytics.churn'
  config: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

export class PredictiveAnalyticsService {
  private historicalData: Map<string, MetricData[]> = new Map();

  // Train predictive models with historical data
  async trainModel(metricName: string, data: MetricData[]): Promise<void> {
    this.historicalData.set(metricName, data);
    // In a real implementation, this would train ML models
    console.log(`Trained model for ${metricName} with ${data.length} data points`);
  }

  // Generate predictions
  async predict(metricName: string, context: any): Promise<PredictionResult> {
    const data = this.historicalData.get(metricName);
    if (!data || data.length < 10) {
      throw new Error(`Insufficient data for ${metricName} prediction`);
    }

    // Simple trend analysis (in production, use proper ML models)
    const recentData = data.slice(-30); // Last 30 days
    const currentValue = recentData[recentData.length - 1].value;
    const previousValue = recentData[recentData.length - 2]?.value || currentValue;

    const trend = currentValue > previousValue ? 'increasing' :
      currentValue < previousValue ? 'decreasing' : 'stable';

    // Calculate predicted value based on trend
    const growthRate = (currentValue - previousValue) / previousValue;
    const predictedValue = currentValue * (1 + growthRate * 7); // 7-day prediction

    // Identify key factors
    const factors = await this.identifyFactors(metricName, context);

    return {
      metric: metricName,
      currentValue,
      predictedValue,
      confidence: this.calculateConfidence(recentData),
      trend,
      factors,
      timeHorizon: 7
    };
  }

  private async identifyFactors(metricName: string, context: any): Promise<PredictionResult['factors']> {
    const factors: PredictionResult['factors'] = [];

    // Context-aware factor analysis
    if (context.category === 'csm' && metricName.includes('health')) {
      factors.push({
        factor: 'Recent Meetings',
        impact: 0.3,
        explanation: 'Customer meetings correlate with health score improvements'
      });
      factors.push({
        factor: 'Support Tickets',
        impact: -0.2,
        explanation: 'High ticket volume negatively impacts health scores'
      });
    } else if (context.category === 'business' && metricName.includes('churn')) {
      factors.push({
        factor: 'Contract Value',
        impact: -0.4,
        explanation: 'Higher contract values reduce churn risk'
      });
      factors.push({
        factor: 'Usage Activity',
        impact: -0.6,
        explanation: 'Low product usage strongly predicts churn'
      });
    }

    return factors;
  }

  private calculateConfidence(data: MetricData[]): number {
    if (data.length < 5) return 0.3;

    // Calculate variance for confidence
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Lower variance = higher confidence
    const confidence = Math.max(0.1, Math.min(0.9, 1 - (stdDev / mean)));
    return confidence;
  }

  // Custom Dashboard Management
  async createDashboard(config: Omit<DashboardConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<DashboardConfig> {
    const dashboard: DashboardConfig = {
      ...config,
      id: `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // In production, save to database
    console.log('Created dashboard:', dashboard.id);
    return dashboard;
  }

  async updateDashboard(id: string, updates: Partial<DashboardConfig>): Promise<DashboardConfig> {
    // In production, update in database
    console.log('Updated dashboard:', id);
    return { ...updates, id, updatedAt: Date.now() } as DashboardConfig;
  }

  async getDashboard(id: string): Promise<DashboardConfig | null> {
    // In production, fetch from database
    console.log('Retrieved dashboard:', id);
    return null; // Placeholder
  }

  async deleteDashboard(id: string): Promise<void> {
    // In production, delete from database
    console.log('Deleted dashboard:', id);
  }

  // Generate insights from multiple metrics
  async generateInsights(context: any): Promise<Array<{
    type: 'prediction' | 'anomaly' | 'trend' | 'recommendation';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    data: any;
  }>> {
    const insights: Array<{
      type: 'prediction' | 'anomaly' | 'trend' | 'recommendation';
      title: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      data: any;
    }> = [];

    // Generate context-specific insights
    if (context.category === 'csm') {
      // CSM-specific insights
      const healthPrediction = await this.predict('account_health', context);
      if (healthPrediction.trend === 'decreasing' && healthPrediction.confidence > 0.7) {
        insights.push({
          type: 'prediction',
          title: 'Health Score Decline Predicted',
          description: `Account health may drop to ${healthPrediction.predictedValue.toFixed(1)} in 7 days`,
          severity: 'high',
          data: healthPrediction
        });
      }

      insights.push({
        type: 'recommendation',
        title: 'Schedule QBR',
        description: 'Based on usage patterns, schedule a QBR to address potential concerns',
        severity: 'medium',
        data: { suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      });

    } else if (context.category === 'business') {
      // Business-specific insights
      const churnPrediction = await this.predict('churn_risk', context);
      if (churnPrediction.predictedValue > 0.3) {
        insights.push({
          type: 'prediction',
          title: 'Portfolio Churn Risk',
          description: `${Math.round(churnPrediction.predictedValue * 100)}% of accounts at risk`,
          severity: 'high',
          data: churnPrediction
        });
      }

      insights.push({
        type: 'trend',
        title: 'Revenue Growth',
        description: 'ARR growth trending 15% above forecast',
        severity: 'low',
        data: { growth: 0.15, forecast: 0.12 }
      });
    }

    return insights;
  }
}

// Export singleton
export const predictiveAnalytics = new PredictiveAnalyticsService();