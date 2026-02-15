import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { useLens } from "@/components/layouts/app-shell"

interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon?: LucideIcon
  primary?: boolean
  className?: string
}

export function MetricCard({ title, value, trend, trendLabel, icon: Icon, primary, className = "" }: MetricCardProps) {
  const { currentLens } = useLens()

  // Lens-aware styling
  const getLensColor = () => {
    switch (currentLens) {
      case "business":
        return "bg-[#2D7A3E]"
      case "cs":
        return "bg-purple-600"
      default:
        return "bg-blue-600"
    }
  }

  return (
    <div
      className={`rounded-xl border p-5 ${
        primary ? `${getLensColor()} text-white border-transparent` : "bg-white border-gray-200"
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${primary ? "text-white/80" : "text-gray-500"}`}>{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {Icon && <Icon className={`w-8 h-8 ${primary ? "text-white/60" : "text-gray-300"}`} />}
      </div>

      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${primary ? "text-white/80" : ""}`}>
          {trend >= 0 ? (
            <TrendingUp className={`w-4 h-4 ${primary ? "" : "text-green-500"}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${primary ? "" : "text-red-500"}`} />
          )}
          <span className={trend >= 0 ? (primary ? "" : "text-green-600") : primary ? "" : "text-red-600"}>
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
          {trendLabel && <span className={primary ? "text-white/60" : "text-gray-400"}>{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
