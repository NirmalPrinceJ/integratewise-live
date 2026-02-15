"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { spineClient } from "@/lib/spine-client"
import { Database, AlertCircle } from "lucide-react"

interface CompletenessBadgeProps {
  entityId: string
  tenantId: string
  variant?: "badge" | "detailed" | "inline"
  showFields?: boolean
}

export function CompletenessBadge({
  entityId,
  tenantId,
  variant = "badge",
  showFields = false
}: CompletenessBadgeProps) {
  const [loading, setLoading] = useState(true)
  const [completeness, setCompleteness] = useState<number | null>(null)
  const [fieldsPresent, setFieldsPresent] = useState<number>(0)
  const [fieldsExpected, setFieldsExpected] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCompleteness()
  }, [entityId, tenantId])

  const loadCompleteness = async () => {
    try {
      setLoading(true)
      const data = await spineClient.getCompleteness(entityId)
      setCompleteness(data.completeness_score)
      setFieldsPresent(data.fields_present)
      setFieldsExpected(data.fields_expected)
      setError(null)
    } catch (err) {
      console.error("Failed to load completeness:", err)
      setError("Failed to load")
      setCompleteness(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-6 w-20" />
  }

  if (error || completeness === null) {
    return (
      <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-500">
        <AlertCircle className="w-3 h-3 mr-1" />
        Unknown
      </Badge>
    )
  }

  const getColorClasses = (score: number) => {
    if (score >= 80) return { bg: "bg-green-100", text: "text-green-700", border: "border-0" }
    if (score >= 50) return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-0" }
    return { bg: "bg-red-100", text: "text-red-700", border: "border-0" }
  }

  const colors = getColorClasses(completeness)

  // Badge variant - Simple compact badge
  if (variant === "badge") {
    return (
      <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
        <Database className="w-3 h-3 mr-1" />
        {completeness}%
      </Badge>
    )
  }

  // Detailed variant - Shows progress bar
  if (variant === "detailed") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Data Completeness</span>
          <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
            {completeness}%
          </Badge>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              completeness >= 80 ? "bg-green-500" :
              completeness >= 50 ? "bg-yellow-500" :
              "bg-red-500"
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        {showFields && (
          <p className="text-xs text-gray-500">
            {fieldsPresent} of {fieldsExpected} fields
          </p>
        )}
      </div>
    )
  }

  // Inline variant - Shows percentage with progress bar inline
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
          {completeness}%
        </Badge>
        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              completeness >= 80 ? "bg-green-500" :
              completeness >= 50 ? "bg-yellow-500" :
              "bg-red-500"
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        {showFields && (
          <span className="text-xs text-gray-500">
            {fieldsPresent}/{fieldsExpected}
          </span>
        )}
      </div>
    )
  }

  return null
}
