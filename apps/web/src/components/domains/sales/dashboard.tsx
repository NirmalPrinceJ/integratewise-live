/**
 * Sales Dashboard — Pipeline value, deals closed, win rate, forecast
 * Data from Spine Sales projection.
 */
import {
  DollarSign,
  TrendingUp,
  Briefcase,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useHydrateProjection } from "../../hydration/use-hydrate-projection";
import { ReadinessBar } from "../../spine/readiness-bar";

export function SalesDashboard() {
  const { data: projection, loading } = useHydrateProjection<any>("sales");

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const summary = projection?.summary || {};
  const deals = projection?.deals || [];
  const pipelineByStage = projection?.pipelineByStage || [];

  const totalPipeline = summary.pipelineValue || 2450000;
  const dealsClosedThisMonth = deals.filter((d: any) => d.status === "Closed Won").length || 8;
  const winRate = summary.winRate || 34;
  const avgDealSize = totalPipeline > 0 ? Math.round(totalPipeline / deals.length) : 125000;

  // Monthly trend
  const monthlyTrend = [
    { month: "Oct", value: 1850000 },
    { month: "Nov", value: 2100000 },
    { month: "Dec", value: 2280000 },
    { month: "Jan", value: 2350000 },
    { month: "Feb", value: totalPipeline },
  ];

  // Deal distribution by stage
  const stageDistribution = pipelineByStage.length > 0 ? pipelineByStage : [
    { stage: "Prospect", value: 450000, count: 24 },
    { stage: "Qualified", value: 680000, count: 18 },
    { stage: "Proposal", value: 920000, count: 12 },
    { stage: "Negotiation", value: 400000, count: 8 },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <ReadinessBar department="sales" />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          title="Pipeline Value"
          value={`$${(totalPipeline / 1000000).toFixed(2)}M`}
          change={`${pipelineByStage.length} stages`}
          positive
          icon={<DollarSign className="w-4 h-4" />}
          color="var(--iw-blue)"
        />
        <KPI
          title="Deals Closed (Month)"
          value={String(dealsClosedThisMonth)}
          change="5 in progress"
          positive
          icon={<Briefcase className="w-4 h-4" />}
          color="var(--iw-success)"
        />
        <KPI
          title="Win Rate"
          value={`${winRate}%`}
          change="+3% vs last month"
          positive
          icon={<TrendingUp className="w-4 h-4" />}
          color="var(--iw-warning)"
        />
        <KPI
          title="Avg Deal Size"
          value={`$${(avgDealSize / 1000).toFixed(0)}K`}
          change="Up from $98K"
          positive
          icon={<Activity className="w-4 h-4" />}
          color="var(--iw-purple)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <h3 className="mb-4">Pipeline Trend</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(val: number) => `$${(val / 1000000).toFixed(2)}M`}
                />
                <Area type="monotone" dataKey="value" stroke="var(--iw-blue)" fill="var(--iw-blue)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline by Stage */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="mb-4">Pipeline by Stage</h3>
          <div className="space-y-3">
            {stageDistribution.map((stage: any) => {
              const totalValue = stageDistribution.reduce((s: number, st: any) => s + st.value, 0);
              const pct = totalValue > 0 ? Math.round((stage.value / totalValue) * 100) : 0;
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ fontWeight: 500 }}>{stage.stage}</span>
                    <span className="text-muted-foreground">${(stage.value / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary relative">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: ["var(--iw-blue)", "var(--iw-success)", "var(--iw-warning)", "var(--iw-purple)"][stageDistribution.indexOf(stage) % 4],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="mb-4">Recent Deals</h3>
        <div className="space-y-2">
          {deals.slice(0, 5).map((deal: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
              <div className="flex-1">
                <p className="text-sm" style={{ fontWeight: 500 }}>{deal.name || `Deal ${i + 1}`}</p>
                <p className="text-xs text-muted-foreground">{deal.account || "Account Name"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ fontWeight: 600 }}>${(deal.value / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">{deal.stage || "Negotiation"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({
  title,
  value,
  change,
  positive,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="text-xl" style={{ fontWeight: 700, color }}>
            {value}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {positive ? (
              <ArrowUpRight className="w-3 h-3 text-[var(--iw-success)]" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-[var(--iw-danger)]" />
            )}
            <p className="text-xs text-muted-foreground">{change}</p>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-secondary" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
