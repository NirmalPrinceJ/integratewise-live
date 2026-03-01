/**
 * BizOps Dashboard — Active projects, task completion, workflows automated, efficiency
 * Data from Spine BizOps projection.
 */
import {
  Briefcase,
  CheckCircle,
  GitBranch,
  DollarSign,
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

export function BizOpsDashboard() {
  const { data: projection, loading } = useHydrateProjection<any>("bizops");

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const summary = projection?.summary || {};
  const activeProjects = summary.activeProjects || 12;
  const taskCompletion = summary.taskCompletion || 76;
  const workflowsAutomated = summary.workflowsAutomated || 24;
  const costSavings = summary.costSavings || 285000;

  // Project timeline
  const projectTimeline = [
    { week: "W1", onTrack: 10, atRisk: 1, delayed: 0 },
    { week: "W2", onTrack: 11, atRisk: 1, delayed: 0 },
    { week: "W3", onTrack: 10, atRisk: 2, delayed: 0 },
    { week: "W4", onTrack: 11, atRisk: 1, delayed: 0 },
    { week: "W5", onTrack: activeProjects - 1, atRisk: 1, delayed: 0 },
  ];

  // Task completion trend
  const completionTrend = [
    { day: "Mon", completed: 28, pending: 32 },
    { day: "Tue", completed: 35, pending: 28 },
    { day: "Wed", completed: 42, pending: 26 },
    { day: "Thu", completed: 58, pending: 18 },
    { day: "Fri", completed: Math.round(taskCompletion), pending: 100 - Math.round(taskCompletion) },
  ];

  // Workflow automation types
  const workflowTypes = [
    { type: "Approval Workflows", count: 8, fill: "var(--iw-blue)" },
    { type: "Data Integration", count: 6, fill: "var(--iw-success)" },
    { type: "Notification", count: 5, fill: "var(--iw-warning)" },
    { type: "Reporting", count: 5, fill: "var(--iw-purple)" },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <ReadinessBar department="bizops" />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          title="Active Projects"
          value={String(activeProjects)}
          change="11 on track, 1 at risk"
          positive
          icon={<Briefcase className="w-4 h-4" />}
          color="var(--iw-blue)"
        />
        <KPI
          title="Task Completion"
          value={`${taskCompletion}%`}
          change="This week"
          positive={taskCompletion > 70}
          icon={<CheckCircle className="w-4 h-4" />}
          color="var(--iw-success)"
        />
        <KPI
          title="Workflows Automated"
          value={String(workflowsAutomated)}
          change="4 new this month"
          positive
          icon={<GitBranch className="w-4 h-4" />}
          color="var(--iw-teal)"
        />
        <KPI
          title="Cost Savings"
          value={`$${(costSavings / 1000).toFixed(0)}K`}
          change="YTD automation"
          positive
          icon={<DollarSign className="w-4 h-4" />}
          color="var(--iw-success)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <h3 className="mb-4">Project Status Trend</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="onTrack" fill="var(--iw-success)" radius={[4, 4, 0, 0]} stackId="status" name="On Track" />
                <Bar dataKey="atRisk" fill="var(--iw-warning)" radius={[4, 4, 0, 0]} stackId="status" name="At Risk" />
                <Bar dataKey="delayed" fill="var(--iw-danger)" radius={[4, 4, 0, 0]} stackId="status" name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workflow Types */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="mb-4">Workflow Types</h3>
          <div className="space-y-3">
            {workflowTypes.map((wf: any) => (
              <div key={wf.type}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ fontWeight: 500 }}>{wf.type}</span>
                  <span className="text-muted-foreground">{wf.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary relative">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(wf.count / workflowsAutomated) * 100}%`,
                      background: wf.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Completion */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="mb-4">Task Completion Rate</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="completed" stroke="var(--iw-success)" fill="var(--iw-success)" fillOpacity={0.1} name="Completed" />
              <Area type="monotone" dataKey="pending" stroke="var(--iw-warning)" fill="var(--iw-warning)" fillOpacity={0.1} name="Pending" />
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
