"use client"

import useSWR from "swr"

export interface AdminRole {
    id: string
    name: string
    permissions: string[]
}

export interface RolesResponse {
    roles: AdminRole[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAdminRoles() {
    const { data, error, isLoading, mutate } = useSWR<RolesResponse>("/api/admin/roles", fetcher)

    const updateRole = async (role: Partial<AdminRole>) => {
        const res = await fetch("/api/admin/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operation: "update", after: role }),
        })
        const result = await res.json()
        mutate()
        return result
    }

    const createRole = async (role: Partial<AdminRole>) => {
        const res = await fetch("/api/admin/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(role),
        })
        const result = await res.json()
        mutate()
        return result
    }

    return {
        roles: data?.roles || [],
        loading: isLoading,
        error,
        updateRole,
        createRole,
        refresh: mutate,
    }
}
