import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Star, ArrowRight, Package } from "lucide-react"
import { getProducts } from "@/lib/supabase/queries"

export default async function ProductsPage() {
  const products = await getProducts()

  const tiers = ["All", ...new Set(products.map((p) => p.tier_name).filter(Boolean))]

  return (
    <div className="p-6">
      <PageHeader
        title="Products"
        description={`${products.length} offerings across ${tiers.length - 1} tiers`}
        stageId="BUSINESS-018"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        }
      />

      {/* Tier Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tiers.map((tier, i) => (
          <button
            key={tier}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              i === 0
                ? "bg-[#2D7A3E] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#2D7A3E]"
            }`}
          >
            {tier || "Uncategorized"} {i === 0 && `(${products.length})`}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-4">Add your products and services to showcase your offerings.</p>
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 pr-4">{product.name}</h3>
                {product.is_featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
              </div>
              {product.tier_name && (
                <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-3">
                  {product.tier_name}
                </span>
              )}
              {product.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">View details</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
