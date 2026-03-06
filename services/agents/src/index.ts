import { Hono } from 'hono';
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';

// ============================================================================
// Types & Interfaces
// ============================================================================
interface Env {
  // Primary data source (truth database)
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;

  // Edge cache (D1) — used for agent_colony_runs, idempotency keys, cached projections
  DB: D1Database;

  AI: Ai;
  AGENT_COLONY: Workflow;
  SPINE_URL: string;
  KNOWLEDGE_URL: string;
  ACT_URL: string;

  // Service bindings (v3.6 Section 19.3-19.4)
  THINK: Fetcher;
  GOVERN: Fetcher;
  KNOWLEDGE: Fetcher;
}

interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AgentTask {
  taskId: string;
  tenantId: string;
  userId: string;
  objective: string;
  context: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AgentResult {
  agentId: string;
  output: unknown;
  confidence: number;
  reasoning: string;
  nextAction?: string;
}

// ============================================================================
// Supabase Query Helper (Truth Database)
// ============================================================================
async function supabaseQuery(
    url: string,
    key: string,
    table: string,
    query: string
): Promise<any[]> {
    try {
        const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error(`Supabase query failed: ${res.status} ${res.statusText}`);
            return [];
        }

        return res.json();
    } catch (err: any) {
        console.error(`Supabase fetch error: ${err.message}`);
        return [];
    }
}

// ============================================================================
// Base Agent Class
// ============================================================================
abstract class BaseAgent {
  protected env: Env;
  protected agentId: string;
  protected systemPrompt: string;
  protected model: string = '@cf/meta/llama-3.1-70b-instruct';

  constructor(env: Env, agentId: string, systemPrompt: string) {
    this.env = env;
    this.agentId = agentId;
    this.systemPrompt = systemPrompt;
  }

  async think(messages: AgentMessage[]): Promise<string> {
    const response = await this.env.AI.run(this.model as any, {
      messages: [
        { role: 'system', content: this.systemPrompt },
        ...messages,
      ],
    });
    return (response as { response: string }).response;
  }

  abstract execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult>;
}

// ============================================================================
// Specialized Agents
// ============================================================================

/**
 * Orchestrator Agent - Routes tasks to specialized agents
 */
class OrchestratorAgent extends BaseAgent {
  constructor(env: Env) {
    super(env, 'orchestrator', `You are the Orchestrator Agent for IntegrateWise.
Your role is to analyze incoming tasks and determine which specialized agents should handle them.

Available agents:
- RESEARCH: Gathers information from knowledge base, APIs, and external sources
- ANALYST: Analyzes data, calculates metrics, identifies patterns and anomalies
- WRITER: Generates emails, reports, summaries, and documentation
- PLANNER: Creates action plans, playbooks, and strategic recommendations
- EXECUTOR: Triggers actions via connectors (CRM updates, emails, Slack messages)

Respond with a JSON array of agent assignments:
{
  "plan": "Brief description of the overall approach",
  "assignments": [
    { "agent": "RESEARCH", "task": "specific task for this agent", "priority": 1 },
    { "agent": "ANALYST", "task": "specific task for this agent", "priority": 2, "dependsOn": ["RESEARCH"] }
  ]
}`);
  }

  async execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult> {
    const response = await this.think([
      { role: 'user', content: `Objective: ${task.objective}\n\nContext: ${JSON.stringify(task.context)}` }
    ]);

    let plan;
    try {
      plan = JSON.parse(response);
    } catch {
      plan = { plan: response, assignments: [] };
    }

    return {
      agentId: this.agentId,
      output: plan,
      confidence: 0.9,
      reasoning: 'Analyzed task and created execution plan',
    };
  }
}

/**
 * Research Agent - Gathers information from various sources
 */
class ResearchAgent extends BaseAgent {
  constructor(env: Env) {
    super(env, 'research', `You are the Research Agent for IntegrateWise.
Your role is to gather relevant information from:
- Knowledge base (internal documents, playbooks, best practices)
- Customer data (CRM records, interactions, health metrics)
- External sources (industry benchmarks, competitive intel)

Always cite your sources and provide confidence levels for each piece of information.
Structure your findings clearly with key insights highlighted.`);
  }

