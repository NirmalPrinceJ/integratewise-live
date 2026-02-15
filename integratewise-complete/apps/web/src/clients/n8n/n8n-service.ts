// src/services/n8n/n8n-service.ts
// Service for controlling and monitoring n8n.integratewise.online

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  connections: any;
}

interface N8nExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  startedAt: string;
  stoppedAt?: string;
  data: any;
}

export class N8nService {
  private baseUrl = 'https://n8n.integratewise.ai/api/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all workflows
  async getWorkflows(): Promise<N8nWorkflow[]> {
    return this.request('/workflows');
  }

  // Get specific workflow
  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request(`/workflows/${id}`);
  }

  // Create new workflow
  async createWorkflow(workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  }

  // Update workflow
  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.request(`/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(workflow),
    });
  }

  // Delete workflow
  async deleteWorkflow(id: string): Promise<void> {
    await this.request(`/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  // Activate/Deactivate workflow
  async toggleWorkflow(id: string, active: boolean): Promise<void> {
    await this.request(`/workflows/${id}/${active ? 'activate' : 'deactivate'}`, {
      method: 'POST',
    });
  }

  // Get workflow executions
  async getExecutions(workflowId?: string): Promise<N8nExecution[]> {
    const endpoint = workflowId ? `/executions?workflowId=${workflowId}` : '/executions';
    return this.request(endpoint);
  }

  // Trigger workflow execution
  async triggerWorkflow(id: string, data?: any): Promise<N8nExecution> {
    return this.request(`/workflows/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  // Deploy workflow from template
  async deployWorkflowFromTemplate(template: any): Promise<N8nWorkflow> {
    // Assume template is a valid n8n workflow JSON
    return this.createWorkflow(template);
  }
}

// OpenRouter integration
export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, model = 'anthropic/claude-3-haiku:beta'): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async getModels() {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    return response.json();
  }
}