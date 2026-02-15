"use client"

/**
 * Marketing Attribution — Track channel and campaign attribution
 * Ported from Figma Design marketing/attribution.tsx
 */

import { useState } from "react"
import { BarChart3, Target, DollarSign, TrendingUp, Zap, Search, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AttributionChannel {
  id: string
  channel: string
  touchpoints: number
  conversions: number
  revenue: number
  roi: number
  trend: "up" | "down" | "flat"
  costPerAcquisition: number
  pipelineInfluenced: number
}

interface CampaignAttribution {
  id: string
  campaign: string
  channel: string
  firstTouch: number
  lastTouch: number
  multiTouch: number
  revenue: number
  status: "active" | "completed"
}

const channels: AttributionChannel[] = [
  { id: "ch1", channel: "Organic Search", touchpoints: 4520, conversions: 342, revenue: 285000, roi: 8.2, trend: "up", costPerAcquisition: 45, pipelineInfluenced: 890000 },
  { id: "ch2", channel: "Paid Search (Google)", touchpoints: 3210, conversions: 198, revenue: 195000, roi: 3.8, trend: "up", costPerAcquisition: 82, pipelineInfluenced: 620000 },
  { id: "ch3", channel: "LinkedIn Ads", touchpoints: 2890, conversions: 156, revenue: 178000, roi: 4.5, trend: "up", costPerAcquisition: 95, pipelineInfluenced: 540000 },
  { id: "ch4", channel: "Email Marketing", touchpoints: 5600, conversions: 412, revenue: 320000, roi: 12.4, trend: "up", costPerAcquisition: 22, pipelineInfluenced: 1200000 },
  { id: "ch5", channel: "Content / Blog", touchpoints: 8900, conversions: 267, revenue: 145000, roi: 6.1, trend: "flat", costPerAcquisition: 38, pipelineInfluenced: 480000 },
  { id: "ch6", channel: "Webinars", touchpoints: 1240, conversions: 189, revenue: 210000, roi: 5.6, trend: "down", costPerAcquisition: 110, pipelineInfluenced: 720000 },
  { id: "ch7", channel: "Partner Referral", touchpoints: 680, conversions: 92, revenue: 340000, roi: 18.5, trend: "up", costPerAcquisition: 28, pipelineInfluenced: 980000 },
]

const campaigns: CampaignAttribution[] = [
  { id: "ca1", campaign: "APAC Enterprise Push Q1", channel: "Multi-Channel", firstTouch: 45, lastTouch: 32, multiTouch: 78, revenue: 420000, status: "active" },
  { id: "ca2", campaign: "Integration Maturity Series", channel: "Webinars + Email", firstTouch: 34, lastTouch: 28, multiTouch: 56, revenue: 280000, status: "active" },
  { id: "ca3", campaign: "Always-On Lead Gen", channel: "Paid + Organic", firstTouch: 120, lastTouch: 89, multiTouch: 180, revenue: 560000, status: "active" },
  { id: "ca4", campaign: "Holiday Promo 2024", channel: "Email + Social", firstTouch: 67, lastTouch: 45, multiTouch: 92, revenue: 195000, status: "completed" },
  { id: "ca5", campaign: "Partner Co-Marketing", channel: "Referral + Content", firstTouch: 23, lastTouch: 18, multiTouch: 34, revenue: 310000, status: "active" },
]

export default function AttributionPage() {
  const totalRevenue = channels.reduce((s, c) => s + c.revenue, 0)
  const totalConversions = channels.reduce((s, c) => s + c.conversions, 0)
  const totalPipeline = channels.reduce((s, c) => s + c.pipelineInfluenced, 0)
  const avgROI = (channels.reduce((s, c) => s + c.roi, 0) / channels.length).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attribution</h1>
        <p className="text-sm text-muted-foreground">Multi-touch attribution and channel performance</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Attributed Revenue</span></div><p className="text-lg font-semibold">${(totalRevenue / 1000).toFixed(0)}k</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Conversions</span></div><p className="text-lg font-semibold">{totalConversions.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Pipeline Influenced</span></div><p className="text-lg font-semibold">${(totalPipeline / 1000000).toFixed(1)}M</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-orange-500" /><span className="text-xs text-muted-foreground">Avg ROI</span></div><p className="text-lg font-semibold">{avgROI}x</p></CardContent></Card>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList>
          <TabsTrigger value="channels">Channel Attribution</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Attribution</TabsTrigger>
        </TabsList>

        {/* Channel Attribution */}
        <TabsContent value="channels" className="space-y-3 mt-4">
          {channels
            .sort((a, b) => b.revenue - a.revenue)
            .map((ch) => {
              const revenueShare = (ch.revenue / totalRevenue) * 100
              return (
                <Card key={ch.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{ch.channel}</h3>
                        {ch.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                        {ch.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">${(ch.revenue / 1000).toFixed(0)}k revenue</Badge>
                    </div>
                    <Progress value={revenueShare} className="h-1.5 mb-3" />
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Touchpoints</span><p className="font-mono font-medium">{ch.touchpoints.toLocaleString()}</p></div>
                      <div><span className="text-muted-foreground">Conversions</span><p className="font-mono font-medium">{ch.conversions}</p></div>
                      <div><span className="text-muted-foreground">ROI</span><p className="font-mono font-medium">{ch.roi}x</p></div>
                      <div><span className="text-muted-foreground">CPA</span><p className="font-mono font-medium">${ch.costPerAcquisition}</p></div>
                      <div><span className="text-muted-foreground">Pipeline</span><p className="font-mono font-medium">${(ch.pipelineInfluenced / 1000).toFixed(0)}k</p></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </TabsContent>

        {/* Campaign Attribution */}
        <TabsContent value="campaigns" className="space-y-3 mt-4">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-sm">{c.campaign}</h3>
                    <p className="text-[10px] text-muted-foreground">{c.channel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.status === "active" ? "default" : "outline"} className="text-[10px]">{c.status}</Badge>
                    <Badge variant="secondary" className="font-mono text-xs">${(c.revenue / 1000).toFixed(0)}k</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground mb-1">First-Touch</p>
                    <p className="text-lg font-semibold">{c.firstTouch}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground mb-1">Last-Touch</p>
                    <p className="text-lg font-semibold">{c.lastTouch}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-[10px] text-muted-foreground mb-1">Multi-Touch</p>
                    <p className="text-lg font-semibold text-primary">{c.multiTouch}</p>
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
