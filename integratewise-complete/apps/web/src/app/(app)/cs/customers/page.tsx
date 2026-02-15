import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Building2, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { getClients, formatCurrency } from "@/lib/supabase/queries"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="p-6">
      <PageHeader
        title="Clients"
        description="Manage your client relationships"
        stageId="BUSINESS-018"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        }
      />

      {/* Client Cards */}
      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-500 mb-4">Add your first client to start tracking relationships.</p>
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add First Client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {clients.map((client) => (
            <Link href={`/business/clients/${client.id}`} key={client.id} className="block group">
              <div className="bg-white rounded-xl border border-gray-200 p-5 group-hover:border-[#2D7A3E] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url || "/placeholder.svg"}
                          alt={client.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.industry || "No industry"}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${client.status === "active"
                      ? "bg-green-100 text-green-700"
                      : client.status === "at_risk"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {client.status === "at_risk" ? "At Risk" : client.status || "Unknown"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Health Score</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">{client.health_score || 0}%</span>
                      {(client.health_score || 0) >= 70 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(Number(client.total_revenue) || 0)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
