"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface DocumentItem {
  id: string
  name: string
  modified: string
  status: string
}

export function KnowledgePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [documents, setDocuments] = useState<DocumentItem[]>([])

  useEffect(() => {
    if (!open) return
    const load = async () => {
      const response = await fetch("/api/documents")
      const data = (await response.json()) as DocumentItem[]
      setDocuments(data)
    }
    load()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200/60 z-40 shadow-lg">
      <div className="px-4 py-3 border-b border-slate-200/60 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Knowledge Panel</p>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 transition-colors" title="Close panel">
          <X className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto h-full">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-slate-200 rounded-md p-3 text-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
            <p className="font-medium text-slate-900">{doc.name}</p>
            <p className="text-slate-500 text-[11px] mt-0.5">{doc.modified} · {doc.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
