"use client"

import * as React from "react"

import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminApi } from "@/components/admin/use-admin-api"
import type { ServiceHealthMetric } from "@/types/admin"
import { RefreshCw, Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

type ObservabilityResponse = {
  success: boolean
  data: { 
    services: ServiceHealthMetric[]
    total: number
    summary?: {
      healthy: number
      degraded: number
      unhealthy: number
      avgLatencyMs: number
    }
  }
}

export function ObservabilityPage() {
  const { data, loading, error, reload } = useAdminApi<ObservabilityResponse>("/api/admin/observability")
  const services = data?.data.services ?? []
  const summary = data?.data.summary

  type ServiceRow = ServiceHealthMetric & { id: string }
  const rows: ServiceRow[] = React.useMemo(
    () => services.map((s) => ({ ...s, id: s.service })),
    [services]
  )

  const cols: Array<DataTableColumn<ServiceRow>> = [
    { 
      key: "service", 
      header: "Service", 
      render: (s) => (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{s.service}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      className: "w-[140px]",
      render: (s) => (
        <Badge 
          variant={s.status === "healthy" ? "default" : s.status === "degraded" ? "secondary" : "destructive"}
          className="flex items-center gap-1 w-fit"
        >
          {s.status === "healthy" ? <CheckCircle2 className="h-3 w-3" /> : 
           s.status === "degraded" ? <AlertTriangle className="h-3 w-3" /> : 
           <XCircle className="h-3 w-3" />}
          {s.status}
        </Badge>
      ),
    },
    { 
      key: "latencyMs", 
      header: "Latency", 
      className: "w-[110px]", 
      render: (s) => (
        <span className={s.latencyMs > 500 ? "text-amber-600 font-medium" : s.latencyMs > 1000 ? "text-rose-600 font-medium" : ""}>
          {s.latencyMs}ms
        </span>
      )
    },
    { 
      key: "errorRate", 
      header: "Error Rate", 
      className: "w-[110px]", 
      render: (s) => (
        <span className={s.errorRate > 0 ? "text-rose-600 font-medium" : "text-emerald-600"}>
          {(s.errorRate * 100).toFixed(1)}%
        </span>
      )
    },
    { 
      key: "updatedAt", 
      header: "Last Check", 
      className: "w-[180px]", 
      render: (s) => new Date(s.updatedAt).toLocaleTimeString() 
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Admin</p>
          <h1 className="text-2xl font-semibold">Observability & Reliability</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time service health for all 17 deployed Cloudflare Workers.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => reload?.()} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 text-sm">{error}</div> : null}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Total Services</p>
          <p className="text-2xl font-bold mt-2">{loading ? "…" : services.length}</p>
        </Card>
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <p className="text-xs uppercase tracking-widest text-emerald-600">Healthy</p>
          <p className="text-2xl font-bold mt-2 text-emerald-700">
            {loading ? "…" : summary?.healthy ?? services.filter(s => s.status === "healthy").length}
          </p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs uppercase tracking-widest text-amber-600">Degraded</p>
          <p className="text-2xl font-bold mt-2 text-amber-700">
            {loading ? "…" : summary?.degraded ?? services.filter(s => s.status === "degraded").length}
          </p>
        </Card>
        <Card className="p-4 bg-rose-50 border-rose-200">
          <p className="text-xs uppercase tracking-widest text-rose-600">Unhealthy</p>
          <p className="text-2xl font-bold mt-2 text-rose-700">
            {loading ? "…" : summary?.unhealthy ?? services.filter(s => s.status === "down").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Avg Latency</p>
          <p className="text-2xl font-bold mt-2">
            {loading ? "…" : `${summary?.avgLatencyMs ?? Math.round(services.reduce((sum, s) => sum + s.latencyMs, 0) / services.length || 0)}ms`}
          </p>
        </Card>
      </div>

      <DataTable 
        title="Service Health Status" 
        rows={rows} 
        columns={cols}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Recently Deployed</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">integratewise-webhooks</span>
              <Badge variant="outline" className="text-xs">NEW</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">integratewise-billing</span>
              <Badge variant="outline" className="text-xs">NEW</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">View Logs</Button>
            <Button variant="outline" size="sm">Trace Explorer</Button>
            <Button variant="outline" size="sm">Alert Rules</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

