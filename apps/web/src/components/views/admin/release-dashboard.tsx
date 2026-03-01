import React from "react"
import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import {
    Rocket,
    History,
    RefreshCcw,
    ShieldAlert,
    Server,
    Code
} from "lucide-react"

export function ReleaseDashboard() {
    const releases = [
        { service: "Loader", status: "stable", env: "production", version: "2.4.1", updated: "1h ago" },
        { service: "Normalizer", status: "degraded", env: "production", version: "4.1.0", updated: "15m ago" },
        { service: "Spine", status: "stable", env: "production", version: "1.0.0", updated: "3d ago" },
        { service: "Think", status: "stable", env: "staging", version: "11.11.2-beta", updated: "5m ago" },
    ]

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title="Release Control"
                description="Monitor system releases, manage environment overrides, and trigger rollbacks."
                stageId="OPS-099"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Server className="w-5 h-5 text-green-600" />
                        <span className="text-xs font-bold text-green-700 uppercase">Production</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">11/12 Healthy</p>
                    <p className="text-sm text-green-700">1 Service Degraded (Normalizer)</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Code className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-bold text-blue-700 uppercase">Staging</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">100% Sync</p>
                    <p className="text-sm text-blue-700">Up to date with origin/main</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center">
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                        <Rocket className="w-4 h-4 mr-2" />
                        Push to Production
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-400" />
                        Active Services
                    </div>
                    <Button variant="ghost" size="sm">
                        <RefreshCcw className="w-3 h-3 mr-2" />
                        Refresh
                    </Button>
                </div>
                <div className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4 font-medium text-gray-500">Service</th>
                                <th className="text-left p-4 font-medium text-gray-500">Environment</th>
                                <th className="text-left p-4 font-medium text-gray-500">Version</th>
                                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {releases.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{r.service}</td>
                                    <td className="p-4 capitalize">{r.env}</td>
                                    <td className="p-4 font-mono text-xs">{r.version}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === "stable" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <ShieldAlert className="w-4 h-4 mr-1" /> Rollback
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
