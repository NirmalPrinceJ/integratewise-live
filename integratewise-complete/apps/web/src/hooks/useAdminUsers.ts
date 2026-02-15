"use client"

import useSWR from "swr"

export interface AdminUser {
    id: string
    name: string
    email: string
    role: string
    status: "active" | "invited" | "suspended"
}

export interface UsersResponse {
    users: AdminUser[]
    total: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAdminUsers() {
    const { data, error, isLoading, mutate } = useSWR<UsersResponse>("/api/admin/users", fetcher)

    const inviteUser = async (user: Partial<AdminUser>) => {
        const res = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
        const result = await res.json()
        mutate()
        return result
    }

    return {
        users: data?.users || [],
        total: data?.total || 0,
        loading: isLoading,
        error,
        inviteUser,
        refresh: mutate,
    }
}
