"use client"

/**
 * Document Storage — Unified document hub with grid/list, breadcrumbs, search, quotas
 * Ported from Figma Design document-storage.tsx (1228 lines → streamlined)
 */

import { useState, useMemo, useCallback, useRef, type DragEvent } from "react"
import {
  FileText, Folder, Search, Plus, Download, Trash2, Star,
  ChevronRight, Upload, Lock, Users, Globe, Clock, HardDrive,
  Image as ImageIcon, Video, File, FileSpreadsheet, FileCode,
  Archive, Music, X, FolderPlus, CloudUpload, LayoutGrid, LayoutList,
  Eye, MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

/* ─── Types ─── */
type FileType =
  | "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx"
  | "png" | "jpg" | "jpeg" | "gif" | "svg" | "webp"
  | "mp4" | "mov" | "avi" | "mp3" | "wav"
  | "zip" | "rar" | "tar"
  | "txt" | "csv" | "json" | "xml" | "md"
  | "figma" | "sketch" | "folder" | "unknown"

type AccessLevel = "private" | "team" | "organization" | "public"
type SortField = "name" | "modified" | "size" | "type"
type ViewMode = "grid" | "list"
type SidePanel = "none" | "details" | "activity"

interface StorageItem {
  id: string; name: string; type: FileType; isFolder: boolean
  parentId: string | null; size: number
  createdAt: string; modifiedAt: string
  owner: { id: string; name: string; initials: string }
  access: AccessLevel; starred: boolean; tags: string[]
  source?: string; version?: number; description?: string
}

interface BreadcrumbItem { id: string | null; name: string }

/* ─── Helpers ─── */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return "Just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 7) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getFileIcon(type: FileType) {
  const c = "w-5 h-5"
  switch (type) {
    case "pdf": return <FileText className={c} style={{ color: "#E53935" }} />
    case "doc": case "docx": return <FileText className={c} style={{ color: "#1A73E8" }} />
    case "xls": case "xlsx": case "csv": return <FileSpreadsheet className={c} style={{ color: "#0F9D58" }} />
    case "ppt": case "pptx": return <FileText className={c} style={{ color: "#F4511E" }} />
    case "png": case "jpg": case "jpeg": case "gif": case "svg": case "webp": return <ImageIcon className={c} style={{ color: "#9C27B0" }} />
    case "mp4": case "mov": case "avi": return <Video className={c} style={{ color: "#E91E63" }} />
    case "mp3": case "wav": return <Music className={c} style={{ color: "#FF9800" }} />
    case "zip": case "rar": case "tar": return <Archive className={c} style={{ color: "#795548" }} />
    case "json": case "xml": case "md": return <FileCode className={c} style={{ color: "#607D8B" }} />
    default: return <File className={c} style={{ color: "#9E9E9E" }} />
  }
}

const ACCESS_ICONS = { private: Lock, team: Users, organization: Globe, public: Globe }

/* ─── Mock Data ─── */
const OWNERS = {
  arun: { id: "u1", name: "Arun Kumar", initials: "AK" },
  priya: { id: "u2", name: "Priya Sharma", initials: "PS" },
  rajesh: { id: "u3", name: "Rajesh Menon", initials: "RM" },
  anjali: { id: "u4", name: "Anjali Patel", initials: "AP" },
  vikram: { id: "u5", name: "Vikram Rao", initials: "VR" },
  deepak: { id: "u6", name: "Deepak Jain", initials: "DJ" },
}

