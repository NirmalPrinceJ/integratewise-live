"use client";

import { useState, useEffect } from "react";
import { pipeline } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Building2, RotateCcw, DollarSign, TrendingUp } from "lucide-react";

interface Account {
  id: string;
  name: string;
  arr?: number;
  mrr?: number;
  healthScore?: number;
  renewalDate?: string;
  tier?: string;
  status?: string;
}

export function PersonalAccountsView() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      setLoading(true);
      setError(null);
      const result = await pipeline.entities({ type: "account", limit: 25 });
      const data = result.data || result.entities || [];
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load accounts");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value?: number): string {
    if (!value) return "-";
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  }

  const totalARR = accounts.reduce((sum, a) => sum + (a.arr || 0), 0);
  const avgHealth = accounts.length > 0
    ? Math.round(accounts.reduce((sum, a) => sum + (a.healthScore || 0), 0) / accounts.length)
    : 0;

  const healthColors: Record<string, string> = {
    excellent: "bg-emerald-100 text-emerald-700",
    good: "bg-blue-100 text-blue-700",
    at_risk: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
  };

  function getHealthStatus(score?: number): string {
    if (!score) return "unknown";
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "at_risk";
    return "critical";
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Accounts</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadAccounts} className="mt-2">
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
          <h2 className="text-xl font-semibold">Accounts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{accounts.length} accounts</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadAccounts}>
          Refresh
        </Button>
      </div>

      {accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Total ARR
              </p>
              <span className="text-2xl font-bold">{formatCurrency(totalARR)}</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Avg Health
              </p>
              <span className="text-2xl font-bold">{avgHealth}%</span>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Count
              </p>
              <span className="text-2xl font-bold">{accounts.length}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-350px)]">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/3 mb-3" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No accounts found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 pr-4">
            {accounts.map(account => {
              const health = account.healthScore || 0;
              const healthStatus = getHealthStatus(health);
              return (
                <Card key={account.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{account.name}</h3>
                        {account.tier && (
                          <Badge variant="outline" className="mt-1 text-xs">{account.tier}</Badge>
                        )}
                      </div>
                      <Badge className={`text-xs ${healthColors[healthStatus] || "bg-gray-100 text-gray-700"}`}>
                        Health: {health}%
                      </Badge>
                    </div>
                    <Progress value={health} className="h-1.5 mb-3" />
                    <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
                      {account.arr && (
                        <div>
                          <p className="text-muted-foreground">ARR</p>
                          <p className="font-semibold">{formatCurrency(account.arr)}</p>
                        </div>
                      )}
                      {account.renewalDate && (
                        <div>
                          <p className="text-muted-foreground">Renewal</p>
                          <p className="font-semibold">{new Date(account.renewalDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
