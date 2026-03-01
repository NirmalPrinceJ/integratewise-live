"use client";

import { useState, useEffect } from "react";
import { pipeline } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw } from "lucide-react";

interface PipelineEntity {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export function PersonalPipelineView() {
  const [entities, setEntities] = useState<PipelineEntity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<PipelineEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    loadEntities();
  }, []);

  async function loadEntities() {
    try {
      setLoading(true);
      setError(null);
      const result = await pipeline.entities({ limit: 25 });
      const data = result.data || result.entities || [];
      setEntities(Array.isArray(data) ? data : []);
      applyFilters(Array.isArray(data) ? data : [], search, typeFilter);
    } catch (err: any) {
      setError(err.message || "Failed to load pipeline entities");
      setEntities([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(data: PipelineEntity[], searchTerm: string, type: string | null) {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (type) {
      filtered = filtered.filter(e => e.type === type);
    }
    setFilteredEntities(filtered);
  }

  function handleSearch(value: string) {
    setSearch(value);
    applyFilters(entities, value, typeFilter);
  }

  function handleTypeFilter(type: string) {
    setTypeFilter(type === typeFilter ? null : type);
    applyFilters(entities, search, type === typeFilter ? null : type);
  }

  const types = [...new Set(entities.map(e => e.type))].filter(Boolean);
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    inactive: "bg-gray-100 text-gray-700",
    processing: "bg-blue-100 text-blue-700",
    error: "bg-red-100 text-red-700",
  };

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pipeline</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadEntities} className="mt-2">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Pipeline</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filteredEntities.length} entities</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search entities..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button size="sm" variant="outline" onClick={loadEntities}>
            Refresh
          </Button>
        </div>
      </div>

      {types.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {types.map(type => (
            <Button
              key={type}
              size="sm"
              variant={typeFilter === type ? "default" : "outline"}
              onClick={() => handleTypeFilter(type)}
              className="text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-300px)]">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEntities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No entities found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 pr-4">
            {filteredEntities.map(entity => (
              <Card key={entity.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{entity.name}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{entity.type}</Badge>
                        <Badge className={`text-xs ${statusColors[entity.status] || "bg-gray-100 text-gray-700"}`}>
                          {entity.status}
                        </Badge>
                      </div>
                      {entity.updatedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Updated: {new Date(entity.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
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
