"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Building } from "lucide-react"

const mockPredictions = [
  {
    id: "pred-1",
    type: "churn",
    entity: "TechStart Inc",
    probability: 78,
    impact: "high",
    reason: "Usage down 45%, no login in 14 days",
    trend: "up"
  },
  {
    id: "pred-2",
    type: "expansion",
    entity: "Acme Corporation",
    probability: 82,
    impact: "high",
    reason: "High engagement, approaching limit",
    trend: "up"
  },
  {
    id: "pred-3",
    type: "renewal",
    entity: "Global Retail Co",
    probability: 45,
    impact: "medium",
    reason: "Delayed renewal conversation",
    trend: "down"
  },
  {
    id: "pred-4",
    type: "upsell",
    entity: "FinanceHub",
    probability: 67,
    impact: "medium",
    reason: "API usage growing 20% MoM",
    trend: "up"
  }
]

export default function PredictionsPage() {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      churn: "bg-red-100 text-red-600",
      expansion: "bg-green-100 text-green-600",
      renewal: "bg-blue-100 text-blue-600",
      upsell: "bg-purple-100 text-purple-600"
    }
    return colors[type] || "bg-gray-100"
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
        <p className="text-muted-foreground">AI-powered forecasts and risk assessments</p>
      </div>

      <div className="grid gap-4">
        {mockPredictions.map((pred) => (
          <Card key={pred.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getTypeColor(pred.type)}`}>
                  {pred.trend === "up" ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold capitalize">{pred.type} Risk</h3>
                      <Badge variant={pred.impact === "high" ? "destructive" : "default"}>
                        {pred.impact} impact
                      </Badge>
                    </div>
                    <span className="text-2xl font-bold">{pred.probability}%</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{pred.entity}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pred.reason}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Confidence</span>
                        <span>{pred.probability}%</span>
                      </div>
                      <Progress value={pred.probability} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
