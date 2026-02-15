"use client"

/**
 * Enhanced Top Bar — Breadcrumbs, Search, Notifications, RBAC badge
 * 
 * Ported from Figma Design top-bar.tsx.
 * Shows context-aware breadcrumbs, search trigger, notification center, RBAC role.
 */

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useCTX } from "@/contexts/ctx-context"
import { CTX_CONFIG } from "@/types/ctx"
import { NotificationCenter } from "@/components/notifications/notification-center"
import {
  Search,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

interface TopBarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  onOpenCommandPalette?: () => void
}

export function TopBar({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenCommandPalette,
}: TopBarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()
  const { activeCtx } = useCTX()
  const { theme, setTheme } = useTheme()
  const ctxInfo = CTX_CONFIG[activeCtx]

  // Derive breadcrumb from pathname
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "))

  return (
    <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <span>{ctxInfo.icon}</span>
            <span className="hidden md:inline">{ctxInfo.label}</span>
          </span>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className={i === segments.length - 1 ? "font-semibold" : "text-muted-foreground"}>
                {seg}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Global Search */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-muted-foreground text-xs hover:bg-accent transition-colors"
        >
          <Search className="w-3 h-3" />
          <span className="hidden sm:inline">Search Spine...</span>
          <kbd className="hidden sm:inline text-[10px] bg-card px-1 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 flex items-center justify-center bg-red-500 text-white text-[8px] rounded-full px-1 font-bold">
              3
            </span>
          </button>
          <NotificationCenter
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* RBAC Role Badge */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-[10px] text-muted-foreground font-bold">
          <Shield className="w-3 h-3" />
          <span className="uppercase tracking-tighter">Admin</span>
        </div>
      </div>
    </div>
  )
}
