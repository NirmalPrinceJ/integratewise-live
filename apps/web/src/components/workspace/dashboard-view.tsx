/**
 * Dashboard View with Progressive Hydration (Personal → Work → Accounts/Projects)
 * Extracted from l1-module-content to reduce file size and improve maintainability.
 */
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  ArrowUpRight, ArrowDownRight, Calendar as CalendarIcon, CheckCircle2, ChevronRight,
  Target, Zap, DollarSign, Activity, Building2, Users as UsersIcon, Plug,
  AlertTriangle, User, Briefcase,
} from "lucide-react";
import { useGoalsSafe } from "../goal-framework/goal-context";
import { type GoalStatus } from "../goal-framework/goal-schema";
import { type CTXEnum, type ViewMode } from "../spine/types";

const STATUS_DOT: Record<GoalStatus, string> = {
  ON_TRACK: "bg-emerald-500", AT_RISK: "bg-amber-500", OFF_TRACK: "bg-red-500",
  EXCEEDED: "bg-blue-500", NOT_STARTED: "bg-gray-400",
};

const VIEW_TABS: { id: ViewMode; label: string; icon: any }[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "project", label: "Accounts & Projects", icon: Building2 },
];

const DEFAULT_SUMMARY = {
  totalARR: 1420000, arrGrowth: 12.5, operationalHealth: 84,
  activeIntegrations: 14, totalIntegrations: 15, totalCustomers: 127,
  atRiskAccounts: 4, pendingApprovals: 3, teamUtilization: 78,
};

const DEMO_TASKS = [
  { task: "Review FinanceFlow renewal strategy", priority: "critical", due: "Today", project: "CS" },
  { task: "Approve AI-suggested upsell for DataVault", priority: "high", due: "Today", project: "Sales" },
  { task: "Prepare Q1 board deck data", priority: "medium", due: "Tomorrow", project: "BizOps" },
  { task: "Update Jira integration field mapping", priority: "low", due: "This week", project: "Tech" },
];

const DEMO_FEED = [
  { text: "Expansion signal detected for TechServe India — usage up 34%", type: "success", time: "12m" },
  { text: "FinanceFlow champion went silent — last engagement 12 days ago", type: "warning", time: "1h" },
  { text: "Stripe schema drift auto-corrected — 2 fields updated", type: "info", time: "2h" },
  { text: "DataVault Australia NPS jumped to 9.2 — upsell opportunity", type: "success", time: "3h" },
];

const DEMO_ACCOUNTS = [
  { name: "TechServe India", logo: "🏢", arr: 420000, health: 92, tier: "Enterprise", renewal: "126 days", signals: ["Expansion signal", "High usage"] },
  { name: "CloudBridge APAC", logo: "☁️", arr: 280000, health: 78, tier: "Enterprise", renewal: "72 days", signals: ["CSAT drop"] },
  { name: "FinanceFlow Solutions", logo: "💰", arr: 180000, health: 42, tier: "Mid-Market", renewal: "29 days", signals: ["Champion silent", "Payment failed"] },
  { name: "DataVault Australia", logo: "🔒", arr: 350000, health: 88, tier: "Enterprise", renewal: "204 days", signals: ["NPS 9.2"] },
  { name: "RetailNest Pte Ltd", logo: "🛍️", arr: 95000, health: 71, tier: "SMB", renewal: "98 days", signals: [] },
  { name: "HealthTech Innovations", logo: "🏥", arr: 210000, health: 95, tier: "Mid-Market", renewal: "202 days", signals: ["Usage surge", "Expansion"] },
];

const PRIORITY_DOT: Record<string, string> = {
  critical: "bg-red-500", high: "bg-amber-500", medium: "bg-blue-500", low: "bg-gray-300",
};

const FEED_DOT: Record<string, string> = {
  success: "bg-emerald-500", warning: "bg-amber-500", info: "bg-blue-500",
};

interface DashboardViewProps {
  activeCtx: CTXEnum;
  projection: any;
  readiness: any;
}

