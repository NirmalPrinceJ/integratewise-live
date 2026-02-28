import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Brain, TrendingUp, AlertTriangle, Zap, Loader2 } from "lucide-react";
import { useInsights, useInsightStats } from "../../hooks/useInsights";

export function IntelligencePage() {
  const { insights, loading, dismiss } = useInsights();
  const { stats } = useInsightStats();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Intelligence</h1>
          <p className="text-gray-500">AI-powered insights from your connected data</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{stats?.growth || 0} Growth</Badge>
          <Badge variant="destructive">{stats?.risk || 0} Risks</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    insight.insight_type === "growth"
                      ? "bg-green-100 text-green-600"
                      : insight.insight_type === "risk"
                      ? "bg-red-100 text-red-600"
                      : insight.insight_type === "anomaly"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {insight.insight_type === "growth" && <TrendingUp className="h-5 w-5" />}
                  {insight.insight_type === "risk" && <AlertTriangle className="h-5 w-5" />}
                  {insight.insight_type === "anomaly" && <Zap className="h-5 w-5" />}
                  {insight.insight_type === "opportunity" && <Brain className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{insight.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex gap-2">
                    <button className="text-sm font-medium text-black hover:underline">
                      View Details →
                    </button>
                    <button 
                      onClick={() => dismiss(insight.id)}
                      className="text-sm text-gray-400 hover:text-gray-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {insights.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No insights yet</h3>
              <p className="text-gray-500">
                Connect more tools to get AI-powered insights
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
