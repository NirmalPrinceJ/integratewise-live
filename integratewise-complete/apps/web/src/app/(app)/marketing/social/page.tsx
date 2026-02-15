"use client"

/**
 * Social Media Management — Track and manage social media presence
 * Ported from Figma Design marketing/social.tsx
 */

import { useState } from "react"
import { MessageSquare, Heart, Share2, Eye, TrendingUp, Calendar, Plus, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SocialPost {
  id: string
  platform: "linkedin" | "twitter" | "instagram" | "facebook"
  content: string
  status: "published" | "scheduled" | "draft"
  publishDate: string
  impressions: number
  engagements: number
  clicks: number
  shares: number
}

const posts: SocialPost[] = [
  { id: "sp1", platform: "linkedin", content: "Excited to announce our latest integration with Salesforce APAC! 🚀", status: "published", publishDate: "Feb 8", impressions: 12450, engagements: 342, clicks: 189, shares: 45 },
  { id: "sp2", platform: "twitter", content: "How we helped TechFlow Solutions reduce integration time by 60%...", status: "published", publishDate: "Feb 7", impressions: 8920, engagements: 215, clicks: 128, shares: 67 },
  { id: "sp3", platform: "linkedin", content: "Join our webinar: Integration Maturity in APAC — Feb 15th", status: "scheduled", publishDate: "Feb 12", impressions: 0, engagements: 0, clicks: 0, shares: 0 },
  { id: "sp4", platform: "instagram", content: "Behind the scenes: Building the future of business operations...", status: "draft", publishDate: "", impressions: 0, engagements: 0, clicks: 0, shares: 0 },
  { id: "sp5", platform: "twitter", content: "New case study: How HealthPlus achieved 95% compliance score 📊", status: "published", publishDate: "Feb 5", impressions: 5670, engagements: 178, clicks: 94, shares: 32 },
]

const platformConfig: Record<string, { color: string; icon: string }> = {
  linkedin: { color: "#0077B5", icon: "in" },
  twitter: { color: "#1DA1F2", icon: "𝕏" },
  instagram: { color: "#E4405F", icon: "📷" },
  facebook: { color: "#1877F2", icon: "f" },
}

export default function SocialPage() {
  const publishedPosts = posts.filter((p) => p.status === "published")
  const totalImpressions = publishedPosts.reduce((s, p) => s + p.impressions, 0)
  const totalEngagements = publishedPosts.reduce((s, p) => s + p.engagements, 0)
  const engagementRate = totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Media</h1>
          <p className="text-sm text-muted-foreground">Manage and track social media presence</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Impressions</span></div><p className="text-lg font-semibold">{totalImpressions.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Heart className="w-4 h-4 text-pink-500" /><span className="text-xs text-muted-foreground">Engagements</span></div><p className="text-lg font-semibold">{totalEngagements.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Engagement Rate</span></div><p className="text-lg font-semibold">{engagementRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Share2 className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Total Shares</span></div><p className="text-lg font-semibold">{publishedPosts.reduce((s, p) => s + p.shares, 0)}</p></CardContent></Card>
      </div>

      {/* Posts by status */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({posts.filter((p) => p.status === "published").length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({posts.filter((p) => p.status === "scheduled").length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({posts.filter((p) => p.status === "draft").length})</TabsTrigger>
        </TabsList>

        {["all", "published", "scheduled", "draft"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            {posts
              .filter((p) => tab === "all" || p.status === tab)
              .map((post) => {
                const cfg = platformConfig[post.platform]
                return (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: cfg.color }}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="capitalize text-[10px]">{post.platform}</Badge>
                            <Badge variant={post.status === "published" ? "default" : "outline"} className="text-[10px]">{post.status}</Badge>
                            {post.publishDate && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />{post.publishDate}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{post.content}</p>
                          {post.status === "published" && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.impressions.toLocaleString()}</span>
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.engagements}</span>
                              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.clicks}</span>
                              <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{post.shares}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
