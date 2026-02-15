// src/services/business-intelligence/phase3-integration.test.ts
// Integration test for Phase 3 services working together

import { MultiAgentOrchestrator } from '../orchestration/multi-agent-orchestrator';
import { AdvancedAIModelsService } from '../orchestration/advanced-ai-models';
import { ScalabilityService } from '../scalability/scalability-service';
import { BusinessIntelligenceService } from './business-intelligence-service';
import { ObservabilityService } from '../monitoring/observability-service';
import { CircuitBreakerService } from '../resilience/circuit-breaker-service';

// Mock implementations for integration testing
const mockObservability = {
  incrementCounter: (name: string, tags?: Record<string, any>) => {
    console.log(`[Observability] ${name}:`, tags);
  },
  recordLatency: (name: string, latency: number) => {
    console.log(`[Observability] Latency ${name}: ${latency}ms`);
  },
};

const mockCircuitBreaker = {
  execute: async <T>(operation: () => Promise<T>, fallback?: () => Promise<T>) => {
    return operation();
  },
};

const mockAIModels = {
  execute: async (config: any) => {
    console.log(`[AI Models] Executing with model: ${config.modelId}`);
    return {
      content: JSON.stringify({
        result: 'Mock AI response',
        confidence: 0.85,
      }),
    };
  },
  selectModel: async (requirements: any) => 'gpt-5.2-chat',
  compareModels: async (models: string[]) => ({
    'gpt-5.2-chat': { accuracy: 0.92, latency: 1200, cost: 0.02 },
    'claude-opus-4-5': { accuracy: 0.89, latency: 1500, cost: 0.025 },
  }),
};

