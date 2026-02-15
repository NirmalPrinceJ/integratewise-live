/**
 * Accounts View - Company/Account Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Building2,
  Plus,
  DollarSign,
  Users,
  MapPin,
  Globe,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from "lucide-react"

const mockAccounts = [
  {
    id: "acc-001",
    name: "Acme Corporation",
    industry: "Technology",
    size: "Enterprise",
    employees: 5000,
    revenue: 2500000,
    location: "San Francisco, CA",
    website: "acmecorp.com",
    contacts: 12,
    deals: 3,
    health: "healthy",
    owner: "Sarah Chen"
  },
  {
    id: "acc-002",
    name: "TechStart Inc",
    industry: "SaaS",
    size: "Mid-Market",
    employees: 250,
    revenue: 450000,
    location: "Austin, TX",
    website: "techstart.io",
    contacts: 5,
    deals: 2,
    health: "at-risk",
    owner: "Mike Johnson"
  },
  {
    id: "acc-003",
    name: "Global Systems Ltd",
    industry: "Manufacturing",
    size: "Enterprise",
    employees: 12000,
    revenue: 5200000,
    location: "Chicago, IL",
    website: "globalsystems.com",
    contacts: 24,
    deals: 5,
    health: "healthy",
    owner: "Lisa Park"
  },
  {
    id: "acc-004",
    name: "InnovateTech",
    industry: "Technology",
    size: "SMB",
    employees: 50,
    revenue: 125000,
    location: "Boston, MA",
    website: "innovatetech.co",
    contacts: 3,
    deals: 1,
    health: "churned",
    owner: "David Lee"
  },
]

const kpis: KPIItem[] = [
  { label: "Total Accounts", value: "156", color: "primary" },
  { label: "Total Revenue", value: "$8.4M", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Healthy", value: "112", color: "green", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "At Risk", value: "23", color: "yellow", icon: <TrendingDown className="w-4 h-4" /> },
]

function HealthBadge({ health }: { health: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    healthy: { bg: "bg-green-100", text: "text-green-700" },
    "at-risk": { bg: "bg-yellow-100", text: "text-yellow-700" },
    churned: { bg: "bg-red-100", text: "text-red-700" },
  }
  const { bg, text } = config[health] || config.healthy
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text} capitalize`}>
      {health.replace("-", " ")}
    </span>
  )
}

function SizeBadge({ size }: { size: string }) {
  const config: Record<string, string> = {
    Enterprise: "bg-purple-50 text-purple-700 border-purple-200",
    "Mid-Market": "bg-blue-50 text-blue-700 border-blue-200",
    SMB: "bg-gray-50 text-gray-700 border-gray-200",
  }
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${config[size]}`}>
      {size}
    </span>
  )
}

export function AccountsView() {
  const [accounts] = useState(mockAccounts)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = accounts.find(a => a.id === selectedAccount)

  return (
    <ListPageTemplate
      title="Accounts"
      description="Manage your company accounts"
      stageId="SALES-ACCOUNTS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Accounts" }
      ]}
      kpis={kpis}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Company Name</h4>
            <p className="text-gray-900 font-medium">{selected.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Industry</h4>
              <p className="text-gray-900">{selected.industry}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Size</h4>
              <SizeBadge size={selected.size} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Employees</h4>
              <p className="text-gray-900">{selected.employees.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Revenue</h4>
              <p className="text-gray-900 font-semibold">${(selected.revenue / 1000).toFixed(0)}K</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Health</h4>
            <HealthBadge health={selected.health} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
            <p className="text-gray-900 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              {selected.location}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
            <a href={`https://${selected.website}`} className="text-[#2D7A3E] hover:underline flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {selected.website}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Contacts</h4>
              <p className="text-gray-900">{selected.contacts}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Open Deals</h4>
              <p className="text-gray-900">{selected.deals}</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center justify-center gap-2">
              View Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Account Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={accounts.length === 0}
      emptyState={{
        icon: <Building2 className="w-12 h-12" />,
        title: "No Accounts Yet",
        description: "Add your first account to start tracking companies.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Add First Account
          </button>
        )
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Account</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Industry</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Size</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Revenue</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Health</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Owner</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr 
                key={account.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedAccount(account.id)
                  setRightPanelOpen(true)
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.contacts} contacts • {account.deals} deals</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.industry}</td>
                <td className="px-4 py-3"><SizeBadge size={account.size} /></td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${(account.revenue / 1000).toFixed(0)}K</td>
                <td className="px-4 py-3"><HealthBadge health={account.health} /></td>
                <td className="px-4 py-3 text-sm text-gray-600">{account.owner}</td>
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

export default AccountsView
