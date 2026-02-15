/**
 * Approvals API Handlers
 * Approve/Reject handlers with API integration + feedback capture
 * Day 4: UI Polish + Integration
 */

import type { PendingApproval } from "./pending-approvals-card"
import type { ExecutionRun } from "./execution-status-card"

// Types for API responses
export interface ApprovalResponse {
  success: boolean
  executionId?: string
  message: string
  error?: string
}

export interface RejectionResponse {
  success: boolean
  message: string
  error?: string
}

export interface ExecutionStatusResponse {
  execution: ExecutionRun
}

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper for correlation ID generation
function generateCorrelationId(): string {
  return `cor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Helper for idempotency key generation
function generateIdempotencyKey(approvalId: string, action: "approve" | "reject"): string {
  return `${approvalId}_${action}_${Date.now()}`
}

/**
 * Approve a pending action
 * @param approval - The approval to approve
 * @param feedback - Optional feedback from the user
 * @returns Promise<ApprovalResponse>
 */
export async function approveAction(
  approval: PendingApproval,
  feedback?: string
): Promise<ApprovalResponse> {
  const correlationId = generateCorrelationId()
  const idempotencyKey = generateIdempotencyKey(approval.id, "approve")

  try {
    const response = await fetch(`${API_BASE_URL}/act/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        approval_id: approval.id,
        entity_id: approval.entity.id,
        entity_type: approval.entity.type,
        action_type: approval.type,
        suggested_action: approval.suggestedAction,
        feedback: feedback || null,
        approved_at: new Date().toISOString(),
        evidence_ids: approval.evidence.map((_, idx) => `ev-${approval.id}-${idx}`),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      executionId: data.execution_id,
      message: data.message || "Action approved and queued for execution",
    }
  } catch (error) {
    console.error(`[${correlationId}] Approval failed:`, error)
    
    return {
      success: false,
      message: "Failed to approve action",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Reject a pending action
 * @param approval - The approval to reject
 * @param reason - Required reason for rejection
 * @returns Promise<RejectionResponse>
 */
export async function rejectAction(
  approval: PendingApproval,
  reason: string
): Promise<RejectionResponse> {
  const correlationId = generateCorrelationId()
  const idempotencyKey = generateIdempotencyKey(approval.id, "reject")

  try {
    const response = await fetch(`${API_BASE_URL}/act/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        approval_id: approval.id,
        entity_id: approval.entity.id,
        entity_type: approval.entity.type,
        action_type: approval.type,
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      message: data.message || "Action rejected",
    }
  } catch (error) {
    console.error(`[${correlationId}] Rejection failed:`, error)
    
    return {
      success: false,
      message: "Failed to reject action",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Retry a failed execution
 * @param executionId - The execution to retry
 * @returns Promise<ApprovalResponse>
 */
export async function retryExecution(executionId: string): Promise<ApprovalResponse> {
  const correlationId = generateCorrelationId()

  try {
    const response = await fetch(`${API_BASE_URL}/act/retry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
      },
      body: JSON.stringify({
        execution_id: executionId,
        retried_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      executionId: data.new_execution_id || executionId,
      message: data.message || "Execution retry queued",
    }
  } catch (error) {
    console.error(`[${correlationId}] Retry failed:`, error)
    
    return {
      success: false,
      message: "Failed to retry execution",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get execution status
 * @param executionId - The execution to check
 * @returns Promise<ExecutionStatusResponse | null>
 */
export async function getExecutionStatus(executionId: string): Promise<ExecutionStatusResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/act/executions/${executionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return { execution: data }
  } catch (error) {
    console.error("Failed to get execution status:", error)
    return null
  }
}

/**
 * List pending approvals
 * @param filters - Optional filters
 * @returns Promise<PendingApproval[]>
 */
export async function listPendingApprovals(filters?: {
  urgency?: string[]
  type?: string[]
  entityType?: string
}): Promise<PendingApproval[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.urgency) params.set("urgency", filters.urgency.join(","))
    if (filters?.type) params.set("type", filters.type.join(","))
    if (filters?.entityType) params.set("entity_type", filters.entityType)

    const response = await fetch(`${API_BASE_URL}/act/approvals?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.approvals || []
  } catch (error) {
    console.error("Failed to list pending approvals:", error)
    return []
  }
}

/**
 * List recent executions
 * @param limit - Max number of executions to return
 * @returns Promise<ExecutionRun[]>
 */
export async function listRecentExecutions(limit: number = 10): Promise<ExecutionRun[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/act/executions?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.executions || []
  } catch (error) {
    console.error("Failed to list recent executions:", error)
    return []
  }
}

// Export all handlers
export const approvalsApi = {
  approve: approveAction,
  reject: rejectAction,
  retry: retryExecution,
  getStatus: getExecutionStatus,
  listApprovals: listPendingApprovals,
  listExecutions: listRecentExecutions,
}

export default approvalsApi
