"use client"

/**
 * Notification Center — Full notification panel with categories, filters, actions
 * Ported from Figma Design notifications/notification-center.tsx
 */

import { useState, useEffect, useRef } from "react"
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  Zap,
  GitBranch,
  Shield,
  DollarSign,
  Megaphone,
  Globe,
  Clock,
  ChevronRight,
  Volume2,
  VolumeX,
  Settings,
} from "lucide-react"
import { useRouter } from "next/navigation"

export interface Notification {
  id: string
  type: "info" | "warning" | "critical" | "success"
  category: "system" | "workflow" | "rbac" | "integration" | "sales" | "marketing" | "website" | "approval"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionLabel?: string
  actionHref?: string
  actor?: string
  actorInitials?: string
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "critical",
    category: "workflow",
    title: "Workflow Error: Marketing Attribution Sync",
    message: "Failed after 3 retries — Salesforce API rate limit exceeded.",
    timestamp: "5 min ago",
    read: false,
    actionLabel: "View Workflow",
    actionHref: "/workflow-builder",
    actor: "System",
    actorInitials: "SY",
  },
  {
    id: "n2",
    type: "warning",
    category: "approval",
    title: "Approval Pending: Role Change Request",
    message: "Priya Sharma requested Admin role for Vikram Rao — requires your approval.",
    timestamp: "12 min ago",
    read: false,
    actionLabel: "Review",
    actionHref: "/admin/roles",
    actor: "Priya Sharma",
    actorInitials: "PS",
  },
  {
    id: "n3",
    type: "success",
    category: "integration",
    title: "Salesforce → HubSpot Sync Complete",
    message: "156 records synced successfully. No conflicts detected.",
    timestamp: "28 min ago",
    read: false,
    actionLabel: "View Details",
    actionHref: "/integrations",
    actor: "System",
    actorInitials: "SY",
  },
  {
    id: "n4",
    type: "warning",
    category: "rbac",
    title: "MFA Not Enabled: Rajesh Menon",
    message: "User has not enabled MFA after 7 days. Security policy requires enforcement.",
    timestamp: "1h ago",
    read: false,
    actionLabel: "Manage User",
    actionHref: "/admin/users",
    actor: "System",
    actorInitials: "SY",
  },
  {
    id: "n5",
    type: "info",
    category: "sales",
    title: "Deal Stage Changed: Acme Corp Enterprise",
    message: "Moved from 'Proposal' to 'Negotiation' — $240K deal value.",
    timestamp: "2h ago",
    read: false,
    actionLabel: "View Deal",
    actionHref: "/sales/deals",
    actor: "Vikram Rao",
    actorInitials: "VR",
  },
  {
    id: "n6",
    type: "success",
    category: "workflow",
    title: "Churn Prediction Pipeline Completed",
    message: "Daily churn scoring complete — 3 accounts flagged at high risk.",
    timestamp: "3h ago",
    read: true,
    actionLabel: "View Pipeline",
    actionHref: "/sales/pipeline",
  },
  {
    id: "n7",
    type: "info",
    category: "marketing",
    title: "Campaign Published: Q1 APAC Webinar Series",
    message: "Email campaign sent to 2,450 contacts. Open tracking enabled.",
    timestamp: "4h ago",
    read: true,
    actionLabel: "View Campaign",
    actionHref: "/marketing/campaigns",
  },
  {
    id: "n8",
    type: "warning",
    category: "system",
    title: "Renewal Risk: TechFlow Solutions",
    message: "Health score dropped to 52 — renewal in 28 days.",
    timestamp: "5h ago",
    read: true,
    actionLabel: "View Account",
    actionHref: "/accounts",
  },
]

const typeConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  critical: { color: "#F44336", bg: "rgba(244,67,54,0.1)", icon: AlertTriangle },
  warning: { color: "#FF9800", bg: "rgba(255,152,0,0.1)", icon: AlertTriangle },
  success: { color: "#00C853", bg: "rgba(0,200,83,0.1)", icon: Zap },
  info: { color: "#0066FF", bg: "rgba(0,102,255,0.1)", icon: Info },
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  system: Settings,
  workflow: GitBranch,
  rbac: Shield,
  integration: Zap,
  sales: DollarSign,
  marketing: Megaphone,
  website: Globe,
  approval: Shield,
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.type === "critical" && !n.read).length

  const filtered = notifications.filter((n) => {
    if (filter === "unread" && n.read) return false
    if (filter === "critical" && n.type !== "critical") return false
    if (categoryFilter !== "all" && n.category !== categoryFilter) return false
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleAction = (n: Notification) => {
    markAsRead(n.id)
    if (n.actionHref) {
      router.push(n.actionHref)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" />
      <div
        ref={panelRef}
        className="absolute top-full right-0 mt-1 z-50 w-[420px] max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideDown 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                {unreadCount}
              </span>
            )}
            {criticalCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-medium">
                {criticalCount} critical
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={markAllRead}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-border bg-secondary/20 space-y-2">
          <div className="flex gap-1">
            {(["all", "unread", "critical"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] capitalize transition-all ${
                  filter === f
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1 text-[9px] opacity-70">({unreadCount})</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {["all", "approval", "workflow", "rbac", "integration", "sales", "marketing", "system"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-[10px] capitalize whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-card text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-30" />
              <span className="text-sm">No notifications</span>
              <span className="text-[11px] opacity-70">You&apos;re all caught up</span>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((n) => {
                const cfg = typeConfig[n.type]
                const TypeIcon = cfg.icon

                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-secondary/30 transition-all cursor-pointer relative group ${
                      !n.read ? "bg-primary/[0.02]" : ""
                    }`}
                    onClick={() => markAsRead(n.id)}
                  >
                    {/* Unread indicator */}
                    {!n.read && (
                      <div
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                    )}

                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <TypeIcon className="w-4 h-4" style={{ color: cfg.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className={`text-[12px] ${n.read ? "font-normal" : "font-semibold"}`}>
                            {n.title}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissNotification(n.id)
                            }}
                            className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {n.timestamp}
                          </span>
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded capitalize font-medium"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {n.category}
                          </span>
                          {n.actor && (
                            <span className="text-[10px] text-muted-foreground">by {n.actor}</span>
                          )}
                        </div>
                        {n.actionLabel && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAction(n)
                            }}
                            className="mt-2 flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                          >
                            {n.actionLabel}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-secondary/20 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {notifications.length} total · {unreadCount} unread
          </span>
          <button className="text-[11px] text-primary hover:underline font-medium">
            Notification Settings
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
