/**
 * Skeleton Loaders
 * Loading state components for all views
 * Day 4: UI Polish + Integration
 */

"use client"

import { cn } from "@/lib/utils"

// Base skeleton component
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

// KPI Band Skeleton
export function KPIBandSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-7 w-16" />
        </div>
      ))}
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="px-4 py-4 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton 
                key={colIdx} 
                className={cn(
                  "h-4",
                  colIdx === 0 ? "w-32" : colIdx === columns - 1 ? "w-16" : "w-24"
                )} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Card Grid Skeleton
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

// Approval Card Skeleton
export function ApprovalCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Timeline Skeleton
export function TimelineSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="relative pl-10">
            <Skeleton className="absolute left-2 w-5 h-5 rounded-full" />
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Entity Header Skeleton
export function EntityHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-16 w-24 rounded-xl" />
    </div>
  )
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <KPIBandSkeleton />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Skeleton className="h-5 w-24 mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between mb-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Skeleton className="h-5 w-28 mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between mb-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Full Page Skeleton
export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      
      {/* KPIs */}
      <KPIBandSkeleton />
      
      {/* Content */}
      <TableSkeleton />
    </div>
  )
}

// Kanban Skeleton
export function KanbanSkeleton({ columns = 4, cardsPerColumn = 3 }: { columns?: number; cardsPerColumn?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: columns }).map((_, colIdx) => (
        <div key={colIdx} className="flex-shrink-0 w-72 bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIdx) => (
              <div key={cardIdx} className="bg-white rounded-lg p-3 border border-gray-200">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
export default {
  Skeleton,
  KPIBandSkeleton,
  TableSkeleton,
  CardGridSkeleton,
  ListItemSkeleton,
  ApprovalCardSkeleton,
  TimelineSkeleton,
  EntityHeaderSkeleton,
  DashboardSkeleton,
  PageSkeleton,
  KanbanSkeleton
}
