/**
 * Knowledge View - Knowledge Base Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  BookOpen,
  Search,
  Plus,
  Folder,
  FileText,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users
} from "lucide-react"

// Mock data - replace with API calls
const mockKnowledgeItems = [
  {
    id: "kb-001",
    title: "Sales Playbook - Enterprise",
    category: "Sales",
    type: "playbook",
    status: "published",
    views: 234,
    contributors: 3,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z"
  },
  {
    id: "kb-002",
    title: "Customer Onboarding Guide",
    category: "Customer Success",
    type: "guide",
    status: "published",
    views: 567,
    contributors: 5,
    created_at: "2024-01-05T09:00:00Z",
    updated_at: "2024-01-14T11:20:00Z"
  },
  {
    id: "kb-003",
    title: "Product Feature Comparison",
    category: "Product",
    type: "reference",
    status: "draft",
    views: 12,
    contributors: 2,
    created_at: "2024-01-12T15:00:00Z",
    updated_at: "2024-01-13T10:00:00Z"
  },
  {
    id: "kb-004",
    title: "Technical Integration FAQ",
    category: "Engineering",
    type: "faq",
    status: "published",
    views: 892,
    contributors: 4,
    created_at: "2023-12-20T08:00:00Z",
    updated_at: "2024-01-11T16:45:00Z"
  },
]

const categories = [
  { name: "Sales", count: 24, color: "bg-blue-500" },
  { name: "Customer Success", count: 18, color: "bg-green-500" },
  { name: "Product", count: 12, color: "bg-purple-500" },
  { name: "Engineering", count: 31, color: "bg-orange-500" },
  { name: "Marketing", count: 15, color: "bg-pink-500" },
]

const kpis: KPIItem[] = [
  { label: "Total Articles", value: "156", change: "+8 this week", changeType: "positive" },
  { label: "Categories", value: "12", icon: <Folder className="w-4 h-4" /> },
  { label: "Total Views", value: "12.4K", icon: <Eye className="w-4 h-4" /> },
  { label: "Contributors", value: "23", icon: <Users className="w-4 h-4" /> },
]

function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-600",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.draft}`}>
      {status}
    </span>
  )
}

export function KnowledgeView() {
  const [items] = useState(mockKnowledgeItems)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const selected = items.find(i => i.id === selectedItem)
  const filteredItems = activeCategory 
    ? items.filter(i => i.category === activeCategory)
    : items

  return (
    <UnifiedPageTemplate
      title="Knowledge Base"
      description="Centralized knowledge repository for your organization"
      stageId="OPS-KNOWLEDGE-001"
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Knowledge" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Article
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Title</h4>
            <p className="text-gray-900">{selected.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
            <p className="text-gray-900">{selected.category}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
            <p className="text-gray-900 capitalize">{selected.type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <StatusBadge status={selected.status} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Views</h4>
              <p className="text-gray-900">{selected.views}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Contributors</h4>
              <p className="text-gray-900">{selected.contributors}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
            <p className="text-gray-900">{new Date(selected.updated_at).toLocaleString()}</p>
          </div>
          <div className="pt-4 border-t border-gray-200 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Article Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={items.length === 0}
      emptyState={{
        icon: <BookOpen className="w-12 h-12" />,
        title: "Knowledge Base Empty",
        description: "Start building your knowledge base by creating your first article.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Create First Article
          </button>
        )
      }}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === null ? 'bg-[#2D7A3E]/10 text-[#2D7A3E]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    activeCategory === cat.name ? 'bg-[#2D7A3E]/10 text-[#2D7A3E]' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                    {cat.name}
                  </div>
                  <span className="text-xs text-gray-400">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="col-span-9">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedItem(item.id)
                    setRightPanelOpen(true)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnifiedPageTemplate>
  )
}

export default KnowledgeView
