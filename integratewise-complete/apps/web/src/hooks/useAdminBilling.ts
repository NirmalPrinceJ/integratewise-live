"use client"

import useSWR from "swr"

export interface BillingUsage {
    aiTokens: number
    actionRuns: number
    connectorSyncs: number
    storageGb: number
}

export interface BillingPlanInfo {
    tenantId: string
    plan: string
    seats: number
    seatsUsed: number
    usage: BillingUsage
    alerts: string[]
}

export interface BillingResponse {
    plans: BillingPlanInfo[]
    total: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAdminBilling() {
    const { data, error, isLoading, mutate } = useSWR<BillingResponse>("/api/admin/billing", fetcher)

    return {
        plans: data?.plans || [],
        loading: isLoading,
        error,
        refresh: mutate,
    }
}
