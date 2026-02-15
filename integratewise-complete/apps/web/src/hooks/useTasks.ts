"use client"

/**
 * useTasks Hook
 * 
 * Fetches task entities from the Spine Service (L3)
 * Integrates with: services/spine-v2
 */

import { useEntities } from "./useEntities"
import { EntityType } from "@/lib/spine/universal-entity-service"

export interface TaskData {
    title: string
    description: string
    status: "todo" | "in_progress" | "done" | "blocked" | "overdue"
    priority: "low" | "medium" | "high" | "critical"
    dueDate: string
    dueDays?: number
    assignee: string
    assigneeInitials?: string
    project?: string
    projectName?: string
    accountId?: string
    accountName?: string
    labels: string[]
    subtasks: {
        completed: number
        total: number
    }
}

interface UseTasksOptions {
    limit?: number
    status?: string
    priority?: string
    search?: string
    category?: "personal" | "team" | "business"
}

export function useTasks(options: UseTasksOptions = {}) {
    const { entities, isLoading, error, refresh } = useEntities<TaskData>("task", options)

    return {
        tasks: entities,
        isLoading,
        error,
        refresh,
    }
}
