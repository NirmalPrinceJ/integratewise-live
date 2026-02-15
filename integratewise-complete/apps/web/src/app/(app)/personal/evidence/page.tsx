"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CheckCircle2, AlertCircle, Download, Eye } from "lucide-react"

const mockEvidence = [
  {
    id: "ev-1",
    title: "Q4 Business Review - Acme Corp",
    type: "presentation",
    status: "verified",
    date: "2026-01-15",
    size: "2.4 MB",
    author: "Alice Johnson"
  },
  {
    id: "ev-2",
    title: "Contract Amendment - Enterprise Terms",
    type: "contract",
    status: "verified",
    date: "2026-01-10",
    size: "1.1 MB",
    author: "Legal Team"
  },
  {
    id: "ev-3",
    title: "Security Assessment Report",
    type: "report",
    status: "pending",
    date: "2026-02-01",
    size: "3.2 MB",
    author: "Security Team"
  },
  {
    id: "ev-4",
    title: "Usage Analytics - Last 90 Days",
    type: "data",
    status: "verified",
    date: "2026-02-05",
    size: "850 KB",
    author: "System"
  }
]

export default function EvidencePage() {
  const getStatusIcon = (status: string) => {
    return status === "verified" 
      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
      : <AlertCircle className="h-4 w-4 text-amber-500" />
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evidence</h1>
        <p className="text-muted-foreground">Document repository and proof points</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockEvidence.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{item.type}</Badge>
                        <span>{item.author}</span>
                        <span>{item.date}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
