import { PageHeader } from "@/components/spine/page-header"
import { MetricCard } from "@/components/spine/metric-card"
import { Sparkles } from "lucide-react"
import { getMetrics, formatCurrency } from "@/lib/supabase/queries"

export default async function MetricsPage() {
  const metrics = await getMetrics()

  // Calculate pipeline by stage
  const pipelineStages = [
    { stage: "Discovery", deals: metrics.deals.filter((d) => d.stage === "discovery") },
    { stage: "Qualification", deals: metrics.deals.filter((d) => d.stage === "qualification") },
    { stage: "Proposal", deals: metrics.deals.filter((d) => d.stage === "proposal") },
    { stage: "Negotiation", deals: metrics.deals.filter((d) => d.stage === "negotiation") },
  ]

  const totalPipelineValue = metrics.pipeline || 1
  const stagePercentages = pipelineStages.map((s) => ({
    stage: s.stage,
    value: Math.round((s.deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0) / totalPipelineValue) * 100),
  }))

  return (
    <div className="p-6">
      <PageHeader
        title="Business Metrics"
        description="IntegrateWise LLP performance dashboard"
        stageId="METRICS-016"
      />

      {/* Metric Cards Row - Live Data */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="MRR" value={formatCurrency(metrics.mrr)} trend={12} primary />
        <MetricCard title="Pipeline" value={formatCurrency(metrics.pipeline)} trend={8} />
        <MetricCard title="Revenue (YTD)" value={formatCurrency(metrics.ytdRevenue)} trend={15} />
        <MetricCard title="Active Clients" value={metrics.activeClients.toString()} trend={-5} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Sales Pipeline by Stage */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Sales Pipeline by Stage</h3>
          <div className="space-y-4">
            {stagePercentages.map((item) => (
              <div key={item.stage} className="flex items-center gap-4">
                <span className="w-28 text-sm text-gray-600">{item.stage}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-[#2D7A3E] h-2 rounded-full" style={{ width: `${item.value || 5}%` }} />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{item.value || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: "Clients", value: metrics.clients.length.toString() },
              {
                label: "Open Deals",
                value: metrics.deals.filter((d) => d.stage !== "won" && d.stage !== "lost").length.toString(),
              },
              {
                label: "Subscriptions",
                value: metrics.subscriptions.filter((s) => s.status === "active").length.toString(),
              },
              { label: "Win Rate", value: `${metrics.winRate}%` },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Business Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#2D7A3E]" />
          <h3 className="font-semibold text-gray-900">AI Business Insights</h3>
        </div>
        <ul className="space-y-2 text-gray-600">
          {metrics.mrr > 0 && (
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D7A3E] rounded-full mt-2" />
              Current MRR of {formatCurrency(metrics.mrr)} from{" "}
              {metrics.subscriptions.filter((s) => s.status === "active").length} active subscriptions
            </li>
          )}
          {metrics.pipeline > 0 && (
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D7A3E] rounded-full mt-2" />
              Pipeline value of {formatCurrency(metrics.pipeline)} across{" "}
              {metrics.deals.filter((d) => d.stage !== "won" && d.stage !== "lost").length} open opportunities
            </li>
          )}
          {metrics.clients.filter((c) => c.health_score && c.health_score < 50).length > 0 && (
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
              {metrics.clients.filter((c) => c.health_score && c.health_score < 50).length} client(s) with low health
              score - attention needed
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[#2D7A3E] rounded-full mt-2" />
            Win rate of {metrics.winRate}% - {metrics.winRate >= 50 ? "performing well" : "needs improvement"}
          </li>
        </ul>
      </div>
    </div>
  )
}
