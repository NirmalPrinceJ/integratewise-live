// src/services/business-intelligence/validate-service.ts
// Simple validation script for Business Intelligence Service

import { BusinessIntelligenceService } from './business-intelligence-service';

// Mock dependencies for validation
const mockObservability = {
  incrementCounter: (name: string, tags?: Record<string, any>) => {
    console.log(`[Observability] ${name}:`, tags);
  },
};

const mockAIModels = {
  execute: async (config: any) => {
    console.log(`[AI Models] Executing with model: ${config.modelId}`);
    return {
      content: JSON.stringify({
        parameters: { slope: 0.5, intercept: 10 },
        recommendations: [
          'Increase server capacity',
          'Optimize database queries',
          'Implement caching',
        ],
      }),
    };
  },
};

async function validateBusinessIntelligenceService() {
  console.log('🔍 Validating Business Intelligence Service...\n');

  try {
    // Create service instance
    const biService = new BusinessIntelligenceService(mockObservability as any, mockAIModels as any, {
      enablePredictiveAnalytics: true,
      enableAutomatedInsights: true,
      dataRetentionDays: 30,
    });

    console.log('✅ Service instantiated successfully');

    // Test data ingestion
    console.log('\n📊 Testing data ingestion...');
    const testData = [
      {
        timestamp: new Date(),
        metrics: { requests: 100, errors: 2, response_time: 150 },
        dimensions: { service: 'api', region: 'us-east' },
        metadata: { source: 'test' },
      },
      {
        timestamp: new Date(Date.now() - 60000),
        metrics: { requests: 120, errors: 1, response_time: 140 },
        dimensions: { service: 'api', region: 'us-east' },
        metadata: { source: 'test' },
      },
    ];

    biService.ingestAnalyticsData(testData);
    console.log('✅ Data ingestion successful');

    // Test predictive model creation
    console.log('\n🤖 Testing predictive model creation...');
    const modelId = await biService.createPredictiveModel({
      name: 'Response Time Predictor',
      type: 'regression',
      target: 'response_time',
      features: ['requests', 'errors'],
    });
    console.log(`✅ Predictive model created: ${modelId}`);

    // Test prediction
    console.log('\n🔮 Testing prediction...');
    const prediction = await biService.predict(modelId, { requests: 110, errors: 1 });
    console.log(`✅ Prediction result: ${prediction}`);

    // Test dashboard creation
    console.log('\n📈 Testing dashboard creation...');
    const dashboardId = biService.createDashboard({
      name: 'Performance Dashboard',
      description: 'Monitor API performance metrics',
      widgets: [
        {
          id: 'requests-metric',
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
    console.log(`✅ Dashboard created: ${dashboardId}`);

    // Test dashboard data retrieval
    console.log('\n📊 Testing dashboard data retrieval...');
    const dashboardData = biService.getDashboardData(dashboardId);
    console.log('✅ Dashboard data retrieved:', Object.keys(dashboardData));

    // Test report creation
    console.log('\n📋 Testing report creation...');
    const reportId = biService.createReport({
      title: 'Weekly Performance Report',
      description: 'Weekly performance metrics and insights',
      type: 'on_demand',
      recipients: ['admin@example.com'],
      format: 'json',
      template: 'weekly_report',
    });
    console.log(`✅ Report created: ${reportId}`);

    // Test report generation
    console.log('\n📄 Testing report generation...');
    const reportData = await biService.generateReport(reportId);
    console.log('✅ Report generated with keys:', Object.keys(reportData));

    // Test analytics summary
    console.log('\n📈 Testing analytics summary...');
    const summary = biService.getAnalyticsSummary();
    console.log('✅ Analytics summary:', summary);

    console.log('\n🎉 All Business Intelligence Service validations passed!');

  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run validation
validateBusinessIntelligenceService();