// src/services/agents/advanced-agent-service.ts
// Advanced AI Agent Service with Multi-Agent Collaboration and Learning

interface Agent {
  id: string;
  name: string;
  role: 'orchestrator' | 'specialist' | 'validator';
  capabilities: string[];
  memory: AgentMemory[];
  performance: AgentMetrics;
}

interface AgentMemory {
  id: string;
  type: 'success' | 'failure' | 'learning';
  context: any;
  action: string;
  outcome: any;
  timestamp: number;
  feedback?: string;
}

interface AgentMetrics {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  learningIterations: number;
}

interface MultiAgentTask {
  id: string;
  description: string;
  context: any;
  assignedAgents: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  steps: TaskStep[];
  result?: any;
}

interface TaskStep {
  agentId: string;
  action: string;
  input: any;
  output?: any;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
}

export class AdvancedAgentService {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, MultiAgentTask> = new Map();
  private openRouterService: any; // From n8n-service

  constructor(openRouterApiKey: string) {
    this.openRouterService = new (require('./n8n-service').OpenRouterService)(openRouterApiKey);
    this.initializeAgents();
  }

  private initializeAgents() {
    // Orchestrator Agent
    this.agents.set('orchestrator-001', {
      id: 'orchestrator-001',
      name: 'Master Orchestrator',
      role: 'orchestrator',
      capabilities: ['task_decomposition', 'agent_coordination', 'decision_making'],
      memory: [],
      performance: { tasksCompleted: 0, successRate: 0, averageResponseTime: 0, learningIterations: 0 }
    });

    // Specialist Agents
    this.agents.set('analyst-001', {
      id: 'analyst-001',
      name: 'Data Analyst',
      role: 'specialist',
      capabilities: ['data_analysis', 'insights_generation', 'predictive_modeling'],
      memory: [],
      performance: { tasksCompleted: 0, successRate: 0, averageResponseTime: 0, learningIterations: 0 }
    });

    this.agents.set('executor-001', {
      id: 'executor-001',
      name: 'Action Executor',
      role: 'specialist',
      capabilities: ['api_calls', 'workflow_execution', 'data_manipulation'],
      memory: [],
      performance: { tasksCompleted: 0, successRate: 0, averageResponseTime: 0, learningIterations: 0 }
    });

    // Validator Agent
    this.agents.set('validator-001', {
      id: 'validator-001',
      name: 'Quality Validator',
      role: 'validator',
      capabilities: ['quality_assessment', 'error_detection', 'compliance_check'],
      memory: [],
      performance: { tasksCompleted: 0, successRate: 0, averageResponseTime: 0, learningIterations: 0 }
    });
  }

  async executeMultiAgentTask(taskDescription: string, context: any): Promise<any> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create multi-agent task
    const task: MultiAgentTask = {
      id: taskId,
      description: taskDescription,
      context,
      assignedAgents: ['orchestrator-001', 'analyst-001', 'executor-001', 'validator-001'],
      status: 'pending',
      steps: []
    };

    this.tasks.set(taskId, task);

