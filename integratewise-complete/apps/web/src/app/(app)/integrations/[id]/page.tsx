"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, RefreshCw, Settings, Clock, Zap, 
  AlertTriangle, Check, Shield, Pause, Play, Trash2,
  Database, Activity, Calendar, Edit2, Save, X,
  ChevronDown, ChevronRight, ExternalLink
} from "lucide-react"

// Maps to connector_entity_sync table
interface EntityConfig {
  entity_sync_id: string // UUID
  entity_type: string
  enabled: boolean
  direction: "inbound" | "outbound" | "bidirectional"
  field_mapping_profile_id?: string // UUID
  lastSync?: string
  recordCount: number
  fields: string[]
}

// Maps to integration_sync_runs table
interface SyncLog {
  sync_run_id: string // UUID
  started_at: string
  ended_at: string
  action: string
  status: "success" | "error" | "warning"
  records_processed: number
  duration_ms: number
}

// Maps to integration_connectors + connector_sync_config + connector_auth_grants
interface ConnectorData {
  connector_id: string // UUID
  connector_key: string
  name: string
  icon: string
  description: string
  status: "connected" | "disconnected" | "error" | "syncing"
  connected_at: string
  last_sync_at: string
  sync_frequency: string
  sync_mode: string
  auto_retry: boolean
  record_count: number
  auth_type: string
  scopes: string[]
  entities: EntityConfig[]
  recentLogs: SyncLog[]
}

// Mock data - would come from API based on connector_id UUID
const connectorRegistry: Record<string, ConnectorData> = {
  "c1a2b3c4-d5e6-7f89-0a1b-2c3d4e5f6789": {
    connector_id: "c1a2b3c4-d5e6-7f89-0a1b-2c3d4e5f6789",
    connector_key: "hubspot",
    name: "HubSpot",
    icon: "🎯",
    description: "CRM, contacts, deals, and marketing automation",
    status: "connected",
    connected_at: "2024-01-15T10:30:00Z",
    last_sync_at: "2024-01-20T14:25:00Z",
    sync_frequency: "realtime",
    sync_mode: "webhook",
    auto_retry: true,
    record_count: 12543,
    auth_type: "OAuth 2.0",
    scopes: ["crm.objects.contacts.read", "crm.objects.companies.read", "crm.objects.deals.read"],
    entities: [
      { entity_sync_id: "es-001-uuid", entity_type: "contacts", enabled: true, direction: "bidirectional", lastSync: "5 min ago", recordCount: 5230, fields: ["email", "firstName", "lastName", "phone", "company", "createdAt"], field_mapping_profile_id: "fmp-001-uuid" },
      { entity_sync_id: "es-002-uuid", entity_type: "companies", enabled: true, direction: "inbound", lastSync: "5 min ago", recordCount: 1245, fields: ["name", "domain", "industry", "size", "revenue"], field_mapping_profile_id: "fmp-002-uuid" },
      { entity_sync_id: "es-003-uuid", entity_type: "deals", enabled: true, direction: "bidirectional", lastSync: "5 min ago", recordCount: 3890, fields: ["name", "amount", "stage", "closeDate", "owner"], field_mapping_profile_id: "fmp-003-uuid" },
      { entity_sync_id: "es-004-uuid", entity_type: "tickets", enabled: false, direction: "inbound", recordCount: 0, fields: ["subject", "status", "priority", "createdAt"] },
      { entity_sync_id: "es-005-uuid", entity_type: "tasks", enabled: false, direction: "inbound", recordCount: 0, fields: ["title", "dueDate", "assignee", "status"] },
    ],
    recentLogs: [
      { sync_run_id: "sr-001-uuid", started_at: "2024-01-20T14:25:00Z", ended_at: "2024-01-20T14:25:12Z", action: "Full sync", status: "success", records_processed: 245, duration_ms: 12000 },
      { sync_run_id: "sr-002-uuid", started_at: "2024-01-20T14:10:00Z", ended_at: "2024-01-20T14:10:00Z", action: "Webhook: Contact updated", status: "success", records_processed: 1, duration_ms: 300 },
      { sync_run_id: "sr-003-uuid", started_at: "2024-01-20T13:55:00Z", ended_at: "2024-01-20T13:55:00Z", action: "Webhook: Deal created", status: "success", records_processed: 1, duration_ms: 200 },
      { sync_run_id: "sr-004-uuid", started_at: "2024-01-20T13:40:00Z", ended_at: "2024-01-20T13:40:03Z", action: "Incremental sync", status: "warning", records_processed: 23, duration_ms: 3000 },
      { sync_run_id: "sr-005-uuid", started_at: "2024-01-20T13:25:00Z", ended_at: "2024-01-20T13:25:08Z", action: "Full sync", status: "success", records_processed: 189, duration_ms: 8000 },
    ],
  }
}

