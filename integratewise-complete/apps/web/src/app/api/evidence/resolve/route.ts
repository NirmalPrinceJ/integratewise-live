import { NextResponse } from "next/server"

type EvidenceItem = {
  title: string
  source: string
  date: string
  preview?: string
  link?: string
}

type WorldPayload = {
  scope?: "personal" | "work" | "accounts" | "admin" | string
  department?: string | null
  accountId?: string | null
  accountRole?: string | null
}

// Mock adapter - replace with real Evidence resolution
export async function POST(request: Request) {
  const body = await request.json()
  const { situation_id, world } = body as {
    situation_id?: string
    world?: WorldPayload
  }

  const worldScope = world?.scope ?? "work"
  const origin = new URL(request.url).origin

  // Mock evidence resolution matching final contract
  const evidenceMap: Record<string, any> = {
    sit_001: {
      truth: [
        {
          type: "truth",
          title: "Sprint velocity data - Sprint 47",
          source: "Jira",
          date: "Jan 22-26, 2026",
          link: "/spine/records/jira_velocity_sprint47",
          preview: "Story points: 42 (target: 55) | Completed: 28 | Carried over: 14",
          confidence: 95,
        },
        {
          type: "truth",
          title: "Sprint velocity data - Sprint 46",
          source: "Jira",
          date: "Jan 15-19, 2026",
          link: "/spine/records/jira_velocity_sprint46",
          preview: "Story points: 47 (target: 55) | Completed: 31 | Carried over: 16",
          confidence: 95,
        },
        {
          type: "truth",
          title: "Support ticket metrics",
          source: "Zendesk",
          date: "Last 30 days",
          link: "/spine/records/zendesk_metrics_jan26",
          preview: "Total tickets: 342 | Assigned to engineering: 89 (26%) | Avg resolution time: 4.2h",
          confidence: 92,
        },
      ],
      context: [
        {
          type: "context",
          title: "Q1 Engineering Capacity Plan",
          source: "Notion",
          date: "Jan 15, 2026",
          link: "/context/artifacts/notion_q1_capacity",
          preview: "Planned allocation: 100% feature development (55 points/sprint). Support rotation not factored into velocity calculations. Assumes dedicated support team handles L1/L2...",
          confidence: 88,
        },
        {
          type: "context",
          title: "Sprint Retrospective Notes - Sprint 46",
          source: "Confluence",
          date: "Jan 19, 2026",
          link: "/context/artifacts/retro_sprint46",
          preview: "Team feedback: 'Too much context switching between feature work and support escalations. Suggest dedicated support engineer rotation.'",
          confidence: 85,
        },
      ],
      ai_chats: [
        {
          type: "ai-chat",
          title: "Engineering Standup - Jan 28",
          source: "IQ Hub",
          date: "Jan 28, 2026",
          link: "/iq-hub/sessions/standup_jan28_001",
          preview: "Discussion summary: 4 engineers mentioned support interruptions. Sarah: 'Spent 6h yesterday on customer escalation'. Mike: 'Hard to maintain flow state with Slack pings.'",
          confidence: 82,
        },
        {
          type: "ai-chat",
          title: "Manager 1:1 - Jane (EM)",
          source: "IQ Hub",
          date: "Jan 27, 2026",
          link: "/iq-hub/sessions/oneone_jane_jan27",
          preview: "Jane expressed concerns about team morale due to support load. Mentioned potential burnout risk if continues through Q1.",
          confidence: 78,
        },
      ],
    },
    sit_002: {
      truth: [
        {
          type: "truth",
          title: "Deal: Acme Corp Enterprise",
          source: "HubSpot",
          date: "In legal review since Dec 15, 2025",
          link: "/spine/records/deal_acme_enterprise",
          preview: "Value: $180K ARR | Stage: Contract Review (42 days) | Blocker: Data residency requirements",
          confidence: 98,
        },
        {
          type: "truth",
          title: "Deal: GlobalTech Expansion",
          source: "HubSpot",
          date: "In legal review since Dec 20, 2025",
          link: "/spine/records/deal_globaltech",
          preview: "Value: $140K ARR | Stage: Contract Review (37 days) | Blocker: SLA terms",
          confidence: 98,
        },
        {
          type: "truth",
          title: "Deal: MegaCorp Integration",
          source: "HubSpot",
          date: "In legal review since Dec 28, 2025",
          link: "/spine/records/deal_megacorp",
          preview: "Value: $100K ARR | Stage: Contract Review (29 days) | Blocker: Liability caps",
          confidence: 98,
        },
      ],
      context: [
        {
          type: "context",
          title: "Contract Review Log - Acme Corp",
          source: "DocuSign",
          date: "Jan 20, 2026",
          link: "/context/artifacts/docusign_acme_log",
          preview: "Version 4 sent. Issues: EU data residency clause needs approval from our DPO. Waiting on security team review for SOC 2 attestations.",
        },
        {
          type: "context",
          title: "Standard MSA Template v2.1",
          source: "Google Drive",
          date: "Dec 1, 2025",
          link: "/context/artifacts/msa_template_v2",
          preview: "Current template doesn't include flexible data residency options. Legal recommends creating enterprise tier addendum.",
        },
      ],
      ai_chats: [
        {
          type: "ai-chat",
          title: "Legal-Sales Sync",
          source: "Slack (#legal-sales)",
          date: "Jan 27, 2026",
          link: "/iq-hub/sessions/legal_sales_jan27",
          preview: "Legal team: 'We need standardized MSA for enterprise tier. Current template causes 30+ day delays on every deal. Suggest executive workshop to finalize terms.'",
        },
      ],
    },
  }

  const evidence = evidenceMap[situation_id] || {
    truth: [],
    context: [],
    ai_chats: [],
  }

  // World-aware enrichment: Think + Act are derived from the situation record; Governance/Audit are derived from admin surfaces.
  const situation = await loadSituation(origin, situation_id)

  const think: EvidenceItem[] = situation
    ? [
        {
          title: "Situation narrative",
          source: "Think Engine",
          date: situation.createdAt ?? "",
          preview: situation.narrative ?? "",
        },
        {
          title: "Why it matters",
          source: "Think Engine",
          date: situation.createdAt ?? "",
          preview: situation.whyItMatters ?? "",
        },
      ].filter((item) => item.preview)
    : []

  const actFromSituation: EvidenceItem[] = (situation?.proposedActions ?? []).map((action: any) => ({
    title: action.title ?? "Action",
    source: action.proposedBy ? `Act (proposed by ${action.proposedBy})` : "Act Engine",
    date: action.proposedAt ?? situation?.createdAt ?? "",
    preview: action.description ?? action.estimatedImpact ?? "",
  }))

  const actRuns: EvidenceItem[] = await loadActRuns(origin)

  const { governance, audit } = await loadAdminGovernanceAndAudit(origin, worldScope === "admin")

  // Prefer the situation's evidence array if present (it includes a single list of evidence typed by 'type')
  // so the drawer stays consistent across worlds/scopes.
  if (situation?.evidence?.length) {
    const split = splitSituationEvidence(situation.evidence)
    evidence.truth = split.truth
    evidence.context = split.context
    evidence.ai_chats = split.ai_chats
  }

  return NextResponse.json({
    ...evidence,
    think,
    act: [...actFromSituation, ...actRuns],
    governance,
    audit,
    meta: {
      world: worldScope,
      department: world?.department ?? null,
      accountId: world?.accountId ?? null,
      accountRole: world?.accountRole ?? null,
      situationId: situation_id ?? null,
    },
  })
}

