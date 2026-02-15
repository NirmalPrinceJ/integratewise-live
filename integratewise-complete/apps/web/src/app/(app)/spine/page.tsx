"use client"

import { useState, useEffect } from "react"
import { KBHeader } from "@/components/layouts/kb-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CompletenessBadge } from "@/components/workspace/completeness-badge"
import { useL2Drawer } from "@/components/cognitive/l2-drawer"
import { spineClient, type SpineEntity } from "@/lib/spine-client"
import { RefreshCw, Database } from "lucide-react"

export default function SpinePage() {
  // TODO: Get real tenant ID from auth
  const tenantId = "00000000-0000-0000-0000-000000000000"
  const { openDrawer } = useL2Drawer()

  const [entities, setEntities] = useState<SpineEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEntities()
  }, [])

  const loadEntities = async () => {
    try {
      setLoading(true)
      const data = await spineClient.listEntities({ tenant_id: tenantId, entity_type: "account" })
      setEntities(data.entities)
      setError(null)
    } catch (err) {
      console.error("Failed to load entities:", err)
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2F3E5F] mb-2">Truth Store (Loop B)</h1>
            <p className="text-gray-600">The Spine: Single Source of Truth for verified data</p>
          </div>
          <Button variant="outline" className="bg-white border-[#4A6FA5] text-[#4A6FA5]">
            <span className="w-2 h-2 rounded-full bg-[#4A6FA5] mr-2 animate-pulse" />
            Data Connect Status
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-white p-6">
            <div className="text-sm text-gray-600 mb-2">Total Entities</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-[#2F3E5F]">{loading ? "..." : entities.length}</div>
              <Database className="w-6 h-6 text-[#4A6FA5]" />
            </div>
          </Card>

          <Card className="bg-white p-6">
            <div className="text-sm text-gray-600 mb-2">Avg Completeness</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-[#4A6FA5]">
                {loading ? "..." : Math.round(entities.reduce((acc, e) => acc + (e.completeness_score || 0), 0) / entities.length || 0)}%
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">Live</Badge>
            </div>
          </Card>

          <Card className="bg-white p-6">
            <div className="text-sm text-gray-600 mb-2">Complete</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-green-600">
                {loading ? "..." : entities.filter(e => (e.completeness_score || 0) >= 80).length}
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">≥80%</Badge>
            </div>
          </Card>

          <Card className="bg-white p-6">
            <div className="text-sm text-gray-600 mb-2">Needs Attention</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-red-600">
                {loading ? "..." : entities.filter(e => (e.completeness_score || 0) < 50).length}
              </div>
              <Badge className="bg-red-100 text-red-700 border-0">&lt;50%</Badge>
            </div>
          </Card>
        </div>

        {/* Organizations Table */}
        <Card className="bg-white">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2F3E5F]">Entities in Adaptive Spine</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white gap-2"
                  onClick={loadEntities}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button className="bg-[#4A6FA5] hover:bg-[#3d5a8f]" size="sm">
                  + Ingest Data
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Failed to load entities</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={loadEntities} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : entities.length === 0 ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No entities yet</h3>
                <p className="text-gray-500 mb-4">Upload data via the Loader to start populating the Spine.</p>
                <Button className="bg-[#4A6FA5] hover:bg-[#3d5a8f]">
                  Go to Loader
                </Button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Data Completeness
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fields
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entities.map((entity) => (
                    <tr key={entity.entity_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#2F3E5F] rounded flex items-center justify-center text-white font-bold mr-3">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#2F3E5F]">{entity.data?.name || entity.entity_id.slice(0, 8)}</div>
                            <div className="text-xs text-gray-500 font-mono">{entity.entity_id.slice(0, 16)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-[#4A6FA5] text-[#4A6FA5]">
                          {entity.entity_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <CompletenessBadge
                          entityId={entity.entity_id}
                          tenantId={tenantId}
                          variant="inline"
                          showFields={true}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {entity.fields_present} / {entity.fields_expected}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(entity.updated_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="link"
                          className="text-[#4A6FA5] hover:text-[#3d5a8f] p-0"
                          onClick={() => {
                            // L1 → L2: Open cognitive drawer to analyze entity
                            openDrawer({
                              trigger: 'ui_click',
                              contextType: 'entity',
                              contextId: entity.entity_id,
                              requestedSurface: 'spine',
                              userMode: 'analyst'
                            })
                          }}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