export function DashboardView({ activeCtx, projection, readiness }: DashboardViewProps) {
  const goalsCtx = useGoalsSafe();
  const [viewMode, setViewMode] = useState<ViewMode>("personal");
  const strategicGoals = goalsCtx?.strategicGoals || [];
  const deptKPIs = goalsCtx?.getDeptKPIs(activeCtx) || [];
  const allKPIs = goalsCtx?.allKPIs || [];
  const orgType = goalsCtx?.orgType || "PRODUCT";

  const summary = projection?.summary || DEFAULT_SUMMARY;

  const readinessScore = useMemo(() => {
    if (!readiness) return 0;
    const scores = Object.values(readiness).map((r: any) => r.overallScore);
    return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / (scores.length || 1));
  }, [readiness]);

  const displayKPIs = deptKPIs.length > 0 ? deptKPIs.slice(0, 4) : allKPIs.slice(0, 4);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header with View Mode Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {viewMode === "personal" ? "My Overview" : viewMode === "work" ? "Work Dashboard" : "Accounts & Projects"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeCtx.replace("CTX_", "")} · {orgType} Org · {readinessScore}% data coverage
            </p>
          </div>
          <div className="flex bg-secondary rounded-lg p-0.5">
            {VIEW_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Personal View ─── */}
        {viewMode === "personal" && (
          <PersonalView summary={summary} />
        )}

        {/* ─── Work View ─── */}
        {viewMode === "work" && (
          <WorkView
            displayKPIs={displayKPIs}
            strategicGoals={strategicGoals}
            orgType={orgType}
            readinessScore={readinessScore}
            summary={summary}
          />
        )}

        {/* ─── Project / Account View ─── */}
        {viewMode === "project" && (
          <AccountsProjectView summary={summary} />
        )}
      </div>
    </ScrollArea>
  );
}

// ── Sub-views (split for readability) ────────────────────────────────────────