const INITIAL_FILES: StorageItem[] = [
  { id: "f1", name: "Business Operations", type: "folder", isFolder: true, parentId: null, size: 0, createdAt: "2025-11-01T10:00:00Z", modifiedAt: "2026-02-08T14:30:00Z", owner: OWNERS.arun, access: "organization", starred: true, tags: ["BizOps"] },
  { id: "f2", name: "Customer Success", type: "folder", isFolder: true, parentId: null, size: 0, createdAt: "2025-10-15T09:00:00Z", modifiedAt: "2026-02-07T11:00:00Z", owner: OWNERS.priya, access: "team", starred: true, tags: ["CS"] },
  { id: "f3", name: "Sales Assets", type: "folder", isFolder: true, parentId: null, size: 0, createdAt: "2025-09-01T08:00:00Z", modifiedAt: "2026-02-06T16:45:00Z", owner: OWNERS.deepak, access: "team", starred: false, tags: ["Sales"] },
  { id: "f4", name: "Engineering", type: "folder", isFolder: true, parentId: null, size: 0, createdAt: "2025-08-01T12:00:00Z", modifiedAt: "2026-02-09T09:20:00Z", owner: OWNERS.rajesh, access: "team", starred: false, tags: ["Engineering"] },
  { id: "f5", name: "Legal & Compliance", type: "folder", isFolder: true, parentId: null, size: 0, createdAt: "2025-07-15T14:00:00Z", modifiedAt: "2026-01-28T10:15:00Z", owner: OWNERS.vikram, access: "private", starred: false, tags: ["Legal"] },
  { id: "f6", name: "Marketing", type: "folder", isFolder: true, parentId: null, size: 0, createdAt: "2025-12-01T10:00:00Z", modifiedAt: "2026-02-05T13:00:00Z", owner: OWNERS.anjali, access: "team", starred: false, tags: ["Marketing"] },
  { id: "d1", name: "APAC RevOps Playbook 2026.pdf", type: "pdf", isFolder: false, parentId: null, size: 2457600, createdAt: "2026-01-15T10:00:00Z", modifiedAt: "2026-02-08T14:30:00Z", owner: OWNERS.arun, access: "team", starred: true, tags: ["APAC", "RevOps"], source: "Google Drive", version: 3, description: "APAC region revenue operations strategy." },
  { id: "d2", name: "TechServe SOW v3.2.docx", type: "docx", isFolder: false, parentId: null, size: 912384, createdAt: "2025-12-10T09:00:00Z", modifiedAt: "2026-02-07T16:45:00Z", owner: OWNERS.priya, access: "private", starred: true, tags: ["Contract", "Enterprise"], source: "Google Drive", version: 4 },
  { id: "d3", name: "Q4 2025 Revenue Dashboard.xlsx", type: "xlsx", isFolder: false, parentId: null, size: 5242880, createdAt: "2026-01-02T08:00:00Z", modifiedAt: "2026-02-06T12:00:00Z", owner: OWNERS.rajesh, access: "team", starred: false, tags: ["Finance", "Dashboard"], source: "Google Drive" },
  { id: "d4", name: "Board Presentation Feb 2026.pptx", type: "pptx", isFolder: false, parentId: null, size: 15728640, createdAt: "2026-02-01T14:00:00Z", modifiedAt: "2026-02-09T11:30:00Z", owner: OWNERS.arun, access: "private", starred: true, tags: ["Board", "Presentation"] },
  { id: "d5", name: "Integration Onboarding SOP.pdf", type: "pdf", isFolder: false, parentId: "f1", size: 1258291, createdAt: "2025-11-20T10:00:00Z", modifiedAt: "2026-01-15T14:00:00Z", owner: OWNERS.arun, access: "organization", starred: false, tags: ["Onboarding", "SOP"], source: "Notion" },
  { id: "d6", name: "Ops Team Structure.png", type: "png", isFolder: false, parentId: "f1", size: 3145728, createdAt: "2025-12-05T12:00:00Z", modifiedAt: "2026-01-08T09:30:00Z", owner: OWNERS.priya, access: "team", starred: false, tags: ["Org Chart"], source: "Figma" },
  { id: "d7", name: "Customer Health Scoring.pdf", type: "pdf", isFolder: false, parentId: "f2", size: 460800, createdAt: "2025-10-01T09:00:00Z", modifiedAt: "2026-01-30T14:00:00Z", owner: OWNERS.anjali, access: "team", starred: true, tags: ["CS", "Health Score"] },
  { id: "d8", name: "Sales Pitch Deck 2026.pptx", type: "pptx", isFolder: false, parentId: "f3", size: 12582912, createdAt: "2026-01-10T10:00:00Z", modifiedAt: "2026-02-08T11:00:00Z", owner: OWNERS.deepak, access: "team", starred: true, tags: ["Sales", "Pitch"], version: 6 },
  { id: "d9", name: "Architecture Decision Records.md", type: "md", isFolder: false, parentId: "f4", size: 81920, createdAt: "2025-08-01T12:00:00Z", modifiedAt: "2026-02-09T09:20:00Z", owner: OWNERS.rajesh, access: "team", starred: false, tags: ["ADR", "Architecture"], source: "GitHub" },
  { id: "d10", name: "Brand Guidelines 2026.pdf", type: "pdf", isFolder: false, parentId: "f6", size: 20971520, createdAt: "2025-12-15T10:00:00Z", modifiedAt: "2026-02-01T12:00:00Z", owner: OWNERS.anjali, access: "organization", starred: true, tags: ["Brand"], source: "Figma", version: 3 },
]