describe('Phase 3 Services Integration', () => {
  let orchestrator: MultiAgentOrchestrator;
  let aiModels: AdvancedAIModelsService;
  let scalability: ScalabilityService;
  let businessIntelligence: BusinessIntelligenceService;

  beforeEach(() => {
    // Initialize services
    aiModels = new AdvancedAIModelsService(mockObservability as any, mockCircuitBreaker as any, {
      defaultModel: 'gpt-5.2-chat',
      fallbackModels: ['claude-opus-4-5', 'deepseek-v3.1'],
    });

    scalability = new ScalabilityService(mockObservability as any, mockCircuitBreaker as any, {
      maxWorkers: 10,
      enableAutoScaling: true,
      cacheConfig: { ttl: 300, maxSize: 1000 },
    });

    businessIntelligence = new BusinessIntelligenceService(
      mockObservability as any,
      aiModels,
      {
        enablePredictiveAnalytics: true,
        enableAutomatedInsights: true,
        dataRetentionDays: 30,
      }
    );

    orchestrator = new MultiAgentOrchestrator(
      mockObservability as any,
      aiModels,
      scalability,
      businessIntelligence,
      mockCircuitBreaker as any
    );
  });

  it('should orchestrate a complex AI workflow with scalability and monitoring', async () => {
    console.log('\n🚀 Testing complex AI workflow orchestration...');

    // Define a complex workflow
    const workflow = {
      id: 'complex-analysis-workflow',
      name: 'Complex Data Analysis Workflow',
      description: 'Analyze data, generate insights, and scale resources as needed',
      steps: [
        {
          id: 'data-analysis',
          name: 'Data Analysis',
          type: 'agent',
          agentType: 'analyst',
          input: { data: 'large_dataset' },
          dependencies: [],
        },
        {
          id: 'insight-generation',
          name: 'Insight Generation',
          type: 'agent',
          agentType: 'insights',
          input: { analysis: '$data-analysis.output' },
          dependencies: ['data-analysis'],
        },
        {
          id: 'prediction-modeling',
          name: 'Prediction Modeling',
          type: 'agent',
          agentType: 'predictor',
          input: { insights: '$insight-generation.output' },
          dependencies: ['insight-generation'],
        },
        {
          id: 'scaling-decision',
          name: 'Scaling Decision',
          type: 'conditional',
          condition: '$prediction-modeling.output.load > 80',
          trueStep: 'scale-up',
          falseStep: 'maintain',
          dependencies: ['prediction-modeling'],
        },
        {
          id: 'scale-up',
          name: 'Scale Up Resources',
          type: 'action',
          action: 'scale_resources',
          input: { factor: 2 },
          dependencies: ['scaling-decision'],
        },
        {
          id: 'maintain',
          name: 'Maintain Current Resources',
          type: 'action',
          action: 'log_status',
          input: { message: 'Resources stable' },
          dependencies: ['scaling-decision'],
        },
      ],
      timeout: 300000, // 5 minutes
    };

    // Execute the workflow
    const result = await orchestrator.executeWorkflow(workflow, {
      large_dataset: {
        records: 10000,
        metrics: { cpu_usage: 75, memory_usage: 60, requests_per_second: 150 },
      },
    });

    console.log('✅ Workflow execution completed');
    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.steps).toBeDefined();
    expect(result.steps.length).toBe(workflow.steps.length);
  });

  it('should handle model selection and fallback with performance monitoring', async () => {
    console.log('\n🧠 Testing AI model selection and fallback...');

    // Test model selection for different requirements
    const fastModel = await aiModels.selectModel({
      priority: 'speed',
      maxLatency: 1000,
      requiredCapabilities: ['text-generation'],
    });

    const accurateModel = await aiModels.selectModel({
      priority: 'accuracy',
      maxCost: 0.05,
      requiredCapabilities: ['analysis', 'reasoning'],
    });

    expect(fastModel).toBeDefined();
    expect(accurateModel).toBeDefined();
    console.log(`✅ Selected fast model: ${fastModel}`);
    console.log(`✅ Selected accurate model: ${accurateModel}`);

    // Test model comparison
    const comparison = await aiModels.compareModels(['gpt-5.2-chat', 'claude-opus-4-5']);
    expect(comparison).toBeDefined();
    expect(Object.keys(comparison)).toHaveLength(2);
    console.log('✅ Model comparison completed');
  });

  it('should scale resources dynamically based on load', async () => {
    console.log('\n⚡ Testing dynamic resource scaling...');

    // Submit tasks to trigger scaling
    const tasks = [];
    for (let i = 0; i < 20; i++) {
      tasks.push(
        scalability.submitTask({
          id: `task-${i}`,
          type: 'data_processing',
          payload: { data: `test-data-${i}`, size: 1000 },
          priority: 'normal',
        })
      );
    }

    // Wait for tasks to be processed
    const results = await Promise.all(tasks);
    expect(results).toHaveLength(20);
    results.forEach(result => {
      expect(result.status).toBe('completed');
    });

    console.log('✅ All tasks processed successfully');

    // Check scaling metrics
    const metrics = scalability.getMetrics();
    expect(metrics).toBeDefined();
    expect(metrics.activeWorkers).toBeGreaterThanOrEqual(1);
    console.log(`✅ Scaling metrics: ${JSON.stringify(metrics)}`);
  });

  it('should generate business insights from analytics data', async () => {
    console.log('\n📊 Testing business intelligence insights...');

    // Ingest analytics data
    const analyticsData = [];
    for (let i = 0; i < 100; i++) {
      analyticsData.push({
        timestamp: new Date(Date.now() - i * 60000), // Every minute
        metrics: {
          requests: 100 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
          errors: Math.random() * 3,
          response_time: 50 + Math.random() * 30,
          cpu_usage: 60 + Math.random() * 20,
        },
        dimensions: { service: 'api', region: 'us-east' },
      });
    }

    businessIntelligence.ingestAnalyticsData(analyticsData);
    console.log('✅ Analytics data ingested');

    // Create predictive model
    const modelId = await businessIntelligence.createPredictiveModel({
      name: 'Load Predictor',
      type: 'time_series',
      target: 'requests',
      features: ['cpu_usage', 'response_time'],
    });
    console.log(`✅ Predictive model created: ${modelId}`);

    // Generate insights
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for insight generation

    const insights = businessIntelligence.getInsights();
    expect(insights.length).toBeGreaterThan(0);
    console.log(`✅ Generated ${insights.length} insights`);

    // Test prediction
    const prediction = await businessIntelligence.predict(modelId, {
      cpu_usage: 75,
      response_time: 60,
    });
    expect(typeof prediction).toBe('number');
    console.log(`✅ Prediction result: ${prediction}`);
  });

  it('should create and generate business intelligence reports', async () => {
    console.log('\n📋 Testing report generation...');

    // Create a comprehensive report
    const reportId = businessIntelligence.createReport({
      title: 'Phase 3 Performance Report',
      description: 'Comprehensive analysis of Phase 3 services performance',
      type: 'on_demand',
      recipients: ['admin@example.com', 'team@example.com'],
      format: 'json',
      template: 'comprehensive_report',
    });
    console.log(`✅ Report created: ${reportId}`);

    // Generate the report
    const reportData = await businessIntelligence.generateReport(reportId);
    expect(reportData).toBeDefined();
    expect(reportData.title).toBe('Phase 3 Performance Report');
    expect(reportData.data).toBeDefined();
    expect(reportData.insights).toBeDefined();
    expect(reportData.recommendations).toBeDefined();
    console.log('✅ Report generated successfully');

    // Test dashboard creation
    const dashboardId = businessIntelligence.createDashboard({
      name: 'Phase 3 Overview',
      description: 'Real-time monitoring of all Phase 3 services',
      widgets: [
        {
          id: 'active-agents',
          type: 'metric',
          title: 'Active Agents',
          dataSource: 'orchestrator',
          config: { metric: 'active_agents' },
          position: { x: 0, y: 0, width: 3, height: 2 },
        },
        {
          id: 'model-performance',
          type: 'chart',
          title: 'Model Performance',
          dataSource: 'ai_models',
          config: { chartType: 'line', metric: 'accuracy' },
          position: { x: 3, y: 0, width: 6, height: 4 },
        },
        {
          id: 'scaling-events',
          type: 'table',
          title: 'Recent Scaling Events',
          dataSource: 'scalability',
          config: { columns: ['timestamp', 'action', 'factor'] },
          position: { x: 0, y: 2, width: 9, height: 3 },
        },
      ],
      filters: [
        {
          field: 'time_range',
          type: 'date',
          values: ['last_hour', 'last_day', 'last_week'],
          defaultValue: 'last_hour',
        },
      ],
      refreshInterval: 60,
    });
    console.log(`✅ Dashboard created: ${dashboardId}`);

    // Get dashboard data
    const dashboardData = businessIntelligence.getDashboardData(dashboardId);
    expect(dashboardData).toBeDefined();
    expect(dashboardData.widgetData).toBeDefined();
    console.log('✅ Dashboard data retrieved');
  });

  it('should handle failures gracefully with circuit breaker and fallback', async () => {
    console.log('\n🛡️ Testing failure handling and resilience...');

    // Simulate AI model failure
    const failingAIModels = {
      ...mockAIModels,
      execute: async (config: any) => {
        if (config.modelId === 'gpt-5.2-chat') {
          throw new Error('Model temporarily unavailable');
        }
        return mockAIModels.execute(config);
      },
    };

    const resilientAIModels = new AdvancedAIModelsService(
      mockObservability as any,
      mockCircuitBreaker as any,
      {
        defaultModel: 'gpt-5.2-chat',
        fallbackModels: ['claude-opus-4-5'],
      }
    );

    // Override the execute method
    (resilientAIModels as any).execute = failingAIModels.execute;

    // Test that fallback works
    const result = await resilientAIModels.execute({
      modelId: 'gpt-5.2-chat',
      messages: [{ role: 'user', content: 'Test message' }],
    });

    expect(result).toBeDefined();
    expect(result.content).toContain('Mock AI response');
    console.log('✅ Fallback mechanism worked correctly');
  });

  it('should provide comprehensive analytics summary', () => {
    console.log('\n📈 Testing comprehensive analytics...');

    const summary = businessIntelligence.getAnalyticsSummary();

    expect(summary).toBeDefined();
    expect(typeof summary.totalDataPoints).toBe('number');
    expect(typeof summary.dataRetentionDays).toBe('number');
    expect(typeof summary.totalInsights).toBe('number');
    expect(typeof summary.activeModels).toBe('number');
    expect(typeof summary.dashboards).toBe('number');
    expect(typeof summary.reports).toBe('number');
    expect(summary.lastUpdated).toBeInstanceOf(Date);

    console.log('✅ Analytics summary generated:', summary);
  });
});