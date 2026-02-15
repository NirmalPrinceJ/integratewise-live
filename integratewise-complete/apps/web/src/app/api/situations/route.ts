import { NextResponse } from "next/server"

// Mock adapter - replace with real Think engine integration
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const scope = searchParams.get("scope") || "operations"

  // Mock situations data matching final contract
  const situations = [
    {
      id: "sit_001",
      severity: "medium",
      domain: "operations",
      confidence: 87,
      title: "Project velocity declining for 3 consecutive sprints",
      narrative: "Detected 23% drop in story points completed. Primary contributing factor: 4 team members on concurrent support rotations.",
      whyItMatters: "Current trajectory risks Q1 delivery commitments. Three key milestones may slip by 2-3 weeks.",
      evidence: [
        {
          type: "truth",
          title: "Sprint velocity data",
          source: "Jira",
          date: "Last 3 sprints",
          link: "/spine/records/jira_velocity_001",
          confidence: 95,
        },
        {
          type: "truth",
          title: "Support ticket volume",
          source: "Zendesk",
          date: "Last 30 days",
          link: "/spine/records/zendesk_vol_001",
          confidence: 92,
        },
        {
          type: "context",
          title: "Team capacity planning doc",
          source: "Notion",
          date: "Jan 15, 2026",
          link: "/context/artifacts/notion_capacity_001",
          preview: "Q1 planning assumes 100% engineering capacity, but current support load is 25% of team time...",
        },
        {
          type: "ai-chat",
          title: "Engineering standup summary",
          source: "IQ Hub",
          date: "Jan 28, 2026",
          link: "/iq-hub/sessions/standup_jan28",
          preview: "Team expressed concerns about context switching between feature work and support...",
        },
      ],
      proposedActions: [
        {
          id: "act_001",
          title: "Redistribute support rotation",
          description: "Move 2 engineers off support to focus on sprint work",
          requiresApproval: true,
          status: "pending",
          proposedBy: "Think Engine",
          proposedAt: "2 hours ago",
          policies: [
            {
              type: "approval",
              description: "Engineering Manager approval required for team changes",
              satisfied: false,
            },
            {
              type: "review",
              description: "Support SLA impact assessment",
              satisfied: true,
            },
          ],
          estimatedImpact: "Restore 15-18 story points/sprint capacity",
          riskLevel: "medium",
        },
        {
          id: "act_002",
          title: "Extend sprint timeline",
          description: "Add 2 days to current sprint to catch up",
          requiresApproval: true,
          status: "pending",
          proposedBy: "Think Engine",
          proposedAt: "2 hours ago",
          policies: [
            {
              type: "approval",
              description: "Product owner approval for timeline changes",
              satisfied: false,
            },
          ],
          estimatedImpact: "Complete current sprint goals without burnout",
          riskLevel: "low",
        },
      ],
      status: "pending",
      createdAt: "2h ago",
    },
    {
      id: "sit_002",
      severity: "high",
      domain: "sales",
      confidence: 92,
      title: "3 enterprise deals stalled in legal review >30 days",
      narrative: "Contract reviews averaging 34 days vs target of 10 days. Common blocker: MSA terms misalignment.",
      whyItMatters: "$420K ARR at risk. If not closed by Feb 15, deals may push to Q2 affecting quarterly targets.",
      evidence: [
        {
          type: "truth",
          title: "Deal stage history",
          source: "HubSpot",
          date: "Last 45 days",
          link: "/spine/records/hubspot_deals_001",
          confidence: 98,
        },
        {
          type: "context",
          title: "Contract review notes",
          source: "DocuSign",
          date: "Jan 20-28, 2026",
          link: "/context/artifacts/docusign_001",
          preview: "Recurring issues: data residency requirements, SLA terms, liability caps...",
        },
        {
          type: "ai-chat",
          title: "Legal team chat summary",
          source: "Slack",
          date: "Jan 27, 2026",
          link: "/iq-hub/sessions/legal_sync_jan27",
          preview: "Legal team requests standardized MSA templates for enterprise tier...",
        },
      ],
      proposedActions: [
        {
          id: "act_003",
          title: "Schedule executive alignment call",
          description: "CEO + VP Sales + General Counsel sync on MSA terms",
          requiresApproval: false,
          status: "pending",
          proposedBy: "Think Engine",
          proposedAt: "4 hours ago",
          policies: [],
          estimatedImpact: "Unblock 3 deals worth $420K ARR",
          riskLevel: "low",
        },
        {
          id: "act_004",
          title: "Prepare alternative pricing structure",
          description: "Create flexible payment terms option for stalled deals",
          requiresApproval: true,
          status: "pending",
          proposedBy: "Think Engine",
          proposedAt: "4 hours ago",
          policies: [
            {
              type: "approval",
              description: "CFO approval required for pricing changes",
              satisfied: false,
            },
            {
              type: "compliance",
              description: "Revenue recognition review",
              satisfied: true,
            },
          ],
          estimatedImpact: "Accelerate deal closure by 10-15 days",
          riskLevel: "medium",
        },
      ],
      status: "pending",
      createdAt: "4h ago",
    },
  ]

  // Filter by scope
  const filteredSituations = situations.filter(s => 
    scope === "operations" ? s.domain === "operations" :
    scope === "sales" ? s.domain === "sales" :
    true
  )

  return NextResponse.json({
    situations: filteredSituations,
    meta: {
      scope,
      total: filteredSituations.length,
      lastUpdated: new Date().toISOString(),
    },
  })
}
