"use client"

/**
 * CTX Sidebar — Domain-aware navigation with CTX switcher
 * 
 * Ported from Figma Design sidebar.tsx.
 * Adapts navigation modules based on active CTX (domain context).
 */

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCTX } from "@/contexts/ctx-context"
import {
  type CTXEnum,
  type L1Module,
  CTX_CONFIG,
  MODULE_ROUTES,
} from "@/types/ctx"
import {
  Home,
  Briefcase,
  Building2,
  Users,
  MessageSquare,
  FileText,
  CheckSquare,
  Calendar,
  StickyNote,
  Brain,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ChevronsUpDown,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  type LucideIcon,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MODULE_ICONS: Record<L1Module, LucideIcon> = {
  Home,
  Projects: Briefcase,
  Accounts: Building2,
  Contacts: Users,
  Meetings: MessageSquare,
  Docs: FileText,
  Tasks: CheckSquare,
  Calendar: Calendar,
  Notes: StickyNote,
  "Knowledge Space": Brain,
  Team: Users,
  Pipeline: DollarSign,
  Risks: AlertTriangle,
  Expansion: TrendingUp,
  Analytics: BarChart3,
}

interface CTXSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenCommandPalette?: () => void
  onOpenIntelligence?: () => void
}

export function CTXSidebar({
  collapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  onOpenIntelligence,
}: CTXSidebarProps) {
  const { activeCtx, switchCtx, availableModules } = useCTX()
  const [ctxDropdownOpen, setCtxDropdownOpen] = useState(false)
  const pathname = usePathname()

  const ctxInfo = CTX_CONFIG[activeCtx]

  return (
    <div
      className={cn(
        "h-full flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* CTX Switcher */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <button
            onClick={() => !collapsed && setCtxDropdownOpen(!ctxDropdownOpen)}
            className="w-full flex items-center gap-2 hover:bg-secondary/50 rounded-md p-1 -m-1 transition-colors"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm",
                ctxInfo.color
              )}
            >
              {ctxInfo.icon}
            </div>
            {!collapsed && (
              <>
                <div className="overflow-hidden flex-1 text-left">
                  <div className="text-sm font-semibold truncate">{ctxInfo.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">
                    Unified Context
                  </div>
                </div>
                <ChevronsUpDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </>
            )}
          </button>

          {ctxDropdownOpen && !collapsed && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCtxDropdownOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden py-1">
                {(Object.keys(CTX_CONFIG) as CTXEnum[]).map((key) => {
                  const cfg = CTX_CONFIG[key]
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        switchCtx(key)
                        setCtxDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary transition-colors",
                        key === activeCtx && "bg-primary/5"
                      )}
                    >
                      <span className="text-sm">{cfg.icon}</span>
                      <span className="text-xs font-medium">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Shortcut */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-muted-foreground text-xs hover:bg-accent transition-colors"
          >
            <Search className="w-3 h-3" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-[10px] bg-card px-1 py-0.5 rounded border border-border">⌘K</kbd>
          </button>
        </div>
      )}

      {/* Navigation Modules */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 space-y-1">
        {!collapsed && (
          <div className="text-[10px] text-muted-foreground mb-2 px-2 uppercase tracking-widest font-bold">
            L1 Modules
          </div>
        )}
        <nav className="space-y-0.5">
          {availableModules.map((mod) => {
            const Icon = MODULE_ICONS[mod] || Home
            const href = MODULE_ROUTES[mod] || "/today"
            const isActive = pathname === href || pathname.startsWith(href + "/")

            const linkContent = (
              <Link
                key={mod}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md font-bold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", !isActive && "text-muted-foreground")} />
                {!collapsed && <span className="truncate">{mod}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={mod} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{mod}</TooltipContent>
                </Tooltip>
              )
            }

            return linkContent
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-2">
        {/* Intelligence Trigger */}
        <button
          onClick={onOpenIntelligence}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary font-bold bg-primary/5 hover:bg-primary/10 transition-all",
            collapsed && "justify-center px-0"
          )}
        >
          <Zap className="w-4 h-4" />
          {!collapsed && <span>Intelligence (⌘J)</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-all",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  )
}
