/**
 * Projects View - Project Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  FolderKanban,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Users,
  MoreHorizontal,
  Target,
  ArrowRight,
  TrendingUp
} from "lucide-react"

// Mock data - replace with API calls
const mockProjects = [
  {
    id: "proj-001",
    name: "Q1 Product Launch",
    description: "New feature release for enterprise customers",
    status: "on-track",
    progress: 75,
    dueDate: "2024-02-15",
    owner: "Sarah Chen",
    team: ["John", "Mike", "Lisa"],
    tasks: { completed: 18, total: 24 },
    priority: "high"
  },
  {
    id: "proj-002",
    name: "Website Redesign",
    description: "Complete overhaul of marketing website",
    status: "at-risk",
    progress: 45,
    dueDate: "2024-01-31",
    owner: "Mike Johnson",
    team: ["Emma", "Chris"],
    tasks: { completed: 12, total: 28 },
    priority: "high"
  },
  {
    id: "proj-003",
    name: "Customer Portal v2",
    description: "Self-service portal improvements",
    status: "on-track",
    progress: 90,
    dueDate: "2024-01-20",
    owner: "Lisa Park",
    team: ["David", "Amy", "Tom"],
    tasks: { completed: 27, total: 30 },
    priority: "medium"
  },
  {
    id: "proj-004",
    name: "API Documentation",
    description: "Developer documentation refresh",
    status: "completed",
    progress: 100,
    dueDate: "2024-01-10",
    owner: "David Lee",
    team: ["Sarah"],
    tasks: { completed: 15, total: 15 },
    priority: "low"
  },
]

const kpis: KPIItem[] = [
  { label: "Active Projects", value: "12", color: "primary" },
  { label: "On Track", value: "8", color: "green", icon: <CheckCircle className="w-4 h-4" /> },
  { label: "At Risk", value: "3", color: "yellow", icon: <AlertTriangle className="w-4 h-4" /> },
  { label: "Completed", value: "24", icon: <Target className="w-4 h-4" /> },
]

function StatusBadge({ status }: { status: string }) {
  const config = {
    'on-track': { bg: "bg-green-100", text: "text-green-700", label: "On Track" },
    'at-risk': { bg: "bg-yellow-100", text: "text-yellow-700", label: "At Risk" },
    'behind': { bg: "bg-red-100", text: "text-red-700", label: "Behind" },
    'completed': { bg: "bg-blue-100", text: "text-blue-700", label: "Completed" },
  }
  const { bg, text, label } = config[status as keyof typeof config] || config['on-track']
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    high: "bg-red-50 text-red-600 border-red-200",
    medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
    low: "bg-gray-50 text-gray-600 border-gray-200",
  }
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${config[priority as keyof typeof config]}`}>
      {priority}
    </span>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  const color = progress >= 75 ? "bg-green-500" : progress >= 50 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${progress}%` }} />
    </div>
  )
}

export function ProjectsView() {
  const [projects] = useState(mockProjects)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'kanban'>('cards')

  const selected = projects.find(p => p.id === selectedProject)

  return (
    <UnifiedPageTemplate
      title="Projects"
      description="Track and manage all active projects"
      stageId="OPS-PROJECTS-001"
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Projects" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      viewModes={['cards', 'table', 'kanban']}
      currentViewMode={viewMode}
      onViewModeChange={(mode) => setViewMode(mode as 'table' | 'cards' | 'kanban')}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Project Name</h4>
            <p className="text-gray-900">{selected.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-gray-600 text-sm">{selected.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Priority</h4>
              <PriorityBadge priority={selected.priority} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Progress</h4>
            <div className="flex items-center gap-2">
              <ProgressBar progress={selected.progress} />
              <span className="text-sm text-gray-600">{selected.progress}%</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4>
            <p className="text-gray-900">{selected.owner}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
            <p className="text-gray-900">{new Date(selected.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Tasks</h4>
            <p className="text-gray-900">{selected.tasks.completed} / {selected.tasks.total} completed</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              View Project
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Project Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={projects.length === 0}
      emptyState={{
        icon: <FolderKanban className="w-12 h-12" />,
        title: "No Projects Yet",
        description: "Create your first project to start tracking work.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Create First Project
          </button>
        )
      }}
    >
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
              onClick={() => {
                setSelectedProject(project.id)
                setRightPanelOpen(true)
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{project.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <ProgressBar progress={project.progress} />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.dueDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {project.team.length + 1}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {project.tasks.completed}/{project.tasks.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Project</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Progress</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Owner</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Due Date</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr 
                  key={project.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedProject(project.id)
                    setRightPanelOpen(true)
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <FolderKanban className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                  <td className="px-4 py-3">
                    <div className="w-24">
                      <ProgressBar progress={project.progress} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{project.owner}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(project.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {['on-track', 'at-risk', 'behind', 'completed'].map((status) => (
            <div key={status} className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 capitalize">{status.replace('-', ' ')}</h4>
              <div className="space-y-2">
                {projects.filter(p => p.status === status).map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => {
                      setSelectedProject(project.id)
                      setRightPanelOpen(true)
                    }}
                  >
                    <p className="text-sm font-medium text-gray-900 mb-2">{project.name}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{project.owner}</span>
                      <span>{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </UnifiedPageTemplate>
  )
}

export default ProjectsView
