"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Check, RefreshCw, X, ExternalLink, Loader2 } from "lucide-react"

// ── Full connector catalog (static metadata) ─────────────────────────────
const CONNECTOR_CATALOG: {
  provider: string
  name: string
  icon: string
  category: string
  description: string
}[] = [
  { provider: "hubspot", name: "HubSpot", icon: "🎯", category: "CRM", description: "Contacts, deals, companies" },
  { provider: "salesforce", name: "Salesforce", icon: "☁️", category: "CRM", description: "Accounts, contacts, opportunities" },
  { provider: "slack", name: "Slack", icon: "💬", category: "Communication", description: "Channels, messages, users" },
  { provider: "github", name: "GitHub", icon: "🐙", category: "Engineering", description: "Repos, issues, PRs" },
  { provider: "notion", name: "Notion", icon: "📝", category: "Productivity", description: "Pages, databases, blocks" },
  { provider: "google", name: "Google", icon: "📅", category: "Productivity", description: "Gmail, Calendar, Drive" },
  { provider: "stripe", name: "Stripe", icon: "💳", category: "Billing", description: "Payments, subscriptions, invoices" },
  { provider: "linear", name: "Linear", icon: "🔷", category: "Engineering", description: "Issues, projects, cycles" },
  { provider: "jira", name: "Jira", icon: "🔵", category: "Engineering", description: "Issues, sprints, boards" },
  { provider: "zendesk", name: "Zendesk", icon: "🎫", category: "Support", description: "Tickets, users, organizations" },
  { provider: "intercom", name: "Intercom", icon: "💡", category: "Support", description: "Conversations, contacts, companies" },
  { provider: "asana", name: "Asana", icon: "📋", category: "Productivity", description: "Tasks, projects, workspaces" },
]

interface ConnectorStatus {
  provider: string
  status: string
  provider_workspace_name?: string
  last_sync_at?: string
  sync_enabled?: boolean
  sync_error?: string
  metadata?: Record<string, unknown>
}

export default function IntegrationsPage() {
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const fetchConnectors = useCallback(async () => {
    try {
      const res = await fetch("/api/connectors/list")
      if (res.ok) {
        const data = await res.json()
        setConnectors(data.connectors || [])
      }
    } catch (err) {
      console.error("Failed to fetch connectors:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnectors()
  }, [fetchConnectors])

  // Show toast-like message from URL params (after OAuth redirect)
  const connectedProvider = searchParams.get("connected")
  const errorParam = searchParams.get("error")

  const statusMap = new Map(connectors.map((c) => [c.provider, c]))

  const connected = CONNECTOR_CATALOG.filter((c) => statusMap.get(c.provider)?.status === "connected")
  const available = CONNECTOR_CATALOG.filter((c) => statusMap.get(c.provider)?.status !== "connected")

  const handleConnect = (provider: string) => {
    // Redirect to OAuth flow
    window.location.href = `/api/connectors/${provider}/connect`
  }

  const handleDisconnect = async (provider: string) => {
    setActionLoading(provider)
    try {
      await fetch(`/api/connectors/${provider}/disconnect`, { method: "POST" })
      await fetchConnectors()
    } catch (err) {
      console.error("Disconnect failed:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const formatLastSync = (iso?: string) => {
    if (!iso) return "Never"
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    if (diff < 60_000) return "Just now"
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Integrations"
        description="Connect your external tools and data sources"
        stageId="INTEGRATIONS-017"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        }
      />

      {/* Status banner from OAuth redirect */}
      {connectedProvider && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span className="font-medium capitalize">{connectedProvider}</span> connected successfully!
        </div>
      )}
      {errorParam && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
          <X className="w-4 h-4" />
          Connection failed: {errorParam.replace(/_/g, " ")}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading integrations...
        </div>
      ) : (
        <>
          {/* Connected Integrations */}
          {connected.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Connected ({connected.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {connected.map((integration) => {
                  const status = statusMap.get(integration.provider)!
                  const isDisconnecting = actionLoading === integration.provider
                  return (
                    <div key={integration.provider} className="bg-white rounded-xl border border-green-200 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-900">{integration.name}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Connected
                              {status.provider_workspace_name && (
                                <span className="text-gray-400 ml-1">· {status.provider_workspace_name}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnect(integration.provider)}
                          disabled={isDisconnecting}
                          title="Disconnect"
                        >
                          {isDisconnecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Last sync: {formatLastSync(status.last_sync_at)}</span>
                        {status.sync_error && (
                          <span className="text-xs text-red-500 truncate ml-2" title={status.sync_error}>
                            Error
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Available Integrations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Available ({available.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {available.map((integration) => (
                <div
                  key={integration.provider}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#2D7A3E] transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{integration.name}</p>
                      <p className="text-xs text-gray-400">{integration.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{integration.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent group-hover:border-[#2D7A3E] group-hover:text-[#2D7A3E]"
                    onClick={() => handleConnect(integration.provider)}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
