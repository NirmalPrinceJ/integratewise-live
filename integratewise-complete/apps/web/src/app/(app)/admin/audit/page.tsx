"use client"

import { PageHeader } from "@/components/spine/page-header"
import { useAdminAudit, AuditLogEntry } from "@/hooks/useAdminAudit"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Search, Filter, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuditLogsPage() {
  const { entries, loading, error, refresh } = useAdminAudit()

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          Failed to load audit logs.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all activity in your workspace"
        stageId="AUDIT-029"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => refresh()}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search logs..." className="pl-9" />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actor</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Object</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && entries.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4" colSpan={5}>
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : (
              entries.map((log: AuditLogEntry) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold ${log.action.includes('CREATE') ? 'bg-green-50 text-green-700 border-green-200' :
                          log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            log.action.includes('DELETE') ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {log.actor.slice(-2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{log.actor}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="text-gray-500">{log.objectType}:</span>{' '}
                      <span className="font-medium text-gray-900">{log.objectId}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                    {log.justification || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {entries.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-500">
            No audit entries found.
          </div>
        )}
      </div>
    </div>
  )
}
