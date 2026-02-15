"use client"

/**
 * Spine Projection Hooks — Data fetching for domain projections
 * 
 * These hooks provide the standard way to fetch Spine data for L1 views.
 * They wrap the Spine client with SWR caching and CTX-awareness.
 */

import useSWR from "swr"

// ─── Domain Table Hook ────────────────────────────────────────────────────────

interface DomainTableResult<T = Record<string, unknown>> {
  data: T[]
  loading: boolean
  error: Error | null
  mutate: () => void
}

async function fetchDomainTable(domain: string, table: string) {
  const res = await fetch(`/api/spine/domain/${domain}/${table}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${domain}/${table}`)
  }
  return res.json()
}

/**
 * Fetch any domain table with loading/error state.
 * Maps to Figma's useDomainTable() pattern.
 */
export function useDomainTable<T = Record<string, unknown>>(
  domain: string,
  table: string | null
): DomainTableResult<T> {
  const { data, error, mutate } = useSWR(
    table ? `/api/spine/domain/${domain}/${table}` : null,
    () => (table ? fetchDomainTable(domain, table) : null),
    { revalidateOnFocus: false }
  )

  return {
    data: data?.data || data?.entities || data || [],
    loading: !error && !data && !!table,
    error: error || null,
    mutate,
  }
}

// ─── Spine Projection Hook ───────────────────────────────────────────────────

interface ProjectionResult<T = Record<string, unknown>> {
  data: T | null
  loading: boolean
  error: Error | null
}

async function fetchProjection(department: string) {
  const res = await fetch(`/api/spine/projection/${department}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch projection for ${department}`)
  }
  return res.json()
}

/**
 * Fetch a department-level projection from Spine.
 * Maps to Figma's useSpineProjection() pattern.
 */
export function useSpineProjection<T = Record<string, unknown>>(department: string): ProjectionResult<T> {
  const { data, error } = useSWR(
    `/api/spine/projection/${department}`,
    () => fetchProjection(department),
    { revalidateOnFocus: false }
  )

  return {
    data: data || null,
    loading: !error && !data,
    error: error || null,
  }
}

// ─── Spine Readiness Hook ────────────────────────────────────────────────────

export interface ReadinessState {
  state: "off" | "adding" | "seeded" | "live"
  score: number
  coverage: number
  completeness: number
  freshness: number
  confidence: number
}

export interface DepartmentReadiness {
  department: string
  label: string
  overallState: "off" | "adding" | "seeded" | "live"
  overallScore: number
  buckets: Array<{
    capability: string
    state: string
    label: string
    description: string
    score: number
  }>
}

async function fetchReadiness() {
  const res = await fetch("/api/spine/readiness")
  if (!res.ok) {
    throw new Error("Failed to fetch readiness")
  }
  return res.json()
}

/**
 * Fetch platform readiness scores per department/bucket.
 * Maps to Figma's useSpineReadiness() pattern.
 */
export function useSpineReadiness() {
  const { data, error } = useSWR(
    "/api/spine/readiness",
    fetchReadiness,
    { revalidateOnFocus: false, revalidateOnMount: true }
  )

  return {
    data: data || null,
    loading: !error && !data,
    error: error || null,
  }
}

// ─── Spine Entities Hook ─────────────────────────────────────────────────────

interface EntitiesResult<T = Record<string, unknown>> {
  data: T[]
  count: number
  loading: boolean
  error: Error | null
  mutate: () => void
}

async function fetchEntities(type: string) {
  const res = await fetch(`/api/entities/${type}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch entities of type ${type}`)
  }
  return res.json()
}

/**
 * Fetch entities of a specific type from Spine.
 * Maps to Figma's useSpineEntities() pattern.
 */
export function useSpineEntities<T = Record<string, unknown>>(type: string): EntitiesResult<T> {
  const { data, error, mutate } = useSWR(
    `/api/entities/${type}`,
    () => fetchEntities(type),
    { revalidateOnFocus: false }
  )

  return {
    data: data?.entities || data?.data || data || [],
    count: data?.count || 0,
    loading: !error && !data,
    error: error || null,
    mutate,
  }
}
