// src/services/orchestration/advanced-ai-models.ts
// Advanced AI Models Integration for Phase 3

import { OpenAIChatClient } from '@azure/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'xai' | 'microsoft';
  model: string;
  capabilities: ModelCapability[];
  contextWindow: number;
  costPerToken: number;
  quality: number; // 0-1 scale
  throughput: number; // tokens per second
  latency: number; // seconds
  safety: number; // 0-1 scale (lower is better)
  multimodal: boolean;
  reasoning: boolean;
  endpoint?: string;
}

export interface ModelCapability {
  type: 'text' | 'vision' | 'audio' | 'code' | 'reasoning' | 'tool_use';
  quality: number; // 0-1 scale
}

export interface ModelRequest {
  modelId: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  stream?: boolean;
  reasoning?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | MultimodalContent[];
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export interface MultimodalContent {
  type: 'text' | 'image' | 'audio';
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export interface ModelResponse {
  modelId: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: ToolCall[];
  reasoning?: string;
  confidence?: number;
  metadata: {
    latency: number;
    model: string;
    timestamp: Date;
  };
}

export class AdvancedAIModelsService {
  private models = new Map<string, AIModel>();
  private clients = new Map<string, OpenAIChatClient>();
  private modelPerformance = new Map<string, PerformanceMetrics>();

  constructor(private config: {
    azureEndpoint?: string;
    azureKey?: string;
    githubToken?: string;
    enableCaching?: boolean;
    enableMetrics?: boolean;
  }) {
    this.initializeModels();
    this.initializeClients();
  }

  private initializeModels() {
    // Define available models based on AI Toolkit guidance
    const models: AIModel[] = [
      {
        id: 'gpt-5.2-chat',
        name: 'GPT-5.2 Chat',
        provider: 'openai',
        model: 'gpt-5.2-chat',
        capabilities: [
          { type: 'text', quality: 0.95 },
          { type: 'vision', quality: 0.92 },
          { type: 'code', quality: 0.98 },
          { type: 'reasoning', quality: 0.96 },
          { type: 'tool_use', quality: 0.97 }
        ],
        contextWindow: 200000,
        costPerToken: 0.0036875,
        quality: 0.95,
        throughput: 90.92,
        latency: 0.34,
        safety: 0.004,
        multimodal: true,
        reasoning: true,
      },
      {
        id: 'claude-opus-4-5',
        name: 'Claude Opus 4.5',
        provider: 'anthropic',
        model: 'claude-opus-4-5',
        capabilities: [
          { type: 'text', quality: 0.97 },
          { type: 'vision', quality: 0.94 },
          { type: 'code', quality: 0.99 },
          { type: 'reasoning', quality: 0.98 },
          { type: 'tool_use', quality: 0.96 }
        ],
        contextWindow: 200000,
        costPerToken: 0.01,
        quality: 0.97,
        throughput: 49.73,
        latency: 2.01,
        safety: 0.0015,
        multimodal: true,
        reasoning: true,
      },
      {
        id: 'deepseek-v3.1',
        name: 'DeepSeek V3.1',
        provider: 'deepseek',
        model: 'DeepSeek-V3.1',
        capabilities: [
          { type: 'text', quality: 0.91 },
          { type: 'code', quality: 0.93 },
          { type: 'reasoning', quality: 0.95 },
          { type: 'tool_use', quality: 0.92 }
        ],
        contextWindow: 128000,
        costPerToken: 0.00084,
        quality: 0.91,
        throughput: 60,
        latency: 0.39,
        safety: 0.005,
        multimodal: false,
        reasoning: true,
      },
      {
        id: 'grok-4',
        name: 'Grok 4',
        provider: 'xai',
        model: 'grok-4',
        capabilities: [
          { type: 'text', quality: 0.94 },
          { type: 'vision', quality: 0.89 },
          { type: 'reasoning', quality: 0.96 },
          { type: 'tool_use', quality: 0.93 }
        ],
        contextWindow: 256000,
        costPerToken: 0.006,
        quality: 0.94,
        throughput: 23.84,
        latency: 0.56,
        safety: 0.058,
        multimodal: true,
        reasoning: true,
      },
      {
        id: 'phi-4-reasoning',
        name: 'Phi-4 Reasoning',
        provider: 'microsoft',
        model: 'Phi-4-reasoning',
        capabilities: [
          { type: 'text', quality: 0.88 },
          { type: 'code', quality: 0.91 },
          { type: 'reasoning', quality: 0.94 }
        ],
        contextWindow: 33000,
        costPerToken: 0.0002188,
        quality: 0.88,
        throughput: 28.89,
        latency: 0.3,
        safety: 0.002,
        multimodal: false,
        reasoning: true,
      }
    ];

    models.forEach(model => this.models.set(model.id, model));
  }

  private initializeClients() {
    if (this.config.azureEndpoint && this.config.azureKey) {
      const azureClient = new OpenAIChatClient(
        this.config.azureEndpoint,
        new AzureKeyCredential(this.config.azureKey)
      );

      // Map models to Azure client
      this.clients.set('gpt-5.2-chat', azureClient);
      this.clients.set('claude-opus-4-5', azureClient);
      this.clients.set('deepseek-v3.1', azureClient);
      this.clients.set('grok-4', azureClient);
      this.clients.set('phi-4-reasoning', azureClient);
    }

    // GitHub Models integration for development
    if (this.config.githubToken) {
      // Would initialize GitHub Models client here
      // Using models.inference.ai.azure.com endpoint
    }
  }

  // Model Selection and Recommendation
  selectModel(requirements: {
    task: 'analysis' | 'generation' | 'validation' | 'reasoning' | 'coding' | 'multimodal';
    priority: 'quality' | 'speed' | 'cost' | 'safety';
    multimodal?: boolean;
    maxTokens?: number;
    budget?: number;
  }): AIModel | null {
    const candidates = Array.from(this.models.values()).filter(model => {
      // Filter by capabilities
      const hasCapability = this.hasRequiredCapabilities(model, requirements);
      if (!hasCapability) return false;

      // Filter by multimodal requirement
      if (requirements.multimodal && !model.multimodal) return false;

      // Filter by context window
      if (requirements.maxTokens && model.contextWindow < requirements.maxTokens) return false;

      // Filter by budget
      if (requirements.budget && model.costPerToken > requirements.budget) return false;

      return true;
    });

    if (candidates.length === 0) return null;

    // Score and rank candidates
    const scored = candidates.map(model => ({
      model,
      score: this.calculateModelScore(model, requirements)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0].model;
  }

  private hasRequiredCapabilities(model: AIModel, requirements: any): boolean {
    const requiredCapability = requirements.task;
    return model.capabilities.some(cap => {
      switch (requirements.task) {
        case 'analysis':
        case 'validation':
          return cap.type === 'text' && cap.quality > 0.8;
        case 'generation':
          return cap.type === 'text' && cap.quality > 0.85;
        case 'reasoning':
          return cap.type === 'reasoning' && cap.quality > 0.9;
        case 'coding':
          return cap.type === 'code' && cap.quality > 0.9;
        case 'multimodal':
          return cap.type === 'vision' || cap.type === 'audio';
        default:
          return cap.type === 'text';
      }
    });
  }

  private calculateModelScore(model: AIModel, requirements: any): number {
    let score = 0;

    // Base quality score
    score += model.quality * 0.3;

    // Priority-based scoring
    switch (requirements.priority) {
      case 'quality':
        score += model.quality * 0.4;
        break;
      case 'speed':
        score += (1 / model.latency) * 0.4; // Lower latency = higher score
        break;
      case 'cost':
        score += (1 / model.costPerToken) * 0.4; // Lower cost = higher score
        break;
      case 'safety':
        score += (1 - model.safety) * 0.4; // Lower safety risk = higher score
        break;
    }

    // Task-specific capability bonus
    const taskCapability = model.capabilities.find(cap => {
      switch (requirements.task) {
        case 'coding': return cap.type === 'code';
        case 'reasoning': return cap.type === 'reasoning';
        case 'multimodal': return cap.type === 'vision';
        default: return cap.type === 'text';
      }
    });
    if (taskCapability) {
      score += taskCapability.quality * 0.3;
    }

    return score;
  }

  // Model Execution
  async execute(request: ModelRequest): Promise<ModelResponse> {
    const model = this.models.get(request.modelId);
    if (!model) {
      throw new Error(`Model ${request.modelId} not found`);
    }

    const client = this.clients.get(request.modelId);
    if (!client) {
      throw new Error(`Client for model ${request.modelId} not available`);
    }

    const startTime = Date.now();

    try {
      // Convert messages to OpenAI format
      const openaiMessages = this.convertToOpenAIMessages(request.messages);

      // Prepare request parameters
      const params: any = {
        messages: openaiMessages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
      };

      // Add tools if specified
      if (request.tools && request.tools.length > 0) {
        params.tools = request.tools;
        params.tool_choice = 'auto';
      }

      // Add reasoning if requested and supported
      if (request.reasoning && model.reasoning) {
        params.reasoning = true;
      }

      const response = await client.complete(params);

      const endTime = Date.now();
      const latency = endTime - startTime;

      // Update performance metrics
      this.updatePerformanceMetrics(request.modelId, latency, response.usage);

      const result: ModelResponse = {
        modelId: request.modelId,
        content: response.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        toolCalls: response.choices[0]?.message?.tool_calls,
        reasoning: response.choices[0]?.message?.reasoning,
        confidence: this.calculateConfidence(response),
        metadata: {
          latency,
          model: model.model,
          timestamp: new Date(),
        },
      };

      return result;

    } catch (error) {
      const endTime = Date.now();
      this.updatePerformanceMetrics(request.modelId, endTime - startTime, null, error);
      throw error;
    }
  }

  private convertToOpenAIMessages(messages: ChatMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: Array.isArray(msg.content)
        ? msg.content.map(item => {
            if (item.type === 'text') return { type: 'text', text: item.text };
            if (item.type === 'image') return { type: 'image_url', image_url: { url: item.imageUrl } };
            if (item.type === 'audio') return { type: 'audio', audio: { url: item.audioUrl } };
            return item;
          })
        : msg.content,
      tool_calls: msg.toolCalls,
      tool_call_id: msg.toolCallId,
    }));
  }

  private calculateConfidence(response: any): number {
    // Simple confidence calculation based on response characteristics
    // In a real implementation, this would use model-specific confidence scores
    const content = response.choices[0]?.message?.content || '';
    const length = content.length;

    // Longer, more detailed responses tend to be more confident
    if (length > 1000) return 0.9;
    if (length > 500) return 0.8;
    if (length > 100) return 0.7;
    return 0.6;
  }

  // Performance Monitoring
  private updatePerformanceMetrics(
    modelId: string,
    latency: number,
    usage: any,
    error?: any
  ): void {
    if (!this.config.enableMetrics) return;

    const metrics = this.modelPerformance.get(modelId) || {
      requests: 0,
      errors: 0,
      totalLatency: 0,
      totalTokens: 0,
      lastUpdated: new Date(),
    };

    metrics.requests++;
    metrics.totalLatency += latency;

    if (usage) {
      metrics.totalTokens += usage.total_tokens || 0;
    }

    if (error) {
      metrics.errors++;
    }

    metrics.lastUpdated = new Date();
    this.modelPerformance.set(modelId, metrics);
  }

  getModelPerformance(modelId: string): PerformanceMetrics | undefined {
    return this.modelPerformance.get(modelId);
  }

  getAllModelPerformance(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.modelPerformance);
  }

