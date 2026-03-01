"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import type { ComponentType } from "react"
import {
  Brain,
  ClipboardList,
  FileCheck,
  FileText,
  ExternalLink,
  ShieldCheck,
  Zap,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Filter,
  Clock,
  Link2,
  GitBranch,
  GitMerge,
  Eye,
  Check,
  AlertTriangle,
  Info,
  Sparkles,
  BarChart3,
  Network,
  Fingerprint,
  History,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Share2,
  Download,
  Copy,
  Lock,
  Unlock,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Database,
  MessageSquare,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Lightbulb,
} from "lucide-react"
import type { EvidenceId, InsightId, DecisionId, CorrelationId } from "@/types/uuid"
import { useWorldScope } from "@/contexts/world-scope"
import { useTenant } from "@/contexts/tenant-context"
import { featureAccess, planLabel } from "@/lib/entitlements"
import { Link } from "react-router"

// Evidence item with rich metadata
interface EvidenceItem {
  /** UUID of the evidence item */
  id?: EvidenceId
  title: string
  source: string
  sourceSystem?: string
  sourceIcon?: string
  date: string
  timestamp?: number
  preview?: string
  link?: string
  confidence?: number
  verified?: boolean
  contributors?: string[]
  tags?: string[]
  /** Array of correlation UUIDs */
  correlations?: CorrelationId[]
  dataLineage?: {
    origin: string
    transformations: string[]
    lastUpdated: string
  }
}

// Insight with reasoning chain
interface InsightItem {
  /** UUID of the insight */
  id: InsightId
  type: "prediction" | "pattern" | "anomaly" | "recommendation" | "risk"
  title: string
  description: string
  confidence: number
  reasoning: ReasoningStep[]
  /** Array of evidence UUIDs */
  evidence: EvidenceId[]
  impact: "high" | "medium" | "low"
  timeframe?: string
  suggestedActions?: string[]
}

// Reasoning step for transparency
interface ReasoningStep {
  step: number
  description: string
  dataUsed: string[]
  weight: number
  output: string
}

// Decision record for audit
interface DecisionRecord {
  /** UUID of the decision */
  id: DecisionId
  timestamp: string
  type: "workflow_triggered" | "recommendation_accepted" | "data_merged" | "prediction_made"
  description: string
  actor: "system" | "user" | "ai"
  actorName?: string
  /** Array of input evidence/artifact UUIDs */
  inputs: EvidenceId[]
  /** Array of output artifact UUIDs */
  outputs: EvidenceId[]
  outcome?: "success" | "pending" | "failed"
  revertible?: boolean
}

// Correlation link between evidence
interface CorrelationLink {
  /** UUID of source evidence */
  sourceId: EvidenceId
  /** UUID of target evidence */
  targetId: EvidenceId
  relationship: string
  strength: number
  discovered: string
}

interface EvidenceResponse {
  truth: EvidenceItem[]
  context: EvidenceItem[]
  ai_chats: EvidenceItem[]
  think?: InsightItem[] | EvidenceItem[]
  act?: DecisionRecord[] | EvidenceItem[]
  governance?: EvidenceItem[]
  audit?: EvidenceItem[]
  correlations?: CorrelationLink[]
  meta?: {
    totalSources: number
    lastSynced: string
    coveragePeriod: string
    confidenceScore: number
  }
}

type CognitiveTab = "lineage" | "spine" | "context" | "knowledge" | "think" | "act" | "approve" | "governance"

const TAB_META: Array<{
  id: CognitiveTab
  label: string
  icon: ComponentType<{ className?: string }>
  description: string
}> = [
  { id: "lineage", label: "Data Lineage", icon: GitBranch, description: "See where every piece of data comes from" },
  { id: "spine", label: "Spine", icon: Database, description: "Structured data from connected systems" },
  { id: "context", label: "Context", icon: FileText, description: "Knowledge from docs, emails, meetings" },
  { id: "knowledge", label: "AI Memory", icon: Brain, description: "30-day AI conversation history" },
  { id: "think", label: "Reasoning", icon: Sparkles, description: "AI predictions with full reasoning chain" },
  { id: "act", label: "Act", icon: Zap, description: "Automated workflows and actions" },
  { id: "approve", label: "Approve", icon: ClipboardList, description: "Human-in-the-loop approvals" },
  { id: "governance", label: "Audit", icon: ShieldCheck, description: "Audit trail and compliance" },
]

// Confidence meter component
function ConfidenceMeter({ value, size = "sm" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const getColor = (v: number) => {
    if (v >= 0.9) return "accent-emerald-500"
    if (v >= 0.7) return "accent-blue-500"
    if (v >= 0.5) return "accent-amber-500"
    return "accent-rose-500"
  }
  
  const getLabel = (v: number) => {
    if (v >= 0.9) return "Very High"
    if (v >= 0.7) return "High"
    if (v >= 0.5) return "Medium"
    return "Low"
  }

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className="flex items-center gap-2">
      <progress
        className={`flex-1 w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size]} ${getColor(value)}`}
        value={Math.round(value * 100)}
        max={100}
      />
      <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
        {Math.round(value * 100)}% {size === "lg" && getLabel(value)}
      </span>
    </div>
  )
}

