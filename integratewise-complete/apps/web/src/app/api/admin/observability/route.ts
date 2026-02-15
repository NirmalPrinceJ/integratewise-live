import { NextResponse } from "next/server"
import type { ServiceHealthMetric } from "@/types/admin"

// All deployed services
const SERVICE_ENDPOINTS = [
  { name: "gateway", url: "https://integratewise-gateway.connect-a1b.workers.dev" },
  { name: "iq-hub", url: "https://integratewise-iq-hub.connect-a1b.workers.dev" },
  { name: "store", url: "https://integratewise-store.connect-a1b.workers.dev" },
  { name: "normalizer", url: "https://integratewise-normalizer.connect-a1b.workers.dev" },
  { name: "loader", url: "https://integratewise-loader.connect-a1b.workers.dev" },
  { name: "mcp-tool-server", url: "https://integratewise-mcp-tool-server.connect-a1b.workers.dev" },
  { name: "spine", url: "https://integratewise-spine.connect-a1b.workers.dev" },
  { name: "knowledge", url: "https://integratewise-knowledge.connect-a1b.workers.dev" },
  { name: "think", url: "https://integratewise-think.connect-a1b.workers.dev" },
  { name: "act", url: "https://integratewise-act.connect-a1b.workers.dev" },
  { name: "govern", url: "https://integratewise-govern.connect-a1b.workers.dev" },
  { name: "agents", url: "https://integratewise-agents.connect-a1b.workers.dev" },
  { name: "tenants", url: "https://integratewise-tenants.connect-a1b.workers.dev" },
  { name: "workflow", url: "https://integratewise-workflow.connect-a1b.workers.dev" },
  { name: "admin", url: "https://integratewise-admin.connect-a1b.workers.dev" },
  { name: "webhooks", url: "https://integratewise-webhooks.connect-a1b.workers.dev" },
  { name: "billing", url: "https://integratewise-billing.connect-a1b.workers.dev" },
]

async function checkServiceHealth(service: { name: string; url: string }): Promise<ServiceHealthMetric> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(service.url, {
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    })
    
    clearTimeout(timeoutId)
    const latencyMs = Date.now() - startTime
    
    return {
      service: service.name,
      status: response.ok ? "healthy" : "degraded",
      latencyMs,
      errorRate: response.ok ? 0 : 1,
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    return {
      service: service.name,
      status: "unhealthy",
      latencyMs: Date.now() - startTime,
      errorRate: 1,
      updatedAt: new Date().toISOString()
    }
  }
}

export async function GET() {
  try {
    // Check all services in parallel
    const healthChecks = await Promise.all(
      SERVICE_ENDPOINTS.map(service => checkServiceHealth(service))
    )
    
    // Sort by status: unhealthy first, then degraded, then healthy
    const statusOrder = { unhealthy: 0, degraded: 1, healthy: 2 }
    healthChecks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    
    const healthySvcs = healthChecks.filter(s => s.status === "healthy").length
    const degradedSvcs = healthChecks.filter(s => s.status === "degraded").length
    const unhealthySvcs = healthChecks.filter(s => s.status === "unhealthy").length
    
    return NextResponse.json({
      success: true,
      data: {
        services: healthChecks,
        total: healthChecks.length,
        summary: {
          healthy: healthySvcs,
          degraded: degradedSvcs,
          unhealthy: unhealthySvcs,
          avgLatencyMs: Math.round(healthChecks.reduce((sum, s) => sum + s.latencyMs, 0) / healthChecks.length)
        }
      }
    })
  } catch (error) {
    console.error("Error checking service health:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to check service health"
    }, { status: 500 })
  }
}

