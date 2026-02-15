// src/services/agents/advanced-agent-system.ts
// Advanced Multi-Agent System with Communication and Learning

interface AgentMessage {
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'proposal';
  content: any;
  timestamp: number;
  correlationId: string;
}

interface AgentMemory {
  agentId: string;
  experiences: Array<{
    input: any;
    action: string;
    outcome: 'success' | 'failure';
    feedback: string;
    timestamp: number;
  }>;
  learnedPatterns: Map<string, number>; // Pattern -> confidence score
}

interface AgentConfig {
  id: string;
  name: string;
  role: 'orchestrator' | 'analyzer' | 'executor' | 'learner';
  capabilities: string[];
  personality: {
    riskTolerance: number; // 0-1
    creativity: number; // 0-1
    thoroughness: number; // 0-1
  };
}

export class AdvancedAgentSystem {
  private agents: Map<string, AgentConfig> = new Map();
  private memories: Map<string, AgentMemory> = new Map();
  private messageQueue: AgentMessage[] = [];
  private activeConversations: Map<string, AgentMessage[]> = new Map();

  constructor() {
    this.initializeCoreAgents();
  }

  private initializeCoreAgents() {
    // Orchestrator Agent - Master controller
    this.registerAgent({
      id: 'orchestrator-001',
      name: 'Orchestra',
      role: 'orchestrator',
      capabilities: ['coordinate', 'delegate', 'monitor', 'resolve_conflicts'],
      personality: { riskTolerance: 0.3, creativity: 0.7, thoroughness: 0.9 }
    });

    // Analyzer Agent - Data and insight specialist
    this.registerAgent({
      id: 'analyzer-001',
      name: 'Insight',
      role: 'analyzer',
      capabilities: ['analyze', 'predict', 'identify_patterns', 'generate_reports'],
      personality: { riskTolerance: 0.2, creativity: 0.8, thoroughness: 0.95 }
    });

    // Executor Agent - Action specialist
    this.registerAgent({
      id: 'executor-001',
      name: 'Action',
      role: 'executor',
      capabilities: ['execute', 'integrate', 'automate', 'monitor_execution'],
      personality: { riskTolerance: 0.6, creativity: 0.4, thoroughness: 0.8 }
    });

    // Learner Agent - Continuous improvement
    this.registerAgent({
      id: 'learner-001',
      name: 'Sage',
      role: 'learner',
      capabilities: ['learn', 'adapt', 'optimize', 'provide_feedback'],
      personality: { riskTolerance: 0.4, creativity: 0.9, thoroughness: 0.7 }
    });
  }

  registerAgent(config: AgentConfig) {
    this.agents.set(config.id, config);
    this.memories.set(config.id, {
      agentId: config.id,
      experiences: [],
      learnedPatterns: new Map()
    });
  }

  async sendMessage(message: Omit<AgentMessage, 'timestamp' | 'correlationId'>): Promise<void> {
    const fullMessage: AgentMessage = {
      ...message,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId()
    };

    this.messageQueue.push(fullMessage);

    if (message.to === 'broadcast') {
      // Handle broadcast to all agents
      await this.handleBroadcast(fullMessage);
    } else {
      // Direct message
      await this.routeMessage(fullMessage);
    }
  }

  private async handleBroadcast(message: AgentMessage): Promise<void> {
    const promises = Array.from(this.agents.keys())
      .filter(id => id !== message.from)
      .map(agentId => this.deliverMessage(message, agentId));

    await Promise.all(promises);
  }

  private async routeMessage(message: AgentMessage): Promise<void> {
    const targetAgent = this.agents.get(message.to);
    if (!targetAgent) {
      throw new Error(`Agent ${message.to} not found`);
    }

    await this.deliverMessage(message, message.to);
  }

  private async deliverMessage(message: AgentMessage, targetId: string): Promise<void> {
    const conversationId = message.correlationId;
    if (!this.activeConversations.has(conversationId)) {
      this.activeConversations.set(conversationId, []);
    }

    this.activeConversations.get(conversationId)!.push(message);

    // Process message based on agent role
    const response = await this.processMessage(message, targetId);

    if (response) {
      await this.sendMessage({
        from: targetId,
        to: message.from,
        type: 'response',
        content: response
      });
    }
  }

