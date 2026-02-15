"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, Plus, Search, DollarSign, Calendar,
  MoreHorizontal, Building2, User, ArrowRight,
  AlertTriangle, CheckCircle2, Clock, Target
} from "lucide-react";

// Mock data
const mockDeals = [
  {
    id: "deal-1",
    name: "Acme Corp - Enterprise Expansion",
    account: "Acme Corporation",
    value: 150000,
    stage: "negotiation",
    probability: 75,
    closeDate: "2026-02-28",
    owner: "Alice Johnson",
    type: "expansion",
    daysInStage: 12,
    nextAction: "Send final proposal"
  },
  {
    id: "deal-2",
    name: "TechStart Inc - New Logo",
    account: "TechStart Inc",
    value: 48000,
    stage: "proposal",
    probability: 50,
    closeDate: "2026-03-15",
    owner: "Bob Smith",
    type: "new_business",
    daysInStage: 8,
    nextAction: "Product demo scheduled"
  },
  {
    id: "deal-3",
    name: "Global Retail - Renewal",
    account: "Global Retail Co",
    value: 180000,
    stage: "at_risk",
    probability: 40,
    closeDate: "2026-03-01",
    owner: "Carol Davis",
    type: "renewal",
    daysInStage: 25,
    nextAction: "Escalation meeting"
  },
  {
    id: "deal-4",
    name: "FinanceHub - Upsell",
    account: "FinanceHub",
    value: 24000,
    stage: "discovery",
    probability: 25,
    closeDate: "2026-04-15",
    owner: "Alice Johnson",
    type: "expansion",
    daysInStage: 5,
    nextAction: "Requirements gathering"
  },
  {
    id: "deal-5",
    name: "HealthTech - Enterprise",
    account: "HealthTech Solutions",
    value: 96000,
    stage: "closed_won",
    probability: 100,
    closeDate: "2026-01-30",
    owner: "Bob Smith",
    type: "new_business",
    daysInStage: 0,
    nextAction: null
  }
];

const stageConfig = {
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

export default function PipelinePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" ||
      deal.stage === activeTab ||
      (activeTab === "open" && !["closed_won", "closed_lost"].includes(deal.stage));
    return matchesSearch && matchesTab;
  });

  const openDeals = mockDeals.filter(d => !["closed_won", "closed_lost"].includes(d.stage));
  const stats = {
    totalPipeline: openDeals.reduce((sum, d) => sum + d.value, 0),
    weightedPipeline: openDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0),
    openDeals: openDeals.length,
    atRisk: mockDeals.filter(d => d.stage === "at_risk").length,
    wonThisMonth: mockDeals.filter(d => d.stage === "closed_won").reduce((sum, d) => sum + d.value, 0)
  };

  // Pipeline stages for board view
  const stages = ["discovery", "qualification", "proposal", "negotiation"];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Track deals, forecast, and renewals</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPipeline.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weighted</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(stats.weightedPipeline).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openDeals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.atRisk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Won (Month)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${stats.wonThisMonth.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Deals</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="at_risk">At Risk</TabsTrigger>
          <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
          <TabsTrigger value="closed_won">Won</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-3">
            {filteredDeals.map((deal) => {
              const stage = stageConfig[deal.stage as keyof typeof stageConfig];
              const type = typeConfig[deal.type as keyof typeof typeConfig];
              const isAtRisk = deal.stage === "at_risk";
              const isClosingSoon = new Date(deal.closeDate) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

              return (
                <Card key={deal.id} className={`hover:shadow-md transition-shadow ${isAtRisk ? "border-red-500 border-l-4" : ""}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-2 h-12 rounded-full ${stage.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{deal.name}</h3>
                            <Badge variant={type.variant}>{type.label}</Badge>
                            {isAtRisk && <Badge variant="destructive">At Risk</Badge>}
                            {isClosingSoon && !isAtRisk && <Badge className="bg-orange-500">Closing Soon</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {deal.account}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {deal.owner}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(deal.closeDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-bold">${deal.value.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{deal.probability}% probability</p>
                        </div>
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{stage.label}</span>
                            <span>{deal.daysInStage}d</span>
                          </div>
                          <Progress value={deal.probability} className="h-2" />
                        </div>
                        {deal.nextAction && (
                          <div className="w-48 text-sm">
                            <p className="text-muted-foreground">Next:</p>
                            <p className="truncate">{deal.nextAction}</p>
                          </div>
                        )}
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
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
