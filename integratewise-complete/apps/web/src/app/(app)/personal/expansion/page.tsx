"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Rocket, Plus, Search, TrendingUp, DollarSign,
  MoreHorizontal, Building2, User, ArrowRight,
  Target, Sparkles, Lightbulb, BarChart3
} from "lucide-react";

// Mock data
const mockExpansionOpps = [
  {
    id: "exp-1",
    title: "Acme Corp - Add-on Modules",
    account: "Acme Corporation",
    type: "upsell",
    potential: 75000,
    probability: 60,
    stage: "qualified",
    owner: "Alice Johnson",
    createdAt: "2026-01-15",
    signals: ["High usage", "Feature requests", "Budget available"],
    nextAction: "Product demo",
    daysToClose: 45
  },
  {
    id: "exp-2",
    title: "TechStart - Seat Expansion",
    account: "TechStart Inc",
    type: "expansion",
    potential: 24000,
    probability: 80,
    stage: "proposal",
    owner: "Bob Smith",
    createdAt: "2026-01-20",
    signals: ["Team growth", "Active users", "Executive sponsor"],
    nextAction: "Contract review",
    daysToClose: 15
  },
  {
    id: "exp-3",
    title: "Global Retail - Cross-sell Analytics",
    account: "Global Retail Co",
    type: "cross_sell",
    potential: 48000,
    probability: 30,
    stage: "discovery",
    owner: "Carol Davis",
    createdAt: "2026-01-28",
    signals: ["Data needs", "Competitor using analytics"],
    nextAction: "Need assessment",
    daysToClose: 90
  },
  {
    id: "exp-4",
    title: "FinanceHub - Premium Tier",
    account: "FinanceHub",
    type: "upsell",
    potential: 36000,
    probability: 45,
    stage: "qualified",
    owner: "Alice Johnson",
    createdAt: "2026-02-01",
    signals: ["Hitting limits", "Power users"],
    nextAction: "ROI presentation",
    daysToClose: 60
  },
  {
    id: "exp-5",
    title: "HealthTech - API Package",
    account: "HealthTech Solutions",
    type: "expansion",
    potential: 18000,
    probability: 70,
    stage: "negotiation",
    owner: "Bob Smith",
    createdAt: "2026-01-10",
    signals: ["Integration requests", "Dev team engaged"],
    nextAction: "Finalize terms",
    daysToClose: 10
  }
];

const typeConfig = {
  upsell: { label: "Upsell", color: "bg-blue-500", variant: "default" as const },
  expansion: { label: "Expansion", color: "bg-green-500", variant: "secondary" as const },
  cross_sell: { label: "Cross-sell", color: "bg-purple-500", variant: "outline" as const }
};

const stageConfig = {
  discovery: { label: "Discovery", order: 1 },
  qualified: { label: "Qualified", order: 2 },
  proposal: { label: "Proposal", order: 3 },
  negotiation: { label: "Negotiation", order: 4 }
};

export default function ExpansionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredOpps = mockExpansionOpps.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || opp.type === activeTab || opp.stage === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    totalPotential: mockExpansionOpps.reduce((sum, o) => sum + o.potential, 0),
    weightedPotential: mockExpansionOpps.reduce((sum, o) => sum + (o.potential * o.probability / 100), 0),
    opportunities: mockExpansionOpps.length,
    avgProbability: Math.round(mockExpansionOpps.reduce((sum, o) => sum + o.probability, 0) / mockExpansionOpps.length)
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expansion</h1>
          <p className="text-muted-foreground">Track growth opportunities and initiatives</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Opportunity
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Potential</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPotential.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weighted</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(stats.weightedPotential).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Rocket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.opportunities}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Probability</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProbability}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upsell">Upsell</TabsTrigger>
          <TabsTrigger value="expansion">Expansion</TabsTrigger>
          <TabsTrigger value="cross_sell">Cross-sell</TabsTrigger>
          <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpps.map((opp) => {
              const type = typeConfig[opp.type as keyof typeof typeConfig];
              const stage = stageConfig[opp.stage as keyof typeof stageConfig];

              return (
                <Card key={opp.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant={type.variant}>{type.label}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{opp.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>{opp.account}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Potential</p>
                        <p className="text-lg font-semibold">${opp.potential.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Probability</p>
                        <p className="text-lg font-semibold">{opp.probability}%</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{stage.label}</span>
                        <span>{opp.daysToClose}d to close</span>
                      </div>
                      <Progress value={opp.probability} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Signals
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {opp.signals.map((signal, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{signal}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{opp.owner}</span>
                      </div>
                      <Button variant="link" size="sm" className="gap-1 p-0">
                        {opp.nextAction}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
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
