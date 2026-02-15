/**
 * MCP Client for AI Assistant
 * 
 * Connects the AI assistant to MCP tools for Knowledge Bank operations.
 * Provides type-safe tool invocation and result handling.
 */

// ============================================================================
// MCP TOOL DEFINITIONS
// ============================================================================

export interface MCPTool {
  name: string;
  description: string;
  input_schema: Record<string, any>;
}

export interface MCPToolCall {
  tool: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Available MCP Tools
export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'kb.search',
    description: 'Search the Knowledge Bank for relevant content using semantic search',
    input_schema: {
      type: 'object',
      required: ['tenant_id', 'query'],
      properties: {
        tenant_id: { type: 'string', description: 'Tenant ID' },
        query: { type: 'string', description: 'Search query' },
        top_k: { type: 'number', description: 'Number of results (default: 5)', default: 5 },
        filters: {
          type: 'object',
          properties: {
            artifact_type: { type: 'string' },
            topic: { type: 'string' },
          }
        }
      }
    }
  },
  {
    name: 'kb.write_session_summary',
    description: 'Save an AI session summary to the Knowledge Bank',
    input_schema: {
      type: 'object',
      required: ['tenant_id', 'user_id', 'provider', 'session_id', 'started_at', 'ended_at', 'summary_md'],
      properties: {
        tenant_id: { type: 'string' },
        user_id: { type: 'string' },
        provider: { type: 'string', enum: ['chatgpt', 'claude', 'grok', 'gemini', 'system'] },
        session_id: { type: 'string' },
        started_at: { type: 'string', format: 'date-time' },
        ended_at: { type: 'string', format: 'date-time' },
        summary_md: { type: 'string' },
        topics: { type: 'array', items: { type: 'string' } },
        project: { type: 'string' }
      }
    }
  },
  {
    name: 'kb.get_artifact',
    description: 'Retrieve a specific artifact from the Knowledge Bank',
    input_schema: {
      type: 'object',
      required: ['tenant_id', 'artifact_id'],
      properties: {
        tenant_id: { type: 'string' },
        artifact_id: { type: 'string' }
      }
    }
  },
  {
    name: 'kb.list_recent',
    description: 'List recent Knowledge Bank artifacts',
    input_schema: {
      type: 'object',
      required: ['tenant_id'],
      properties: {
        tenant_id: { type: 'string' },
        limit: { type: 'number', default: 10 },
        artifact_type: { type: 'string' }
      }
    }
  },
  {
    name: 'kb.topic_list',
    description: 'List all topics in the Knowledge Bank',
    input_schema: {
      type: 'object',
      required: ['tenant_id'],
      properties: {
        tenant_id: { type: 'string' }
      }
    }
  }
];

// ============================================================================
// MCP CLIENT
// ============================================================================

export interface MCPClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class MCPClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config: MCPClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
  }

  // List available tools
  async listTools(): Promise<MCPTool[]> {
    const response = await this.fetch('/tools');
    return response.tools || MCP_TOOLS;
  }

  // Invoke a tool
  async invoke(toolName: string, args: Record<string, any>): Promise<MCPToolResult> {
    try {
      const response = await this.fetch('/invoke', {
        method: 'POST',
        body: JSON.stringify({
          tool: toolName,
          arguments: args
        })
      });

      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Tool invocation failed'
      };
    }
  }

  // Search Knowledge Bank
  async search(tenantId: string, query: string, options?: {
    topK?: number;
    artifactType?: string;
    topic?: string;
  }): Promise<MCPToolResult> {
    return this.invoke('kb.search', {
      tenant_id: tenantId,
      query,
      top_k: options?.topK || 5,
      filters: {
        artifact_type: options?.artifactType,
        topic: options?.topic
      }
    });
  }

  // Write session summary
  async writeSessionSummary(params: {
    tenantId: string;
    userId: string;
    provider: string;
    sessionId: string;
    startedAt: string;
    endedAt: string;
    summaryMd: string;
    topics?: string[];
    project?: string;
  }): Promise<MCPToolResult> {
    return this.invoke('kb.write_session_summary', {
      tenant_id: params.tenantId,
      user_id: params.userId,
      provider: params.provider,
      session_id: params.sessionId,
      started_at: params.startedAt,
      ended_at: params.endedAt,
      summary_md: params.summaryMd,
      topics: params.topics || [],
      project: params.project
    });
  }

  // Get artifact
  async getArtifact(tenantId: string, artifactId: string): Promise<MCPToolResult> {
    return this.invoke('kb.get_artifact', {
      tenant_id: tenantId,
      artifact_id: artifactId
    });
  }

  // List recent artifacts
  async listRecent(tenantId: string, options?: {
    limit?: number;
    artifactType?: string;
  }): Promise<MCPToolResult> {
    return this.invoke('kb.list_recent', {
      tenant_id: tenantId,
      limit: options?.limit || 10,
      artifact_type: options?.artifactType
    });
  }

  // List topics
  async listTopics(tenantId: string): Promise<MCPToolResult> {
    return this.invoke('kb.topic_list', {
      tenant_id: tenantId
    });
  }

  // Private fetch helper
  private async fetch(path: string, options?: RequestInit): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options?.headers },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`MCP request failed: ${response.status} - ${error}`);
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('MCP request timed out');
      }
      throw error;
    }
  }
}

