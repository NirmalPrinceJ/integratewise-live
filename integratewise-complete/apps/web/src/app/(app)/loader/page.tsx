"use client"

import { useState } from "react"
import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { FileUploadHandler } from "@/components/loader/file-upload-handler"
import { useL2Drawer } from "@/components/cognitive/l2-drawer"
import { FileSpreadsheet, Database, Cloud } from "lucide-react"

export default function LoaderPage() {
  // TODO: Get actual tenant ID from auth context
  const tenantId = "00000000-0000-0000-0000-000000000000" // Default tenant
  const [uploadResults, setUploadResults] = useState<any>(null)
  const { openDrawer } = useL2Drawer()

  const handleUploadComplete = (results: any) => {
    setUploadResults(results)

    // L3 → L2: Trigger cognitive drawer with spine surface
    if (results.results && results.results.length > 0) {
      const firstEntityId = results.results[0].entity_id

      // Open L2 drawer with spine surface to show completeness analysis
      openDrawer({
        trigger: 'system',
        contextType: 'entity',
        contextId: firstEntityId,
        requestedSurface: 'spine',
        userMode: 'operator'
      })
    }
  }

  return (
    <div className="p-6">
      <PageHeader
        title="One-Click Loader"
        description="Import and normalize data from any source into The Spine"
        stageId="LOADER-007"
      />

      {/* Import Options */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: FileSpreadsheet,
            title: "CSV / Excel",
            description: "Upload spreadsheets with your data",
            action: "Upload File",
            active: true,
          },
          {
            icon: Database,
            title: "Direct Connect",
            description: "Connect to external databases",
            action: "Configure",
            active: false,
          },
          {
            icon: Cloud,
            title: "API Import",
            description: "Import from connected integrations",
            action: "Select Source",
            active: false,
          },
        ].map((option) => (
          <div key={option.title} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
              <option.icon className="w-8 h-8 text-[#2D7A3E]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{option.description}</p>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              disabled={!option.active}
            >
              {option.action}
            </Button>
            {!option.active && (
              <span className="text-xs text-gray-400 mt-2 inline-block">Coming Soon</span>
            )}
          </div>
        ))}
      </div>

      {/* L0 → L3: Upload Area with Spine Integration */}
      <div className="mb-8">
        <FileUploadHandler
          tenantId={tenantId}
          entityType="account"
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {/* Upload Summary (L3 → L1) */}
      {uploadResults && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-green-900 mb-2">✨ Ingestion Complete</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-700">{uploadResults.total}</p>
              <p className="text-sm text-green-600">Total Records</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{uploadResults.successful}</p>
              <p className="text-sm text-green-600">Successfully Ingested</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-500">{uploadResults.failed}</p>
              <p className="text-sm text-gray-500">Skipped</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Imports */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Imports</h3>
        <div className="space-y-3">
          {[
            { file: "clients_export.csv", records: 156, date: "Jan 15, 2026", status: "completed" },
            { file: "leads_hubspot.json", records: 42, date: "Jan 10, 2026", status: "completed" },
            { file: "contacts.xlsx", records: 89, date: "Jan 5, 2026", status: "completed" },
          ].map((item) => (
            <div key={item.file} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.file}</p>
                <p className="text-sm text-gray-500">
                  {item.records} records imported on {item.date}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
