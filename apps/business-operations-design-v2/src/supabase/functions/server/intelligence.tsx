import * as kv from "./kv_store.tsx";

/**
 * ④ Intelligence Engine
 * Handles Cognitive logic: Think, Act, Govern.
 */

export interface ActionProposal {
  id: string;
  action: string;
  reasoning: string;
  confidence: number;
  goal_refs: string[];
  status: "PENDING" | "APPROVED" | "DENIED";
}

export const IntelligenceEngine = {
  async proposeAction(tenantId: string, proposal: Omit<ActionProposal, "id" | "status">) {
    const id = `prop_${Math.random().toString(36).substr(2, 9)}`;
    const fullProposal: ActionProposal = {
      ...proposal,
      id,
      status: "PENDING"
    };
    
    // Store in KV HITL queue
    const queueKey = `hitl:${tenantId}:queue`;
    const queue = (await kv.get(queueKey)) || [];
    queue.push(fullProposal);
    await kv.set(queueKey, queue);
    
    console.log(`[Intelligence] Proposed action ${id} via HITL queue.`);
    return fullProposal;
  },

  async approveAction(tenantId: string, proposalId: string) {
    const queueKey = `hitl:${tenantId}:queue`;
    const queue = (await kv.get(queueKey)) || [];
    const idx = queue.findIndex((p: any) => p.id === proposalId);
    
    if (idx >= 0) {
      queue[idx].status = "APPROVED";
      // Generate ApprovalToken
      const token = {
        token: `tkn_${Math.random().toString(36).substr(2, 12)}`,
        issuedAt: new Date().toISOString(),
        governId: "GOVERN_SSOT_01"
      };
      (queue[idx] as any).token = token;
      await kv.set(queueKey, queue);
      
      console.log(`[Intelligence] Action ${proposalId} approved. Issued token ${token.token}`);
      return { success: true, token };
    }
    
    return { error: "Proposal not found" };
  }
};