// Source badge component
function SourceBadge({ source, verified }: { source: string; verified?: boolean }) {
  const sourceColors: Record<string, string> = {
    salesforce: "bg-blue-100 text-blue-700 border-blue-200",
    hubspot: "bg-orange-100 text-orange-700 border-orange-200",
    jira: "bg-blue-100 text-blue-700 border-blue-200",
    slack: "bg-purple-100 text-purple-700 border-purple-200",
    email: "bg-rose-100 text-rose-700 border-rose-200",
    calendar: "bg-emerald-100 text-emerald-700 border-emerald-200",
    docs: "bg-amber-100 text-amber-700 border-amber-200",
    ai: "bg-violet-100 text-violet-700 border-violet-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  }
  
  const key = source.toLowerCase()
  const colorClass = sourceColors[key] || sourceColors.default
  
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${colorClass}`}>
      {verified && <Check className="w-2.5 h-2.5" />}
      {source}
    </span>
  )
}

// Reasoning chain visualization
function ReasoningChain({ steps }: { steps: ReasoningStep[] }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        <GitMerge className="w-3.5 h-3.5" />
        <span>Reasoning Chain ({steps.length} steps)</span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      
      {expanded && (
        <div className="ml-4 border-l-2 border-slate-200 pl-4 space-y-3">
          {steps.map((step, idx) => (
            <div key={step.step} className="relative">
              <div className="absolute -left-[1.4rem] w-3 h-3 rounded-full bg-slate-200 border-2 border-white" />
              <div className="text-xs">
                <div className="font-medium text-slate-700">Step {step.step}: {step.description}</div>
                <div className="text-slate-500 mt-1">
                  Data: {step.dataUsed.join(", ")}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400">Weight:</span>
                  <ConfidenceMeter value={step.weight} size="sm" />
                </div>
                <div className="mt-1 text-slate-600 italic">&quot;{step.output}&quot;</div>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="absolute -bottom-2 left-1/2 w-3 h-3 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Data lineage graph (simplified visual)
function DataLineageGraph({ items, correlations }: { items: EvidenceItem[]; correlations?: CorrelationLink[] }) {
  const sources = useMemo(() => {
    const grouped: Record<string, EvidenceItem[]> = {}
    items.forEach(item => {
      const key = item.sourceSystem || item.source || "Unknown"
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(item)
    })
    return grouped
  }, [items])
  
  const sourceList = Object.keys(sources)
  
  return (
    <div className="space-y-4">
      {/* Source nodes */}
      <div className="flex items-start justify-between gap-4 overflow-x-auto pb-4">
        {sourceList.map((source, idx) => (
          <div key={source} className="flex-shrink-0 w-40">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{source}</span>
              </div>
              <div className="text-xs text-slate-500">{sources[source].length} records</div>
              <div className="mt-2 space-y-1">
                {sources[source].slice(0, 3).map((item, i) => (
                  <div key={item.id || i} className="flex items-center gap-1">
                    {item.verified ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Info className="w-3 h-3 text-slate-400" />
                    )}
                    <span className="text-[10px] text-slate-600 truncate">{item.title}</span>
                  </div>
                ))}
                {sources[source].length > 3 && (
                  <span className="text-[10px] text-slate-400">+{sources[source].length - 3} more</span>
                )}
              </div>
            </div>
            {idx < sourceList.length - 1 && (
              <div className="hidden lg:flex items-center justify-center mt-2">
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        
        {/* Convergence node (IQ Hub) */}
        <div className="flex-shrink-0 w-48">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">IQ Hub</span>
            </div>
            <div className="text-xs text-indigo-600">Converged Intelligence</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <ConfidenceMeter value={0.94} size="md" />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-indigo-500">
              {items.length} data points merged
            </div>
          </div>
        </div>
      </div>
      
      {/* Correlation links */}
      {correlations && correlations.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <div className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-2">
            <Network className="w-3.5 h-3.5" />
            Discovered Correlations
          </div>
          <div className="grid grid-cols-2 gap-2">
            {correlations.slice(0, 4).map((link, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                <div className="flex items-center gap-1 text-slate-600">
                  <Link2 className="w-3 h-3" />
                  <span className="font-medium">{link.relationship}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-slate-400">Strength:</span>
                  <ConfidenceMeter value={link.strength} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Decision timeline with replay
function DecisionTimeline({ decisions }: { decisions: DecisionRecord[] }) {
  const [playing, setPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const outcomeIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    pending: <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />,
    failed: <XCircle className="w-4 h-4 text-rose-500" />,
  }
  
  const actorIcons = {
    system: <Database className="w-4 h-4 text-slate-500" />,
    user: <User className="w-4 h-4 text-blue-500" />,
    ai: <Sparkles className="w-4 h-4 text-violet-500" />,
  }
  
  return (
    <div className="space-y-4">
      {/* Playback controls */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          className="p-1.5 hover:bg-slate-200 rounded"
          disabled={currentIndex === 0}
          title="Previous decision"
        >
          <SkipBack className="w-4 h-4 text-slate-600" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="p-1.5 hover:bg-slate-200 rounded"
          title={playing ? "Pause replay" : "Play replay"}
        >
          {playing ? (
            <Pause className="w-4 h-4 text-slate-600" />
          ) : (
            <Play className="w-4 h-4 text-slate-600" />
          )}
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(decisions.length - 1, currentIndex + 1))}
          className="p-1.5 hover:bg-slate-200 rounded"
          disabled={currentIndex === decisions.length - 1}
          title="Next decision"
        >
          <SkipForward className="w-4 h-4 text-slate-600" />
        </button>
        <div className="flex-1 mx-2">
          <progress
            className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden accent-indigo-500"
            value={currentIndex + 1}
            max={decisions.length}
          />
        </div>
        <span className="text-xs text-slate-500">
          {currentIndex + 1} / {decisions.length}
        </span>
      </div>
      
      {/* Timeline */}
      <div className="space-y-3">
        {decisions.map((decision, idx) => (
          <div
            key={decision.id}
            className={`border rounded-lg p-3 transition-all ${
              idx === currentIndex 
                ? "border-indigo-300 bg-indigo-50/50 shadow-sm" 
                : idx < currentIndex 
                ? "border-slate-200 bg-slate-50 opacity-60"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                {actorIcons[decision.actor]}
                <div>
                  <div className="text-sm font-medium text-slate-800">{decision.description}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {decision.timestamp}
                    {decision.actorName && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{decision.actorName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {decision.outcome && outcomeIcons[decision.outcome]}
                {decision.revertible && (
                  <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-slate-600" title="Revert this action">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            {idx === currentIndex && (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase mb-1">Inputs</div>
                  <div className="space-y-1">
                    {decision.inputs.map((input, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-slate-600">
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        {input}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase mb-1">Outputs</div>
                  <div className="space-y-1">
                    {decision.outputs.map((output, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-slate-600">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        {output}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Insight card with reasoning
function InsightCard({ insight }: { insight: InsightItem }) {
  const typeStyles = {
    prediction: { icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
    pattern: { icon: Layers, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    anomaly: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    recommendation: { icon: Lightbulb, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    risk: { icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  }
  
  const style = typeStyles[insight.type]
  const Icon = style.icon
  
  const impactColors = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-slate-100 text-slate-600",
  }
  
  return (
    <div className={`border rounded-lg p-4 ${style.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Icon className={`w-5 h-5 mt-0.5 ${style.color}`} />
          <div>
            <div className="text-sm font-semibold text-slate-800">{insight.title}</div>
            <div className="text-xs text-slate-600 mt-1">{insight.description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${impactColors[insight.impact]}`}>
            {insight.impact.toUpperCase()} IMPACT
          </span>
          {insight.timeframe && (
            <span className="text-[10px] text-slate-500">{insight.timeframe}</span>
          )}
        </div>
      </div>
      
      {/* Confidence */}
      <div className="mt-3">
        <div className="text-[10px] font-medium text-slate-500 uppercase mb-1">Confidence Score</div>
        <ConfidenceMeter value={insight.confidence} size="lg" />
      </div>
      
      {/* Reasoning chain */}
      {insight.reasoning && insight.reasoning.length > 0 && (
        <div className="mt-3">
          <ReasoningChain steps={insight.reasoning} />
        </div>
      )}
      
      {/* Evidence used */}
      <div className="mt-3">
        <div className="text-[10px] font-medium text-slate-500 uppercase mb-1">Evidence Used</div>
        <div className="flex flex-wrap gap-1">
          {insight.evidence.map((e, i) => (
            <SourceBadge key={i} source={e} verified />
          ))}
        </div>
      </div>
      
      {/* Suggested actions */}
      {insight.suggestedActions && insight.suggestedActions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200/60">
          <div className="text-[10px] font-medium text-slate-500 uppercase mb-2">Suggested Actions</div>
          <div className="flex flex-wrap gap-2">
            {insight.suggestedActions.map((action, i) => (
              <button
                key={i}
                className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                {action}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Main export - Cognitive Drawer (L2 AI Layer)
export function CognitiveDrawer({
  situationId,
  open,
  onClose,
  onOpen,
  override,
}: {
  /** UUID of the situation to show evidence for */
  situationId: string | null // TODO: Update to SituationId once defined in types
  open: boolean
  onClose: () => void
  onOpen?: () => void
  override?: {
    title?: string
    description?: string
    evidence: EvidenceResponse
  } | null
}) {
  const { scope, department, accountId, accountRole } = useWorldScope()
  const tenant = useTenant()
  const [evidence, setEvidence] = useState<EvidenceResponse | null>(null)
  const [activeTab, setActiveTab] = useState<CognitiveTab>("lineage")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drawerTitle, setDrawerTitle] = useState<string | null>(null)
  const [drawerDescription, setDrawerDescription] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  // Generate mock rich data for demo
  const enrichedEvidence = useMemo<EvidenceResponse | null>(() => {
    if (!evidence) {
      // Return demo data when no evidence loaded (using type assertions for mock IDs)
      // CHURN RISK SCENARIO: Customer X - Multi-source intelligence convergence
      return {
        truth: [
          { 
            id: "spine-1" as EvidenceId, 
            title: "Payment Delay Detected", 
            source: "Stripe", 
            sourceSystem: "stripe", 
            date: "11:15 AM", 
            timestamp: 1738309500000,
            verified: true, 
            confidence: 0.99, 
            preview: "Customer X: Invoice $45K overdue by 15 days (INV-2847)",
            tags: ["payment", "overdue", "customer-x", "high-value"],
            dataLineage: {
              origin: "Stripe Webhooks API",
              transformations: ["Invoice status check", "Aging bucket calculation", "Risk scoring"],
              lastUpdated: "2026-01-31 11:15:00 IST"
            }
          },
          { 
            id: "spine-2" as EvidenceId, 
            title: "API Error Incidents", 
            source: "DataDog", 
            sourceSystem: "datadog", 
            date: "11:17 AM", 
            timestamp: 1738309620000,
            verified: true, 
            confidence: 0.97, 
            preview: "Customer X production environment: 12 API failures in 7 days, 3 incidents this week",
            tags: ["api-errors", "production", "customer-x", "technical"],
            dataLineage: {
              origin: "DataDog APM & Error Tracking",
              transformations: ["Error aggregation", "Customer tagging", "Incident correlation"],
              lastUpdated: "2026-01-31 11:17:00 IST"
            }
          },
          { 
            id: "spine-3" as EvidenceId, 
            title: "Usage Decline Alert", 
            source: "Product Analytics", 
            sourceSystem: "mixpanel", 
            date: "11:18 AM", 
            timestamp: 1738309680000,
            verified: true, 
            confidence: 0.95, 
            preview: "Customer X: MAU decreased 30% (450 → 315 users) over 14 days",
            tags: ["usage-drop", "mau", "customer-x", "engagement"],
            dataLineage: {
              origin: "Mixpanel Events API",
              transformations: ["User activity aggregation", "Trend analysis", "Anomaly detection"],
              lastUpdated: "2026-01-31 11:18:00 IST"
            }
          },
          { 
            id: "spine-4" as EvidenceId, 
            title: "Contract Renewal Timeline", 
            source: "Salesforce", 
            sourceSystem: "salesforce", 
            date: "Today", 
            verified: true, 
            confidence: 0.99, 
            preview: "Customer X: $450K ARR contract renews in 45 days (March 17, 2026)" 
          },
        ],
        context: [
          { 
            id: "ctx-1" as EvidenceId, 
            title: "Support Escalation Ticket", 
            source: "Zendesk", 
            sourceSystem: "zendesk", 
            date: "Yesterday", 
            verified: true, 
            confidence: 0.92,
            preview: "Ticket #5847: \"API keeps failing during peak hours, considering alternatives\" - Customer X Engineering Team",
            tags: ["support", "escalation", "api-issues", "churn-signal"]
          },
          { 
            id: "ctx-2" as EvidenceId, 
            title: "Sales Call Notes", 
            source: "Gong", 
            sourceSystem: "gong", 
            date: "3 days ago", 
            verified: true, 
            confidence: 0.88,
            preview: "Customer X CFO mentioned: \"Budget concerns for Q2, need to justify ROI with current reliability issues\"",
            tags: ["sales-call", "budget", "roi-concern"]
          },
          { 
            id: "ctx-3" as EvidenceId, 
            title: "Internal Slack Discussion", 
            source: "Slack", 
            sourceSystem: "slack", 
            date: "2 days ago", 
            verified: true,
            confidence: 0.85,
            preview: "#customer-x channel: Engineering team frustrated with recurring bugs, mentioned evaluating Competitor Y",
            tags: ["slack", "competitor-mention", "engineering-frustration"]
          },
          { 
            id: "ctx-4" as EvidenceId, 
            title: "Email Thread Analysis", 
            source: "Gmail", 
            sourceSystem: "email", 
            date: "This week", 
            verified: true,
            confidence: 0.90,
            preview: "Response time from Customer X champion increased from 2h → 18h average, tone shifted to formal",
            tags: ["email", "engagement-decline", "sentiment"]
          },
        ],
        ai_chats: [
          { 
            id: "ai-1" as EvidenceId, 
            title: "Customer Health Discussion", 
            source: "AI Memory", 
            sourceSystem: "ai", 
            date: "Jan 29", 
            verified: true, 
            preview: "We reviewed Customer X health score. I flagged early warning signs based on engagement patterns." 
          },
          { 
            id: "ai-2" as EvidenceId, 
            title: "Churn Prevention Strategies", 
            source: "AI Memory", 
            sourceSystem: "ai", 
            date: "Jan 27", 
            verified: true, 
            preview: "You asked about saving at-risk accounts. I analyzed 127 historical cases with similar patterns." 
          },
          { 
            id: "ai-3" as EvidenceId, 
            title: "Technical Escalation Protocol", 
            source: "AI Memory", 
            sourceSystem: "ai", 
            date: "Jan 25", 
            verified: true, 
            preview: "Discussed best practices for handling production incidents with enterprise customers." 
          },
        ],
        think: [
          {
            id: "churn-prediction-1" as InsightId,
            type: "risk",
            title: "Customer X: Critical Churn Risk Detected",
            description: "Multi-source intelligence indicates 87% probability of churn within 30 days. Root cause: Technical issues → User frustration → Payment withholding. Immediate cross-functional intervention required.",
            confidence: 0.87,
            impact: "high",
            timeframe: "Next 30 days",
            reasoning: [
              { 
                step: 1, 
                description: "Payment behavior analysis", 
                dataUsed: ["Stripe invoice history", "Payment patterns", "Aging analysis"], 
                weight: 0.25, 
                output: "Invoice $45K overdue 15 days - unusual for this customer (historically paid within 5 days). Pattern matches 'payment withholding' in 82% of historical churn cases." 
              },
              { 
                step: 2, 
                description: "Technical health assessment", 
                dataUsed: ["DataDog APM", "Error logs", "Incident reports"], 
                weight: 0.30, 
                output: "12 API failures in 7 days, 3 production incidents this week. Error rate 340% above baseline. Customer environment instability detected." 
              },
              { 
                step: 3, 
                description: "User engagement decline", 
                dataUsed: ["Product analytics", "MAU trends", "Feature usage"], 
                weight: 0.25, 
                output: "MAU dropped 30% (450→315) in 14 days. 8 power users inactive for 5+ days. Engagement cliff detected." 
              },
              { 
                step: 4, 
                description: "Sentiment & competitive signals", 
                dataUsed: ["Support tickets", "Email tone", "Slack mentions", "Sales calls"], 
                weight: 0.20, 
                output: "Support escalation mentions 'considering alternatives'. Competitor Y evaluation confirmed via Slack. CFO expressed ROI concerns in last call." 
              },
              { 
                step: 5, 
                description: "Historical pattern matching", 
                dataUsed: ["127 similar historical cases", "Churn database", "Win/loss analysis"], 
                weight: 1.0, 
                output: "Pattern matches 8 previous cases: 6 churned without intervention (75%), 2 saved with immediate executive escalation (25%). Time-to-action critical: <48 hours." 
              },
            ],
            evidence: ["spine-1", "spine-2", "spine-3", "ctx-1", "ctx-2", "ctx-3", "ctx-4"] as EvidenceId[],
            suggestedActions: [
              "🚨 IMMEDIATE: Emergency escalation to Engineering VP + CS VP + Sales VP + Finance",
              "📞 Schedule executive call with Customer X within 24 hours",
              "🔧 Engineering: Root cause analysis + hotfix deployment for API issues",
              "💰 Finance: Offer payment plan flexibility + waive late fees as goodwill gesture",
              "🤝 CS: Deploy dedicated success engineer for 30-day intensive support",
              "📊 Sales: Prepare contract addendum with enhanced SLA guarantees"
            ],
          },
          {
            id: "financial-impact-1" as InsightId,
            type: "prediction",
            title: "Financial Impact Analysis: Customer X Churn",
            description: "If Customer X churns, estimated total impact: $630K ($450K ARR loss + $180K replacement cost). Historical replacement cycle: 6-9 months.",
            confidence: 0.92,
            impact: "high",
            timeframe: "Immediate",
            reasoning: [
              { 
                step: 1, 
                description: "Direct revenue impact", 
                dataUsed: ["Salesforce contract value", "Renewal timeline"], 
                weight: 0.4, 
                output: "$450K ARR at risk (contract renews March 17). Represents 6.8% of total ARR base." 
              },
              { 
                step: 2, 
                description: "Replacement cost calculation", 
                dataUsed: ["CAC analysis", "Sales cycle data"], 
                weight: 0.3, 
                output: "Average enterprise CAC: $180K. Typical sales cycle: 6-9 months. Opportunity cost included." 
              },
              { 
                step: 3, 
                description: "Logo churn impact", 
                dataUsed: ["Market positioning", "Reference value"], 
                weight: 0.3, 
                output: "Customer X is tier-1 reference account. Loss impacts 3 active deals ($890K pipeline) citing them as reference." 
              },
            ],
            evidence: ["spine-1", "spine-4"] as EvidenceId[],
            suggestedActions: [
              "Prioritize retention investment up to $50K (11% of ARR)",
              "Prepare win-back scenario planning",
              "Update revenue forecast with churn risk flag"
            ],
          },
          {
            id: "intervention-success-1" as InsightId,
            type: "recommendation",
            title: "Intervention Success Probability: 68%",
            description: "Based on 127 similar historical cases, immediate cross-functional intervention has 68% save rate when deployed within 48 hours. Success factors: Executive engagement, technical resolution, contract flexibility.",
            confidence: 0.91,
            impact: "high",
            timeframe: "48-hour window",
            reasoning: [
              { 
                step: 1, 
                description: "Historical intervention analysis", 
                dataUsed: ["127 similar churn risk cases", "Intervention outcomes", "Save playbooks"], 
                weight: 0.5, 
                output: "86 accounts with 85%+ churn probability: 59 saved (68%), 27 churned (32%). Key factor: Time-to-action <48hrs." 
              },
              { 
                step: 2, 
                description: "Success pattern identification", 
                dataUsed: ["Saved account playbooks", "Executive engagement logs"], 
                weight: 0.5, 
                output: "Top 3 success factors: (1) C-level engagement in first call, (2) Technical fix within 1 week, (3) Contract concession offered." 
              },
            ],
            evidence: ["ai-1", "ai-2"] as EvidenceId[],
            suggestedActions: [
              "Deploy 'Enterprise Save Playbook' immediately",
              "Assign dedicated task force: 1 engineer, 1 CSM, 1 sales exec",
              "Set 7-day checkpoint milestones with executive oversight"
            ],
          },
        ] as InsightItem[],
        act: [
          { 
            id: "action-1" as DecisionId, 
            timestamp: "11:20 AM", 
            type: "prediction_made", 
            description: "AI Synthesis: Customer X churn risk 87% - Multi-source intelligence convergence completed", 
            actor: "ai", 
            actorName: "Think Layer (Llama 3.3 70B + IntegrateWise fine-tune)", 
            inputs: ["spine-1", "spine-2", "spine-3", "ctx-1", "ctx-2", "ctx-3", "ctx-4"] as EvidenceId[], 
            outputs: ["churn-prediction-1", "financial-impact-1", "intervention-success-1"] as EvidenceId[], 
            outcome: "success", 
            revertible: false 
          },
          { 
            id: "action-2" as DecisionId, 
            timestamp: "11:21 AM", 
            type: "workflow_triggered", 
            description: "Emergency escalation workflow initiated: Notification sent to Engineering VP, CS VP, Sales VP, Finance Director", 
            actor: "system", 
            actorName: "Act Layer", 
            inputs: ["churn-prediction-1"] as EvidenceId[], 
            outputs: ["Slack alerts sent", "Email escalations sent", "Jira epic created", "Salesforce task created"] as EvidenceId[], 
            outcome: "success", 
            revertible: true 
          },
          { 
            id: "action-3" as DecisionId, 
            timestamp: "11:25 AM", 
            type: "recommendation_accepted", 
            description: "John Doe (CSM) reviewed prediction and accepted recommended action plan", 
            actor: "user", 
            actorName: "John Doe (Customer Success Manager)", 
            inputs: ["churn-prediction-1", "intervention-success-1"] as EvidenceId[], 
            outputs: ["Executive call scheduled", "Task force assigned", "Save playbook activated"] as EvidenceId[], 
            outcome: "success", 
            revertible: true 
          },
          { 
            id: "action-4" as DecisionId, 
            timestamp: "11:28 AM", 
            type: "workflow_triggered", 
            description: "Engineering VP acknowledged - Root cause analysis initiated, hotfix team mobilized", 
            actor: "user", 
            actorName: "Sarah Chen (Engineering VP)", 
            inputs: ["spine-2", "action-2"] as EvidenceId[], 
            outputs: ["P0 incident created", "Engineering task force assembled", "RCA scheduled"] as EvidenceId[], 
            outcome: "pending", 
            revertible: false 
          },
          { 
            id: "action-5" as DecisionId, 
            timestamp: "Pending", 
            type: "workflow_triggered", 
            description: "Outcome tracking: Customer X retention status (Updates every 24 hours)", 
            actor: "system", 
            actorName: "Governance Layer", 
            inputs: ["action-1", "action-2", "action-3", "action-4"] as EvidenceId[], 
            outputs: ["Tracking dashboard updated", "Retention metric monitored"] as EvidenceId[], 
            outcome: "pending", 
            revertible: false 
          },
        ] as DecisionRecord[],
        governance: [
          { 
            id: "gov-1" as EvidenceId, 
            title: "AI Prediction Audit Log", 
            source: "Governance", 
            sourceSystem: "audit", 
            date: "11:20 AM Today", 
            timestamp: 1738310400000,
            verified: true, 
            preview: "Churn prediction logged: Customer X (87% probability). Model: Llama 3.3 70B + IntegrateWise fine-tune. Training data: 127 historical cases. Confidence: High (based on 5-factor analysis)." 
          },
          { 
            id: "gov-2" as EvidenceId, 
            title: "Human Review Record", 
            source: "Compliance", 
            sourceSystem: "audit", 
            date: "11:25 AM Today", 
            timestamp: 1738310700000,
            verified: true, 
            preview: "Prediction reviewed by: John Doe (Customer Success Manager, CSM ID: USR-847). Review time: 5 minutes. Decision: Action approved. Notes: 'Matches my assessment, proceeding with escalation'." 
          },
          { 
            id: "gov-3" as EvidenceId, 
            title: "Escalation Action Logged", 
            source: "Governance", 
            sourceSystem: "audit", 
            date: "11:21 AM Today", 
            timestamp: 1738310460000,
            verified: true, 
            preview: "Action taken: Emergency escalation to VP level (4 executives notified). Workflow: Enterprise Save Playbook v3.2. SLA: 48-hour response required." 
          },
          { 
            id: "gov-4" as EvidenceId, 
            title: "Outcome Tracking Status", 
            source: "Compliance", 
            sourceSystem: "audit", 
            date: "Ongoing", 
            verified: true, 
            preview: "Outcome: [PENDING] - Customer X retention tracked via 7-day checkpoint system. Next update: 2026-02-01 11:20 AM IST. Historical benchmark: 68% save rate for similar interventions." 
          },
          { 
            id: "gov-5" as EvidenceId, 
            title: "Data Lineage Verification", 
            source: "Governance", 
            sourceSystem: "audit", 
            date: "11:20 AM Today", 
            verified: true, 
            preview: "All data sources verified: Stripe (payment), DataDog (technical), Mixpanel (usage), Zendesk (support), Gong (sales), Slack (collaboration). Data freshness: <10 minutes. GDPR compliant." 
          },
          { 
            id: "gov-6" as EvidenceId, 
            title: "Model Performance Metrics", 
            source: "AI Observatory", 
            sourceSystem: "audit", 
            date: "11:20 AM Today", 
            verified: true, 
            preview: "Model accuracy (last 90 days): 89.4% precision, 84.2% recall on churn predictions. False positive rate: 8.3%. Confidence calibration score: 0.92. Last retrained: 2026-01-15." 
          },
        ],
        correlations: [
          { sourceId: "spine-1" as EvidenceId, targetId: "ctx-1" as EvidenceId, relationship: "Payment delay correlates with support escalation", strength: 0.94, discovered: "11:19 AM" },
          { sourceId: "spine-2" as EvidenceId, targetId: "ctx-3" as EvidenceId, relationship: "API errors match Slack engineering complaints", strength: 0.91, discovered: "11:19 AM" },
          { sourceId: "spine-3" as EvidenceId, targetId: "ctx-2" as EvidenceId, relationship: "Usage decline precedes CFO budget concerns", strength: 0.87, discovered: "11:19 AM" },
          { sourceId: "ctx-1" as EvidenceId, targetId: "ctx-3" as EvidenceId, relationship: "Support ticket sentiment matches Slack frustration", strength: 0.88, discovered: "11:19 AM" },
        ],
        meta: {
          totalSources: 12,
          lastSynced: "2 minutes ago",
          coveragePeriod: "Last 30 days",
          confidenceScore: 0.94,
        },
      }
    }
    return evidence
  }, [evidence])

  useEffect(() => {
    if (!open) return

    if (override?.evidence) {
      setEvidence(override.evidence)
      setDrawerTitle(override.title ?? "Evidence Trail")
      setDrawerDescription(override.description ?? null)
      setLoading(false)
      setError(null)
      return
    }

    if (!situationId) {
      // Load default evidence
      setLoading(false)
      return
    }
    
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/evidence/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            situation_id: situationId,
            world: { scope, department, accountId, accountRole },
          }),
        })
        if (!response.ok) throw new Error(`Failed to load evidence (${response.status})`)
        const data = (await response.json()) as EvidenceResponse
        setEvidence(data)
        setDrawerTitle(`Evidence: ${situationId}`)
      } catch (err) {
        setEvidence(null)
        setError(err instanceof Error ? err.message : "Failed to load evidence")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open, situationId, scope, department, accountId, accountRole, override])

  const counts = useMemo(
    () => ({
      lineage: (enrichedEvidence?.truth?.length ?? 0) + (enrichedEvidence?.context?.length ?? 0) + (enrichedEvidence?.ai_chats?.length ?? 0),
      spine: enrichedEvidence?.truth?.length ?? 0,
      context: enrichedEvidence?.context?.length ?? 0,
      knowledge: enrichedEvidence?.ai_chats?.length ?? 0,
      think: enrichedEvidence?.think?.length ?? 0,
      act: enrichedEvidence?.act?.length ?? 0,
      approve: 3, // Pending approvals count
      governance: enrichedEvidence?.governance?.length ?? 0,
    }),
    [enrichedEvidence]
  )

  const totalItems = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts])

  const tabAccess = useMemo(() => {
    const accessFor = (key: string) => {
      const result = featureAccess({ plan: tenant.plan, featureFlags: tenant.featureFlags, featureKey: key })
      return typeof result === 'object' ? result.hasAccess : result
    }
    return {
      lineage: true,
      spine: accessFor("surfaces.spine"),
      context: accessFor("surfaces.context"),
      knowledge: true,
      think: (tenant.plan as string) !== "personal" && (tenant.plan as string) !== "free",
      act: (tenant.plan as string) !== "personal",
      approve: (tenant.plan as string) !== "personal",
      governance: (tenant.plan as string) !== "personal",
    } satisfies Record<CognitiveTab, boolean>
  }, [tenant.plan, tenant.featureFlags])

  // Copy evidence to clipboard
  const handleCopy = useCallback(() => {
    if (enrichedEvidence) {
      navigator.clipboard.writeText(JSON.stringify(enrichedEvidence, null, 2))
    }
  }, [enrichedEvidence])

  // Export evidence
  const handleExport = useCallback(() => {
    if (enrichedEvidence) {
      const blob = new Blob([JSON.stringify(enrichedEvidence, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `evidence-${new Date().toISOString()}.json`
      a.click()
    }
  }, [enrichedEvidence])

  // Collapsed state - mini strip at bottom
  if (!open) {
    if (!onOpen) return null
    return (
      <div className="fixed inset-x-0 bottom-0 z-40">
        <button
          type="button"
          onClick={onOpen}
          className="w-full bg-card hover:bg-muted/30 transition-colors border-t border-border"
          title="Open Evidence Layer - Full transparency for every insight"
        >
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-semibold text-foreground tracking-wide">
                  COGNITIVE LAYER
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="px-2 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-medium border border-border">
                  {counts.spine} Spine
                </span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-medium border border-border">
                  {counts.context} Context
                </span>
                <span className="px-2 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-medium border border-border">
                  {counts.knowledge} AI Memory
                </span>
              </div>
              {enrichedEvidence?.meta && (
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>•</span>
                  <span>{enrichedEvidence.meta.totalSources} sources</span>
                  <span>•</span>
                  <span>Synced {enrichedEvidence.meta.lastSynced}</span>
                  <span>•</span>
                  <ConfidenceMeter value={enrichedEvidence.meta.confidenceScore} size="sm" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Full audit trail available</span>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </button>
      </div>
    )
  }

  // Expanded state
  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ${expanded ? "top-0" : ""}`}>
      <div className={`bg-card border-t border-border shadow-2xl ${expanded ? "h-full overflow-hidden flex flex-col" : ""}`}>
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">Cognitive Layer</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-semibold text-primary">
                        L2
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Evidence, reasoning, and governed actions</div>
                  </div>
                </div>
                
                {/* Meta badges */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-600">
                    {enrichedEvidence?.meta?.totalSources ?? 12} Sources Connected
                  </span>
                  <span className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-600">
                    {enrichedEvidence?.meta?.coveragePeriod ?? "30-day"} Memory
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="text-[10px] font-medium text-emerald-700">
                      {Math.round((enrichedEvidence?.meta?.confidenceScore ?? 0.94) * 100)}% Confidence
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search evidence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-3 w-48 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  title="Copy evidence to clipboard"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={handleExport}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  title="Export evidence as JSON"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  title={expanded ? "Minimize drawer" : "Maximize drawer"}
                >
                  {expanded ? (
                    <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  title="Close drawer"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
              {TAB_META.map((tab) => {
                const Icon = tab.icon
                const isActive = tab.id === activeTab
                const allowed = tabAccess[tab.id]
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={!allowed}
                    onClick={() => allowed && setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg"
                        : allowed
                        ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                    title={tab.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      isActive ? "bg-white/20" : "bg-slate-100"
                    }`}>
                      {counts[tab.id]}
                    </span>
                    {!allowed && <Lock className="w-3 h-3" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${expanded ? "flex-1 overflow-y-auto" : "max-h-[50vh] overflow-y-auto"}`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="border border-rose-200 bg-rose-50 rounded-lg p-4 text-sm text-rose-900">
                {error}
              </div>
            ) : !tabAccess[activeTab] ? (
              <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-6 text-center">
                <Lock className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <div className="text-sm font-semibold text-indigo-900">Upgrade Required</div>
                <div className="text-xs text-indigo-700 mt-1 max-w-md mx-auto">
                  The {TAB_META.find(t => t.id === activeTab)?.label} layer provides advanced insights. Upgrade your plan to unlock full transparency.
                </div>
                <Link
                  to="/admin/billing"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  View Plans
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Data Lineage Tab */}
                {activeTab === "lineage" && enrichedEvidence && (
                  <DataLineageGraph 
                    items={[
                      ...(enrichedEvidence.truth ?? []),
                      ...(enrichedEvidence.context ?? []),
                      ...(enrichedEvidence.ai_chats ?? []),
                    ]}
                    correlations={enrichedEvidence.correlations}
                  />
                )}
                
                {/* Spine Tab */}
                {activeTab === "spine" && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {(enrichedEvidence?.truth ?? []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                              {item.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <SourceBadge source={item.source} verified={item.verified} />
                              <span className="text-[10px] text-slate-400">{item.date}</span>
                            </div>
                          </div>
                          {item.confidence && (
                            <div className="w-20">
                              <ConfidenceMeter value={item.confidence} size="sm" />
                            </div>
                          )}
                        </div>
                        {item.preview && (
                          <p className="text-xs text-slate-600 mt-3 leading-relaxed">{item.preview}</p>
                        )}
                        <div className="mt-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-2 py-1 rounded text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100" title="View source data">
                            View Source
                          </button>
                          <button className="px-2 py-1 rounded text-[10px] font-medium text-indigo-600 hover:bg-indigo-50" title="Trace data lineage">
                            Trace Lineage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Context Tab */}
                {activeTab === "context" && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {(enrichedEvidence?.context ?? []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <SourceBadge source={item.source} />
                              <span className="text-[10px] text-slate-400">{item.date}</span>
                            </div>
                          </div>
                        </div>
                        {item.preview && (
                          <p className="text-xs text-slate-600 mt-3 leading-relaxed">{item.preview}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Knowledge / AI Memory Tab */}
                {activeTab === "knowledge" && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-900">30-Day AI Memory</span>
                      </div>
                      <p className="text-xs text-violet-700">
                        Your AI assistant remembers all conversations and context from the past 30 days. 
                        This enables continuity, learning, and increasingly personalized assistance.
                      </p>
                    </div>
                    {(enrichedEvidence?.ai_chats ?? []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.date}
                              </span>
                            </div>
                            {item.preview && (
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">&quot;{item.preview}&quot;</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Think / Reasoning Tab */}
                {activeTab === "think" && (
                  <div className="space-y-4">
                    {(enrichedEvidence?.think ?? []).map((item, idx) => {
                      // Check if it's an InsightItem (has 'type' property)
                      if ('type' in item && 'confidence' in item && 'impact' in item) {
                        return <InsightCard key={(item as InsightItem).id || idx} insight={item as InsightItem} />
                      }
                      // Fallback for basic EvidenceItem
                      const evidence = item as EvidenceItem
                      return (
                        <div key={evidence.id || idx} className="bg-white border border-slate-200 rounded-lg p-4">
                          <span className="text-sm font-semibold text-slate-900">{evidence.title}</span>
                          {evidence.preview && (
                            <p className="text-xs text-slate-600 mt-2">{evidence.preview}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {/* Act / Actions Tab */}
                {activeTab === "act" && enrichedEvidence?.act && (
                  <>
                    {Array.isArray(enrichedEvidence.act) && enrichedEvidence.act.length > 0 && 'actor' in enrichedEvidence.act[0] ? (
                      <DecisionTimeline decisions={enrichedEvidence.act as DecisionRecord[]} />
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        {(enrichedEvidence.act as EvidenceItem[]).map((item, idx) => (
                          <div key={item.id || idx} className="bg-white border border-slate-200 rounded-lg p-4">
                            <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                            {item.preview && (
                              <p className="text-xs text-slate-600 mt-2">{item.preview}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Approve Tab - Human-in-the-Loop */}
                {activeTab === "approve" && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900">Pending Approvals</span>
                      </div>
                      <p className="text-xs text-amber-700">
                        AI-recommended actions requiring human review before execution.
                        Your approval ensures quality and maintains control.
                      </p>
                    </div>
                    
                    {/* Pending Approvals List */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 'appr_001',
                          title: 'Schedule executive call with Customer X',
                          description: 'Based on 87% churn risk prediction, schedule intervention call with VP of Sales',
                          confidence: 0.92,
                          source: 'Think Layer',
                          impact: 'high',
                          expiresIn: '2 hours',
                        },
                        {
                          id: 'appr_002',
                          title: 'Deploy hotfix for API timeout issues',
                          description: 'Engineering team prepared patch for recurring timeout errors affecting Customer X',
                          confidence: 0.88,
                          source: 'Engineering',
                          impact: 'high',
                          expiresIn: '4 hours',
                        },
                        {
                          id: 'appr_003',
                          title: 'Send retention offer email',
                          description: 'Personalized retention offer based on account history and engagement patterns',
                          confidence: 0.85,
                          source: 'Marketing AI',
                          impact: 'medium',
                          expiresIn: '24 hours',
                        },
                      ].map((approval) => (
                        <div key={approval.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-300 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900">{approval.title}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  approval.impact === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {approval.impact.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">{approval.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
                                <span>Source: {approval.source}</span>
                                <span>Confidence: {Math.round(approval.confidence * 100)}%</span>
                                <span className="text-amber-600">Expires: {approval.expiresIn}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                              <button className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                                <X className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Governance Tab */}
                {activeTab === "governance" && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-900">Compliance Status</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="bg-white rounded-lg p-3 border border-emerald-200">
                          <div className="text-lg font-bold text-emerald-700">100%</div>
                          <div className="text-[10px] text-emerald-600">GDPR Compliant</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-emerald-200">
                          <div className="text-lg font-bold text-emerald-700">47</div>
                          <div className="text-[10px] text-emerald-600">Decisions Logged</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-emerald-200">
                          <div className="text-lg font-bold text-emerald-700">0</div>
                          <div className="text-[10px] text-emerald-600">Policy Violations</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      {(enrichedEvidence?.governance ?? []).map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="bg-white border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                          </div>
                          {item.preview && (
                            <p className="text-xs text-slate-600">{item.preview}</p>
                          )}
                          <div className="mt-2 text-[10px] text-slate-400">{item.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Fingerprint className="w-3 h-3" />
                Every insight is traceable
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Audit-ready documentation
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Synced {enrichedEvidence?.meta?.lastSynced ?? "2 min ago"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">⌘J</kbd>
              <span>anywhere to open Cognitive Layer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Backwards-compatible alias
export { CognitiveDrawer as EvidenceDrawer }
