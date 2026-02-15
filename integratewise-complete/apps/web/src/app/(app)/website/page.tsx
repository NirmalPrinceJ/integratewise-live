"use client"

/**
 * Website Dashboard — Pages, blog, SEO, media management
 * Ported from Figma Design website/ components
 */

import { Globe, FileText, Image, BarChart3, Search, TrendingUp, Eye, MousePointer, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const siteMetrics = {
  totalPages: 34,
  publishedPosts: 28,
  monthlyVisitors: 45200,
  avgTimeOnSite: "3:42",
  bounceRate: 38,
  topPage: "/pricing",
  conversionRate: 4.2,
}

const pages = [
  { path: "/", title: "Home", views: 12400, conversions: 520, status: "published" as const },
  { path: "/pricing", title: "Pricing", views: 8900, conversions: 892, status: "published" as const },
  { path: "/product", title: "Product", views: 6700, conversions: 201, status: "published" as const },
  { path: "/demo", title: "Request Demo", views: 4500, conversions: 675, status: "published" as const },
  { path: "/blog", title: "Blog Index", views: 3200, conversions: 96, status: "published" as const },
  { path: "/about", title: "About Us", views: 2100, conversions: 42, status: "published" as const },
  { path: "/careers", title: "Careers", views: 1800, conversions: 0, status: "draft" as const },
]

const blogPosts = [
  { title: "Integration Maturity: A Framework for APAC", date: "Feb 8", views: 2340, status: "published" as const, category: "Thought Leadership" },
  { title: "How TechServe Reduced Integration Time by 60%", date: "Feb 5", views: 1890, status: "published" as const, category: "Case Study" },
  { title: "5 Signs Your RevOps Needs Automation", date: "Feb 1", views: 4520, status: "published" as const, category: "Guide" },
  { title: "Q1 Product Updates: What's New", date: "Jan 28", views: 1240, status: "published" as const, category: "Product" },
  { title: "Data Integration Best Practices for Healthcare", date: "Draft", views: 0, status: "draft" as const, category: "Guide" },
]

const seoScores = [
  { page: "Home", score: 92, issues: 1 },
  { page: "Pricing", score: 88, issues: 2 },
  { page: "Product", score: 85, issues: 3 },
  { page: "Blog", score: 95, issues: 0 },
  { page: "Demo", score: 78, issues: 4 },
]

export default function WebsiteDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Website</h1>
        <p className="text-sm text-muted-foreground">Manage pages, blog, SEO, and media assets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Monthly Visitors</span></div><p className="text-lg font-semibold">{siteMetrics.monthlyVisitors.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><MousePointer className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Conversion Rate</span></div><p className="text-lg font-semibold">{siteMetrics.conversionRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><FileText className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Pages</span></div><p className="text-lg font-semibold">{siteMetrics.totalPages}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-amber-500" /><span className="text-xs text-muted-foreground">Bounce Rate</span></div><p className="text-lg font-semibold">{siteMetrics.bounceRate}%</p></CardContent></Card>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Pages */}
        <TabsContent value="pages" className="space-y-2 mt-4">
          {pages.map((page) => {
            const convRate = page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : "0"
            return (
              <Card key={page.path}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{page.title}</p>
                      <Badge variant={page.status === "published" ? "default" : "outline"} className="text-[10px]">{page.status}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">{page.path}</p>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right"><p className="text-muted-foreground">Views</p><p className="font-mono font-medium">{page.views.toLocaleString()}</p></div>
                    <div className="text-right"><p className="text-muted-foreground">Conversions</p><p className="font-mono font-medium">{page.conversions}</p></div>
                    <div className="text-right"><p className="text-muted-foreground">Conv. Rate</p><p className="font-mono font-medium">{convRate}%</p></div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* Blog */}
        <TabsContent value="blog" className="space-y-2 mt-4">
          {blogPosts.map((post) => (
            <Card key={post.title}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{post.title}</p>
                    <Badge variant={post.status === "published" ? "default" : "outline"} className="text-[10px]">{post.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{post.date}</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-mono font-medium">{post.views > 0 ? post.views.toLocaleString() : "—"}</p>
                  <p className="text-muted-foreground">views</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-3 mt-4">
          {seoScores.map((item) => (
            <Card key={item.page}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.page}</span>
                  <div className="flex items-center gap-2">
                    {item.issues > 0 && <Badge variant="destructive" className="text-[10px]">{item.issues} issues</Badge>}
                    <span className={`text-sm font-bold ${item.score >= 90 ? "text-green-600" : item.score >= 80 ? "text-amber-500" : "text-red-500"}`}>{item.score}</span>
                  </div>
                </div>
                <Progress value={item.score} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
