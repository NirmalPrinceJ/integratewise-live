/**
 * Memory Triage Client - Wires AI Sessions to Shared Memory Pool
 * 
 * Implements the L3→L2→L1 memory consolidation pipeline:
 * Raw AI Sessions → Triage → Shared Pool
 * 
 * Service: memory-consolidator (services/memory-consolidator)
 */

import { createClient } from "@/lib/supabase/client";

interface RawSession {
  id: string;
  userId: string;
  tenantId: string;
  sessionType: "chat" | "think" | "analysis" | "decision";
  content: string;
  metadata: {
    entities?: string[];
    decisions?: string[];
    confidence?: number;
  };
  createdAt: string;
}

interface TriagedMemory {
  id: string;
  sessionId: string;
  memoryType: "fact" | "decision" | "pattern" | "correction";
  content: string;
  entities: string[];
  confidence: number;
  verified: boolean;
  shared: boolean;
  createdAt: string;
}

interface TriageResult {
  memories: TriagedMemory[];
  stats: {
    totalExtracted: number;
    facts: number;
    decisions: number;
    patterns: number;
    corrections: number;
  };
}

/**
 * Client-side memory triage API
 */
export class MemoryTriageClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_MEMORY_TRIAGE_URL ||
      "http://localhost:8787";
  }

  /**
   * Submit a raw AI session for triage
   */
  async triageSession(session: RawSession): Promise<TriageResult> {
    const response = await fetch(`${this.baseUrl}/triage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    if (!response.ok) {
      throw new Error(`Triage failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get triaged memories for an entity
   */
  async getMemoriesForEntity(
    entityId: string,
    options?: {
      types?: ("fact" | "decision" | "pattern" | "correction")[];
      verified?: boolean;
      limit?: number;
    }
  ): Promise<TriagedMemory[]> {
    const params = new URLSearchParams();
    params.set("entityId", entityId);
    if (options?.types) params.set("types", options.types.join(","));
    if (options?.verified !== undefined)
      params.set("verified", String(options.verified));
    if (options?.limit) params.set("limit", String(options.limit));

    const response = await fetch(`${this.baseUrl}/memories?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch memories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Verify a triaged memory (promote to shared pool)
   */
  async verifyMemory(
    memoryId: string,
    verification: {
      verified: boolean;
      verifiedBy: string;
      notes?: string;
    }
  ): Promise<TriagedMemory> {
    const response = await fetch(`${this.baseUrl}/memories/${memoryId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verification),
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Share a memory across the organization
   */
  async shareMemory(memoryId: string): Promise<TriagedMemory> {
    const response = await fetch(`${this.baseUrl}/memories/${memoryId}/share`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Sharing failed: ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * React hook for memory triage operations
 */
export function useMemoryTriage() {
  const client = new MemoryTriageClient();

  return {
    /**
     * Triage a completed AI session
     */
    async triageSession(session: RawSession) {
      return client.triageSession(session);
    },

    /**
     * Get memories for an entity
     */
    async getMemories(
      entityId: string,
      options?: Parameters<MemoryTriageClient["getMemoriesForEntity"]>[1]
    ) {
      return client.getMemoriesForEntity(entityId, options);
    },

    /**
     * Verify a memory (promote to shared pool)
     */
    async verifyMemory(
      memoryId: string,
      verification: {
        verified: boolean;
        verifiedBy: string;
        notes?: string;
      }
    ) {
      return client.verifyMemory(memoryId, verification);
    },

    /**
     * Share a memory organization-wide
     */
    async shareMemory(memoryId: string) {
      return client.shareMemory(memoryId);
    },
  };
}

/**
 * Auto-triage hook - automatically triages sessions when they complete
 */
export function useAutoTriage() {
  const client = new MemoryTriageClient();

  return {
    /**
     * Enable auto-triage for a session
     * Call this when a session ends
     */
    async enableForSession(session: RawSession) {
      try {
        const result = await client.triageSession(session);
        console.log("[MemoryTriage] Session triaged:", result.stats);
        return result;
      } catch (err) {
        console.error("[MemoryTriage] Auto-triage failed:", err);
        throw err;
      }
    },
  };
}