  async execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult> {
    // Query knowledge base
    const knowledgeResults = await step.do(`research-knowledge-${task.taskId}`, async (): Promise<any> => {
      const response = await fetch(`${this.env.KNOWLEDGE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: task.objective,
          tenantId: task.tenantId,
          limit: 10,
        }),
      });
      return response.json();
    });

    // Query Spine for entity data
    const spineResults = await step.do(`research-spine-${task.taskId}`, async (): Promise<any> => {
      if (task.context.entityId) {
        const response = await fetch(`${this.env.SPINE_URL}/entities/${task.context.entityId}`, {
          headers: { 'x-tenant-id': task.tenantId },
        });
        return response.json();
      }
      return null;
    });

    // Synthesize findings
    const synthesis = await this.think([
      { role: 'user', content: `Research task: ${task.objective}
      
Knowledge base findings: ${JSON.stringify(knowledgeResults)}
Entity data: ${JSON.stringify(spineResults)}

Synthesize these findings into actionable insights.` }
    ]);

    return {
      agentId: this.agentId,
      output: {
        knowledge: knowledgeResults,
        entityData: spineResults,
        synthesis,
      },
      confidence: 0.85,
      reasoning: 'Gathered and synthesized information from multiple sources',
    };
  }
}

/**
 * Analyst Agent - Analyzes data and identifies patterns
 */
class AnalystAgent extends BaseAgent {
  constructor(env: Env) {
    super(env, 'analyst', `You are the Analyst Agent for IntegrateWise.
Your role is to:
- Analyze quantitative and qualitative data
- Calculate health scores, risk metrics, and trends
- Identify patterns, anomalies, and correlations
- Provide data-driven recommendations

Always show your reasoning and calculations. Highlight key metrics and their implications.
Format numerical findings with appropriate precision and context.`);
  }

  async execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult> {
    const analysisPrompt = `Analyze the following data for: ${task.objective}

Context and data:
${JSON.stringify(task.context, null, 2)}

Provide:
1. Key metrics and their values
2. Trend analysis (improving/declining/stable)
3. Anomalies or concerns
4. Risk assessment (low/medium/high/critical)
5. Recommended actions based on analysis`;

    const analysis = await this.think([{ role: 'user', content: analysisPrompt }]);

    return {
      agentId: this.agentId,
      output: {
        analysis,
        timestamp: new Date().toISOString(),
      },
      confidence: 0.88,
      reasoning: 'Performed quantitative and qualitative analysis',
    };
  }
}

/**
 * Writer Agent - Generates content and communications
 */
class WriterAgent extends BaseAgent {
  constructor(env: Env) {
    super(env, 'writer', `You are the Writer Agent for IntegrateWise.
Your role is to create:
- Professional emails and communications
- Executive summaries and reports
- Documentation and playbooks
- Slack/Teams messages

Adapt your tone and style based on the audience (executive, technical, customer-facing).
Be concise but comprehensive. Use clear structure with headers and bullet points.`);
  }

  async execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult> {
    const content = await this.think([
      { role: 'user', content: `Create content for: ${task.objective}

Context: ${JSON.stringify(task.context)}

Requirements:
- Audience: ${task.context.audience || 'professional'}
- Format: ${task.context.format || 'email'}
- Tone: ${task.context.tone || 'professional'}
- Length: ${task.context.length || 'concise'}` }
    ]);

    return {
      agentId: this.agentId,
      output: {
        content,
        format: task.context.format || 'email',
        wordCount: content.split(' ').length,
      },
      confidence: 0.92,
      reasoning: 'Generated professional content based on requirements',
    };
  }
}

/**
 * Planner Agent - Creates strategic plans and recommendations
 */
class PlannerAgent extends BaseAgent {
  constructor(env: Env) {
    super(env, 'planner', `You are the Planner Agent for IntegrateWise.
Your role is to:
- Create actionable step-by-step plans
- Design playbooks and workflows
- Prioritize tasks and allocate resources
- Set timelines and milestones

Plans should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
Include contingency options and success criteria for each step.`);
  }

  async execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult> {
    const plan = await this.think([
      { role: 'user', content: `Create an action plan for: ${task.objective}

Context: ${JSON.stringify(task.context)}

Include:
1. Goal statement
2. Step-by-step actions with owners and deadlines
3. Required resources
4. Success metrics
5. Risk mitigation strategies
6. Contingency plans` }
    ]);

    return {
      agentId: this.agentId,
      output: {
        plan,
        createdAt: new Date().toISOString(),
      },
      confidence: 0.87,
      reasoning: 'Created comprehensive action plan with milestones',
    };
  }
}

/**
 * Executor Agent - Triggers actions via connectors
 */
class ExecutorAgent extends BaseAgent {
  constructor(env: Env) {
    super(env, 'executor', `You are the Executor Agent for IntegrateWise.
Your role is to:
- Translate plans into executable actions
- Trigger API calls to connected systems
- Update CRM records, send emails, post to Slack
- Monitor execution and handle errors

Always confirm actions before executing in production.
Log all actions for audit trail.`);
  }

  async execute(task: AgentTask, step: WorkflowStep): Promise<AgentResult> {
    // Parse the action from context
    const action = task.context.action as {
      type: string;
      target: string;
      params: Record<string, unknown>;
    };

    if (!action) {
      return {
        agentId: this.agentId,
        output: { error: 'No action specified' },
        confidence: 0,
        reasoning: 'Cannot execute without action specification',
      };
    }

    // Execute via Act service
    const result = await step.do(`execute-action-${task.taskId}`, async (): Promise<any> => {
      const response = await fetch(`${this.env.ACT_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: task.tenantId,
          userId: task.userId,
          action,
        }),
      });
      return response.json();
    });

    return {
      agentId: this.agentId,
      output: result,
      confidence: 0.95,
      reasoning: `Executed action: ${action.type} on ${action.target}`,
    };
  }
}

