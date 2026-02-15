// src/services/business-intelligence/business-intelligence-service.ts
// Business Intelligence & Predictive Analytics for Phase 3

import { ObservabilityService } from '../monitoring/observability-service';
import { AdvancedAIModelsService } from '../orchestration/advanced-ai-models';

export interface AnalyticsData {
  timestamp: Date;
  metrics: Record<string, number>;
  dimensions: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'time_series';
  target: string;
  features: string[];
  accuracy: number;
  lastTrained: Date;
  model: any; // Serialized model data
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  data: any;
  recommendations: string[];
  timestamp: Date;
  expiresAt?: Date;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refreshInterval: number; // seconds
  lastUpdated: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'text';
  title: string;
  dataSource: string;
  config: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

export interface DashboardFilter {
  field: string;
  type: 'select' | 'range' | 'date' | 'text';
  values: any[];
  defaultValue?: any;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'scheduled' | 'on_demand' | 'alert';
  schedule?: ReportSchedule;
  recipients: string[];
  format: 'pdf' | 'html' | 'csv' | 'json';
  template: string;
  lastGenerated?: Date;
  status: 'active' | 'paused' | 'error';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string; // HH:MM format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  timezone: string;
}

export class BusinessIntelligenceService {
  private analyticsData: AnalyticsData[] = [];
  private predictiveModels = new Map<string, PredictiveModel>();
  private insights: Insight[] = [];
  private dashboards = new Map<string, Dashboard>();
  private reports = new Map<string, Report>();
  private dataRetentionDays = 90;

  constructor(
    private observability: ObservabilityService,
    private aiModels: AdvancedAIModelsService,
    private config: {
      enablePredictiveAnalytics?: boolean;
      enableAutomatedInsights?: boolean;
      dataRetentionDays?: number;
      insightGenerationInterval?: number;
    } = {}
  ) {
    this.dataRetentionDays = config.dataRetentionDays || 90;

    if (config.enableAutomatedInsights) {
      this.startAutomatedInsightGeneration();
    }

    if (config.enablePredictiveAnalytics) {
      this.startPredictiveAnalytics();
    }
  }

  // Data Ingestion and Storage
  ingestAnalyticsData(data: AnalyticsData | AnalyticsData[]): void {
    const dataArray = Array.isArray(data) ? data : [data];

    for (const item of dataArray) {
      this.analyticsData.push(item);
      this.observability.incrementCounter('analytics_data_ingested', {
        source: item.metadata?.source || 'unknown',
        metrics_count: Object.keys(item.metrics).length,
      });
    }

    // Maintain data retention
    this.cleanupOldData();

    // Trigger real-time insights if enabled
    if (this.config.enableAutomatedInsights) {
      this.generateRealTimeInsights(dataArray);
    }
  }

  private cleanupOldData(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.dataRetentionDays);

    const initialCount = this.analyticsData.length;
    this.analyticsData = this.analyticsData.filter(data => data.timestamp >= cutoffDate);

    const removedCount = initialCount - this.analyticsData.length;
    if (removedCount > 0) {
      this.observability.incrementCounter('analytics_data_cleaned', { records_removed: removedCount });
    }
  }

