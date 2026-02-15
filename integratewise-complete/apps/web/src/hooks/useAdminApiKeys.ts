"use client"

import useSWR from "swr"

export interface ApiKey {
    id: string
    name: string
    prefix: string
    lastUsed?: string
    status: "active" | "revoked" | "expired"
    createdAt: string
    value?: string // Only present upon creation
}

interface ApiKeysResponse {
    keys: ApiKey[]
    total: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAdminApiKeys() {
    const { data, error, isLoading, mutate } = useSWR<ApiKeysResponse>("/api/admin/api-keys", fetcher)

    const createKey = async (name: string) => {
        const res = await fetch("/api/admin/api-keys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        })
        const result = await res.json()
        mutate()
        return result.key as ApiKey
    }

    const revokeKey = async (id: string) => {
        // Mock revoke
        mutate(
            (prev) => ({
                ...prev!,
                keys: prev!.keys.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)),
            }),
            false
        )
        return { success: true }
    }

    return {
        keys: data?.keys || [],
        loading: isLoading,
        error,
        createKey,
        revokeKey,
        refresh: mutate,
    }
}
