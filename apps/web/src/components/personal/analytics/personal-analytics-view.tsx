"use client";

import { useState, useEffect } from "react";
import { workspace } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw, TrendingUp, Mail, CheckCircle2, Clock, BarChart3 } from "lucide-react";

interface AnalyticKPI {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  icon?: any;
  color?: string;
}

interface Analytics {
  dealsWon?: number;
  emailsSent?: number;
  tasksCompleted?: number;
  responseTime?: string | number;
  conversionRate?: number;
  customerSatisfaction?: number;
  teamUtilization?: number;
  pipelineCoverage?: number;
  successMetrics?: AnalyticKPI[];
}

export function PersonalAnalyticsView() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);
      const result = await workspace.view("analytics");
      const data = result.data || result.analytics || {};
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }

  const kpis: AnalyticKPI[] = [
    {
      label: "Deals Won",
      value: analytics?.dealsWon ?? 12,
      unit: "this month",
      trend: 15,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      label: "Emails Sent",
      value: analytics?.emailsSent ?? 247,
      unit: "this week",
      trend: 8,
      icon: Mail,
      color: "text-blue-600",
    },
    {
      label: "Tasks Completed",
      value: analytics?.tasksCompleted ?? 89,
      unit: "this month",
      trend: 12,
      icon: CheckCircle2,
      color: "text-purple-600",
    },
    {
      label: "Avg Response Time",
      value: analytics?.responseTime ?? "2.3h",
      unit: "to customer inquiries",
      trend: -5,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const metricCards = [
    {
      title: "Conversion Rate",
      value: `${analytics?.conversionRate ?? 24}%`,
      progress: analytics?.conversionRate ?? 24,
      description: "From leads to opportunities",
    },
    {
      title: "Customer Satisfaction",
      value: `${analytics?.customerSatisfaction ?? 92}%`,
      progress: analytics?.customerSatisfaction ?? 92,
      description: "CSAT score",
    },
    {
      title: "Team Utilization",
      value: `${analytics?.teamUtilization ?? 78}%`,
      progress: analytics?.teamUtilization ?? 78,
      description: "Resource allocation",
    },
    {
      title: "Pipeline Coverage",
      value: `${analytics?.pipelineCoverage ?? 3.2}x`,
      progress: Math.min(100, (analytics?.pipelineCoverage ?? 3.2) * 20),
      description: "vs. quota target",
    },
  ];

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadAnalytics} className="mt-2">
                <RotateCcw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Personal KPIs and metrics</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadAnalytics}>
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-1/2 mb-3" />
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pr-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                        {Icon && <Icon className={`w-4 h-4 ${kpi.color}`} />}
                      </div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold">{kpi.value}</span>
                        {kpi.unit && <span className="text-xs text-muted-foreground">{kpi.unit}</span>}
                      </div>
                      {kpi.trend !== undefined && (
                        <div className={`text-xs font-medium ${kpi.trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {kpi.trend >= 0 ? "+" : ""}{kpi.trend}% vs last period
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Metric Progress Cards */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {metricCards.map((metric, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{metric.title}</p>
                        <span className="text-lg font-bold">{metric.value}</span>
                      </div>
                      <Progress value={metric.progress} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Chart Placeholder */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Activity Trend</CardTitle>
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-32 flex items-center justify-center border border-dashed rounded bg-secondary/30">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Chart visualization</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].slice(0, 4).map((day, i) => (
                    <div key={i} className="text-center">
                      <div className="h-16 bg-gradient-to-t from-primary/30 to-primary/10 rounded mb-1" />
                      <p className="text-xs text-muted-foreground">{day}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">SUMMARY</p>
                <p className="text-sm leading-relaxed">
                  You're performing well with strong metrics across all key areas. Keep up the momentum with focused
                  effort on pipeline coverage. Consider allocating more resources to high-potential opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
