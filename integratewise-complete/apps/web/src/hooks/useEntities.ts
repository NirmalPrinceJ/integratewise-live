"use client"

/**
 * useEntities Hook
 * 
 * Generic hook for fetching any entity type from the Spine Service (L3)
 * Integrates with: services/spine-v2
 */

import useSWR from "swr"
import { useTenant } from "@/contexts/tenant-context"
import { SpineEntity, EntityType } from "@/lib/spine/universal-entity-service"

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch")
    const json = await res.json()
    return json.data
}

interface UseEntitiesOptions {
    limit?: number
    status?: string
    priority?: string
    search?: string
    category?: "personal" | "csm" | "business" | "team"
    [key: string]: any // For any other query params
}

export function useEntities<T = Record<string, any>>(
    entityType: EntityType,
    options: UseEntitiesOptions = {}
) {
    const tenant = useTenant()
    const { limit = 50, status, priority, search, category, ...rest } = options

    const queryParams = new URLSearchParams()
    queryParams.set("limit", String(limit))
    if (status) queryParams.set("status", status)
    if (priority) queryParams.set("priority", priority)
    if (search) queryParams.set("search", search)
    if (category) queryParams.set("category", category)

    // Add any other params
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.set(key, String(value))
        }
    })

    const { data, error, isLoading, mutate } = useSWR<SpineEntity<T>[]>(
        tenant?.id ? `/api/entities/${entityType}?${queryParams.toString()}` : null,
        fetcher,
        { refreshInterval: 30000 }
    )

    // Map SpineEntity to flat shape
    const entities = (data || []).map(entity => ({
        id: entity.id,
        ...entity.data,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
        scope: entity.scope,
        relationships: entity.relationships
    }))

    return {
        entities,
        isLoading,
        error,
        refresh: mutate,
    }
}
