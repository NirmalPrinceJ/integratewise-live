"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  RefreshCw, Download, Filter, Calendar, Target, Clock,
  ArrowUpRight, ArrowDownRight, Minus, Activity, PieChart,
  LineChart, Layers
} from "lucide-react";

// Mock analytics data
const metrics = {
  mrr: { value: 487500, change: 8.2, trend: "up" },
  arr: { value: 5850000, change: 12.5, trend: "up" },
  netRetention: { value: 112, change: 3.1, trend: "up" },
  grossRetention: { value: 94, change: -1.2, trend: "down" },
  activeAccounts: { value: 156, change: 5, trend: "up" },
  healthScore: { value: 78, change: 2.3, trend: "up" },
  nps: { value: 62, change: -3, trend: "down" },
  churnRate: { value: 2.4, change: -0.5, trend: "up" }
};

const revenueBreakdown = [
  { segment: "Enterprise", value: 2850000, pct: 48.7, color: "bg-blue-500" },
  { segment: "Mid-Market", value: 1950000, pct: 33.3, color: "bg-purple-500" },
  { segment: "SMB", value: 1050000, pct: 17.9, color: "bg-green-500" }
];

const healthDistribution = [
  { label: "Healthy (80-100)", count: 98, pct: 63, color: "bg-green-500" },
  { label: "At Risk (50-79)", count: 42, pct: 27, color: "bg-yellow-500" },
  { label: "Critical (0-49)", count: 16, pct: 10, color: "bg-red-500" }
];

const topAccounts = [
  { name: "Acme Corporation", arr: 180000, health: 85, trend: "up" },
  { name: "Global Retail Co", arr: 168000, health: 45, trend: "down" },
  { name: "TechStart Inc", arr: 96000, health: 92, trend: "up" },
  { name: "HealthTech Solutions", arr: 84000, health: 78, trend: "stable" },
  { name: "FinanceHub", arr: 72000, health: 88, trend: "up" }
];

const recentActivity = [
  { event: "Renewal Completed", account: "DataFlow Inc", value: "+$48,000", time: "2 hours ago" },
  { event: "Churn Risk Detected", account: "Global Retail Co", value: "$168,000", time: "5 hours ago" },
  { event: "Expansion Closed", account: "Acme Corporation", value: "+$36,000", time: "1 day ago" },
  { event: "New Account", account: "CloudNet Systems", value: "+$24,000", time: "2 days ago" }
];

export default function AnalyticsPage() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down": return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === "up") return isPositive ? "text-green-500" : "text-red-500";
    if (trend === "down") return isPositive ? "text-red-500" : "text-green-500";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Insights, metrics, and performance data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.mrr.value.toLocaleString()}</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.mrr.trend)}`}>
              {getTrendIcon(metrics.mrr.trend)}
              <span>{metrics.mrr.change}% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.arr.value / 1000000).toFixed(2)}M</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.arr.trend)}`}>
              {getTrendIcon(metrics.arr.trend)}
              <span>{metrics.arr.change}% YoY growth</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Retention</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.netRetention.value}%</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.netRetention.trend)}`}>
              {getTrendIcon(metrics.netRetention.trend)}
              <span>+{metrics.netRetention.change}% improvement</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.churnRate.value}%</div>
            <div className={`flex items-center text-sm ${getTrendColor(metrics.churnRate.trend, false)}`}>
              {getTrendIcon(metrics.churnRate.trend)}
              <span>{metrics.churnRate.change}% from last quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Revenue by Segment</CardTitle>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{segment.segment}</span>
                        <span className="font-medium">${(segment.value / 1000000).toFixed(2)}M ({segment.pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${segment.color}`} style={{ width: `${segment.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Distribution */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Account Health Distribution</CardTitle>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthDistribution.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          {item.label}
                        </span>
                        <span className="font-medium">{item.count} accounts ({item.pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Accounts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Accounts by ARR</CardTitle>
                <Button variant="link" className="gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAccounts.map((account, idx) => (
                  <div key={account.name} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-6">{idx + 1}</span>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-muted-foreground">${account.arr.toLocaleString()} ARR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-sm font-medium ${account.health >= 80 ? "text-green-500" : account.health >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                        Health: {account.health}
                      </div>
                      {getTrendIcon(account.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly recurring revenue over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Revenue chart visualization</p>
                <p className="text-sm">Connect to Spine API for live data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Score Trends</CardTitle>
              <CardDescription>Account health metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Health metrics visualization</p>
                <p className="text-sm">Connect to Spine API for live data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.event.includes("Churn") ? "bg-red-500" : activity.event.includes("New") ? "bg-blue-500" : "bg-green-500"}`} />
                      <div>
                        <p className="font-medium">{activity.event}</p>
                        <p className="text-sm text-muted-foreground">{activity.account}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${activity.value.startsWith("+") ? "text-green-500" : ""}`}>
                        {activity.value}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
