"use client";

import { useState, useEffect } from "react";
import { knowledge } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search, RotateCcw, BookOpen } from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  similarity?: number;
  createdAt?: string;
  viewCount?: number;
}

export function PersonalKnowledgeView() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadKnowledge();
  }, []);

  async function loadKnowledge() {
    try {
      setLoading(true);
      setError(null);
      // Load recent items first
      const result = await knowledge.search("");
      const data = result.data || result.items || [];
      const itemList = Array.isArray(data) ? data : [];
      setItems(itemList);
      setFilteredItems(itemList);
    } catch (err: any) {
      setError(err.message || "Failed to load knowledge base");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }

    try {
      setLoading(true);
      const result = await knowledge.search(query);
      const data = result.data || result.items || [];
      const searchResults = Array.isArray(data) ? data : [];
      setFilteredItems(searchResults);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Knowledge Base</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadKnowledge} className="mt-2">
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
          <h2 className="text-xl font-semibold">Knowledge Base</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filteredItems.length} articles</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadKnowledge}>
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge articles..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-350px)]">
        {loading && searchQuery ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No articles match your search" : "No knowledge articles found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 pr-4">
            {filteredItems.map((item, idx) => (
              <Card key={item.id || idx} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.category && (
                        <Badge variant="outline" className="mt-1 text-xs">{item.category}</Badge>
                      )}
                    </div>
                    {item.similarity !== undefined && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        {Math.round(item.similarity * 100)}% match
                      </Badge>
                    )}
                  </div>
                  {item.excerpt && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {item.excerpt.length > 150 ? item.excerpt.substring(0, 150) + "..." : item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex gap-2">
                      {item.tags && item.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {item.viewCount && (
                      <span>{item.viewCount} views</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