  // Model Comparison and Analytics
  compareModels(modelIds: string[]): ModelComparison {
    const models = modelIds
      .map(id => this.models.get(id))
      .filter(Boolean) as AIModel[];

    const performances = modelIds
      .map(id => ({ id, metrics: this.modelPerformance.get(id) }))
      .filter(item => item.metrics);

    return {
      models,
      performances: performances.map(item => item.metrics!),
      recommendations: this.generateRecommendations(models),
    };
  }

  private generateRecommendations(models: AIModel[]): string[] {
    const recommendations: string[] = [];

    // Quality vs Speed trade-off
    const highQuality = models.filter(m => m.quality > 0.9);
    const fastModels = models.filter(m => m.latency < 1);

    if (highQuality.length > 0 && fastModels.length > 0) {
      recommendations.push('Consider using high-quality models for complex tasks and fast models for simple queries');
    }

    // Cost optimization
    const cheapModels = models.filter(m => m.costPerToken < 0.001);
    if (cheapModels.length > 0) {
      recommendations.push('Use cost-effective models for high-volume, low-complexity tasks');
    }

    // Safety considerations
    const safeModels = models.filter(m => m.safety < 0.01);
    if (safeModels.length > 0) {
      recommendations.push('Prioritize safety-tested models for user-facing applications');
    }

    return recommendations;
  }

