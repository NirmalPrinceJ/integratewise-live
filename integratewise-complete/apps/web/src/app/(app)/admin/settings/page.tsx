"use client"

import { useState } from "react"
import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Shield, Key, Lock, Globe, Server, Database,
  RefreshCw, Clock, Zap, AlertTriangle, CheckCircle2,
  Settings, Eye, EyeOff, RotateCcw, Activity, Gauge,
  Radio, Timer, Repeat, Fingerprint, FileKey, ShieldCheck
} from "lucide-react"
import { ProtectedPage } from "@/components/ProtectedPage"

// Security policies
const securityPolicies = {
  webhookSignatureVerification: true,
  rateLimitingEnabled: true,
  ipWhitelisting: false,
  forceHttps: true,
  corsStrictMode: true,
  apiKeyRotation: 90, // days
  sessionTimeout: 24, // hours
  mfaRequired: "admin", // "all" | "admin" | "none"
}

// Polling strategies
const pollingConfigs = [
  { provider: "HubSpot", strategy: "exponential", baseInterval: 15, maxInterval: 60, enabled: true },
  { provider: "Salesforce", strategy: "fixed", baseInterval: 30, maxInterval: 30, enabled: true },
  { provider: "Zendesk", strategy: "adaptive", baseInterval: 5, maxInterval: 30, enabled: true },
  { provider: "Stripe", strategy: "webhook", baseInterval: 0, maxInterval: 0, enabled: false },
  { provider: "Slack", strategy: "realtime", baseInterval: 0, maxInterval: 0, enabled: false },
]

// Sync frequencies
const syncConfigs = [
  { entity: "Contacts", defaultFreq: "15min", priority: "high", lastSync: "2 min ago" },
  { entity: "Deals", defaultFreq: "15min", priority: "high", lastSync: "2 min ago" },
  { entity: "Tickets", defaultFreq: "5min", priority: "critical", lastSync: "1 min ago" },
  { entity: "Invoices", defaultFreq: "1hour", priority: "medium", lastSync: "45 min ago" },
  { entity: "Users", defaultFreq: "1hour", priority: "low", lastSync: "30 min ago" },
  { entity: "Activities", defaultFreq: "realtime", priority: "high", lastSync: "live" },
]