// ============================================================================
// AI ASSISTANT WITH MCP TOOLS
// ============================================================================

export interface AIAssistantMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: MCPToolCall[];
  tool_results?: MCPToolResult[];
}

export class AIAssistantWithMCP {
  private mcpClient: MCPClient;
  private tenantId: string;
  private userId: string;

  constructor(config: {
    mcpBaseUrl: string;
    mcpApiKey?: string;
    tenantId: string;
    userId: string;
  }) {
    this.mcpClient = new MCPClient({
      baseUrl: config.mcpBaseUrl,
      apiKey: config.mcpApiKey
    });
    this.tenantId = config.tenantId;
    this.userId = config.userId;
  }

  // Get system prompt with available tools
  getSystemPrompt(): string {
    const toolDescriptions = MCP_TOOLS
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n');

    return `You are an AI assistant for IntegrateWise OS with access to the following Knowledge Bank tools:

${toolDescriptions}

When the user asks about past conversations, documents, or knowledge, use the kb.search tool to find relevant information.
When summarizing a session, use kb.write_session_summary to save it.

Always be helpful, concise, and use the tools when they would provide value to the user.`;
  }

  // Process tool calls from AI response
  async processToolCalls(toolCalls: MCPToolCall[]): Promise<MCPToolResult[]> {
    const results: MCPToolResult[] = [];

    for (const call of toolCalls) {
      // Inject tenant_id if not provided
      const args = { ...call.arguments };
      if (!args.tenant_id) {
        args.tenant_id = this.tenantId;
      }

      const result = await this.mcpClient.invoke(call.tool, args);
      results.push(result);
    }

    return results;
  }

  // Search for relevant context before responding
  async getRelevantContext(query: string): Promise<string> {
    const result = await this.mcpClient.search(this.tenantId, query, { topK: 3 });
    
    if (!result.success || !result.data?.results?.length) {
      return '';
    }

    const contextParts = result.data.results.map((r: any) => 
      `[${r.artifact_type || 'knowledge'}] ${r.title || 'Untitled'}: ${r.snippet || r.content?.substring(0, 200)}`
    );

    return `\n\nRelevant Knowledge:\n${contextParts.join('\n')}`;
  }

  // Save conversation summary
  async saveSessionSummary(
    sessionId: string,
    messages: AIAssistantMessage[],
    startedAt: string
  ): Promise<MCPToolResult> {
    // Generate summary from messages
    const conversationText = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const summaryMd = `## Conversation Summary

**Session ID:** ${sessionId}
**Duration:** ${startedAt} - ${new Date().toISOString()}
**Messages:** ${messages.length}

### Key Points
${this.extractKeyPoints(messages)}

### Full Conversation
${conversationText}`;

    return this.mcpClient.writeSessionSummary({
      tenantId: this.tenantId,
      userId: this.userId,
      provider: 'system',
      sessionId,
      startedAt,
      endedAt: new Date().toISOString(),
      summaryMd,
      topics: this.extractTopics(messages)
    });
  }

  // Extract key points from conversation
  private extractKeyPoints(messages: AIAssistantMessage[]): string {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return '- No key points identified';

    return userMessages
      .slice(0, 5)
      .map(m => `- ${m.content.substring(0, 100)}${m.content.length > 100 ? '...' : ''}`)
      .join('\n');
  }

  // Extract topics from conversation
  private extractTopics(messages: AIAssistantMessage[]): string[] {
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    const topics: string[] = [];

    // Simple keyword-based topic extraction
    const topicKeywords: Record<string, string[]> = {
      'accounts': ['account', 'customer', 'client'],
      'revenue': ['revenue', 'mrr', 'arr', 'billing', 'payment'],
      'support': ['ticket', 'support', 'issue', 'help'],
      'analytics': ['metric', 'dashboard', 'report', 'analytics'],
      'integration': ['integration', 'connector', 'sync', 'api'],
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        topics.push(topic);
      }
    }

    return topics.length > 0 ? topics : ['general'];
  }
}

// Default MCP URL
export const DEFAULT_MCP_URL = 'https://integratewise-mcp-tool-server.connect-a1b.workers.dev';
