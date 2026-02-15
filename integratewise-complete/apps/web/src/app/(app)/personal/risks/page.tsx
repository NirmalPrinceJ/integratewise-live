"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle, Plus, Search, ShieldAlert, Clock,
  MoreHorizontal, Building2, User, ArrowRight,
  AlertCircle, CheckCircle2, Flame, Activity
} from "lucide-react";

import { useSituations, Situation } from "@/hooks/use-situations"
import { Skeleton } from "@/components/ui/skeleton"

const severityConfig = {
  critical: { label: "Critical", icon: Flame, color: "text-red-500", bgColor: "bg-red-100" },
  high: { label: "High", icon: AlertTriangle, color: "text-orange-500", bgColor: "bg-orange-100" },
  medium: { label: "Medium", icon: AlertCircle, color: "text-yellow-500", bgColor: "bg-yellow-100" },
  low: { label: "Low", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-100" }
};

const statusConfig = {
  open: { label: "Open", variant: "destructive" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  monitoring: { label: "Monitoring", variant: "secondary" as const },
  resolved: { label: "Resolved", variant: "outline" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  completed: { label: "Completed", variant: "outline" as const }
};

const categoryConfig = {
  renewal: "Renewal",
  adoption: "Adoption",
  stakeholder: "Stakeholder",
  technical: "Technical",
  financial: "Financial",
  operations: "Operations",
  sales: "Sales"
};

export default function RisksPage() {
  const { situations, loading, error } = useSituations("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const risks = (situations || []).map((sit: Situation) => ({
    id: sit.id,
    title: sit.title,
    description: sit.narrative,
    account: sit.domain === "sales" ? "Sales Prospect" : "Operations Task",
    severity: sit.severity,
    category: sit.domain,
    status: sit.status,
    owner: "Think Engine",
    createdAt: sit.createdAt,
    dueDate: "2026-03-01",
    impactValue: sit.severity === "critical" ? 100000 : 50000,
    mitigationSteps: (sit.proposedActions || []).map((act: any) => ({
      step: act.title,
      completed: act.status === "completed"
    }))
  }))

  const filteredRisks = risks.filter((risk: any) => {
    const matchesSearch = risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" ||
      risk.severity === activeTab ||
      risk.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const openRisks = risks.filter((r: any) => r.status !== "resolved" && r.status !== "completed");
  const stats = {
    total: openRisks.length,
    critical: risks.filter((r: any) => r.severity === "critical" && r.status !== "completed").length,
    atRiskValue: openRisks.reduce((sum: number, r: any) => sum + r.impactValue, 0),
    inProgress: risks.filter((r: any) => r.status === "running").length
  };

  if (loading && risks.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risks</h1>
          <p className="text-muted-foreground">Monitor and mitigate account risks</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Risk
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At Risk ARR</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.atRiskValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search risks..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Risks</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {filteredRisks.map((risk: any) => {
              const severity = severityConfig[risk.severity as keyof typeof severityConfig];
              const status = statusConfig[risk.status as keyof typeof statusConfig] || statusConfig.open;
              const SeverityIcon = severity.icon;
              const completedSteps = (risk.mitigationSteps || []).filter((s: any) => s.completed).length;
              const progressPct = risk.mitigationSteps?.length > 0 ? (completedSteps / risk.mitigationSteps.length) * 100 : 0;

              return (
                <Card key={risk.id} className={`hover:shadow-md transition-shadow ${risk.severity === "critical" ? "border-l-4 border-red-500" : ""}`}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${severity.bgColor}`}>
                        <SeverityIcon className={`h-5 w-5 ${severity.color}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{risk.title}</h3>
                              <Badge variant={status.variant}>{status.label}</Badge>
                              <Badge variant="outline">{categoryConfig[risk.category as keyof typeof categoryConfig]}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {risk.account}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {risk.owner}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due: {new Date(risk.dueDate).toLocaleDateString()}
                          </span>
                          <span className="font-medium text-red-500">
                            ${risk.impactValue.toLocaleString()} at risk
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Mitigation Progress</span>
                              <span>{completedSteps}/{risk.mitigationSteps.length} steps</span>
                            </div>
                            <Progress value={progressPct} className="h-2" />
                          </div>
                          <Button variant="outline" size="sm" className="gap-1">
                            View Details
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