// ============================================================================
// Agent Colony Workflow
// ============================================================================
export class AgentColonyWorkflow extends WorkflowEntrypoint<Env, AgentTask> {
  async run(event: WorkflowEvent<AgentTask>, step: WorkflowStep) {
    const task = event.payload;
    const instanceId = event.instanceId;

    // Initialize agents
    const orchestrator = new OrchestratorAgent(this.env);
    const agents: Record<string, BaseAgent> = {
      RESEARCH: new ResearchAgent(this.env),
      ANALYST: new AnalystAgent(this.env),
      WRITER: new WriterAgent(this.env),
      PLANNER: new PlannerAgent(this.env),
      EXECUTOR: new ExecutorAgent(this.env),
    };

    // Step 1: Orchestrator creates execution plan
    const plan = await step.do('orchestrate', async (): Promise<any> => {
      return orchestrator.execute(task, step);
    });

    const assignments = ((plan as any).output as { assignments: Array<{ agent: string; task: string; priority: number; dependsOn?: string[] }> }).assignments || [];

    // Step 2: Execute agents based on plan
    const results: Record<string, AgentResult> = {};
    const completed = new Set<string>();

    // Sort by priority and execute respecting dependencies
    const sortedAssignments = assignments.sort((a, b) => a.priority - b.priority);

    for (const assignment of sortedAssignments) {
      // Check dependencies
      if (assignment.dependsOn) {
        const depsReady = assignment.dependsOn.every(dep => completed.has(dep));
        if (!depsReady) continue;
      }

      const agent = agents[assignment.agent];
      if (!agent) continue;

      const result = await step.do(`agent-${assignment.agent.toLowerCase()}`, async (): Promise<any> => {
        const agentTask: AgentTask = {
          ...task,
          objective: assignment.task,
          context: {
            ...task.context,
            previousResults: results,
          },
        };
        return agent.execute(agentTask, step);
      });

      results[assignment.agent] = result as AgentResult;
      completed.add(assignment.agent);
    }

    // Step 3: Store results
    await step.do('store-results', async (): Promise<any> => {
      await this.env.DB.prepare(`
        INSERT INTO agent_colony_runs (
          id, instance_id, tenant_id, user_id, task_objective,
          plan, results, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', datetime('now'))
      `).bind(
        crypto.randomUUID(),
        instanceId,
        task.tenantId,
        task.userId,
        task.objective,
        JSON.stringify((plan as any).output),
        JSON.stringify(results)
      ).run();
    });

    return {
      instanceId,
      task: task.objective,
      plan: (plan as any).output,
      results,
      status: 'completed',
    };
  }
}

// ============================================================================
// Hono API
// ============================================================================
const app = new Hono<{ Bindings: Env }>();

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'Agent Colony',
    version: '1.0.0',
    database: 'Supabase (agent_registry truth) + D1 (agent_colony_runs edge cache)',
    agents: ['orchestrator', 'research', 'analyst', 'writer', 'planner', 'executor'],
  });
});

// Start a new agent colony task
app.post('/colony/run', async (c) => {
  const body = await c.req.json<AgentTask>();

  const instance = await c.env.AGENT_COLONY.create({
    params: body,
  });

  return c.json({
    success: true,
    instanceId: instance.id,
    status: await instance.status(),
  });
});

// Get colony run status
app.get('/colony/:instanceId', async (c) => {
  const instanceId = c.req.param('instanceId');
  const instance = await c.env.AGENT_COLONY.get(instanceId);
  const status = await instance.status();

  return c.json({ instanceId, status });
});

// Quick single-agent execution (no workflow)
app.post('/agent/:agentType', async (c) => {
  const agentType = c.req.param('agentType').toUpperCase();
  const body = await c.req.json<{ prompt: string; context?: Record<string, unknown> }>();

  const agents: Record<string, (env: Env) => BaseAgent> = {
    RESEARCH: (env) => new ResearchAgent(env),
    ANALYST: (env) => new AnalystAgent(env),
    WRITER: (env) => new WriterAgent(env),
    PLANNER: (env) => new PlannerAgent(env),
  };

  const agentFactory = agents[agentType];
  if (!agentFactory) {
    return c.json({ error: 'Unknown agent type' }, 400);
  }

  const agent = agentFactory(c.env);
  const response = await agent['think']([{ role: 'user', content: body.prompt }]);

  return c.json({
    agent: agentType,
    response,
    timestamp: new Date().toISOString(),
  });
});

// Get colony run history
// v3.6: agent_colony_runs stored in D1 (edge cache) — eventual sync to Supabase via background job
// agent_registry (master list of agents) is in Supabase PostgreSQL with RLS
app.get('/colony/history/:tenantId', async (c) => {
  const tenantId = c.req.param('tenantId');
  const result = await c.env.DB.prepare(`
    SELECT * FROM agent_colony_runs
    WHERE tenant_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).bind(tenantId).all();

  return c.json({ runs: result.results });
});

export default app;
