"use client"

import { useState } from "react"
import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Webhook, Plus, Copy, Eye, EyeOff, RefreshCw, Trash2,
  CheckCircle2, XCircle, Clock, AlertTriangle, Settings,
  Shield, Key, Activity, ArrowUpRight, Filter, Search,
  RotateCcw, Pause, Play, ChevronDown, ExternalLink
} from "lucide-react"
import { ProtectedPage } from "@/components/ProtectedPage"

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  source: string
  sourceIcon: string
  events: string[]
  status: "active" | "paused" | "error"
  lastReceived: string
  successRate: number
  secret: string
  createdAt: string
}

const webhooks: WebhookEndpoint[] = [
  {
    id: "wh_1",
    name: "HubSpot Contacts",
    url: "https://api.integratewise.io/v1/webhooks/hubspot",
    source: "HubSpot",
    sourceIcon: "🎯",
    events: ["contact.created", "contact.updated", "contact.deleted"],
    status: "active",
    lastReceived: "2 minutes ago",
    successRate: 99.8,
    secret: "whsec_abc123xyz789...",
    createdAt: "2025-12-01"
  },
  {
    id: "wh_2",
    name: "Stripe Payments",
    url: "https://api.integratewise.io/v1/webhooks/stripe",
    source: "Stripe",
    sourceIcon: "💳",
    events: ["payment_intent.succeeded", "invoice.paid", "subscription.updated"],
    status: "active",
    lastReceived: "5 minutes ago",
    successRate: 100,
    secret: "whsec_stripe456...",
    createdAt: "2025-11-15"
  },
  {
    id: "wh_3",
    name: "Zendesk Tickets",
    url: "https://api.integratewise.io/v1/webhooks/zendesk",
    source: "Zendesk",
    sourceIcon: "💬",
    events: ["ticket.created", "ticket.updated", "ticket.solved"],
    status: "error",
    lastReceived: "1 hour ago",
    successRate: 87.5,
    secret: "whsec_zendesk789...",
    createdAt: "2026-01-05"
  },
  {
    id: "wh_4",
    name: "Slack Events",
    url: "https://api.integratewise.io/v1/webhooks/slack",
    source: "Slack",
    sourceIcon: "💬",
    events: ["message.channels", "member_joined_channel"],
    status: "paused",
    lastReceived: "3 days ago",
    successRate: 98.2,
    secret: "whsec_slack012...",
    createdAt: "2025-10-20"
  },
]

const recentEvents = [
  { id: 1, webhook: "HubSpot Contacts", event: "contact.updated", status: "success", time: "2 min ago", payload: "312 bytes" },
  { id: 2, webhook: "Stripe Payments", event: "payment_intent.succeeded", status: "success", time: "5 min ago", payload: "1.2 KB" },
  { id: 3, webhook: "Zendesk Tickets", event: "ticket.created", status: "failed", time: "1 hr ago", payload: "856 bytes", error: "Timeout" },
  { id: 4, webhook: "HubSpot Contacts", event: "contact.created", status: "success", time: "1 hr ago", payload: "428 bytes" },
  { id: 5, webhook: "Stripe Payments", event: "invoice.paid", status: "success", time: "2 hr ago", payload: "2.1 KB" },
]

export default function WebhooksPage() {
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null)
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <ProtectedPage featureKey="admin.webhooks">
    <DashboardLayout
      title="Webhooks"
      description="Manage webhook endpoints for Flow A (Gateway → Normalizer → Spine)"
      stageId="ADMIN-WEBHOOKS-001"
      actions={
        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
          <Plus className="w-4 h-4 mr-2" />
          New Endpoint
        </Button>
      }
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Active Endpoints</span>
            <Webhook className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{webhooks.filter(w => w.status === "active").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Events Today</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">98.7%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Failed (24h)</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">16</p>
        </div>
      </div>

      {/* Webhook Endpoints */}
      <Section title="Webhook Endpoints">
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div 
              key={webhook.id}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                selectedWebhook?.id === webhook.id 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => setSelectedWebhook(selectedWebhook?.id === webhook.id ? null : webhook)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{webhook.sourceIcon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                      <Badge className={
                        webhook.status === "active" 
                          ? "bg-green-100 text-green-700"
                          : webhook.status === "paused"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }>
                        {webhook.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 font-mono mt-1">{webhook.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last event: {webhook.lastReceived}</p>
                    <p className="text-xs text-gray-400">Success rate: {webhook.successRate}%</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedWebhook?.id === webhook.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedWebhook?.id === webhook.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-6" onClick={(e) => e.stopPropagation()}>
                  {/* Subscribed Events */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Subscribed Events</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="font-mono text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Signing Secret */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Signing Secret</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-100 rounded font-mono text-sm">
                        {showSecret[webhook.id] ? webhook.secret : "•".repeat(24)}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowSecret({ ...showSecret, [webhook.id]: !showSecret[webhook.id] })}
                      >
                        {showSecret[webhook.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(webhook.secret)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-orange-600">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retry Failed
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {webhook.status === "active" ? (
                        <Button variant="outline" size="sm" className="text-yellow-600">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : webhook.status === "paused" ? (
                        <Button variant="outline" size="sm" className="text-green-600">
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      ) : null}
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Recent Events */}
      <Section title="Recent Events">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            View All Logs
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Webhook</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Event</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Payload</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {event.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-500">{event.error}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{event.webhook}</td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">{event.event}</code>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{event.payload}</td>
                  <td className="px-4 py-3 text-gray-500">{event.time}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Configuration */}
      <Section title="Global Settings">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Signature Verification</p>
                  <p className="text-xs text-gray-500">Validate webhook signatures</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Idempotency Check</p>
                  <p className="text-xs text-gray-500">Prevent duplicate event processing</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Retry Policy</p>
                  <p className="text-xs text-gray-500">Automatic retry on failure</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Max Retries</label>
                  <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="3" title="Max Retries">
                    <option value="1">1 retry</option>
                    <option value="3">3 retries</option>
                    <option value="5">5 retries</option>
                    <option value="10">10 retries</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Backoff Strategy</label>
                  <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="exponential" title="Backoff Strategy">
                    <option value="linear">Linear</option>
                    <option value="exponential">Exponential</option>
                    <option value="fixed">Fixed Interval</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Timeout Settings</p>
                  <p className="text-xs text-gray-500">Request timeout configuration</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Request Timeout</label>
                  <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="30" title="Request Timeout">
                    <option value="10">10 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                    <option value="120">120 seconds</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Idle Timeout</label>
                  <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="300" title="Idle Timeout">
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                    <option value="600">10 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Dead Letter Queue */}
      <Section>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Dead Letter Queue</p>
                <p className="text-sm text-yellow-700">16 events failed after max retries</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View DLQ
              </Button>
              <Button variant="outline" size="sm" className="text-yellow-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry All
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </DashboardLayout>
    </ProtectedPage>
  )
}
