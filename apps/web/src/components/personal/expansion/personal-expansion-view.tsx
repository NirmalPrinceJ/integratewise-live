"use client";

import { useState, useEffect } from "react";
import { workspace } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, RotateCcw, Zap } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  stage: string;
  revenue?: number;
  probability?: number;
  description?: string;
  account?: string;
}

export function PersonalExpansionView() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError(null);
      const result = await workspace.view("expansion");
      const data = result.data || result.opportunities || [];
      setOpportunities(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load expansion opportunities");
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value?: number): string {
    if (!value) return "-";
    return `$${(value / 1000).toFixed(0)}K`;
  }

  const stageColors: Record<string, string> = {
    discovery: "bg-blue-100 text-blue-700",
    evaluation: "bg-purple-100 text-purple-700",
    proposal: "bg-amber-100 text-amber-700",
    negotiation: "bg-orange-100 text-orange-700",
    won: "bg-emerald-100 text-emerald-700",
    closed: "bg-gray-100 text-gray-700",
  };

  const totalRevenue = opportunities.reduce((sum, opp) => sum + (opp.revenue || 0), 0);
  const avgProbability = opportunities.length > 0
    ? Math.round(opportunities.reduce((sum, opp) => sum + (opp.probability || 0), 0) / opportunities.length)
    : 0;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Expansion Opportunities</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadOpportunities} className="mt-2">
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
          <h2 className="text-xl font-semibold">Expansion Opportunities</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{opportunities.length} opportunities</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadOpportunities}>
          Refresh
        </Button>
      </div>

      {opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Pipeline</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{formatCurrency(totalRevenue)}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Avg Win Probability</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{avgProbability}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-400px)]">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No expansion opportunities yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 pr-4">
            {opportunities.map(opp => (
              <Card key={opp.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{opp.title}</h3>
                      {opp.account && (
                        <p className="text-xs text-muted-foreground mt-0.5">{opp.account}</p>
                      )}
                    </div>
                    <Badge className={`text-xs ${stageColors[opp.stage] || "bg-gray-100 text-gray-700"}`}>
                      {opp.stage}
                    </Badge>
                  </div>
                  {opp.description && (
                    <p className="text-xs text-muted-foreground mb-3">{opp.description}</p>
                  )}
                  <div className="space-y-2">
                    {opp.probability !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Win Probability</span>
                          <span className="font-medium">{opp.probability}%</span>
                        </div>
                        <Progress value={opp.probability} className="h-1.5" />
                      </div>
                    )}
                    {opp.revenue && (
                      <div className="flex items-center justify-between text-xs pt-2 border-t">
                        <span className="text-muted-foreground">Potential Revenue</span>
                        <span className="font-semibold">{formatCurrency(opp.revenue)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