export default function AdminSettingsPage() {
  const [policies, setPolicies] = useState(securityPolicies)
  const [showSecrets, setShowSecrets] = useState(false)

  return (
    <ProtectedPage featureKey="admin.settings">
    <DashboardLayout
      title="System Settings"
      description="Global security, polling, and sync configuration for all tenants"
      stageId="ADMIN-SETTINGS-001"
      actions={
        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
          <RefreshCw className="w-4 h-4 mr-2" />
          Apply Changes
        </Button>
      }
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Security Score</span>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">94/100</p>
          <p className="text-xs text-gray-400 mt-1">All critical policies active</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Active Pollers</span>
            <Radio className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">3/5</p>
          <p className="text-xs text-gray-400 mt-1">2 using webhooks instead</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Sync Entities</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{syncConfigs.length}</p>
          <p className="text-xs text-gray-400 mt-1">All syncing normally</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">API Requests (24h)</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">124K</p>
          <p className="text-xs text-gray-400 mt-1">Within rate limits</p>
        </Card>
      </div>

      {/* Security Settings */}
      <Section title="Security & Authentication" className="mt-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Webhook Signature Verification</p>
                  <p className="text-xs text-gray-500">Validate HMAC signatures on all incoming webhooks</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={policies.webhookSignatureVerification}
                  onChange={(e) => setPolicies({ ...policies, webhookSignatureVerification: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle webhook signature verification"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Rate Limiting</p>
                  <p className="text-xs text-gray-500">1000 req/min per tenant, 100 req/min per IP</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={policies.rateLimitingEnabled}
                  onChange={(e) => setPolicies({ ...policies, rateLimitingEnabled: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle rate limiting"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">CORS Strict Mode</p>
                  <p className="text-xs text-gray-500">Only allow requests from verified origins</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={policies.corsStrictMode}
                  onChange={(e) => setPolicies({ ...policies, corsStrictMode: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle CORS strict mode"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">IP Whitelisting</p>
                  <p className="text-xs text-yellow-700">Restrict API access to specific IPs</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={policies.ipWhitelisting}
                  onChange={(e) => setPolicies({ ...policies, ipWhitelisting: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Toggle IP whitelisting"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>
          </div>

          {/* Right Column - Configuration */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-gray-400" />
                <p className="font-medium text-gray-900">API Key Rotation</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Rotation Period</label>
                  <select 
                    className="w-full mt-1 p-2 border border-gray-200 rounded text-sm"
                    value={policies.apiKeyRotation}
                    onChange={(e) => setPolicies({ ...policies, apiKeyRotation: parseInt(e.target.value) })}
                    title="API Key Rotation Period"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">MFA Requirement</label>
                  <select 
                    className="w-full mt-1 p-2 border border-gray-200 rounded text-sm"
                    value={policies.mfaRequired}
                    onChange={(e) => setPolicies({ ...policies, mfaRequired: e.target.value })}
                    title="MFA Requirement"
                  >
                    <option value="none">None</option>
                    <option value="admin">Admin only</option>
                    <option value="all">All users</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <p className="font-medium text-gray-900">Session Management</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Session Timeout</label>
                  <select 
                    className="w-full mt-1 p-2 border border-gray-200 rounded text-sm"
                    value={policies.sessionTimeout}
                    onChange={(e) => setPolicies({ ...policies, sessionTimeout: parseInt(e.target.value) })}
                    title="Session Timeout"
                  >
                    <option value="1">1 hour</option>
                    <option value="8">8 hours</option>
                    <option value="24">24 hours</option>
                    <option value="168">7 days</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Idle Timeout</label>
                  <select 
                    className="w-full mt-1 p-2 border border-gray-200 rounded text-sm"
                    defaultValue="30"
                    title="Idle Timeout"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileKey className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Signing Keys</p>
                    <p className="text-xs text-green-700">Last rotated: 14 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
                  {showSecrets ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showSecrets ? "Hide" : "View"}
                </Button>
              </div>
              {showSecrets && (
                <div className="mt-3 p-2 bg-white rounded border border-green-200">
                  <code className="text-xs text-gray-600 break-all">
                    whsec_live_7f8d9e0a1b2c3d4e5f6g7h8i9j0k1l2m...
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Polling Strategy Configuration */}
      <Section title="Polling Strategy" className="mt-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Provider</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Strategy</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Base Interval</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Max Interval</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pollingConfigs.map((config) => (
                <tr key={config.provider} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{config.provider}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      config.strategy === "webhook" ? "default" :
                      config.strategy === "realtime" ? "default" :
                      config.strategy === "exponential" ? "secondary" :
                      "outline"
                    } className={
                      config.strategy === "webhook" ? "bg-green-100 text-green-700" :
                      config.strategy === "realtime" ? "bg-blue-100 text-blue-700" :
                      ""
                    }>
                      {config.strategy}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {config.baseInterval > 0 ? `${config.baseInterval} min` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {config.maxInterval > 0 ? `${config.maxInterval} min` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {config.enabled ? (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Radio className="w-3 h-3 animate-pulse" />
                        Polling
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600">
                        <Zap className="w-3 h-3" />
                        Instant
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Polling Strategy Guide</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1 ml-6 list-disc">
            <li><strong>Exponential:</strong> Backs off on errors (15→30→60 min), recovers on success</li>
            <li><strong>Fixed:</strong> Consistent interval regardless of errors</li>
            <li><strong>Adaptive:</strong> Adjusts based on data volume (more changes = faster polling)</li>
            <li><strong>Webhook/Realtime:</strong> No polling needed - data pushed instantly</li>
          </ul>
        </div>
      </Section>

      {/* Sync Frequency Settings */}
      <Section title="Sync Frequency by Entity" className="mt-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Entity Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Default Frequency</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Last Sync</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {syncConfigs.map((config) => (
                <tr key={config.entity} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{config.entity}</td>
                  <td className="px-4 py-3">
                    <select 
                      className="p-1 border border-gray-200 rounded text-sm"
                      defaultValue={config.defaultFreq}
                      title={`Sync frequency for ${config.entity}`}
                    >
                      <option value="realtime">Real-time</option>
                      <option value="5min">5 minutes</option>
                      <option value="15min">15 minutes</option>
                      <option value="1hour">1 hour</option>
                      <option value="daily">Daily</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      config.priority === "critical" ? "destructive" :
                      config.priority === "high" ? "default" :
                      config.priority === "medium" ? "secondary" :
                      "outline"
                    }>
                      {config.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {config.lastSync === "live" ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Activity className="w-3 h-3 animate-pulse" />
                        Live
                      </span>
                    ) : config.lastSync}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Real-time Entities</span>
            </div>
            <p className="text-2xl font-bold text-green-600">1</p>
            <p className="text-xs text-green-700">Via webhooks</p>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Scheduled Syncs</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-xs text-blue-700">5min to 1hr intervals</p>
          </Card>
          <Card className="p-4 bg-purple-50 border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Sync Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">99.7%</p>
            <p className="text-xs text-purple-700">Last 24 hours</p>
          </Card>
        </div>
      </Section>

      {/* Global Retry Configuration */}
      <Section title="Global Retry & Error Handling" className="mt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Retry Policy</p>
                <p className="text-xs text-gray-500">Configure automatic retry behavior</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Max Retries</label>
                <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="5" title="Max Retries">
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
                  <option value="fibonacci">Fibonacci</option>
                  <option value="fixed">Fixed Interval</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Circuit Breaker</p>
                <p className="text-xs text-gray-500">Protect against cascading failures</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Failure Threshold</label>
                <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="5" title="Failure Threshold">
                  <option value="3">3 failures</option>
                  <option value="5">5 failures</option>
                  <option value="10">10 failures</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Reset Timeout</label>
                <select className="w-full mt-1 p-2 border border-gray-200 rounded text-sm" defaultValue="60" title="Reset Timeout">
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DashboardLayout>
    </ProtectedPage>
  )
}
