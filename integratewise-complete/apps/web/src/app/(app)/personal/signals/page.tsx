"use client"

/**
 * Signals Page - L1 View
 * Displays signals from the cognitive layer (L2)
 */

import { useSignals } from "@/hooks/use-signals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"

export default function SignalsPage() {
  const { signals, loading, error } = useSignals("operations")

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-amber-100 text-amber-800"
          >
            Warning
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Info
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Signals</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Signals</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700">Failed to load signals: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Signals</h1>
        <Badge variant="outline" className="text-xs">
          {signals.length} active
        </Badge>
      </div>

      <div className="space-y-4">
        {signals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No signals detected</p>
              <p className="text-sm text-gray-400 mt-1">
                Signals appear when the system detects risks, opportunities, or
                actions
              </p>
            </CardContent>
          </Card>
        ) : (
          signals.map((signal) => (
            <Card
              key={signal.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getSeverityIcon(signal.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityBadge(signal.severity)}
                      <span className="text-xs text-gray-500">
                        {signal.source}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {signal.event}
                    </h3>
                    {signal.entity && (
                      <p className="text-sm text-gray-600">
                        Entity:{" "}
                        {signal.entityLink ? (
                          <Link
                            href={signal.entityLink}
                            className="text-blue-600 hover:underline"
                          >
                            {signal.entity}
                          </Link>
                        ) : (
                          signal.entity
                        )}
                      </p>
                    )}
                    {signal.metadata && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(signal.metadata).map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(signal.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
