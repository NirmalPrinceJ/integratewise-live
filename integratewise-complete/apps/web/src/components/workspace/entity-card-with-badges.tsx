"use client";

/**
 * Entity Card with L2→L1 Wiring
 * 
 * Displays completeness badges that reflect L2 (Spine) data quality status:
 * - 🟢 Complete (90-100%)
 * - 🟡 Partial (70-89%)
 * - 🔴 Incomplete (<70%)
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useL2Drawer } from "@/components/cognitive/l2-drawer";
import { Database, AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";

interface EntityCardProps {
  entityId: string;
  entityType: string;
  name: string;
  subtitle?: string;
  completeness?: number; // 0-1 from Spine
  missingFields?: string[];
  healthScore?: number; // 0-100
  lastSynced?: string;
  href: string;
}

export function EntityCardWithBadges({
  entityId,
  entityType,
  name,
  subtitle,
  completeness = 0,
  missingFields = [],
  healthScore,
  lastSynced,
  href,
}: EntityCardProps) {
  const { openDrawer } = useL2Drawer();

  const completenessPercent = Math.round(completeness * 100);

  // Determine status
  const getStatus = () => {
    if (completenessPercent >= 90)
      return {
        label: "Complete",
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    if (completenessPercent >= 70)
      return {
        label: "Partial",
        variant: "secondary" as const,
        icon: MinusCircle,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    return {
      label: "Incomplete",
      variant: "destructive" as const,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div
      className={`group relative rounded-xl border bg-white p-5 hover:shadow-md transition-all ${status.borderColor}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={href} className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#222C40] truncate group-hover:text-[#4154A3] transition-colors">
            {name}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          )}
        </Link>

        {/* Completeness Badge - L2→L1 Wiring */}
        <button
          onClick={() =>
            openDrawer({
              trigger: "ui_click",
              contextType: "entity",
              contextId: entityId,
              requestedSurface: "spine",
            })
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color} hover:opacity-80 transition-opacity`}
          title={`${completenessPercent}% complete. Click to view details.`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{completenessPercent}%</span>
        </button>
      </div>

      {/* Health Score (if available) */}
      {healthScore !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`h-1.5 flex-1 rounded-full ${
              healthScore >= 80
                ? "bg-green-500"
                : healthScore >= 50
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${healthScore}%` }}
          />
          <span className="text-xs text-gray-500">{healthScore} health</span>
        </div>
      )}

      {/* Missing Fields Preview */}
      {missingFields.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5">Missing:</p>
          <div className="flex flex-wrap gap-1">
            {missingFields.slice(0, 3).map((field) => (
              <Badge
                key={field}
                variant="outline"
                className="text-xs bg-gray-50 text-gray-600"
              >
                {field}
              </Badge>
            ))}
            {missingFields.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{missingFields.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Database className="h-3.5 w-3.5" />
          <span className="capitalize">{entityType}</span>
        </div>

        {lastSynced && (
          <span className="text-xs text-gray-400">
            Synced {new Date(lastSynced).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Quick Action Overlay */}
      <div className="absolute inset-0 bg-[#4154A3]/95 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          onClick={() =>
            openDrawer({
              trigger: "ui_click",
              contextType: "entity",
              contextId: entityId,
              requestedSurface: "spine",
            })
          }
          className="px-4 py-2 bg-white text-[#4154A3] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          View Spine
        </button>
        <Link
          href={href}
          className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
        >
          Open
        </Link>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for entity cards
 */
export function EntityCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full mb-3" />
      <div className="flex gap-1 mb-3">
        <div className="h-5 w-16 bg-gray-100 rounded" />
        <div className="h-5 w-20 bg-gray-100 rounded" />
      </div>
      <div className="h-4 w-full bg-gray-50 rounded" />
    </div>
  );
}
