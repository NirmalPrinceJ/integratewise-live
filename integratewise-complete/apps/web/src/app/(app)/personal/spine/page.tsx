"use client"

import { useState } from "react"
import { useSpineCompleteness } from "@/hooks/useSpineCompleteness"
import { EntityCardWithBadges } from "@/components/workspace/entity-card-with-badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database, Search, RefreshCw } from "lucide-react"
import { useEntities } from "@/hooks/useEntities"

export default function SpinePage() {
  const { entities, isLoading: entitiesLoading } = useEntities("account")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEntities = (entities || []).map((entity: any) => ({
    id: entity.id,
    type: "account",
    name: entity.data?.name || entity.name || "Unnamed Entity",
    subtitle: entity.data?.industry || entity.category || "Entity",
    healthScore: entity.data?.health_score || 0
  })).filter(
    (entity: any) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const entityIds = filteredEntities.map((e: any) => e.id)

  const {
    data: completenessData,
    loading: completenessLoading,
    refetch,
  } = useSpineCompleteness({
    entityIds,
    entityType: "account",
    pollInterval: 30000,
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-[#4154A3]" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Spine</h1>
            <p className="text-xs text-muted-foreground">
              L3 Adaptive Spine Data - Single Source of Truth
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search entities..."
          className="pl-10"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredEntities.length}</div>
            <div className="text-xs text-gray-500">Total Entities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                filteredEntities.filter((e: any) => (e.healthScore || 0) >= 80)
                  .length
              }
            </div>
            <div className="text-xs text-gray-500">Healthy (&gt;80%)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">
              {
                filteredEntities.filter((e: any) => {
                  const score = e.healthScore || 0
                  return score >= 60 && score < 80
                }).length
              }
            </div>
            <div className="text-xs text-gray-500">Needs Attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entitiesLoading || completenessLoading
          ? // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))
          : // Entity cards with completeness badges
          filteredEntities.map((entity: any) => {
            const completeness = completenessData.get(entity.id)
            return (
              <EntityCardWithBadges
                key={entity.id}
                entityId={entity.id}
                entityType={entity.type}
                name={entity.name}
                subtitle={entity.subtitle}
                completeness={completeness?.completeness}
                missingFields={completeness?.missingFields}
                healthScore={entity.healthScore}
                lastSynced={completeness?.lastSynced}
                href={`/accounts/${entity.id}`}
              />
            )
          })}
      </div>

      {/* Empty state */}
      {filteredEntities.length === 0 && !entitiesLoading && !completenessLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No entities found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search query
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
