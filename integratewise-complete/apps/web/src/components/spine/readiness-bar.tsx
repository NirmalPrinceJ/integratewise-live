"use client"

/**
 * Spine Readiness Bar — Shows SSOT data readiness for a department.
 * Ported from Figma Design spine/readiness-bar.tsx → shadcn/ui tokens + inline data.
 * States: OFF → ADDING → SEEDED → LIVE
 */

import { useState } from "react"
import { Database, ChevronDown, ChevronUp } from "lucide-react"

/* ─── Types ─── */
type ReadinessState = "off" | "adding" | "seeded" | "live"

interface ReadinessBucket {
  capability: string
  label: string
  description: string
  state: ReadinessState
  coverage: number
  completeness: number
  freshness: number
  confidence: number
  score: number
}

/* ─── State Config ─── */
const stateConfig: Record<ReadinessState, { color: string; label: string }> = {
  off: { color: "hsl(var(--muted-foreground))", label: "No Data" },
  adding: { color: "#f59e0b", label: "Adding" },
  seeded: { color: "#3b82f6", label: "Seeded" },
  live: { color: "#22c55e", label: "Live" },
}

/* ─── Mock Data ─── */
const departmentReadiness: Record<string, { overallState: ReadinessState; overallScore: number; buckets: ReadinessBucket[] }> = {
  cs: {
    overallState: "seeded",
    overallScore: 72,
    buckets: [
      { capability: "accounts", label: "Accounts", description: "Customer account data from CRM", state: "live", coverage: 0.95, completeness: 0.88, freshness: 0.92, confidence: 0.85, score: 90 },
      { capability: "contacts", label: "Contacts", description: "Stakeholder & team contacts", state: "seeded", coverage: 0.72, completeness: 0.65, freshness: 0.78, confidence: 0.7, score: 71 },
      { capability: "engagement", label: "Engagement", description: "Emails, calls, meetings synced", state: "adding", coverage: 0.45, completeness: 0.38, freshness: 0.55, confidence: 0.5, score: 47 },
    ],
  },
  sales: {
    overallState: "seeded",
    overallScore: 65,
    buckets: [
      { capability: "pipeline", label: "Pipeline", description: "CRM deals & opportunities", state: "live", coverage: 0.9, completeness: 0.82, freshness: 0.95, confidence: 0.88, score: 89 },
      { capability: "contacts", label: "Contacts", description: "Leads & key stakeholders", state: "seeded", coverage: 0.68, completeness: 0.6, freshness: 0.72, confidence: 0.65, score: 66 },
      { capability: "activity", label: "Activity", description: "Calls, emails, meeting notes", state: "adding", coverage: 0.35, completeness: 0.3, freshness: 0.42, confidence: 0.4, score: 37 },
    ],
  },
  marketing: {
    overallState: "adding",
    overallScore: 42,
    buckets: [
      { capability: "campaigns", label: "Campaigns", description: "Marketing campaign data", state: "seeded", coverage: 0.55, completeness: 0.48, freshness: 0.65, confidence: 0.55, score: 56 },
      { capability: "leads", label: "Leads", description: "Inbound form submissions & MQLs", state: "adding", coverage: 0.3, completeness: 0.25, freshness: 0.4, confidence: 0.35, score: 33 },
      { capability: "analytics", label: "Analytics", description: "Website & campaign analytics", state: "off", coverage: 0, completeness: 0, freshness: 0, confidence: 0, score: 0 },
    ],
  },
}

/* ─── Component ─── */
export function ReadinessBar({ department }: { department: string }) {
  const [expanded, setExpanded] = useState(false)
  const dept = departmentReadiness[department]
  if (!dept) return null

  const config = stateConfig[dept.overallState]

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
      >
        <Database className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold">SSOT</span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
          style={{ backgroundColor: `${config.color}15`, color: config.color }}
        >
          {config.label}
        </span>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-1">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${dept.overallScore}%`, backgroundColor: config.color }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">{dept.overallScore}%</span>
        </div>

        {/* Bucket dots */}
        <div className="hidden sm:flex items-center gap-1">
          {dept.buckets.map((b) => (
            <div
              key={b.capability}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: stateConfig[b.state].color }}
              title={`${b.label}: ${stateConfig[b.state].label}`}
            />
          ))}
        </div>

        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dept.buckets.map((bucket) => (
              <BucketCard key={bucket.capability} bucket={bucket} />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
            <Legend color={stateConfig.off.color} label="No data" />
            <Legend color={stateConfig.adding.color} label="Connected, learning" />
            <Legend color={stateConfig.seeded.color} label="Min. viable SSOT" />
            <Legend color={stateConfig.live.color} label="High quality" />
          </div>
        </div>
      )}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function BucketCard({ bucket }: { bucket: ReadinessBucket }) {
  const config = stateConfig[bucket.state]
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{bucket.label}</span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
          style={{ backgroundColor: `${config.color}15`, color: config.color }}
        >
          {config.label}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight">{bucket.description}</p>
      <div className="space-y-1">
        <MetricRow label="Coverage" value={bucket.coverage} color={config.color} />
        <MetricRow label="Completeness" value={bucket.completeness} color={config.color} />
        <MetricRow label="Freshness" value={bucket.freshness} color={config.color} />
        <MetricRow label="Confidence" value={bucket.confidence} color={config.color} />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground">Score</span>
        <span className="text-xs font-mono font-semibold" style={{ color: config.color }}>{bucket.score}/100</span>
      </div>
    </div>
  )
}

function MetricRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-muted-foreground w-20">{label}</span>
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(value * 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-[9px] text-muted-foreground w-6 text-right font-mono">{Math.round(value * 100)}%</span>
    </div>
  )
}

/**
 * ProvenanceBadge — Displays data source lineage & confidence.
 */
export function ProvenanceBadge({ provenance }: { provenance: { sourceToolName: string; confidence: number }[] }) {
  if (!provenance || provenance.length === 0) return null
  const avgConfidence = provenance.reduce((s, p) => s + p.confidence, 0) / provenance.length
  const sourceNames = [...new Set(provenance.map((p) => p.sourceToolName))]

  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
      title={`Sources: ${sourceNames.join(", ")} | Confidence: ${Math.round(avgConfidence * 100)}%`}
    >
      <Database className="w-2.5 h-2.5" />
      {sourceNames.length > 1 ? `${sourceNames.length} sources` : sourceNames[0]}
      <span className="ml-0.5 font-mono">{Math.round(avgConfidence * 100)}%</span>
    </span>
  )
}