export default function IntegrationSettingsPage() {
  const params = useParams()
  const connectorId = params.id as string // UUID from route
  
  // Lookup connector by UUID — fallback to first for demo
  const connector = connectorRegistry[connectorId] || connectorRegistry["c1a2b3c4-d5e6-7f89-0a1b-2c3d4e5f6789"]
  
  const [entities, setEntities] = useState(connector.entities)
  const [syncFrequency, setSyncFrequency] = useState(connector.sync_frequency)
  const [isPaused, setIsPaused] = useState(false)
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null)

  const toggleEntity = (entitySyncId: string) => {
    setEntities(prev => prev.map(e => 
      e.entity_sync_id === entitySyncId ? { ...e, enabled: !e.enabled } : e
    ))
  }

  const updateSyncDirection = (entitySyncId: string, direction: "inbound" | "outbound" | "bidirectional") => {
    setEntities(prev => prev.map(e => 
      e.entity_sync_id === entitySyncId ? { ...e, direction } : e
    ))
  }

  // Format duration from ms
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <DashboardLayout
      title={`${connector.name} Settings`}
      description={connector.description}
      stageId={`CONNECTOR-${connector.connector_id.slice(0, 8).toUpperCase()}`}
      actions={
        <div className="flex items-center gap-3">
          <Link href="/integrations">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={() => setIsPaused(!isPaused)}
            className={isPaused ? "text-yellow-600 border-yellow-200" : ""}
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? "Resume Sync" : "Pause Sync"}
          </Button>
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
        </div>
      }
    >
      {/* Connector Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">{connector.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{connector.name}</h2>
          <p className="text-sm text-gray-500">connector_id: {connector.connector_id}</p>
        </div>
      </div>
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Status</span>
            {isPaused ? (
              <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            )}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Connected {new Date(connector.connected_at).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Last Sync</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(connector.last_sync_at).toLocaleTimeString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Records</span>
            <Database className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {connector.record_count.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Sync Mode</span>
            <Zap className="w-4 h-4 text-[#2D7A3E]" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {syncFrequency === "realtime" ? "Real-time" : `Every ${syncFrequency} min`}
          </p>
        </div>
      </div>

      {/* Sync Frequency Settings */}
      <Section title="Sync Configuration">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sync Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "realtime", label: "Real-time", desc: "Via webhooks" },
                  { value: "15", label: "15 min", desc: "Polling" },
                  { value: "60", label: "1 hour", desc: "Polling" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSyncFrequency(option.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      syncFrequency === option.value
                        ? 'border-[#2D7A3E] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Auto-retry on failure</p>
                  <p className="text-xs text-gray-500">Retry failed syncs up to 3 times</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" aria-label="Auto-retry on failure" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Connection Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Auth Type</span>
                <span className="font-medium text-gray-900">{connector.auth_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Connected</span>
                <span className="font-medium text-gray-900">
                  {new Date(connector.connected_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Scopes</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {connector.scopes.map((scope: string) => (
                    <Badge key={scope} variant="outline" className="text-xs font-mono">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Re-authenticate
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Entity Configuration */}
      <Section title="Entity Sync Settings">
        <div className="space-y-4">
          {entities.map((entity) => (
            <div 
              key={entity.entity_sync_id}
              className={`border rounded-xl overflow-hidden transition-all ${
                entity.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
              }`}
            >
              {/* Entity Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={entity.enabled}
                      onChange={() => toggleEntity(entity.entity_sync_id)}
                      className="sr-only peer"
                      aria-label={`Enable ${entity.entity_type} sync`}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
                  </label>
                  <div>
                    <p className={`font-semibold capitalize ${entity.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {entity.entity_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entity.enabled 
                        ? `${entity.recordCount.toLocaleString()} records • Last sync: ${entity.lastSync}`
                        : "Disabled"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {entity.enabled && (
                    <>
                      <select
                        value={entity.direction}
                        onChange={(e) => updateSyncDirection(entity.entity_sync_id, e.target.value as EntityConfig["direction"])}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                        title={`${entity.entity_type} sync direction`}
                      >
                        <option value="inbound">← Inbound only</option>
                        <option value="outbound">→ Outbound only</option>
                        <option value="bidirectional">↔ Bidirectional</option>
                      </select>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setExpandedEntity(expandedEntity === entity.entity_sync_id ? null : entity.entity_sync_id)}
                      >
                        {expandedEntity === entity.entity_sync_id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded Field Mapping */}
              {expandedEntity === entity.entity_sync_id && entity.enabled && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Synced Fields</p>
                  <div className="flex flex-wrap gap-2">
                    {entity.fields.map((field) => (
                      <Badge key={field} variant="outline" className="text-xs capitalize bg-white">
                        {field}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-3 h-3 mr-2" />
                      Configure Field Mapping
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Recent Sync Activity */}
      <Section title="Recent Sync Activity">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Records</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {connector.recentLogs.map((log) => (
                <tr key={log.sync_run_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(log.started_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.action}</td>
                  <td className="px-4 py-3">
                    {log.status === "success" && (
                      <Badge className="bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    )}
                    {log.status === "warning" && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Warning
                      </Badge>
                    )}
                    {log.status === "error" && (
                      <Badge className="bg-red-100 text-red-700">
                        <X className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.records_processed}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDuration(log.duration_ms)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800">Disconnect Integration</h3>
              <p className="text-sm text-red-600 mt-1">
                This will remove all synced data and stop future syncs. This action cannot be undone.
              </p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100">
              <Trash2 className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </Section>
    </DashboardLayout>
  )
}