const QUOTA = { used: 268435456, total: 5368709120 }

const ACTIVITY_LOG = [
  { id: "a1", action: "uploaded", fileName: "Board Presentation Feb 2026.pptx", user: "Arun Kumar", time: "2 hours ago" },
  { id: "a2", action: "edited", fileName: "TechServe SOW v3.2.docx", user: "Priya Sharma", time: "5 hours ago" },
  { id: "a3", action: "shared", fileName: "APAC RevOps Playbook 2026.pdf", user: "Arun Kumar", time: "1 day ago" },
  { id: "a4", action: "moved", fileName: "Data Privacy Policy (APAC).pdf", user: "Arun Kumar", time: "2 days ago" },
  { id: "a5", action: "created folder", fileName: "Templates", user: "Priya Sharma", time: "3 days ago" },
]

/* ─── Main Component ─── */
export function DocumentStorage() {
  const [files, setFiles] = useState<StorageItem[]>(INITIAL_FILES)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sidePanel, setSidePanel] = useState<SidePanel>("none")
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("modified")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [isDragOver, setIsDragOver] = useState(false)
  const [quickFilter, setQuickFilter] = useState<"all" | "starred" | "recent" | "shared">("all")
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs: BreadcrumbItem[] = [{ id: null, name: "My Drive" }]
    if (currentFolderId) {
      const buildPath = (id: string | null): BreadcrumbItem[] => {
        if (!id) return []
        const folder = files.find((f) => f.id === id)
        if (!folder) return []
        return [...buildPath(folder.parentId), { id: folder.id, name: folder.name }]
      }
      crumbs.push(...buildPath(currentFolderId))
    }
    return crumbs
  }, [currentFolderId, files])

  // Filtered items
  const displayedItems = useMemo(() => {
    let items: StorageItem[]
    if (quickFilter === "starred") items = files.filter((f) => f.starred)
    else if (quickFilter === "recent") items = [...files].filter((f) => !f.isFolder).sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()).slice(0, 20)
    else if (quickFilter === "shared") items = files.filter((f) => f.access === "team" || f.access === "organization")
    else items = files.filter((f) => f.parentId === currentFolderId)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = files.filter((f) => f.name.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q)))
    }

    const folders = items.filter((i) => i.isFolder)
    const filesOnly = items.filter((i) => !i.isFolder)

    const sortFn = (a: StorageItem, b: StorageItem) => {
      let cmp = 0
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break
        case "modified": cmp = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime(); break
        case "size": cmp = a.size - b.size; break
        case "type": cmp = a.type.localeCompare(b.type); break
      }
      return sortDir === "asc" ? cmp : -cmp
    }

    return [...folders.sort(sortFn), ...filesOnly.sort(sortFn)]
  }, [files, currentFolderId, searchQuery, sortField, sortDir, quickFilter])

  const stats = useMemo(() => {
    const allFiles = files.filter((f) => !f.isFolder)
    return { fileCount: allFiles.length, folderCount: files.filter((f) => f.isFolder).length, totalSize: allFiles.reduce((s, f) => s + f.size, 0), usedPercent: Math.round((QUOTA.used / QUOTA.total) * 100) }
  }, [files])

  const navigateToFolder = useCallback((id: string | null) => {
    setCurrentFolderId(id)
    setSelectedItem(null)
    setQuickFilter("all")
  }, [])

  const toggleStar = useCallback((id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)))
  }, [])

  const createFolder = useCallback(() => {
    if (!newFolderName.trim()) return
    setFiles((prev) => [
      ...prev,
      { id: `f_${Date.now()}`, name: newFolderName.trim(), type: "folder", isFolder: true, parentId: currentFolderId, size: 0, createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(), owner: OWNERS.arun, access: "team", starred: false, tags: [] },
    ])
    setNewFolderName("")
    setShowNewFolderDialog(false)
  }, [newFolderName, currentFolderId])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length > 0) {
      const newFiles: StorageItem[] = dropped.map((file, i) => ({
        id: `upload_${Date.now()}_${i}`,
        name: file.name,
        type: (file.name.split(".").pop()?.toLowerCase() || "unknown") as FileType,
        isFolder: false, parentId: currentFolderId, size: file.size,
        createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(),
        owner: OWNERS.arun, access: "private" as const, starred: false, tags: [], source: "Local", version: 1,
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [currentFolderId])

  return (
    <div className="h-full flex flex-col overflow-hidden" onClick={() => {}}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Document Storage</h1>
            <p className="text-sm text-muted-foreground">
              {stats.fileCount} files, {stats.folderCount} folders · {formatBytes(QUOTA.used)} of {formatBytes(QUOTA.total)} used
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" multiple className="hidden" />
            <Button variant="outline" size="sm" onClick={() => setShowNewFolderDialog(true)} className="gap-1.5">
              <FolderPlus className="w-4 h-4" /> New Folder
            </Button>
            <Button size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
              <Upload className="w-4 h-4" /> Upload
            </Button>
          </div>
        </div>

        {/* Quick Filters + Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex p-0.5 bg-secondary rounded-lg">
            {(["all", "starred", "recent", "shared"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setQuickFilter(f); if (f !== "all") setCurrentFolderId(null) }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  quickFilter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All Files" : f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search files, folders, tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-8 text-sm" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-secondary">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <div className="flex p-0.5 bg-secondary rounded-md">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-all ${viewMode === "grid" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setSidePanel(sidePanel === "activity" ? "none" : "activity")} className={`p-1.5 rounded-md ml-1 ${sidePanel === "activity" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        {quickFilter === "all" && (
          <nav className="flex items-center gap-1 text-sm overflow-x-auto pb-1">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.id ?? "root"} className="flex items-center gap-1 shrink-0">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                <button
                  onClick={() => navigateToFolder(crumb.id)}
                  className={`px-1.5 py-0.5 rounded-md text-sm ${i === breadcrumbs.length - 1 ? "font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                >
                  {i === 0 ? <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> {crumb.name}</span> : crumb.name}
                </button>
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`flex-1 overflow-hidden relative transition-all ${isDragOver ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
          onDrop={handleDrop}
        >
          {isDragOver && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-primary/5 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-primary/40 bg-card/80">
                <CloudUpload className="w-12 h-12 text-primary" />
                <p className="text-lg font-semibold">Drop files to upload</p>
              </div>
            </div>
          )}

          <ScrollArea className="h-full">
            {displayedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                  <Folder className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold">No files here</p>
                <p className="text-sm text-muted-foreground max-w-xs">Upload files or create a folder to get started.</p>
                <Button onClick={() => fileInputRef.current?.click()} className="gap-1.5"><Upload className="w-4 h-4" /> Upload Files</Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {displayedItems.map((item) => (
                  <FileGridCard
                    key={item.id}
                    item={item}
                    selected={selectedItem?.id === item.id}
                    onClick={() => { setSelectedItem(item); if (!item.isFolder) setSidePanel("details") }}
                    onDoubleClick={() => item.isFolder && navigateToFolder(item.id)}
                    onToggleStar={() => toggleStar(item.id)}
                    folderCount={item.isFolder ? files.filter((f) => f.parentId === item.id).length : 0}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-1">
                {/* List header */}
                <div className="flex items-center gap-3 px-3 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  <span className="flex-1">Name</span>
                  <span className="w-20 text-right">Size</span>
                  <span className="w-24 text-right">Modified</span>
                  <span className="w-16 text-center">Access</span>
                  <span className="w-20 text-right">Owner</span>
                </div>
                {displayedItems.map((item) => (
                  <FileListRow
                    key={item.id}
                    item={item}
                    selected={selectedItem?.id === item.id}
                    onClick={() => { setSelectedItem(item); if (!item.isFolder) setSidePanel("details") }}
                    onDoubleClick={() => item.isFolder && navigateToFolder(item.id)}
                    onToggleStar={() => toggleStar(item.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Side Panel */}
        {sidePanel !== "none" && (
          <div className="w-72 border-l bg-card flex-shrink-0 overflow-y-auto">
            {sidePanel === "details" && selectedItem && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Details</h3>
                  <button onClick={() => setSidePanel("none")} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    {selectedItem.isFolder ? <Folder className="w-8 h-8 text-primary" /> : getFileIcon(selectedItem.type)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{selectedItem.name}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedItem.type.toUpperCase()} · {formatBytes(selectedItem.size)}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <DetailRow label="Owner" value={selectedItem.owner.name} />
                  <DetailRow label="Modified" value={formatDate(selectedItem.modifiedAt)} />
                  <DetailRow label="Created" value={formatDate(selectedItem.createdAt)} />
                  <DetailRow label="Access" value={selectedItem.access} />
                  {selectedItem.source && <DetailRow label="Source" value={selectedItem.source} />}
                  {selectedItem.version && <DetailRow label="Version" value={`v${selectedItem.version}`} />}
                </div>
                {selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  </div>
                )}
                {selectedItem.description && (
                  <p className="text-xs text-muted-foreground">{selectedItem.description}</p>
                )}
              </div>
            )}
            {sidePanel === "activity" && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Activity</h3>
                  <button onClick={() => setSidePanel("none")} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
                </div>
                {ACTIVITY_LOG.map((a) => (
                  <div key={a.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/30">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold mt-0.5">{a.user.split(" ").map((n) => n[0]).join("")}</div>
                    <div>
                      <p className="text-xs"><span className="font-medium">{a.user}</span> {a.action} <span className="font-medium">{a.fileName}</span></p>
                      <p className="text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowNewFolderDialog(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border rounded-xl p-6 w-96 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold">New Folder</h3>
            <Input placeholder="Folder name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && createFolder()} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>Cancel</Button>
              <Button onClick={createFolder} disabled={!newFolderName.trim()}>Create</Button>
            </div>
          </div>
        </>
      )}

      {/* Quota bar */}
      <div className="flex-shrink-0 px-6 py-2 border-t bg-muted/30 flex items-center gap-4">
        <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
        <Progress value={stats.usedPercent} className="h-1.5 flex-1 max-w-xs" />
        <span className="text-[10px] text-muted-foreground">{formatBytes(QUOTA.used)} / {formatBytes(QUOTA.total)} ({stats.usedPercent}%)</span>
      </div>
    </div>
  )
}

/* ─── Sub-components ─── */
function FileGridCard({ item, selected, onClick, onDoubleClick, onToggleStar, folderCount }: { item: StorageItem; selected: boolean; onClick: () => void; onDoubleClick: () => void; onToggleStar: () => void; folderCount: number }) {
  const AccIcon = ACCESS_ICONS[item.access]
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md group ${selected ? "ring-2 ring-primary border-primary" : "hover:border-muted-foreground/30"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          {item.isFolder ? <Folder className="w-5 h-5 text-primary" /> : getFileIcon(item.type)}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleStar() }} className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${item.starred ? "opacity-100 text-amber-500" : "text-muted-foreground"}`}>
          <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="text-xs font-medium truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{item.isFolder ? `${folderCount} items` : formatBytes(item.size)}</span>
        <AccIcon className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  )
}

function FileListRow({ item, selected, onClick, onDoubleClick, onToggleStar }: { item: StorageItem; selected: boolean; onClick: () => void; onDoubleClick: () => void; onToggleStar: () => void }) {
  const AccIcon = ACCESS_ICONS[item.access]
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group ${selected ? "bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/30"}`}
    >
      <button onClick={(e) => { e.stopPropagation(); onToggleStar() }} className={`p-0.5 ${item.starred ? "text-amber-500" : "text-muted-foreground/30 group-hover:text-muted-foreground"}`}>
        <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
      </button>
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        {item.isFolder ? <Folder className="w-4 h-4 text-primary" /> : getFileIcon(item.type)}
      </div>
      <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
      <span className="w-20 text-right text-xs text-muted-foreground">{item.isFolder ? "—" : formatBytes(item.size)}</span>
      <span className="w-24 text-right text-xs text-muted-foreground">{formatDate(item.modifiedAt)}</span>
      <div className="w-16 flex justify-center"><AccIcon className="w-3.5 h-3.5 text-muted-foreground" /></div>
      <span className="w-20 text-right text-xs text-muted-foreground">{item.owner.initials}</span>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  )
}
