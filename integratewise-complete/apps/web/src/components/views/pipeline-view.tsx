"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, Plus, Search, DollarSign, Calendar,
  MoreHorizontal, Building2, User, ArrowRight,
  AlertTriangle, CheckCircle2, Clock, Target, Filter,
  BarChart3, LayoutGrid, List as ListIcon
} from "lucide-react";

import { useDeals, DealData } from "@/hooks/useDeals";
import { Skeleton } from "@/components/ui/skeleton";

const stageConfig: Record<string, { label: string; color: string; order: number }> = {
  discovery: { label: "Discovery", color: "bg-gray-500", order: 1 },
  qualification: { label: "Qualification", color: "bg-blue-500", order: 2 },
  proposal: { label: "Proposal", color: "bg-yellow-500", order: 3 },
  negotiation: { label: "Negotiation", color: "bg-orange-500", order: 4 },
  closed_won: { label: "Closed Won", color: "bg-green-500", order: 5 },
  closed_lost: { label: "Closed Lost", color: "bg-red-500", order: 6 },
  at_risk: { label: "At Risk", color: "bg-red-500", order: 0 }
};

const typeConfig = {
  new_business: { label: "New Business", variant: "default" as const },
  expansion: { label: "Expansion", variant: "secondary" as const },
  renewal: { label: "Renewal", variant: "outline" as const }
};

export function PipelineView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [layout, setLayout] = useState<"list" | "kanban">("list");

  const { deals, isLoading, error } = useDeals({
    search: searchQuery !== "" ? searchQuery : undefined,
  });

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesTab = activeTab === "all" ||
        deal.stage === activeTab ||
        (activeTab === "open" && !["closed_won", "closed_lost"].includes(deal.stage)) ||
        (activeTab === "at_risk" && deal.status === "at_risk");
      return matchesTab;
    });
  }, [deals, activeTab]);

  const stats = useMemo(() => {
    const openDeals = deals.filter(d => !["closed_won", "closed_lost"].includes(d.stage));
    const wonThisMonth = deals.filter(d => d.stage === "closed_won"); // Simplified month check

    return {
      totalPipeline: openDeals.reduce((sum, d) => sum + (d.value || 0), 0),
      weightedPipeline: openDeals.reduce((sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0),
      openDeals: openDeals.length,
      atRisk: deals.filter(d => d.status === "at_risk" || d.stage === "at_risk").length,
      wonThisMonth: wonThisMonth.reduce((sum, d) => sum + (d.value || 0), 0)
    };
  }, [deals]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading pipeline: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-transparent">
      {/* Header Area */}
      <div className="p-6 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Pipeline</h1>
              <p className="text-muted-foreground font-medium">Drive revenue growth and track deal velocity</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-secondary/50 rounded-lg p-1 mr-2">
                <button
                  onClick={() => setLayout("kanban")}
                  className={`p-1.5 rounded-md transition-all ${layout === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-1.5 rounded-md transition-all ${layout === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
              <Button size="sm" className="gap-2 bg-[var(--iw-blue)] text-white hover:bg-[var(--iw-blue)]/90 h-10 px-4 rounded-xl font-bold">
                <Plus className="h-4 w-4" />
                Create Deal
              </Button>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid gap-4 md:grid-cols-5">
            <StatCard label="Total Pipeline" value={stats.totalPipeline} icon={<DollarSign className="w-4 h-4 text-emerald-500" />} color="emerald" />
            <StatCard label="Weighted Value" value={stats.weightedPipeline} icon={<Target className="w-4 h-4 text-blue-500" />} color="blue" />
            <StatCard label="Open Deals" value={stats.openDeals} count icon={<TrendingUp className="w-4 h-4 text-indigo-500" />} color="indigo" />
            <StatCard label="At Risk" value={stats.atRisk} count icon={<AlertTriangle className="w-4 h-4 text-rose-500" />} color="rose" isCritical />
            <StatCard label="Won This Month" value={stats.wonThisMonth} icon={<CheckCircle2 className="w-4 h-4 text-amber-500" />} color="amber" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                placeholder="Search deals, accounts, or owners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-secondary/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--iw-blue)]"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl">
              {(["open", "negotiation", "at_risk", "closed_won", "all"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-bold">No deals found</h3>
                <p className="text-muted-foreground max-w-xs">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, count = false, isCritical = false }: { label: string; value: number; icon: React.ReactNode; color: string; count?: boolean; isCritical?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border border-border/60 bg-white dark:bg-gray-900/40 shadow-sm hover:shadow-md transition-all group`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-${color}-500/10 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</span>
      </div>
      <div className={`text-xl font-black tracking-tighter ${isCritical && value > 0 ? "text-rose-500" : ""}`}>
        {count ? value : `$${(value / 1000).toFixed(1)}k`}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: DealData }) {
  const stage = stageConfig[deal.stage] || { label: deal.stage, color: "bg-blue-500" };
  const type = typeConfig[deal.type] || { label: deal.type, variant: "outline" };
  const isAtRisk = deal.status === "at_risk" || deal.stage === "at_risk";

  return (
    <Card className={`group hover:shadow-xl hover:shadow-[var(--iw-blue)]/5 transition-all duration-300 rounded-2xl border-border/60 overflow-hidden ${isAtRisk ? 'border-l-4 border-l-rose-500' : ''}`}>
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner bg-secondary/30 group-hover:bg-[var(--iw-blue)]/10 transition-colors`}>
              <Building2 className="w-6 h-6 text-muted-foreground group-hover:text-[var(--iw-blue)] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-black tracking-tight group-hover:text-[var(--iw-blue)] transition-colors truncate max-w-[300px]">{deal.name}</h3>
                <Badge variant={type.variant} className="text-[9px] font-black uppercase tracking-widest px-2 h-5">{type.label}</Badge>
                {isAtRisk && <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-widest px-2 h-5 bg-rose-500">Critical Risk</Badge>}
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/70">
                <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {deal.account}</span>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {deal.owner}</span>
                <span className="opacity-30">·</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(deal.closeDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 pl-4 md:border-l border-border/40">
            <div className="min-w-[100px] text-right">
              <p className="text-lg font-black tracking-tighter">${(deal.value / 1000).toFixed(0)}k</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{deal.probability}% Probability</p>
            </div>

            <div className="w-32 hidden xl:block">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5 text-muted-foreground/70">
                <span>{stage.label}</span>
                <span>{deal.daysInStage}d</span>
              </div>
              <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${deal.probability >= 80 ? 'bg-emerald-500' : deal.probability >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/80">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/80">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        {deal.nextAction && (
          <div className="px-5 py-2.5 bg-secondary/20 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/80">
              <Clock className="w-3 h-3" />
              <span className="uppercase tracking-widest opacity-60 mr-1">Next Action:</span>
              <span className="text-foreground tracking-tight">{deal.nextAction}</span>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-[var(--iw-blue)] hover:underline">Complete action</button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
