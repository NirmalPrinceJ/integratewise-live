"use client";

import { useState, useEffect } from "react";
import { intelligence } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw, AlertTriangle, TrendingDown } from "lucide-react";

interface RiskSignal {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  entityType?: string;
  entityName?: string;
  signalType?: string;
  recommendation?: string;
  confidence?: number;
  detectedAt?: string;
}

export function PersonalRisksView() {
  const [signals, setSignals] = useState<RiskSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRisks();
  }, []);

  async function loadRisks() {
    try {
      setLoading(true);
      setError(null);
      const result = await intelligence.signals({ severity: "high" });
      const data = result.data || result.signals || [];
      const riskList = Array.isArray(data) ? data : [];
      // Filter for high severity and above
      const filtered = riskList.filter(s =>
        s.severity === "critical" || s.severity === "high"
      );
      setSignals(filtered);
    } catch (err: any) {
      setError(err.message || "Failed to load risk signals");
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }

  const severityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const severityIcons: Record<string, any> = {
    critical: AlertTriangle,
    high: AlertTriangle,
    medium: AlertCircle,
    low: AlertCircle,
  };

  const criticalCount = signals.filter(s => s.severity === "critical").length;
  const highCount = signals.filter(s => s.severity === "high").length;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Risk Signals</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadRisks} className="mt-2">
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
          <h2 className="text-xl font-semibold">Risk Signals</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{signals.length} active signals</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadRisks}>
          Refresh
        </Button>
      </div>

      {signals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Critical
              </p>
              <span className="text-2xl font-bold text-red-700">{criticalCount}</span>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> High Priority
              </p>
              <span className="text-2xl font-bold text-orange-700">{highCount}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-350px)]">
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
        ) : signals.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No risk signals detected</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 pr-4">
            {signals.map(signal => {
              const Icon = severityIcons[signal.severity];
              return (
                <Card key={signal.id} className={`border hover:shadow-md transition-shadow cursor-pointer ${severityColors[signal.severity]}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{signal.title}</h3>
                        {signal.entityName && (
                          <p className="text-xs opacity-75 mt-0.5">
                            {signal.entityType && `${signal.entityType}: `}{signal.entityName}
                          </p>
                        )}
                      </div>
                      <Badge
                        className={`text-xs flex-shrink-0 ${severityColors[signal.severity].split(" ").slice(0, 2).join(" ")}`}
                      >
                        {signal.severity.toUpperCase()}
                      </Badge>
                    </div>
                    {signal.signalType && (
                      <p className="text-xs opacity-75 mb-2">Type: {signal.signalType}</p>
                    )}
                    {signal.recommendation && (
                      <div className="p-2 rounded bg-black/10 mb-2">
                        <p className="text-xs font-medium mb-1">Recommended Action:</p>
                        <p className="text-xs leading-relaxed">{signal.recommendation}</p>
                      </div>
                    )}
                    {signal.confidence !== undefined && (
                      <p className="text-xs opacity-75 pt-2 border-t">
                        Confidence: {Math.round(signal.confidence * 100)}%
                      </p>
                    )}
                    {signal.detectedAt && (
                      <p className="text-xs opacity-75 mt-1">
                        Detected: {new Date(signal.detectedAt).toLocaleDateString()}
                      </p>
                    )}
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