  // Predictive Analytics
  async createPredictiveModel(
    config: {
      name: string;
      type: 'regression' | 'classification' | 'time_series';
      target: string;
      features: string[];
      trainingData?: AnalyticsData[];
    }
  ): Promise<string> {
    const modelId = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Use training data or get from analytics data
    const trainingData = config.trainingData || this.getTrainingData(config.features, config.target);

    try {
      // Train model using AI service
      const model = await this.trainPredictiveModel(config, trainingData);

      const predictiveModel: PredictiveModel = {
        id: modelId,
        name: config.name,
        type: config.type,
        target: config.target,
        features: config.features,
        accuracy: await this.evaluateModelAccuracy(model, trainingData),
        lastTrained: new Date(),
        model,
      };

      this.predictiveModels.set(modelId, predictiveModel);

      this.observability.incrementCounter('predictive_model_created', {
        model_type: config.type,
        accuracy: predictiveModel.accuracy,
      });

      return modelId;
    } catch (error) {
      this.observability.incrementCounter('predictive_model_creation_failed', {
        model_type: config.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async trainPredictiveModel(
    config: any,
    trainingData: AnalyticsData[]
  ): Promise<any> {
    // Use AI models service to train predictive model
    // This is a simplified implementation - in reality would use specialized ML libraries

    const prompt = `Train a ${config.type} model to predict ${config.target} based on features: ${config.features.join(', ')}.

Training data sample:
${JSON.stringify(trainingData.slice(0, 5), null, 2)}

Please provide a trained model configuration.`;

    const response = await this.aiModels.execute({
      modelId: 'deepseek-v3.1', // Good for reasoning tasks
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    });

    // Parse and return model (simplified)
    return {
      type: config.type,
      target: config.target,
      features: config.features,
      trainedAt: new Date(),
      parameters: JSON.parse(response.content.match(/\{.*\}/)?.[0] || '{}'),
    };
  }

  private async evaluateModelAccuracy(model: any, testData: AnalyticsData[]): Promise<number> {
    // Simplified accuracy evaluation
    // In reality, would use proper ML evaluation metrics
    const predictions = testData.map(data => this.predictWithModel(model, data));
    const actuals = testData.map(data => this.extractTargetValue(data, model.target));

    let correct = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (Math.abs(predictions[i] - actuals[i]) < 0.1) { // Simplified accuracy check
        correct++;
      }
    }

    return correct / predictions.length;
  }

  async predict(modelId: string, features: Record<string, any>): Promise<number> {
    const model = this.predictiveModels.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const prediction = this.predictWithModel(model.model, { metrics: features } as AnalyticsData);

    this.observability.incrementCounter('prediction_made', {
      model_id: modelId,
      model_type: model.type,
    });

    return prediction;
  }

  private predictWithModel(model: any, data: AnalyticsData): number {
    // Simplified prediction logic
    // In reality, would use proper ML inference
    const featureSum = model.features.reduce((sum: number, feature: string) => {
      return sum + (data.metrics[feature] || 0);
    }, 0);

    return featureSum / model.features.length; // Simple average
  }

  private extractTargetValue(data: AnalyticsData, target: string): number {
    return data.metrics[target] || 0;
  }

  private getTrainingData(features: string[], target: string): AnalyticsData[] {
    // Get recent data for training
    return this.analyticsData
      .filter(data => features.every(f => data.metrics[f] !== undefined) && data.metrics[target] !== undefined)
      .slice(-1000); // Last 1000 records
  }

  // Automated Insights Generation
  private startAutomatedInsightGeneration(): void {
    // Generate insights every configured interval
    const interval = this.config.insightGenerationInterval || 300000; // 5 minutes default
    setInterval(() => this.generateInsights(), interval);
  }

  private async generateInsights(): Promise<void> {
    try {
      const recentData = this.getRecentData(1000); // Last 1000 records

      if (recentData.length < 10) return; // Not enough data

      const insights = await Promise.all([
        this.detectTrends(recentData),
        this.detectAnomalies(recentData),
        this.findCorrelations(recentData),
        this.generatePredictions(recentData),
        this.createRecommendations(recentData),
      ]);

      const allInsights = insights.flat();

      for (const insight of allInsights) {
        this.insights.push(insight);
        this.observability.incrementCounter('insight_generated', {
          type: insight.type,
          severity: insight.severity,
          confidence: insight.confidence,
        });
      }

      // Keep only recent insights
      this.cleanupOldInsights();

    } catch (error) {
      this.observability.incrementCounter('insight_generation_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async generateRealTimeInsights(newData: AnalyticsData[]): Promise<void> {
    // Generate insights for new data immediately
    const anomalies = await this.detectAnomalies(newData);

    for (const anomaly of anomalies) {
      if (anomaly.severity === 'high' || anomaly.severity === 'critical') {
        this.insights.push(anomaly);
        // Could trigger alerts here
      }
    }
  }

  private async detectTrends(data: AnalyticsData[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Group data by dimensions and analyze trends
    const groupedData = this.groupDataByDimensions(data);

    for (const [key, group] of Object.entries(groupedData)) {
      const trend = this.calculateTrend(group);

      if (Math.abs(trend.slope) > 0.1) { // Significant trend
        insights.push({
          id: `trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `Trend Detected: ${key}`,
          description: `Detected ${trend.direction} trend with slope ${trend.slope.toFixed(3)}`,
          type: 'trend',
          severity: Math.abs(trend.slope) > 0.5 ? 'high' : 'medium',
          confidence: 0.8,
          data: { trend, groupSize: group.length },
          recommendations: [
            trend.direction === 'increasing' ? 'Consider scaling resources' : 'Monitor for potential issues',
          ],
          timestamp: new Date(),
        });
      }
    }

    return insights;
  }

  private async detectAnomalies(data: AnalyticsData[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Simple statistical anomaly detection
    const metrics = Object.keys(data[0]?.metrics || {});

    for (const metric of metrics) {
      const values = data.map(d => d.metrics[metric]).filter(v => v !== undefined);
      const stats = this.calculateStats(values);

      // Check recent values against historical stats
      const recentValues = values.slice(-10); // Last 10 values
      const anomalies = recentValues.filter(v =>
        Math.abs(v - stats.mean) > 2 * stats.stdDev
      );

      if (anomalies.length > 0) {
        insights.push({
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `Anomaly Detected: ${metric}`,
          description: `Detected ${anomalies.length} anomalous values in ${metric} (mean: ${stats.mean.toFixed(2)}, recent values: ${anomalies.join(', ')})`,
          type: 'anomaly',
          severity: anomalies.length > 3 ? 'critical' : 'high',
          confidence: 0.9,
          data: { metric, anomalies, stats },
          recommendations: [
            'Investigate the cause of anomalous values',
            'Check system health and recent changes',
          ],
          timestamp: new Date(),
        });
      }
    }

    return insights;
  }

  private async findCorrelations(data: AnalyticsData[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    const metrics = Object.keys(data[0]?.metrics || {});
    if (metrics.length < 2) return insights;

    // Calculate correlations between metrics
    for (let i = 0; i < metrics.length; i++) {
      for (let j = i + 1; j < metrics.length; j++) {
        const correlation = this.calculateCorrelation(
          data.map(d => d.metrics[metrics[i]]),
          data.map(d => d.metrics[metrics[j]])
        );

        if (Math.abs(correlation) > 0.7) { // Strong correlation
          insights.push({
            id: `correlation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Strong Correlation: ${metrics[i]} ↔ ${metrics[j]}`,
            description: `Found ${correlation > 0 ? 'positive' : 'negative'} correlation (${correlation.toFixed(3)}) between ${metrics[i]} and ${metrics[j]}`,
            type: 'correlation',
            severity: 'medium',
            confidence: 0.85,
            data: { metric1: metrics[i], metric2: metrics[j], correlation },
            recommendations: [
              'Consider causal relationships between these metrics',
              correlation > 0 ? 'Monitor both metrics together' : 'Investigate inverse relationship',
            ],
            timestamp: new Date(),
          });
        }
      }
    }

    return insights;
  }

  private async generatePredictions(data: AnalyticsData[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Use predictive models to generate insights
    for (const [modelId, model] of this.predictiveModels.entries()) {
      try {
        const latestData = data[data.length - 1];
        const features = model.features.reduce((acc, feature) => {
          acc[feature] = latestData.metrics[feature] || 0;
          return acc;
        }, {} as Record<string, any>);

        const prediction = await this.predict(modelId, features);

        insights.push({
          id: `prediction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `Prediction: ${model.target}`,
          description: `Model predicts ${model.target} = ${prediction.toFixed(2)} (confidence: ${(model.accuracy * 100).toFixed(1)}%)`,
          type: 'prediction',
          severity: 'low',
          confidence: model.accuracy,
          data: { modelId, prediction, features },
          recommendations: [
            'Monitor actual values against prediction',
            'Consider model retraining if accuracy decreases',
          ],
          timestamp: new Date(),
        });
      } catch (error) {
        // Skip failed predictions
      }
    }

    return insights;
  }

  private async createRecommendations(data: AnalyticsData[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Use AI to generate business recommendations
    const recentInsights = this.insights.slice(-10);
    const dataSummary = this.summarizeData(data);

    const prompt = `Based on the following analytics data and recent insights, provide 2-3 business recommendations:

Data Summary: ${JSON.stringify(dataSummary)}
Recent Insights: ${JSON.stringify(recentInsights.map(i => ({ type: i.type, severity: i.severity, title: i.title })))}`;

    try {
      const response = await this.aiModels.execute({
        modelId: 'gpt-5.2-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const recommendations = response.content.split('\n').filter(line => line.trim());

      insights.push({
        id: `recommendation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: 'AI-Generated Business Recommendations',
        description: 'Automated recommendations based on current analytics and insights',
        type: 'recommendation',
        severity: 'medium',
        confidence: 0.75,
        data: { recommendations, dataSummary },
        recommendations,
        timestamp: new Date(),
      });
    } catch (error) {
      // Skip if AI generation fails
    }

    return insights;
  }

  // Dashboard Management
  createDashboard(config: Omit<Dashboard, 'id' | 'lastUpdated'>): string {
    const dashboardId = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const dashboard: Dashboard = {
      ...config,
      id: dashboardId,
      lastUpdated: new Date(),
    };

    this.dashboards.set(dashboardId, dashboard);
    return dashboardId;
  }

  getDashboardData(dashboardId: string, filters: Record<string, any> = {}): any {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    // Apply filters to data
    let filteredData = this.analyticsData;
    for (const [field, value] of Object.entries(filters)) {
      filteredData = filteredData.filter(data =>
        data.dimensions[field] === value ||
        data.metrics[field] === value
      );
    }

    // Generate data for each widget
    const widgetData: Record<string, any> = {};

    for (const widget of dashboard.widgets) {
      widgetData[widget.id] = this.generateWidgetData(widget, filteredData);
    }

    return {
      dashboard: dashboard.name,
      lastUpdated: dashboard.lastUpdated,
      widgetData,
      filters: dashboard.filters,
    };
  }

  private generateWidgetData(widget: DashboardWidget, data: AnalyticsData[]): any {
    switch (widget.type) {
      case 'metric':
        return this.calculateMetric(widget.config.metric, data);
      case 'chart':
        return this.generateChartData(widget.config.chartType, widget.config.metric, data);
      case 'table':
        return this.generateTableData(widget.config.columns, data);
      default:
        return null;
    }
  }

  // Report Management
  createReport(config: Omit<Report, 'id' | 'lastGenerated' | 'status'>): string {
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const report: Report = {
      ...config,
      id: reportId,
      status: 'active',
    };

    this.reports.set(reportId, report);
    return reportId;
  }

  async generateReport(reportId: string): Promise<any> {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    try {
      // Generate report data based on template
      const reportData = await this.generateReportData(report);

      report.lastGenerated = new Date();

      this.observability.incrementCounter('report_generated', {
        report_id: reportId,
        format: report.format,
        recipients: report.recipients.length,
      });

      return reportData;
    } catch (error) {
      report.status = 'error';
      this.observability.incrementCounter('report_generation_failed', {
        report_id: reportId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async generateReportData(report: Report): Promise<any> {
    // Generate report based on template and current data
    const data = this.analyticsData.slice(-1000); // Recent data
    const insights = this.insights.slice(-50); // Recent insights

    return {
      title: report.title,
      generatedAt: new Date(),
      summary: await this.generateReportSummary(data, insights),
      data,
      insights,
      recommendations: await this.generateReportRecommendations(data, insights),
    };
  }

  private async generateReportSummary(data: AnalyticsData[], insights: Insight[]): Promise<string> {
    const prompt = `Generate a concise executive summary for a business intelligence report based on the following data:

Data Points: ${data.length}
Time Range: ${data[0]?.timestamp.toISOString()} to ${data[data.length - 1]?.timestamp.toISOString()}
Key Insights: ${insights.length}
Critical Issues: ${insights.filter(i => i.severity === 'critical').length}

Please provide a professional summary highlighting key trends and recommendations.`;

    const response = await this.aiModels.execute({
      modelId: 'gpt-5.2-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return response.content;
  }

  private async generateReportRecommendations(data: AnalyticsData[], insights: Insight[]): Promise<string[]> {
    const prompt = `Based on the analytics data and insights, provide 5 specific business recommendations:

Data Summary: ${this.summarizeData(data)}
Insights Summary: ${insights.map(i => `${i.type}: ${i.title}`).join(', ')}

Focus on actionable recommendations for business improvement.`;

    const response = await this.aiModels.execute({
      modelId: 'gpt-5.2-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    return response.content.split('\n').filter(line => line.trim());
  }

  // Utility Methods
  private getRecentData(limit: number): AnalyticsData[] {
    return this.analyticsData.slice(-limit);
  }

  private groupDataByDimensions(data: AnalyticsData[]): Record<string, AnalyticsData[]> {
    const groups: Record<string, AnalyticsData[]> = {};

    for (const item of data) {
      const key = Object.values(item.dimensions).join('|');
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return groups;
  }

  private calculateTrend(data: AnalyticsData[]): { slope: number; direction: 'increasing' | 'decreasing' | 'stable' } {
    if (data.length < 2) return { slope: 0, direction: 'stable' };

    // Simple linear regression
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + Object.values(d.metrics)[0], 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * Object.values(d.metrics)[0], 0);
    const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    let direction: 'increasing' | 'decreasing' | 'stable';
    if (slope > 0.01) direction = 'increasing';
    else if (slope < -0.01) direction = 'decreasing';
    else direction = 'stable';

    return { slope, direction };
  }

  private calculateStats(values: number[]): { mean: number; stdDev: number; min: number; max: number } {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean,
      stdDev,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    const sumX = x.slice(0, n).reduce((sum, v) => sum + v, 0);
    const sumY = y.slice(0, n).reduce((sum, v) => sum + v, 0);
    const sumXY = x.slice(0, n).reduce((sum, v, i) => sum + v * y[i], 0);
    const sumXX = x.slice(0, n).reduce((sum, v) => sum + v * v, 0);
    const sumYY = y.slice(0, n).reduce((sum, v) => sum + v * v, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private summarizeData(data: AnalyticsData[]): any {
    if (data.length === 0) return {};

    const metrics = Object.keys(data[0].metrics);
    const summary: Record<string, any> = {
      totalRecords: data.length,
      timeRange: {
        start: data[0].timestamp,
        end: data[data.length - 1].timestamp,
      },
    };

    for (const metric of metrics) {
      const values = data.map(d => d.metrics[metric]).filter(v => v !== undefined);
      if (values.length > 0) {
        summary[metric] = this.calculateStats(values);
      }
    }

    return summary;
  }

  private calculateMetric(metricName: string, data: AnalyticsData[]): number {
    const values = data.map(d => d.metrics[metricName]).filter(v => v !== undefined);
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private generateChartData(chartType: string, metricName: string, data: AnalyticsData[]): any {
    const values = data.map(d => ({
      timestamp: d.timestamp,
      value: d.metrics[metricName] || 0,
    }));

    return {
      type: chartType,
      data: values,
      metric: metricName,
    };
  }

  private generateTableData(columns: string[], data: AnalyticsData[]): any[] {
    return data.slice(-100).map(d => {
      const row: Record<string, any> = {
        timestamp: d.timestamp,
      };

      for (const column of columns) {
        if (d.metrics[column] !== undefined) {
          row[column] = d.metrics[column];
        } else if (d.dimensions[column] !== undefined) {
          row[column] = d.dimensions[column];
        }
      }

      return row;
    });
  }

  private cleanupOldInsights(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep insights for 7 days

    this.insights = this.insights.filter(insight => insight.timestamp >= cutoffDate);
  }

  private startPredictiveAnalytics(): void {
    // Initialize common predictive models
    setTimeout(() => this.initializeDefaultModels(), 1000);
  }

  private async initializeDefaultModels(): Promise<void> {
    try {
      // Create a usage prediction model
      await this.createPredictiveModel({
        name: 'Usage Prediction',
        type: 'time_series',
        target: 'requests_per_minute',
        features: ['active_users', 'response_time', 'error_rate'],
      });

      // Create a performance prediction model
      await this.createPredictiveModel({
        name: 'Performance Prediction',
        type: 'regression',
        target: 'response_time',
        features: ['cpu_usage', 'memory_usage', 'active_connections'],
      });
    } catch (error) {
      console.error('Failed to initialize default predictive models:', error);
    }
  }

  // Public API
  getInsights(type?: string, severity?: string, limit: number = 50): Insight[] {
    let filtered = this.insights;

    if (type) {
      filtered = filtered.filter(i => i.type === type);
    }

    if (severity) {
      filtered = filtered.filter(i => i.severity === severity);
    }

    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getPredictiveModels(): PredictiveModel[] {
    return Array.from(this.predictiveModels.values());
  }

  getAnalyticsSummary(): any {
    return {
      totalDataPoints: this.analyticsData.length,
      dataRetentionDays: this.dataRetentionDays,
      totalInsights: this.insights.length,
      activeModels: this.predictiveModels.size,
      dashboards: this.dashboards.size,
      reports: this.reports.size,
      lastUpdated: new Date(),
    };
  }
}

// Export types
export type { AnalyticsData, PredictiveModel, Insight, Dashboard, Report };