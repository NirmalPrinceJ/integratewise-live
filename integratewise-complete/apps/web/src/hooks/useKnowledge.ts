"use client"

/**
 * useKnowledge Hook
 * 
 * Fetches knowledge items from the Knowledge Service (L3)
 * Integrates with: services/knowledge
 */

import useSWR from "swr"
import { useTenant } from "@/contexts/tenant-context"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export interface KnowledgeItem {
  id: string
  title: string
  type: "article" | "insight" | "faq" | "framework" | "research"
  content: string
  source: string
  topics: string[]
  lastUpdated: string
  views: number
  helpful: number
  entityId?: string
  entityType?: string
}

interface UseKnowledgeOptions {
  limit?: number
  type?: string
  search?: string
}

export function useKnowledge(options: UseKnowledgeOptions = {}) {
  const tenant = useTenant()
  const { limit = 20, type, search } = options

  const queryParams = new URLSearchParams()
  queryParams.set("limit", String(limit))
  if (type) queryParams.set("type", type)
  if (search) queryParams.set("search", search)

  const { data, error, isLoading, mutate } = useSWR<{
    items: KnowledgeItem[]
    total: number
  }>(
    tenant?.id ? `/api/knowledge?${queryParams.toString()}` : null,
    fetcher,
    { refreshInterval: 60000 }
  )

  return {
    items: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useKnowledgeStats() {
  const tenant = useTenant()

  const { data, isLoading } = useSWR<{
    total: number
    insights: number
    topics: number
    totalViews: number
  }>(tenant?.id ? `/api/knowledge/stats` : null, fetcher)

  return {
    stats: data || { total: 0, insights: 0, topics: 0, totalViews: 0 },
    isLoading,
  }
}
