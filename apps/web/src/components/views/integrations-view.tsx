/**
 * Integrations View - Connector Status & Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Plug,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Zap,
  Database,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  Users,
  MessageSquare
} from "lucide-react"

// Mock data - replace with API calls
const mockIntegrations = [
  {
    id: "int-001",
    name: "Salesforce",
    type: "crm",
    status: "connected",
    lastSync: "2024-01-15T14:30:00Z",
    recordsSync: 12453,
    error: null,
    icon: "salesforce"
  },
  {
    id: "int-002",
    name: "Google Workspace",
    type: "productivity",
    status: "connected",
    lastSync: "2024-01-15T14:25:00Z",
    recordsSync: 8921,
    error: null,
    icon: "google"
  },
  {
    id: "int-003",
    name: "Stripe",
    type: "billing",
    status: "connected",
    lastSync: "2024-01-15T14:00:00Z",
    recordsSync: 3421,
    error: null,
    icon: "stripe"
  },
  {
    id: "int-004",
    name: "Slack",
    type: "communication",
    status: "error",
    lastSync: "2024-01-14T10:00:00Z",
    recordsSync: 0,
    error: "Authentication expired",
    icon: "slack"
  },
  {
    id: "int-005",
    name: "HubSpot",
    type: "marketing",
    status: "pending",
    lastSync: null,
    recordsSync: 0,
    error: null,
    icon: "hubspot"
  },
]

const availableIntegrations = [
  { name: "Intercom", type: "support", icon: MessageSquare },
  { name: "Zendesk", type: "support", icon: Users },
  { name: "Notion", type: "productivity", icon: FileText },
  { name: "QuickBooks", type: "finance", icon: DollarSign },
]

const kpis: KPIItem[] = [
  { label: "Connected", value: "3", color: "green", icon: <CheckCircle className="w-4 h-4" /> },
  { label: "Pending", value: "1", color: "yellow", icon: <Clock className="w-4 h-4" /> },
  { label: "Errors", value: "1", color: "red", icon: <XCircle className="w-4 h-4" /> },
  { label: "Records Synced", value: "24.8K", icon: <Database className="w-4 h-4" /> },
]

function StatusBadge({ status }: { status: string }) {
  const config = {
    connected: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    error: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    syncing: { bg: "bg-blue-100", text: "text-blue-700", icon: RefreshCw },
  }
  const { bg, text, icon: Icon } = config[status as keyof typeof config] || config.pending
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className={`w-3 h-3 ${status === 'syncing' ? 'animate-spin' : ''}`} />
      {status}
    </span>
  )
}

const typeIcons: Record<string, any> = {
  crm: Users,
  productivity: FileText,
  billing: DollarSign,
  communication: MessageSquare,
  marketing: Mail,
}

export function IntegrationsView() {
  const [integrations] = useState(mockIntegrations)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = integrations.find(i => i.id === selectedIntegration)

  return (
    <UnifiedPageTemplate
      title="Integrations"
      description="Manage connected data sources and third-party integrations"
      stageId="OPS-INTEGRATIONS-001"
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Integrations" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Integration</h4>
            <p className="text-gray-900">{selected.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
            <p className="text-gray-900 capitalize">{selected.type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <StatusBadge status={selected.status} />
          </div>
          {selected.lastSync && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Last Sync</h4>
              <p className="text-gray-900">{new Date(selected.lastSync).toLocaleString()}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Records Synced</h4>
            <p className="text-gray-900">{selected.recordsSync.toLocaleString()}</p>
          </div>
          {selected.error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Error</p>
                  <p className="text-sm text-red-600">{selected.error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync Now
            </button>
            <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Integration Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={integrations.length === 0}
      emptyState={{
        icon: <Plug className="w-12 h-12" />,
        title: "No Integrations Yet",
        description: "Connect your first data source to start syncing data.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Add First Integration
          </button>
        )
      }}
    >
      <div className="space-y-6">
        {/* Connected Integrations */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Connected Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => {
              const TypeIcon = typeIcons[integration.type] || Plug
              return (
                <div
                  key={integration.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedIntegration(integration.id)
                    setRightPanelOpen(true)
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{integration.type}</p>
                      </div>
                    </div>
                    <StatusBadge status={integration.status} />
                  </div>
                  
                  {integration.error && (
                    <div className="p-2 bg-red-50 rounded-lg mb-3">
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {integration.error}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {integration.recordsSync.toLocaleString()} records
                    </span>
                    {integration.lastSync && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(integration.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Available Integrations */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableIntegrations.map((integration, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-dashed border-gray-300 p-4 hover:border-[#2D7A3E] hover:bg-[#2D7A3E]/5 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#2D7A3E]/10">
                      <integration.icon className="w-5 h-5 text-gray-400 group-hover:text-[#2D7A3E]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{integration.type}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2D7A3E]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnifiedPageTemplate>
  )
}

export default IntegrationsView