  // Model Health and Availability
  async checkModelHealth(modelId: string): Promise<ModelHealth> {
    const model = this.models.get(modelId);
    if (!model) {
      return { status: 'not_found', modelId };
    }

    const client = this.clients.get(modelId);
    if (!client) {
      return { status: 'client_unavailable', modelId };
    }

    try {
      // Simple health check
      const startTime = Date.now();
      await client.complete({
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      });
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        modelId,
        latency,
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        modelId,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
      };
    }
  }

  async checkAllModelsHealth(): Promise<ModelHealth[]> {
    const promises = Array.from(this.models.keys()).map(id =>
      this.checkModelHealth(id)
    );
    return Promise.all(promises);
  }

  // Advanced Features
  async executeWithFallback(
    request: ModelRequest,
    fallbackModelIds: string[]
  ): Promise<ModelResponse> {
    try {
      return await this.execute(request);
    } catch (error) {
      for (const fallbackId of fallbackModelIds) {
        try {
          const fallbackRequest = { ...request, modelId: fallbackId };
          return await this.execute(fallbackRequest);
        } catch (fallbackError) {
          continue;
        }
      }
      throw error;
    }
  }

  async executeWithRetry(
    request: ModelRequest,
    maxRetries: number = 3,
    backoffMs: number = 1000
  ): Promise<ModelResponse> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.execute(request);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError!;
  }
}

