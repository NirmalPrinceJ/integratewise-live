import { PageHeader } from "@/components/spine/page-header"
import { MetricCard } from "@/components/spine/metric-card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Eye, Heart, Share2, ExternalLink, MoreHorizontal } from "lucide-react"

const content = [
  {
    id: 1,
    title: "Why Your MuleSoft Implementation Fails: 5 Critical Mistakes",
    type: "Article",
    status: "published",
    platform: "LinkedIn",
    date: "12/15/2024",
    views: 12500,
    likes: 890,
    shares: 156,
    tags: ["mulesoft", "best-practices"],
  },
  {
    id: 2,
    title: "Integration Architecture Patterns 2025",
    type: "Ebook",
    status: "published",
    platform: "Website",
    date: "11/1/2024",
    views: 3200,
    likes: 0,
    shares: 245,
    tags: ["integration", "architecture", "ebook"],
  },
  {
    id: 3,
    title: "Customer Success Automation Playbook",
    type: "Guide",
    status: "published",
    platform: "Website",
    date: "8/15/2024",
    views: 1850,
    likes: 0,
    shares: 98,
    tags: ["customer-success", "automation"],
  },
]

export default function ContentLibraryPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Content Library"
        description="Marketing assets, lead magnets, and thought leadership"
        stageId="BUSINESS-018"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Content" value="12" icon={FileText} />
        <MetricCard title="Published" value="10" icon={FileText} />
        <MetricCard title="Total Views" value="110,480" icon={Eye} primary />
        <MetricCard title="Total Shares" value="1,769" icon={Share2} />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search content..."
            className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Article", "Video", "Ebook", "Guide", "Newsletter", "Case Study", "Tool"].map((type, i) => (
            <button
              key={type}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                i === 0 ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-3 gap-4">
        {content.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">{item.status}</span>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {item.platform} • {item.date}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {item.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {item.likes}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                {item.shares}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Content
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
