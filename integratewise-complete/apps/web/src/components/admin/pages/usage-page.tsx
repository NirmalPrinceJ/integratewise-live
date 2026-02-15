"use client"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { useAdminApi } from "@/components/admin/use-admin-api"
import { UsageMeter } from "@/components/paywall/UsageMeter"
import { FeatureGate } from "@/components/paywall/FeatureGate"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, AlertTriangle, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTenant } from "@/contexts/tenant-context"

type UsageMetric = {
  key: string
  label: string
  current: number
  limit: number | null
  trend: number // percentage change from last period
  unit?: string
}

type UsageHistoryRow = {
  id: string
  date: string
  aiSessions: number
  apiCalls: number
  storageDelta: number
}

type UsageAlert = {
  id: string
  metric: string
  message: string
  severity: "warning" | "critical"
  timestamp: string
}

type UsageResponse = {
  success: boolean
  data: {
    period: string
    metrics: UsageMetric[]
    history: UsageHistoryRow[]
    alerts: UsageAlert[]
  }
}

// Mock data generator for development
function generateMockUsageData(): UsageResponse {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return {
    success: true,
    data: {
      period: periodStart.toISOString().split("T")[0],
      metrics: [
        { key: "ai.sessions", label: "AI Sessions", current: 7500, limit: 10000, trend: 12, unit: "sessions" },
        { key: "connectors.count", label: "Integrations", current: 8, limit: 15, trend: 0, unit: "active" },
        { key: "storageGb", label: "Storage", current: 28, limit: 50, trend: 5, unit: "GB" },
        { key: "apiCalls", label: "API Calls", current: 45000, limit: 100000, trend: -3, unit: "calls" },
      ],
      history: Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          id: `day-${i}`,
          date: date.toISOString().split("T")[0],
          aiSessions: Math.floor(Math.random() * 500) + 800,
          apiCalls: Math.floor(Math.random() * 5000) + 5000,
          storageDelta: Math.random() > 0.5 ? Math.random() * 2 : -Math.random() * 0.5,
        }
      }).reverse(),
      alerts: [
        {
          id: "alert-1",
          metric: "AI Sessions",
          message: "AI sessions at 75% of monthly limit",
          severity: "warning",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  }
}

export function AdminUsagePage() {
  const { plan } = useTenant()
  const [selectedPeriod, setSelectedPeriod] = React.useState("current")
  
  // In production, this would fetch from /api/admin/usage
  // For now, use mock data
  const { data, loading, error } = useAdminApi<UsageResponse>("/api/admin/usage")
  const mockData = React.useMemo(() => generateMockUsageData(), [])
  const usageData = data?.data ?? mockData.data

  const historyColumns: DataTableColumn<UsageHistoryRow>[] = [
    { key: "date", header: "Date", render: (row) => row.date },
    { key: "aiSessions", header: "AI Sessions", render: (row) => row.aiSessions.toLocaleString() },
    { key: "apiCalls", header: "API Calls", render: (row) => row.apiCalls.toLocaleString() },
    {
      key: "storageDelta",
      header: "Storage Δ",
      render: (row) => (
        <span className={cn(row.storageDelta >= 0 ? "text-green-600" : "text-red-600")}>
          {row.storageDelta >= 0 ? "+" : ""}{row.storageDelta.toFixed(2)} GB
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Admin</p>
          <h1 className="text-2xl font-semibold">Usage & Metering</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor resource consumption and manage limits.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="last">Last Month</SelectItem>
              <SelectItem value="last3">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 text-sm">{error}</div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {usageData.metrics.map((metric) => {
          const percentage = metric.limit ? (metric.current / metric.limit) * 100 : 0

          return (
            <Card key={metric.key}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  <span>{metric.label}</span>
                  {metric.trend !== 0 && (
                    <span className={cn("flex items-center text-xs", metric.trend > 0 ? "text-green-600" : "text-red-600")}>
                      {metric.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(metric.trend)}%
                    </span>
                  )}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {metric.current.toLocaleString()}
                  {metric.unit && <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UsageMeter
                  metricKey={metric.key}
                  label=""
                  compact
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {metric.limit ? `${metric.limit.toLocaleString()} limit` : "Unlimited"}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usage History</CardTitle>
              <CardDescription>Daily usage breakdown for the selected period</CardDescription>
            </div>
            <FeatureGate featureKey="surfaces.audit" variant="inline">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </FeatureGate>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            title=""
            rows={usageData.history}
            columns={historyColumns}
          />
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <FeatureGate featureKey="surfaces.audit" variant="inline">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Usage Alerts
            </CardTitle>
            <CardDescription>Notifications about usage thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            {usageData.alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active alerts</p>
            ) : (
              <div className="space-y-3">
                {usageData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3",
                      alert.severity === "critical" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                        {alert.severity}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{alert.metric}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FeatureGate>
    </div>
  )
}
