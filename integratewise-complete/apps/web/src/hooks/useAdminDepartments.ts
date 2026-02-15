"use client"

import useSWR from "swr"

export interface Department {
    id: string
    name: string
    head: string
    memberCount: number
    budget: string
    status: "active" | "inactive"
    createdAt: string
}

interface DepartmentsResponse {
    departments: Department[]
    total: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useAdminDepartments() {
    const { data, error, isLoading, mutate } = useSWR<DepartmentsResponse>("/api/admin/departments", fetcher)

    return {
        departments: data?.departments || [],
        loading: isLoading,
        error,
        refresh: mutate,
    }
}