    try {
      // Step 1: Orchestrator decomposes task
      const decomposedTask = await this.orchestrateTask(task);

      // Step 2: Specialist agents execute
      const results = await this.executeSpecialistTasks(decomposedTask);

      // Step 3: Validator checks quality
      const validatedResult = await this.validateResults(results);

      // Step 4: Learn from execution
      await this.learnFromExecution(task, validatedResult);

      task.status = 'completed';
      task.result = validatedResult;

      return validatedResult;

    } catch (error) {
      task.status = 'failed';
      await this.handleFailure(task, error);
      throw error;
    }
  }

  private async orchestrateTask(task: MultiAgentTask): Promise<any> {
    const orchestrator = this.agents.get('orchestrator-001')!;
    const startTime = Date.now();

    const prompt = `As the Master Orchestrator, decompose this task into subtasks for specialist agents:

Task: ${task.description}
Context: ${JSON.stringify(task.context)}

Assign subtasks to:
- Data Analyst: For analysis and insights
- Action Executor: For execution and API calls
- Quality Validator: For validation and compliance

Return a JSON object with subtasks array.`;

    const response = await this.openRouterService.generateText(prompt);
    const decomposed = JSON.parse(this.extractJSON(response));

    task.steps.push({
      agentId: orchestrator.id,
      action: 'task_decomposition',
      input: { task: task.description, context: task.context },
      output: decomposed,
      status: 'completed',
      timestamp: Date.now()
    });

    this.updateAgentMetrics(orchestrator.id, Date.now() - startTime, true);
    return decomposed;
  }

  private async executeSpecialistTasks(decomposedTask: any): Promise<any> {
    const results = {};

    for (const subtask of decomposedTask.subtasks) {
      const agentId = this.getAgentForSubtask(subtask.type);
      const agent = this.agents.get(agentId)!;

      const result = await this.executeAgentTask(agent, subtask);
      results[subtask.type] = result;
    }

    return results;
  }

  private async executeAgentTask(agent: Agent, subtask: any): Promise<any> {
    const startTime = Date.now();

    const prompt = `As a ${agent.role} agent with capabilities: ${agent.capabilities.join(', ')}, execute this subtask:

${JSON.stringify(subtask)}

Use your expertise to provide the best possible result.`;

    const response = await this.openRouterService.generateText(prompt);

    const result = this.extractJSON(response) || response;

    this.updateAgentMetrics(agent.id, Date.now() - startTime, true);

    return result;
  }

  private async validateResults(results: any): Promise<any> {
    const validator = this.agents.get('validator-001')!;
    const startTime = Date.now();

    const prompt = `As a Quality Validator, assess these results for accuracy, completeness, and compliance:

${JSON.stringify(results)}

Provide validation feedback and any corrections needed.`;

    const validation = await this.openRouterService.generateText(prompt);

    this.updateAgentMetrics(validator.id, Date.now() - startTime, true);

    return { results, validation };
  }

  private async learnFromExecution(task: MultiAgentTask, result: any) {
    // Store successful patterns in agent memory
    for (const agentId of task.assignedAgents) {
      const agent = this.agents.get(agentId)!;
      const memory: AgentMemory = {
        id: `memory-${Date.now()}`,
        type: 'success',
        context: task.context,
        action: task.description,
        outcome: result,
        timestamp: Date.now()
      };

      agent.memory.push(memory);
      agent.performance.learningIterations++;

      // Keep only recent memories
      if (agent.memory.length > 50) {
        agent.memory = agent.memory.slice(-50);
      }
    }
  }

  private async handleFailure(task: MultiAgentTask, error: any) {
    // Store failure patterns for learning
    for (const agentId of task.assignedAgents) {
      const agent = this.agents.get(agentId)!;
      const memory: AgentMemory = {
        id: `memory-${Date.now()}`,
        type: 'failure',
        context: task.context,
        action: task.description,
        outcome: error,
        timestamp: Date.now()
      };

      agent.memory.push(memory);
    }
  }

  private getAgentForSubtask(type: string): string {
    switch (type) {
      case 'analysis': return 'analyst-001';
      case 'execution': return 'executor-001';
      case 'validation': return 'validator-001';
      default: return 'executor-001';
    }
  }

  private updateAgentMetrics(agentId: string, responseTime: number, success: boolean) {
    const agent = this.agents.get(agentId)!;
    agent.performance.tasksCompleted++;
    agent.performance.averageResponseTime =
      (agent.performance.averageResponseTime * (agent.performance.tasksCompleted - 1) + responseTime) /
      agent.performance.tasksCompleted;

    if (success) {
      agent.performance.successRate =
        (agent.performance.successRate * (agent.performance.tasksCompleted - 1) + 1) /
        agent.performance.tasksCompleted;
    }
  }

  private extractJSON(text: string): string | null {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : null;
  }

  // Public methods for external access
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgentMetrics(agentId: string): AgentMetrics | null {
    return this.agents.get(agentId)?.performance || null;
  }

  getTaskStatus(taskId: string): MultiAgentTask | null {
    return this.tasks.get(taskId) || null;
  }
}