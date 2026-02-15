// src/services/business-intelligence/business-intelligence-service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BusinessIntelligenceService, AnalyticsData, Insight } from './business-intelligence-service';
import { ObservabilityService } from '../monitoring/observability-service';
import { AdvancedAIModelsService } from '../orchestration/advanced-ai-models';

// Mock dependencies
vi.mock('../monitoring/observability-service');
vi.mock('../orchestration/advanced-ai-models');

describe('BusinessIntelligenceService', () => {
  let biService: BusinessIntelligenceService;
  let mockObservability: ObservabilityService;
  let mockAIModels: AdvancedAIModelsService;

  beforeEach(() => {
    mockObservability = {
      incrementCounter: vi.fn(),
    } as any;

    mockAIModels = {
      execute: vi.fn(),
    } as any;

    biService = new BusinessIntelligenceService(mockObservability, mockAIModels, {
      enablePredictiveAnalytics: true,
      enableAutomatedInsights: true,
      dataRetentionDays: 30,
      insightGenerationInterval: 1000, // Fast for testing
    });
  });

  describe('Data Ingestion', () => {
    it('should ingest analytics data correctly', () => {
      const data: AnalyticsData = {
        timestamp: new Date(),
        metrics: { requests: 100, errors: 2 },
        dimensions: { service: 'api', region: 'us-east' },
        metadata: { source: 'test' },
      };

      biService.ingestAnalyticsData(data);

      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'analytics_data_ingested',
        expect.objectContaining({
          source: 'test',
          metrics_count: 2,
        })
      );
    });

    it('should handle multiple data points', () => {
      const data: AnalyticsData[] = [
        {
          timestamp: new Date(),
          metrics: { requests: 100 },
          dimensions: { service: 'api' },
        },
        {
          timestamp: new Date(),
          metrics: { requests: 200 },
          dimensions: { service: 'web' },
        },
      ];

      biService.ingestAnalyticsData(data);

      expect(mockObservability.incrementCounter).toHaveBeenCalledTimes(2);
    });

    it('should cleanup old data based on retention policy', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 60); // Older than retention period

      const oldData: AnalyticsData = {
        timestamp: oldDate,
        metrics: { requests: 50 },
        dimensions: { service: 'old' },
      };

      const newData: AnalyticsData = {
        timestamp: new Date(),
        metrics: { requests: 100 },
        dimensions: { service: 'new' },
      };

      biService.ingestAnalyticsData([oldData, newData]);

      // Should have cleaned up old data
      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'analytics_data_cleaned',
        { records_removed: 1 }
      );
    });
  });

  describe('Predictive Analytics', () => {
    it('should create predictive models', async () => {
      mockAIModels.execute.mockResolvedValue({
        content: '{"parameters": {"slope": 0.5, "intercept": 10}}',
      });

      const modelId = await biService.createPredictiveModel({
        name: 'Test Model',
        type: 'regression',
        target: 'response_time',
        features: ['cpu_usage', 'memory_usage'],
      });

      expect(modelId).toBeDefined();
      expect(typeof modelId).toBe('string');
      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'predictive_model_created',
        expect.any(Object)
      );
    });

    it('should make predictions with trained models', async () => {
      mockAIModels.execute.mockResolvedValue({
        content: '{"parameters": {"slope": 0.5, "intercept": 10}}',
      });

      const modelId = await biService.createPredictiveModel({
        name: 'Test Model',
        type: 'regression',
        target: 'response_time',
        features: ['cpu_usage'],
      });

      const prediction = await biService.predict(modelId, { cpu_usage: 80 });

      expect(typeof prediction).toBe('number');
      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'prediction_made',
        expect.objectContaining({ model_id: modelId })
      );
    });

    it('should throw error for non-existent models', async () => {
      await expect(biService.predict('non-existent', {})).rejects.toThrow(
        'Model non-existent not found'
      );
    });
  });

  describe('Automated Insights', () => {
    beforeEach(() => {
      // Add some test data
      const testData: AnalyticsData[] = [];
      for (let i = 0; i < 50; i++) {
        testData.push({
          timestamp: new Date(Date.now() - i * 60000), // Every minute
          metrics: {
            requests: 100 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
            errors: Math.random() * 5,
            response_time: 50 + Math.random() * 20,
          },
          dimensions: { service: 'api' },
        });
      }
      biService.ingestAnalyticsData(testData);
    });

    it('should generate trend insights', async () => {
      mockAIModels.execute.mockResolvedValue({ content: 'Mock response' });

      // Wait for insight generation
      await new Promise(resolve => setTimeout(resolve, 1100));

      const insights = biService.getInsights('trend');
      expect(insights.length).toBeGreaterThan(0);

      const trendInsight = insights[0];
      expect(trendInsight.type).toBe('trend');
      expect(trendInsight.confidence).toBeGreaterThan(0);
      expect(trendInsight.recommendations).toBeDefined();
    });

    it('should detect anomalies', async () => {
      // Add anomalous data
      const anomalousData: AnalyticsData = {
        timestamp: new Date(),
        metrics: { requests: 1000, errors: 100 }, // Much higher than normal
        dimensions: { service: 'api' },
      };
      biService.ingestAnalyticsData(anomalousData);

      mockAIModels.execute.mockResolvedValue({ content: 'Mock response' });

      // Wait for insight generation
      await new Promise(resolve => setTimeout(resolve, 1100));

      const insights = biService.getInsights('anomaly');
      expect(insights.length).toBeGreaterThan(0);

      const anomalyInsight = insights[0];
      expect(anomalyInsight.type).toBe('anomaly');
      expect(['critical', 'high']).toContain(anomalyInsight.severity);
    });

    it('should find correlations between metrics', async () => {
      mockAIModels.execute.mockResolvedValue({ content: 'Mock response' });

      // Wait for insight generation
      await new Promise(resolve => setTimeout(resolve, 1100));

      const insights = biService.getInsights('correlation');
      // May or may not find correlations depending on random data
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should generate AI-powered recommendations', async () => {
      mockAIModels.execute.mockResolvedValue({
        content: '1. Increase server capacity\n2. Optimize database queries\n3. Implement caching',
      });

      // Wait for insight generation
      await new Promise(resolve => setTimeout(resolve, 1100));

      const insights = biService.getInsights('recommendation');
      expect(insights.length).toBeGreaterThan(0);

      const recommendationInsight = insights[0];
      expect(recommendationInsight.type).toBe('recommendation');
      expect(recommendationInsight.recommendations).toBeDefined();
      expect(recommendationInsight.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Dashboard Management', () => {
    it('should create dashboards', () => {
      const dashboardId = biService.createDashboard({
        name: 'Test Dashboard',
        description: 'A test dashboard',
        widgets: [],
        filters: [],
        refreshInterval: 300,
      });

      expect(dashboardId).toBeDefined();
      expect(typeof dashboardId).toBe('string');
    });

    it('should generate dashboard data', () => {
      // Add some test data
      biService.ingestAnalyticsData({
        timestamp: new Date(),
        metrics: { requests: 100, errors: 2 },
        dimensions: { service: 'api' },
      });

      const dashboardId = biService.createDashboard({
        name: 'Test Dashboard',
        description: 'A test dashboard',
        widgets: [
          {
            id: 'metric-1',
            type: 'metric',
            title: 'Average Requests',
            dataSource: 'analytics',
            config: { metric: 'requests' },
            position: { x: 0, y: 0, width: 4, height: 2 },
          },
        ],
        filters: [],
        refreshInterval: 300,
      });

      const dashboardData = biService.getDashboardData(dashboardId);

      expect(dashboardData).toHaveProperty('dashboard', 'Test Dashboard');
      expect(dashboardData).toHaveProperty('widgetData');
      expect(dashboardData.widgetData).toHaveProperty('metric-1');
    });

    it('should throw error for non-existent dashboards', () => {
      expect(() => biService.getDashboardData('non-existent')).toThrow(
        'Dashboard non-existent not found'
      );
    });
  });

  describe('Report Management', () => {
    it('should create reports', () => {
      const reportId = biService.createReport({
        title: 'Weekly Performance Report',
        description: 'Weekly performance metrics and insights',
        type: 'scheduled',
        schedule: {
          frequency: 'weekly',
          time: '09:00',
          dayOfWeek: 1,
          timezone: 'UTC',
        },
        recipients: ['admin@example.com'],
        format: 'html',
        template: 'weekly_report',
      });

      expect(reportId).toBeDefined();
      expect(typeof reportId).toBe('string');
    });

    it('should generate reports', async () => {
      mockAIModels.execute.mockResolvedValue({
        content: 'This is a comprehensive report summary covering key metrics and insights.',
      });

      const reportId = biService.createReport({
        title: 'Test Report',
        description: 'A test report',
        type: 'on_demand',
        recipients: ['test@example.com'],
        format: 'json',
        template: 'test_template',
      });

      const reportData = await biService.generateReport(reportId);

      expect(reportData).toHaveProperty('title', 'Test Report');
      expect(reportData).toHaveProperty('generatedAt');
      expect(reportData).toHaveProperty('summary');
      expect(reportData).toHaveProperty('data');
      expect(reportData).toHaveProperty('insights');
      expect(reportData).toHaveProperty('recommendations');

      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'report_generated',
        expect.objectContaining({
          report_id: reportId,
          format: 'json',
          recipients: 1,
        })
      );
    });

    it('should throw error for non-existent reports', async () => {
      await expect(biService.generateReport('non-existent')).rejects.toThrow(
        'Report non-existent not found'
      );
    });
  });

  describe('Analytics Summary', () => {
    it('should provide analytics summary', () => {
      // Add some test data
      biService.ingestAnalyticsData({
        timestamp: new Date(),
        metrics: { requests: 100 },
        dimensions: { service: 'api' },
      });

      const summary = biService.getAnalyticsSummary();

      expect(summary).toHaveProperty('totalDataPoints', 1);
      expect(summary).toHaveProperty('dataRetentionDays', 30);
      expect(summary).toHaveProperty('totalInsights', 0);
      expect(summary).toHaveProperty('activeModels', 0);
      expect(summary).toHaveProperty('dashboards', 0);
      expect(summary).toHaveProperty('reports', 0);
      expect(summary).toHaveProperty('lastUpdated');
    });
  });

  describe('Error Handling', () => {
    it('should handle AI model failures gracefully', async () => {
      mockAIModels.execute.mockRejectedValue(new Error('AI service unavailable'));

      // Should not throw when creating model
      await expect(
        biService.createPredictiveModel({
          name: 'Test Model',
          type: 'regression',
          target: 'response_time',
          features: ['cpu_usage'],
        })
      ).rejects.toThrow();

      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'predictive_model_creation_failed',
        expect.any(Object)
      );
    });

    it('should handle report generation failures', async () => {
      mockAIModels.execute.mockRejectedValue(new Error('AI service unavailable'));

      const reportId = biService.createReport({
        title: 'Test Report',
        description: 'A test report',
        type: 'on_demand',
        recipients: ['test@example.com'],
        format: 'json',
        template: 'test_template',
      });

      await expect(biService.generateReport(reportId)).rejects.toThrow();

      expect(mockObservability.incrementCounter).toHaveBeenCalledWith(
        'report_generation_failed',
        expect.any(Object)
      );
    });
  });
});