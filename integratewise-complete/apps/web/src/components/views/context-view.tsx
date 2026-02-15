/**
 * Context View - Document & Artifact Library
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  FileText, 
  FolderOpen,
  Mail,
  Image,
  File,
  Link2,
  Search,
  Upload,
  MoreHorizontal,
  Download,
  Trash2,
  Eye
} from "lucide-react"

// Mock data - replace with API calls
const mockArtifacts = [
  {
    id: "artifact-001",
    title: "Q4 Sales Strategy.pdf",
    type: "document",
    source: "google_drive",
    size: "2.4 MB",
    chunks: 12,
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-15T09:30:00Z"
  },
  {
    id: "artifact-002",
    title: "Customer Onboarding Email Thread",
    type: "email",
    source: "gmail",
    size: "156 KB",
    chunks: 4,
    created_at: "2024-01-13T14:20:00Z",
    updated_at: "2024-01-13T14:20:00Z"
  },
  {
    id: "artifact-003",
    title: "Product Roadmap 2024",
    type: "document",
    source: "notion",
    size: "890 KB",
    chunks: 8,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-12T16:45:00Z"
  },
  {
    id: "artifact-004",
    title: "Logo Assets Package",
    type: "image",
    source: "upload",
    size: "5.2 MB",
    chunks: 0,
    created_at: "2024-01-09T11:30:00Z",
    updated_at: "2024-01-09T11:30:00Z"
  },
]

const kpis: KPIItem[] = [
  { label: "Total Artifacts", value: "2,847", change: "+89 this week", changeType: "positive" },
  { label: "Documents", value: "1,234", icon: <FileText className="w-4 h-4" /> },
  { label: "Emails", value: "892", icon: <Mail className="w-4 h-4" /> },
  { label: "Indexed Chunks", value: "34.2K", color: "blue" },
]

const typeIcons: Record<string, any> = {
  document: FileText,
  email: Mail,
  image: Image,
  link: Link2,
  file: File,
}

const typeColors: Record<string, string> = {
  document: "bg-blue-50 text-blue-600",
  email: "bg-purple-50 text-purple-600",
  image: "bg-green-50 text-green-600",
  link: "bg-orange-50 text-orange-600",
  file: "bg-gray-100 text-gray-600",
}

export function ContextView() {
  const [artifacts] = useState(mockArtifacts)
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const selected = artifacts.find(a => a.id === selectedArtifact)

  return (
    <UnifiedPageTemplate
      title="Context Library"
      description="Unified library of documents, emails, and files"
      stageId="OPS-CONTEXT-001"
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Context" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      viewModes={['table', 'cards']}
      currentViewMode={viewMode}
      onViewModeChange={(mode) => setViewMode(mode as 'table' | 'cards')}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">File Name</h4>
            <p className="text-gray-900">{selected.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
            <p className="text-gray-900 capitalize">{selected.type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Source</h4>
            <p className="text-gray-900 capitalize">{selected.source.replace('_', ' ')}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Size</h4>
            <p className="text-gray-900">{selected.size}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Indexed Chunks</h4>
            <p className="text-gray-900">{selected.chunks}</p>
          </div>
          <div className="pt-4 border-t border-gray-200 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Artifact Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={artifacts.length === 0}
      emptyState={{
        icon: <FolderOpen className="w-12 h-12" />,
        title: "No Artifacts Yet",
        description: "Upload files or connect data sources to build your context library.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Upload First File
          </button>
        )
      }}
    >
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Source</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Size</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Chunks</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Updated</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {artifacts.map((artifact) => {
                const Icon = typeIcons[artifact.type] || File
                return (
                  <tr 
                    key={artifact.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedArtifact(artifact.id)
                      setRightPanelOpen(true)
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${typeColors[artifact.type]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{artifact.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{artifact.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{artifact.source.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{artifact.size}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{artifact.chunks}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(artifact.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artifacts.map((artifact) => {
            const Icon = typeIcons[artifact.type] || File
            return (
              <div
                key={artifact.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
                onClick={() => {
                  setSelectedArtifact(artifact.id)
                  setRightPanelOpen(true)
                }}
              >
                <div className={`p-3 rounded-lg ${typeColors[artifact.type]} w-fit mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">{artifact.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{artifact.size}</span>
                  <span>•</span>
                  <span>{artifact.chunks} chunks</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </UnifiedPageTemplate>
  )
}

export default ContextView