function PersonalView({ summary }: { summary: any }) {
  const stats = [
    { label: "My Tasks", value: "12", sub: "4 due today", color: "text-[#3F5185]", icon: Activity },
    { label: "Meetings Today", value: "3", sub: "Next: 11:30am", color: "text-[#7B5EA7]", icon: CalendarIcon },
    { label: "Approvals", value: String(summary.pendingApprovals), sub: "Waiting for you", color: "text-[#F54476]", icon: CheckCircle2 },
    { label: "Intelligence", value: "5", sub: "New insights", color: "text-[#D4883E]", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-[#3F5185]/10 transition-colors">
                  <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-[#3F5185]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Focus</CardTitle>
            <CardDescription className="text-[10px]">Tasks and actions that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_TASKS.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group">
                <div className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[t.priority] || "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.task}</div>
                  <div className="text-[10px] text-muted-foreground">{t.due} · {t.project}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F54476]" />
              <CardTitle className="text-sm">Intelligence Feed</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_FEED.map((item, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-all cursor-pointer">
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${FEED_DOT[item.type] || "bg-blue-500"}`} />
                  <div className="flex-1">
                    <p className="text-[11px] leading-relaxed">{item.text}</p>
                    <span className="text-[9px] text-muted-foreground">{item.time} ago</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WorkView({ displayKPIs, strategicGoals, orgType, readinessScore, summary }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayKPIs.map((kpi: any) => {
          const pct = Math.min(100, Math.round((kpi.currentValue / kpi.targetValue) * 100));
          return (
            <Card key={kpi.id} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-[#3F5185]/10"><Target className="w-3.5 h-3.5 text-[#3F5185]" /></div>
                  <div className={`flex items-center text-[10px] font-bold ${kpi.trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {kpi.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(kpi.trend)}%
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {kpi.unit === "$" ? `$${kpi.currentValue >= 1e6 ? (kpi.currentValue / 1e6).toFixed(1) + "M" : (kpi.currentValue / 1e3).toFixed(0) + "K"}` : kpi.unit === "%" ? `${kpi.currentValue}%` : kpi.currentValue}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5">{kpi.name}</div>
                <Progress value={pct} className="h-1 mt-2" />
                {kpi.sparkline && (
                  <div className="flex items-end gap-px h-3 mt-2">
                    {kpi.sparkline.map((v: number, j: number) => {
                      const max = Math.max(...kpi.sparkline!); const min = Math.min(...kpi.sparkline!);
                      const height = Math.max(2, ((v - min) / (max - min || 1)) * 12);
                      return <div key={j} className={`flex-1 rounded-sm ${j === kpi.sparkline!.length - 1 ? "bg-[#3F5185]" : "bg-[#3F5185]/20"}`} style={{ height: `${height}px` }} />;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Strategic Goal Alignment</CardTitle>
            <CardDescription className="text-[10px]">{orgType === "PRODUCT" ? "Product growth tracking" : "Service delivery tracking"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {strategicGoals.map((sg: any) => (
              <div key={sg.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[sg.status as GoalStatus]}`} />
                    <span className="font-semibold">{sg.name}</span>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                      {sg.lens === "PROVIDER" ? <><Building2 className="w-2.5 h-2.5" /> Our Growth</> :
                       sg.lens === "CLIENT" ? <><UsersIcon className="w-2.5 h-2.5" /> Client Value</> :
                       <><Target className="w-2.5 h-2.5" /> Both</>}
                    </span>
                  </div>
                  <span className="font-bold">{sg.progress}%</span>
                </div>
                <Progress value={sg.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-[#1E2A4A] text-white">
          <CardContent className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Plug className="w-4 h-4 text-[#F54476]" />
              <h3 className="text-sm font-bold">Integration Health</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { label: "Data Freshness", value: "< 2 min", ok: true },
                { label: "Coverage", value: `${readinessScore || 94}%`, ok: true },
                { label: "Active Sources", value: `${summary.activeIntegrations}/${summary.totalIntegrations}`, ok: summary.activeIntegrations >= summary.totalIntegrations },
                { label: "Schema Drift", value: "0 issues", ok: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-white/60">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold">{item.value}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.ok ? "bg-emerald-400" : "bg-amber-400"}`} />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', metaKey: true }))}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold mt-4 border border-white/10 text-xs">
              Open Intelligence (⌘J)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AccountsProjectView({ summary }: { summary: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 mb-2">
        {[
          { icon: Building2, color: "bg-emerald-50", iconColor: "text-emerald-600", value: summary.totalCustomers, label: "Total Accounts" },
          { icon: AlertTriangle, color: "bg-red-50", iconColor: "text-red-600", value: summary.atRiskAccounts, label: "At Risk", valueColor: "text-red-600" },
          { icon: DollarSign, color: "bg-blue-50", iconColor: "text-blue-600", value: `$${(summary.totalARR / 1e6).toFixed(2)}M`, label: "Total ARR" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}><stat.icon className={`w-4 h-4 ${stat.iconColor}`} /></div>
              <div><div className={`text-xl font-bold ${stat.valueColor || ""}`}>{stat.value}</div><div className="text-[9px] text-muted-foreground uppercase font-bold">{stat.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEMO_ACCOUNTS.map((acc, i) => (
          <Card key={i} className={`border shadow-sm hover:shadow-md transition-all cursor-pointer ${acc.health < 60 ? "border-red-200" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{acc.logo}</span>
                  <div><h3 className="text-sm font-semibold">{acc.name}</h3><span className="text-[10px] text-muted-foreground">{acc.tier}</span></div>
                </div>
                <Badge className={`text-[9px] border-0 ${acc.health >= 80 ? "bg-emerald-50 text-emerald-700" : acc.health >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{acc.health}%</Badge>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">ARR</span><span className="font-bold">${(acc.arr / 1000).toFixed(0)}K</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Renewal</span><span className="font-medium">{acc.renewal}</span></div>
                <Progress value={acc.health} className={`h-1 ${acc.health < 60 ? "[&>div]:bg-red-500" : acc.health < 80 ? "[&>div]:bg-amber-500" : ""}`} />
              </div>
              {acc.signals.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {acc.signals.map((s, j) => (<Badge key={j} variant="outline" className="text-[8px]">{s}</Badge>))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
