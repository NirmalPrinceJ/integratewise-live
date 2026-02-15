import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, Briefcase } from "lucide-react"
import { getServices, formatCurrency } from "@/lib/supabase/queries"

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="p-6">
      <PageHeader
        title="Services"
        description="IntegrateWise service catalog"
        stageId="BUSINESS-018"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        }
      />

      {/* Service Cards */}
      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-500 mb-4">Add your services to build your catalog.</p>
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add First Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
              {service.tier_name && (
                <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mb-3">
                  Tier {service.tier} - {service.tier_name}
                </span>
              )}
              {service.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>}
              {(service.price_min || service.price_max) && (
                <p className="text-sm text-gray-600 mb-4">
                  {formatCurrency(Number(service.price_min) || 0)} - {formatCurrency(Number(service.price_max) || 0)}
                </p>
              )}
              <div className="flex items-center text-[#2D7A3E] text-sm font-medium cursor-pointer hover:underline">
                Details <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