async function loadSituation(origin: string, situationId?: string) {
  if (!situationId) return null
  try {
    // Use a broad scope so we don't accidentally filter out the situation.
    const response = await fetch(`${origin}/api/situations?scope=all`, { cache: "no-store" })
    if (!response.ok) return null
    const data = (await response.json()) as { situations?: any[] }
    return (data.situations ?? []).find((s) => s.id === situationId) ?? null
  } catch {
    return null
  }
}

function splitSituationEvidence(items: any[]): {
  truth: EvidenceItem[]
  context: EvidenceItem[]
  ai_chats: EvidenceItem[]
} {
  const truth: EvidenceItem[] = []
  const context: EvidenceItem[] = []
  const ai_chats: EvidenceItem[] = []

  for (const item of items) {
    const mapped: EvidenceItem = {
      title: item.title ?? "Evidence",
      source: item.source ?? "",
      date: item.date ?? "",
      preview: item.preview,
      link: item.link,
    }
    if (item.type === "truth") truth.push(mapped)
    else if (item.type === "context") context.push(mapped)
    else if (item.type === "ai-chat") ai_chats.push(mapped)
  }

  return { truth, context, ai_chats }
}

async function loadActRuns(origin: string): Promise<EvidenceItem[]> {
  try {
    const response = await fetch(`${origin}/api/act/runs`, { cache: "no-store" })
    if (!response.ok) return []
    const data = (await response.json()) as { runs?: Array<{ id: string; status: string; startedAt: string }> }
    return (data.runs ?? []).map((run) => ({
      title: `Run ${run.id}`,
      source: "Act Runs",
      date: run.startedAt,
      preview: `Status: ${run.status}`,
    }))
  } catch {
    return []
  }
}

async function loadAdminGovernanceAndAudit(origin: string, enabled: boolean): Promise<{
  governance: EvidenceItem[]
  audit: EvidenceItem[]
}> {
  if (!enabled) return { governance: [], audit: [] }

  const [gov, audit] = await Promise.all([
    (async () => {
      try {
        const response = await fetch(`${origin}/api/admin/governance`, { cache: "no-store" })
        if (!response.ok) return []
        const data = (await response.json()) as { requests?: any[] }
        return (data.requests ?? []).map((req) => ({
          title: `Governance request: ${req.actionKey ?? req.id}`,
          source: "Governance",
          date: req.createdAt ?? req.dueAt ?? "",
          preview: `Status: ${req.status ?? "unknown"} | Risk: ${req.riskScore ?? "?"} | Blast radius: ${req.blastRadius ?? "?"}`,
        }))
      } catch {
        return []
      }
    })(),
    (async () => {
      try {
        const response = await fetch(`${origin}/api/admin/audit`, { cache: "no-store" })
        if (!response.ok) return []
        const data = (await response.json()) as { entries?: any[] }
        return (data.entries ?? []).map((entry) => ({
          title: entry.action ?? "Audit event",
          source: "Audit",
          date: entry.timestamp ?? "",
          preview: entry.justification ?? `${entry.objectType ?? "object"}: ${entry.objectId ?? entry.id ?? ""}`,
        }))
      } catch {
        return []
      }
    })(),
  ])

  return { governance: gov, audit }
}
