"use client"

/**
 * CTX Context Provider — Domain-aware navigation state
 * 
 * Manages the active CTX (domain context) and L1 module selection.
 * All shell components (sidebar, topbar) consume this context.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { type CTXEnum, type L1Module, CTX_MODULES } from "@/types/ctx"

interface CTXContextValue {
  activeCtx: CTXEnum
  setActiveCtx: (ctx: CTXEnum) => void
  activeModule: L1Module
  setActiveModule: (module: L1Module) => void
  availableModules: L1Module[]
  switchCtx: (ctx: CTXEnum) => void
}

const CTXContext = createContext<CTXContextValue>({
  activeCtx: "CTX_BIZOPS",
  setActiveCtx: () => {},
  activeModule: "Home",
  setActiveModule: () => {},
  availableModules: CTX_MODULES.CTX_BIZOPS,
  switchCtx: () => {},
})

export function useCTX() {
  return useContext(CTXContext)
}

export function CTXProvider({ children, defaultCtx = "CTX_BIZOPS" }: { children: ReactNode; defaultCtx?: CTXEnum }) {
  const [activeCtx, setActiveCtx] = useState<CTXEnum>(defaultCtx)
  const [activeModule, setActiveModule] = useState<L1Module>("Home")

  const switchCtx = useCallback((ctx: CTXEnum) => {
    setActiveCtx(ctx)
    setActiveModule("Home") // Reset to home when context changes
  }, [])

  const availableModules = CTX_MODULES[activeCtx] || CTX_MODULES.CTX_BIZOPS

  return (
    <CTXContext.Provider
      value={{
        activeCtx,
        setActiveCtx,
        activeModule,
        setActiveModule,
        availableModules,
        switchCtx,
      }}
    >
      {children}
    </CTXContext.Provider>
  )
}
