/**
 * Service Dashboard — Open tickets, response time, CSAT, first contact resolution
 * Data from Spine Service projection.
 */
import {
  Ticket,
  Clock,
  Heart,
  CheckCircle,
  Target,
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

export function ServiceDashboard() {
  const { data: projection, loading } = useHydrateProjection<any>("service");

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const summary = projection?.summary || {};
  const tickets = projection?.tickets || [];

  const openTickets = summary.openTickets || 24;
  const avgResponseTime = summary.avgResponseTime || 45;
  const csatScore = summary.csatScore || 87;
  const fcrRate = summary.firstContactResolution || 62;

  // Daily ticket volume
  const dailyVolume = [
    { day: "Mon", opened: 18, closed: 12, volume: 24 },
    { day: "Tue", opened: 22, closed: 16, volume: 30 },
    { day: "Wed", opened: 19, closed: 14, volume: 35 },
    { day: "Thu", opened: 25, closed: 20, volume: 40 },
    { day: "Fri", opened: 28, closed: 22, volume: 46 },
  ];

  // Response time trend (in minutes)
  const responseTrend = [
    { day: "Mon", avgTime: 52 },
    { day: "Tue", avgTime: 48 },
    { day: "Wed", avgTime: 45 },
    { day: "Thu", avgTime: 42 },
    { day: "Fri", avgTime: avgResponseTime },
  ];

  // Ticket status breakdown
  const statusBreakdown = [
    { status: "Open", count: 18, fill: "var(--iw-blue)" },
    { status: "In Progress", count: 28, fill: "var(--iw-warning)" },
    { status: "Waiting", count: 12, fill: "var(--iw-purple)" },
    { status: "Resolved", count: 42, fill: "var(--iw-success)" },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <ReadinessBar department="service" />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          title="Open Tickets"
          value={String(openTickets)}
          change="2 critical"
          positive={openTickets < 30}
          icon={<Ticket className="w-4 h-4" />}
          color="var(--iw-blue)"
        />
        <KPI
          title="Avg Response Time"
          value={`${avgResponseTime}m`}
          change="-7m vs last week"
          positive
          icon={<Clock className="w-4 h-4" />}
          color="var(--iw-success)"
        />
        <KPI
          title="CSAT Score"
          value={`${csatScore}%`}
          change="+2% improvement"
          positive
          icon={<Heart className="w-4 h-4" />}
          color="var(--iw-pink)"
        />
        <KPI
          title="First Contact Resolution"
          value={`${fcrRate}%`}
          change="+5% vs last month"
          positive
          icon={<CheckCircle className="w-4 h-4" />}
          color="var(--iw-teal)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Ticket Volume */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <h3 className="mb-4">Daily Ticket Volume</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="opened" fill="var(--iw-blue)" radius={[4, 4, 0, 0]} name="Opened" />
                <Bar dataKey="closed" fill="var(--iw-success)" radius={[4, 4, 0, 0]} name="Closed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Status */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="mb-4">Ticket Status</h3>
          <div className="space-y-3">
            {statusBreakdown.map((stat: any) => {
              const total = statusBreakdown.reduce((s, st) => s + st.count, 0);
              const pct = Math.round((stat.count / total) * 100);
              return (
                <div key={stat.status}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ fontWeight: 500 }}>{stat.status}</span>
                    <span className="text-muted-foreground">{stat.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary relative">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: stat.fill }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Response Time Trend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="mb-4">Response Time Trend</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `${v}m`} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(val: number) => `${val}m`}
              />
              <Area type="monotone" dataKey="avgTime" stroke="var(--iw-success)" fill="var(--iw-success)" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
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