export interface PerformanceMetrics {
  requests: number;
  errors: number;
  totalLatency: number;
  totalTokens: number;
  lastUpdated: Date;
}

export interface ModelComparison {
  models: AIModel[];
  performances: PerformanceMetrics[];
  recommendations: string[];
}

export interface ModelHealth {
  status: 'healthy' | 'unhealthy' | 'client_unavailable' | 'not_found';
  modelId: string;
  latency?: number;
  error?: string;
  lastChecked: Date;
}

// Utility functions for model selection
export function getBestModelForTask(
  service: AdvancedAIModelsService,
  task: 'analysis' | 'generation' | 'validation' | 'reasoning' | 'coding',
  priority: 'quality' | 'speed' | 'cost' = 'quality'
): AIModel | null {
  return service.selectModel({ task, priority });
}

export function getMultimodalModel(
  service: AdvancedAIModelsService,
  priority: 'quality' | 'speed' | 'cost' = 'quality'
): AIModel | null {
  return service.selectModel({
    task: 'multimodal',
    priority,
    multimodal: true
  });
}

export function getCostEffectiveModel(
  service: AdvancedAIModelsService,
  maxBudget: number,
  task: string = 'analysis'
): AIModel | null {
  return service.selectModel({
    task: task as any,
    priority: 'cost',
    budget: maxBudget
  });
}