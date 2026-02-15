"use client"

import useSWR from "swr"

export interface AuditLogEntry {
    id: string
    timestamp: string
    actor: string
    action: string
    target: string
    objectType: string
    objectId: string
    justification?: string
    before?: any
    after?: any
}

export interface AuditResponse {
    entries: AuditLogEntry[]
    total: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAdminAudit() {
    const { data, error, isLoading, mutate } = useSWR<AuditResponse>("/api/admin/audit", fetcher)

    return {
        entries: data?.entries || [],
        total: data?.total || 0,
        loading: isLoading,
        error,
        refresh: mutate,
    }
}
