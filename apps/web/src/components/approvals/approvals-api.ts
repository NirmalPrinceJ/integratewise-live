/**
 * Approvals API Handlers
 * Approve/Reject handlers with API integration + feedback capture
 *
 * Routes (v3.6 gateway):
 *   POST /api/v1/cognitive/act/approve    → ACT Worker
 *   POST /api/v1/cognitive/act/reject     → ACT Worker
 *   POST /api/v1/cognitive/act/retry      → ACT Worker
 *   GET  /api/v1/cognitive/act/executions → ACT Worker
 *   GET  /api/v1/cognitive/govern/pending → GOVERN Worker
 */

import { apiFetch } from "@/lib/api-client"
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
  try {
    const data = await apiFetch<any>(
      "/api/v1/cognitive/act/approve",
      {
        method: "POST",
        body: {
          approval_id: approval.id,
          entity_id: approval.entity.id,
          entity_type: approval.entity.type,
          action_type: approval.type,
          suggested_action: approval.suggestedAction,
          feedback: feedback || null,
          approved_at: new Date().toISOString(),
          evidence_ids: approval.evidence.map((_, idx) => `ev-${approval.id}-${idx}`),
        },
        headers: {
          "x-idempotency-key": generateIdempotencyKey(approval.id, "approve"),
        },
      },
      "ActApprove",
    )

    return {
      success: true,
      executionId: data?.execution_id,
      message: data?.message || "Action approved and queued for execution",
    }
  } catch (error) {
    console.error("[approvals-api] Approval failed:", error)

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
  try {
    const data = await apiFetch<any>(
      "/api/v1/cognitive/act/reject",
      {
        method: "POST",
        body: {
          approval_id: approval.id,
          entity_id: approval.entity.id,
          entity_type: approval.entity.type,
          action_type: approval.type,
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
        },
        headers: {
          "x-idempotency-key": generateIdempotencyKey(approval.id, "reject"),
        },
      },
      "ActReject",
    )

    return {
      success: true,
      message: data?.message || "Action rejected",
    }
  } catch (error) {
    console.error("[approvals-api] Rejection failed:", error)

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
  try {
    const data = await apiFetch<any>(
      "/api/v1/cognitive/act/retry",
      {
        method: "POST",
        body: {
          execution_id: executionId,
          retried_at: new Date().toISOString(),
        },
      },
      "ActRetry",
    )

    return {
      success: true,
      executionId: data?.new_execution_id || executionId,
      message: data?.message || "Execution retry queued",
    }
  } catch (error) {
    console.error("[approvals-api] Retry failed:", error)

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
    const data = await apiFetch<any>(
      `/api/v1/cognitive/act/executions/${executionId}`,
      {},
      "ActExecutionStatus",
    )
    return data ? { execution: data } : null
  } catch (error) {
    console.error("[approvals-api] Failed to get execution status:", error)
    return null
  }
}

/**
 * List pending approvals (from GOVERN Worker)
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

    const qs = params.toString() ? `?${params.toString()}` : ""
    const data = await apiFetch<any>(
      `/api/v1/cognitive/govern/pending${qs}`,
      {},
      "GovernPending",
    )
    return data?.approvals || data?.items || []
  } catch (error) {
    console.error("[approvals-api] Failed to list pending approvals:", error)
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
    const data = await apiFetch<any>(
      `/api/v1/cognitive/act/executions?limit=${limit}`,
      {},
      "ActExecutions",
    )
    return data?.executions || []
  } catch (error) {
    console.error("[approvals-api] Failed to list recent executions:", error)
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
