/**
 * Leads View - Lead Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  UserPlus,
  Plus,
  Mail,
  Phone,
  Building2,
  Calendar,
  MoreHorizontal,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

const mockLeads = [
  {
    id: "lead-001",
    name: "John Smith",
    email: "john@acmecorp.com",
    company: "Acme Corp",
    title: "VP of Sales",
    source: "Website",
    status: "new",
    score: 85,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "lead-002",
    name: "Emily Johnson",
    email: "emily@techstart.io",
    company: "TechStart",
    title: "CTO",
    source: "LinkedIn",
    status: "qualified",
    score: 92,
    created_at: "2024-01-14T14:30:00Z"
  },
  {
    id: "lead-003",
    name: "Michael Chen",
    email: "m.chen@globaltech.com",
    company: "GlobalTech",
    title: "Head of Operations",
    source: "Referral",
    status: "contacted",
    score: 67,
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: "lead-004",
    name: "Sarah Williams",
    email: "sarah@innovate.co",
    company: "Innovate Co",
    title: "CEO",
    source: "Conference",
    status: "unqualified",
    score: 23,
    created_at: "2024-01-12T16:45:00Z"
  },
]

const kpis: KPIItem[] = [
  { label: "Total Leads", value: "234", change: "+18 this week", changeType: "positive" },
  { label: "New Today", value: "12", color: "blue" },
  { label: "Qualified", value: "45", color: "green" },
  { label: "Conversion Rate", value: "24%", change: "+3% vs last month", changeType: "positive" },
]

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    new: { bg: "bg-blue-100", text: "text-blue-700", icon: Star },
    contacted: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    qualified: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    unqualified: { bg: "bg-gray-100", text: "text-gray-600", icon: XCircle },
  }
  const { bg, text, icon: Icon } = config[status] || config.new
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

function LeadScore({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"
  const bg = score >= 80 ? "bg-green-50" : score >= 50 ? "bg-yellow-50" : "bg-red-50"
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color} ${bg}`}>
      {score}
    </span>
  )
}

export function LeadsView() {
  const [leads] = useState(mockLeads)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = leads.find(l => l.id === selectedLead)

  return (
    <ListPageTemplate
      title="Leads"
      description="Track and qualify incoming leads"
      stageId="SALES-LEADS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Leads" }
      ]}
      kpis={kpis}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
            <p className="text-gray-900 font-medium">{selected.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
            <p className="text-gray-900">{selected.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
            <p className="text-gray-900">{selected.company}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Title</h4>
            <p className="text-gray-900">{selected.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Score</h4>
              <LeadScore score={selected.score} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Source</h4>
            <p className="text-gray-900">{selected.source}</p>
          </div>
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
            <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center justify-center gap-2">
              Convert to Deal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Lead Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={leads.length === 0}
      emptyState={{
        icon: <UserPlus className="w-12 h-12" />,
        title: "No Leads Yet",
        description: "Add your first lead to start tracking prospects.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Add First Lead
          </button>
        )
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Lead</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Company</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Score</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Source</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Created</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr 
                key={lead.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedLead(lead.id)
                  setRightPanelOpen(true)
                }}
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{lead.company}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3"><LeadScore score={lead.score} /></td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.source}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

export default LeadsView
