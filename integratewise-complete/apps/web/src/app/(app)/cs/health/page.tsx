import { PageHeader } from "@/components/spine/page-header"
import { MetricCard } from "@/components/spine/metric-card"
import { Users, TrendingUp, AlertTriangle, Heart } from "lucide-react"

const customers = [
  { name: "HealthPlus Corp", health: 85, trend: "up", risk: "low", nps: 72 },
  { name: "TechCorp Solutions", health: 92, trend: "up", risk: "low", nps: 85 },
  { name: "RetailMax", health: 45, trend: "down", risk: "high", nps: 32 },
  { name: "FinanceFirst", health: 78, trend: "stable", risk: "medium", nps: 68 },
]

export default function CustomerHealthPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Customer Health"
        description="Monitor customer health scores and identify at-risk accounts"
        stageId="CS-019"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Customers" value="5" icon={Users} />
        <MetricCard title="Healthy" value="3" icon={Heart} primary />
        <MetricCard title="At Risk" value="1" icon={AlertTriangle} />
        <MetricCard title="Avg Health Score" value="75%" icon={TrendingUp} />
      </div>

      {/* Customer Health Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Health Score</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Trend</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Risk Level</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">NPS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.name} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{customer.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          customer.health >= 70
                            ? "bg-green-500"
                            : customer.health >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${customer.health}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{customer.health}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`text-sm ${
                      customer.trend === "up"
                        ? "text-green-600"
                        : customer.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {customer.trend === "up" ? "↑" : customer.trend === "down" ? "↓" : "→"} {customer.trend}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      customer.risk === "low"
                        ? "bg-green-100 text-green-700"
                        : customer.risk === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.risk}
                  </span>
                </td>
                <td className="p-4 text-gray-900">{customer.nps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
