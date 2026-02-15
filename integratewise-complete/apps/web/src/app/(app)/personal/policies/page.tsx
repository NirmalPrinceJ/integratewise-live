"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, Plus, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react"

const mockPolicies = [
  {
    id: "pol-1",
    name: "Data Retention",
    description: "Customer data retained for 2 years post-contract",
    status: "active",
    category: "compliance",
    lastUpdated: "2026-01-15",
    enforcement: "automatic"
  },
  {
    id: "pol-2",
    name: "Discount Approval Threshold",
    description: "Discounts >20% require VP approval",
    status: "active",
    category: "sales",
    lastUpdated: "2026-01-10",
    enforcement: "workflow"
  },
  {
    id: "pol-3",
    name: "Security Access Review",
    description: "Quarterly review of all system access",
    status: "warning",
    category: "security",
    lastUpdated: "2025-10-01",
    enforcement: "manual"
  },
  {
    id: "pol-4",
    name: "API Rate Limiting",
    description: "1000 requests per minute per API key",
    status: "active",
    category: "technical",
    lastUpdated: "2026-02-01",
    enforcement: "automatic"
  }
]

export default function PoliciesPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning": return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "draft": return <Clock className="h-5 w-5 text-gray-500" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">Governance rules and compliance policies</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Policy
        </Button>
      </div>

      <div className="grid gap-4">
        {mockPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(policy.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{policy.name}</h3>
                      <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                        {policy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{policy.category}</Badge>
                      <span>Enforcement: {policy.enforcement}</span>
                      <span>Updated: {policy.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <Switch defaultChecked={policy.status === "active"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
