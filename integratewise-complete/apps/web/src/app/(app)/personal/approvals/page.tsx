"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Clock, AlertCircle, FileText, User } from "lucide-react"

import { useGovernance, ApprovalRequest } from "@/hooks/use-governance"
import { Skeleton } from "@/components/ui/skeleton"

export default function ApprovalsPage() {
  const { queue: approvals, loading, makeDecision } = useGovernance()

  const pendingCount = approvals.filter((a: ApprovalRequest) => a.status === "pending").length
  const urgentCount = approvals.filter((a: ApprovalRequest) => a.status === "pending" && a.priority === "high").length

  const handleDecision = async (id: string, decision: "approve" | "reject") => {
    try {
      await makeDecision(id, decision)
    } catch (err) {
      console.error("Decision failed:", err)
    }
  }

  if (loading && approvals.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive">High</Badge>
      case "medium": return <Badge variant="default">Medium</Badge>
      case "low": return <Badge variant="outline">Low</Badge>
      default: return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected": return <XCircle className="h-5 w-5 text-red-500" />
      case "pending": return <Clock className="h-5 w-5 text-amber-500" />
      default: return null
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending requests</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{urgentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {approvals.filter(a => a.status === "pending").map((approval) => (
            <Card key={approval.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{approval.title}</h3>
                      {getPriorityBadge(approval.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{approval.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {approval.requestor}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {approval.amount}
                      </span>
                      <span>{approval.submittedAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDecision(approval.id, "reject")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleDecision(approval.id, "approve")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvals.filter(a => a.status === "approved").map((approval) => (
            <Card key={approval.id} className="opacity-75">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{approval.title}</h3>
                  <p className="text-sm text-muted-foreground">{approval.description}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {approvals.filter(a => a.status === "rejected").map((approval) => (
            <Card key={approval.id} className="opacity-75">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{approval.title}</h3>
                  <p className="text-sm text-muted-foreground">{approval.description}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-500" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
