"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { EntitlementTier, Role } from "@/config/os-shell-registry"

/**
 * Tenant Context
 * 
 * Note: tenantId is a UUID string. For type safety in new code,
 * cast to TenantId from @integratewise/types
 */
export type TenantContextValue = {
  /** Tenant UUID (TenantId) */
  tenantId: string
  tenantName: string
  plan: EntitlementTier
  role: Role
  featureFlags: string[]
  limits: Record<string, number | "unlimited">
  usage: Record<string, number>
  ready: boolean
  error?: string
  setPlan: (plan: EntitlementTier) => void
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined)

const STORAGE_KEY = "iw:tenantContext:v1"

type TenantContextResponse = {
  tenantId: string
  tenantName: string
  plan: EntitlementTier
  role: Role
  featureFlags: string[]
  limits?: Record<string, number | "unlimited">
  usage?: Record<string, number>
}

function safeParse(value: string | null): Partial<TenantContextResponse> | null {
  if (!value) return null
  try {
    return JSON.parse(value) as Partial<TenantContextResponse>
  } catch {
    return null
  }
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const [tenantId, setTenantId] = useState("ten_demo")
  const [tenantName, setTenantName] = useState("Acme Corp")
  const [plan, setPlan] = useState<EntitlementTier>("team")
  const [role, setRole] = useState<Role>("admin")
  const [featureFlags, setFeatureFlags] = useState<string[]>(["all"])
  const [limits, setLimits] = useState<Record<string, number | "unlimited">>({})
  const [usage, setUsage] = useState<Record<string, number>>({})

  // Load from localStorage first for instant gating
  useEffect(() => {
    const fromStorage = safeParse(localStorage.getItem(STORAGE_KEY))
    if (fromStorage?.plan) setPlan(fromStorage.plan as EntitlementTier)
    if (fromStorage?.role) setRole(fromStorage.role as Role)
    if (Array.isArray(fromStorage?.featureFlags)) setFeatureFlags(fromStorage.featureFlags as string[])
    if (fromStorage?.tenantId) setTenantId(fromStorage.tenantId)
    if (fromStorage?.tenantName) setTenantName(fromStorage.tenantName)
  }, [])

  // Fetch canonical tenant context
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setError(undefined)
        const res = await fetch("/api/tenant/context", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load tenant context (${res.status})`)
        const data = (await res.json()) as TenantContextResponse
        if (cancelled) return
        setTenantId(data.tenantId)
        setTenantName(data.tenantName)
        setPlan(data.plan)
        setRole(data.role)
        setFeatureFlags(data.featureFlags)
        setLimits(data.limits ?? {})
        setUsage(data.usage ?? {})
        setReady(true)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Failed to load tenant context")
        setReady(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Persist
  useEffect(() => {
    const payload = { tenantId, tenantName, plan, role, featureFlags }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [tenantId, tenantName, plan, role, featureFlags])

  const value = useMemo<TenantContextValue>(
    () => ({
      tenantId,
      tenantName,
      plan,
      role,
      featureFlags,
      limits,
      usage,
      ready,
      error,
      setPlan,
    }),
    [tenantId, tenantName, plan, role, featureFlags, limits, usage, ready, error]
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error("useTenant must be used within TenantProvider")
  return ctx
}
