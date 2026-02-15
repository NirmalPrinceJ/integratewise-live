/**
 * Spine Projection Utilities — "Normalize once. Render anywhere."
 * 
 * Shared types and helpers for projecting Spine data into domain-specific views.
 * All domains import from here for consistent formatting and projection.
 */

// ─── Context-Aware Projection ─────────────────────────────────────────────────

export interface ProjectionContext {
  domain: string
  userId?: string
  focusEntity?: { type: string; id: string }
  timeRange?: { start: string; end: string }
  filters?: Record<string, string>
}

export interface ProjectedMetric {
  key: string
  label: string
  value: number | string
  formatted: string
  trend?: number
  trendLabel?: string
  color: string
  icon?: string
  provenance?: string[]
}

export interface ProjectedAlert {
  id: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  title: string
  description: string
  entityType: string
  entityId: string
  entityName: string
  action: string
  confidence: number
  sources: string[]
  createdAt: string
}

// ─── Shared Formatting ────────────────────────────────────────────────────────

export function formatCurrency(v: number, compact = false): string {
  if (compact) {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
    if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
  }
  return `$${v.toLocaleString()}`
}

export function formatPercent(v: number): string {
  return `${v.toFixed(1)}%`
}

export function formatDaysAgo(days: number): string {
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function trendColor(v: number): string {
  if (v > 0) return "var(--iw-success)"
  if (v < 0) return "var(--iw-danger)"
  return "var(--muted-foreground)"
}

export function healthColor(score: number): string {
  if (score >= 80) return "var(--iw-success)"
  if (score >= 60) return "var(--iw-warning)"
  return "var(--iw-danger)"
}

export function priorityColor(p: string): string {
  const map: Record<string, string> = {
    critical: "var(--iw-danger)",
    high: "var(--iw-danger)",
    medium: "var(--iw-warning)",
    low: "var(--iw-blue)",
    info: "var(--muted-foreground)",
  }
  return map[p] || "var(--muted-foreground)"
}

// ─── Stage / Status Helpers ──────────────────────────────────────────────────

export const dealStageConfig: Record<string, { label: string; color: string; order: number }> = {
  prospect: { label: "Prospect", color: "#0066FF", order: 0 },
  qualify: { label: "Qualify", color: "#7C4DFF", order: 1 },
  proposal: { label: "Proposal", color: "#FF9800", order: 2 },
  negotiate: { label: "Negotiate", color: "#FF4081", order: 3 },
  "closed-won": { label: "Closed Won", color: "#00C853", order: 4 },
  "closed-lost": { label: "Closed Lost", color: "#F44336", order: 5 },
}

export const activityTypeConfig: Record<string, { label: string; color: string; icon: string }> = {
  email: { label: "Email", color: "var(--iw-blue)", icon: "📧" },
  call: { label: "Call", color: "var(--iw-success)", icon: "📞" },
  meeting: { label: "Meeting", color: "var(--iw-purple)", icon: "📅" },
  note: { label: "Note", color: "var(--iw-warning)", icon: "📝" },
  task: { label: "Task", color: "var(--muted-foreground)", icon: "✅" },
  event: { label: "Event", color: "var(--iw-pink)", icon: "🎯" },
  message: { label: "Message", color: "var(--iw-blue)", icon: "💬" },
}

// ─── Revenue Calculations ────────────────────────────────────────────────────

export function calculateWeightedPipeline(deals: { stage: string; amount: number; probability: number }[]): number {
  return deals
    .filter((d) => !["closed-won", "closed-lost"].includes(d.stage))
    .reduce((sum, d) => sum + (d.amount * d.probability) / 100, 0)
}

export function calculateWinRate(deals: { stage: string }[]): number {
  const closed = deals.filter((d) => ["closed-won", "closed-lost"].includes(d.stage))
  if (closed.length === 0) return 0
  const won = closed.filter((d) => d.stage === "closed-won").length
  return Math.round((won / closed.length) * 100)
}

export function calculateAvgDealSize(deals: { stage: string; amount: number }[]): number {
  const won = deals.filter((d) => d.stage === "closed-won")
  if (won.length === 0) return 0
  return Math.round(won.reduce((s, d) => s + d.amount, 0) / won.length)
}