  private async processMessage(message: AgentMessage, agentId: string): Promise<any> {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    const memory = this.memories.get(agentId);
    if (!memory) return null;

    // Apply personality-based decision making
    const decision = await this.makeDecision(message, agent, memory);

    // Learn from this interaction
    this.recordExperience(agentId, {
      input: message,
      action: decision.action,
      outcome: 'pending', // Will be updated later
      feedback: '',
      timestamp: Date.now()
    });

    return decision.response;
  }

  private async makeDecision(message: AgentMessage, agent: AgentConfig, memory: AgentMemory) {
    // Use learned patterns and personality to make decisions
    const relevantPatterns = this.findRelevantPatterns(message, memory);

    let confidence = 0.5; // Base confidence
    let action = 'analyze';

    // Adjust based on personality
    if (agent.personality.riskTolerance > 0.7) {
      confidence += 0.2;
      action = 'execute';
    }

    if (agent.personality.creativity > 0.7) {
      confidence += 0.1;
      action = 'innovate';
    }

    // Apply learned patterns
    for (const [pattern, patternConfidence] of relevantPatterns) {
      confidence = Math.max(confidence, patternConfidence);
    }

    return {
      action,
      confidence,
      response: {
        agentId: agent.id,
        decision: action,
        confidence,
        reasoning: `Based on ${relevantPatterns.size} learned patterns and ${agent.personality.thoroughness * 100}% thoroughness`
      }
    };
  }

  private findRelevantPatterns(message: AgentMessage, memory: AgentMemory): Map<string, number> {
    const relevant = new Map<string, number>();

    for (const [pattern, confidence] of memory.learnedPatterns) {
      if (this.matchesPattern(message, pattern)) {
        relevant.set(pattern, confidence);
      }
    }

    return relevant;
  }

  private matchesPattern(message: AgentMessage, pattern: string): boolean {
    // Simple pattern matching - could be enhanced with NLP
    const content = JSON.stringify(message.content).toLowerCase();
    return content.includes(pattern.toLowerCase());
  }

  private recordExperience(agentId: string, experience: AgentMemory['experiences'][0]) {
    const memory = this.memories.get(agentId);
    if (memory) {
      memory.experiences.push(experience);

      // Keep only recent experiences
      if (memory.experiences.length > 100) {
        memory.experiences = memory.experiences.slice(-100);
      }

      // Update learned patterns
      this.updateLearnedPatterns(memory, experience);
    }
  }

  private updateLearnedPatterns(memory: AgentMemory, experience: AgentMemory['experiences'][0]) {
    const pattern = this.extractPattern(experience);
    const currentConfidence = memory.learnedPatterns.get(pattern) || 0;

    // Reinforcement learning: increase confidence for success, decrease for failure
    const adjustment = experience.outcome === 'success' ? 0.1 : -0.05;
    const newConfidence = Math.max(0, Math.min(1, currentConfidence + adjustment));

    memory.learnedPatterns.set(pattern, newConfidence);
  }

  private extractPattern(experience: AgentMemory['experiences'][0]): string {
    // Extract key patterns from experience
    return `${experience.action}_${experience.outcome}`;
  }

  provideFeedback(correlationId: string, feedback: string, outcome: 'success' | 'failure') {
    const conversation = this.activeConversations.get(correlationId);
    if (conversation) {
      // Update all agents involved in the conversation
      const involvedAgents = new Set(conversation.map(msg => msg.from).concat(conversation.map(msg => msg.to)));

      for (const agentId of involvedAgents) {
        const memory = this.memories.get(agentId);
        if (memory && memory.experiences.length > 0) {
          const lastExperience = memory.experiences[memory.experiences.length - 1];
          lastExperience.outcome = outcome;
          lastExperience.feedback = feedback;

          this.updateLearnedPatterns(memory, lastExperience);
        }
      }
    }
  }

  getAgentStatus(agentId: string) {
    const agent = this.agents.get(agentId);
    const memory = this.memories.get(agentId);

    if (!agent || !memory) return null;

    return {
      agent,
      experienceCount: memory.experiences.length,
      learnedPatternsCount: memory.learnedPatterns.size,
      averageConfidence: Array.from(memory.learnedPatterns.values()).reduce((a, b) => a + b, 0) / memory.learnedPatterns.size || 0
    };
  }

  private generateCorrelationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const advancedAgentSystem = new AdvancedAgentSystem();