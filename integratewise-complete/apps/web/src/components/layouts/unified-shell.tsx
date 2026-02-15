"use client"

/**
 * Unified Shell — CTX-aware sidebar + TopBar + Intelligence overlay
 * 
 * Replaces the fragmented shell system (3 competing shells) with a single
 * unified shell that matches the Figma Design architecture:
 * - CTX switcher in sidebar
 * - Breadcrumbs + RBAC badge + Dark mode toggle in top bar
 * - Notification center
 * - Intelligence overlay (⌘J)
 * - Command palette (⌘K)
 */

import { useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { CTXSidebar } from "@/components/layouts/ctx-sidebar"
import { TopBar } from "@/components/layouts/top-bar"
import { IntelligenceOverlay } from "@/components/intelligence/intelligence-overlay"
import { IntelligenceDrawer } from "@/components/intelligence/intelligence-drawer"
import { useCTX } from "@/contexts/ctx-context"

interface UnifiedShellProps {
  children: ReactNode
}

export function UnifiedShell({ children }: UnifiedShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [intelligenceOpen, setIntelligenceOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { activeCTX } = useCTX()
  const pathname = usePathname()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setIntelligenceOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans bg-background text-foreground">
      <CTXSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenIntelligence={() => setIntelligenceOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Intelligence Layer (L2) */}
      <IntelligenceOverlay
        isOpen={intelligenceOpen && !drawerOpen}
        onClose={() => setIntelligenceOpen(false)}
        activeCtx={activeCTX}
      />
      <IntelligenceDrawer
        isOpen={drawerOpen}
        activeModule={pathname}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
