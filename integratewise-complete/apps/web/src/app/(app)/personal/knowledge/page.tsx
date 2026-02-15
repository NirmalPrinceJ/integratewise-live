"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain, Plus, Search, BookOpen, Sparkles, MessageSquare,
  FileText, Link2, Clock, MoreHorizontal, ExternalLink,
  Lightbulb, TrendingUp, Layers, Hash
} from "lucide-react";

import { useKnowledge, useKnowledgeStats, KnowledgeItem } from "@/hooks/useKnowledge";
import { Skeleton } from "@/components/ui/skeleton";

const typeConfig = {
  article: { label: "Article", icon: BookOpen, color: "bg-blue-100 text-blue-700" },
  insight: { label: "AI Insight", icon: Sparkles, color: "bg-purple-100 text-purple-700" },
  faq: { label: "FAQ", icon: MessageSquare, color: "bg-green-100 text-green-700" },
  framework: { label: "Framework", icon: Layers, color: "bg-orange-100 text-orange-700" },
  research: { label: "Research", icon: TrendingUp, color: "bg-yellow-100 text-yellow-700" }
};

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { items, isLoading, error } = useKnowledge({
    search: searchQuery !== "" ? searchQuery : undefined,
    type: activeTab !== "all" ? activeTab : undefined
  });

  const { stats, isLoading: statsLoading } = useKnowledgeStats();

  const allTopics = Array.from(new Set(items.flatMap((i: KnowledgeItem) => i.topics)));

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading knowledge items: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-10 w-full max-w-lg" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Space</h1>
          <p className="text-muted-foreground">Access insights, docs, and AI-powered intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.insights}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Topics</CardTitle>
            <Hash className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search knowledge base or ask a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Popular Topics */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Popular:</span>
        {allTopics.slice(0, 8).map((topic, idx) => (
          <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-muted">
            {topic}
          </Badge>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="insight">AI Insights</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="framework">Frameworks</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {items.map((item: KnowledgeItem) => {
              const type = typeConfig[item.type as keyof typeof typeConfig];
              const TypeIcon = type.icon;

              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${type.color}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary">{type.label}</Badge>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {item.source}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {item.topics.map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{topic}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Lightbulb className="h-4 w-4" />
                              {item.helpful} helpful
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(item.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
