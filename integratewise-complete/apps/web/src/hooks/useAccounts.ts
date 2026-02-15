"use client"

/**
 * useAccounts Hook
 * 
 * Fetches account entities from the Spine Service (L3)
 * Integrates with: services/spine-v2
 */

import { useEntities } from "./useEntities"

export interface AccountData {
    id: string
    name: string
    logo?: string
    domain: string
    arr: number
    arrGrowth: number
    healthScore: number
    tier: "enterprise" | "mid-market" | "smb"
    region: string
    industry: string
    renewalDate: string
    renewalDays: number
    owner: { name: string; initials: string; avatar?: string }
    lastTouchpoint: string
    lastTouchDays: number
    contacts: number
    openTickets: number
    csat: number
    nps: number
    productAdoption: number
    engagement: number
    valueRealization: number
    status: "active" | "onboarding" | "churning" | "churned"
    tags: string[]
    sources: string[]
}

interface UseAccountsOptions {
    limit?: number
    status?: string
    tier?: string
    search?: string
    category?: "personal" | "csm" | "business" | "team"
}

export function useAccounts(options: UseAccountsOptions = {}) {
    const { entities, isLoading, error, refresh } = useEntities<AccountData>("account", options)

    return {
        accounts: entities,
        isLoading,
        error,
        refresh,
    }
}
