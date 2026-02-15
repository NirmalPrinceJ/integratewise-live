"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { AccountId } from "@/types/uuid"

export type WorldScope = "personal" | "work" | "accounts" | "admin"
export type AccountRole = "cs" | "finance" | "support" | "ops" | string
export type DepartmentId =
  | "ops"
  | "sales"
  | "marketing"
  | "cs"
  | "finance"
  | "support"
  | "product"
  | "admin"
  | "bi"
  | "it"
  | "legal"
  | "procurement"
  | "hr"
  | string

type WorldScopeState = {
  scope: WorldScope
  department: DepartmentId | null
  /** UUID of the account in focus */
  accountId: AccountId | null
  accountRole: AccountRole | null
}

type WorldScopeContextValue = WorldScopeState & {
  setScope: (scope: WorldScope) => void
  setDepartment: (department: DepartmentId | null) => void
  setAccountContext: (next: { accountId: AccountId | null; accountRole: AccountRole | null }) => void
}

const STORAGE_KEY = "iw:worldScope:v1"

const WorldScopeContext = createContext<WorldScopeContextValue | undefined>(undefined)

const safeParse = (value: string | null): WorldScopeState | null => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<WorldScopeState>
    if (!parsed.scope) return null
    return {
      scope: parsed.scope as WorldScope,
      department: (parsed.department ?? null) as DepartmentId | null,
      accountId: (parsed.accountId ?? null) as AccountId | null,
      accountRole: (parsed.accountRole ?? null) as AccountRole | null,
    }
  } catch {
    return null
  }
}

export function WorldScopeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorldScopeState>({
    scope: "work",
    department: "ops",
    accountId: null,
    accountRole: null,
  })

  // Load from URL param (highest priority) or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlScope = params.get("world") as WorldScope | null

    const fromStorage = safeParse(localStorage.getItem(STORAGE_KEY))

    if (urlScope && ["personal", "work", "accounts", "admin"].includes(urlScope)) {
      setState((prev) => ({ ...prev, scope: urlScope }))
      return
    }

    if (fromStorage) {
      setState(fromStorage)
    }
  }, [])

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setScope = useCallback((scope: WorldScope) => {
    setState((prev) => {
      // Keep department for work; clear account context for non-accounts
      const next: WorldScopeState = {
        ...prev,
        scope,
        accountId: scope === "accounts" ? prev.accountId : null,
        accountRole: scope === "accounts" ? prev.accountRole : null,
        department: scope === "work" ? prev.department ?? "ops" : null,
      }
      return next
    })
  }, [])

  const setDepartment = useCallback((department: DepartmentId | null) => {
    setState((prev) => ({ ...prev, department }))
  }, [])

  const setAccountContext = useCallback(
    (next: { accountId: AccountId | null; accountRole: AccountRole | null }) => {
      setState((prev) => ({ ...prev, accountId: next.accountId, accountRole: next.accountRole }))
    },
    []
  )

  const value = useMemo<WorldScopeContextValue>(
    () => ({
      ...state,
      setScope,
      setDepartment,
      setAccountContext,
    }),
    [state, setScope, setDepartment, setAccountContext]
  )

  return <WorldScopeContext.Provider value={value}>{children}</WorldScopeContext.Provider>
}

export function useWorldScope() {
  const ctx = useContext(WorldScopeContext)
  if (!ctx) throw new Error("useWorldScope must be used within WorldScopeProvider")
  return ctx
}
