import { DashboardLayout } from "@/components/layouts/page-layouts"
import { FolderKanban, Users, Calendar, TrendingUp, Clock, Target, Circle } from "lucide-react"

export default async function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Q1 Product Launch",
      status: "on-track",
      progress: 68,
      dueDate: "Mar 15, 2026",
      team: 8,
      tasksCompleted: 42,
      tasksTotal: 62,
      priority: "high",
      health: "good",
    },
    {
      id: 2,
      name: "Customer Portal Redesign",
      status: "at-risk",
      progress: 45,
      dueDate: "Feb 28, 2026",
      team: 5,
      tasksCompleted: 18,
      tasksTotal: 40,
      priority: "medium",
      health: "warning",
    },
    {
      id: 3,
      name: "API Documentation v2",
      status: "ahead",
      progress: 92,
      dueDate: "Feb 10, 2026",
      team: 3,
      tasksCompleted: 23,
      tasksTotal: 25,
      priority: "low",
      health: "excellent",
    },
    {
      id: 4,
      name: "Mobile App Beta",
      status: "on-track",
      progress: 34,
      dueDate: "Apr 30, 2026",
      team: 12,
      tasksCompleted: 28,
      tasksTotal: 82,
      priority: "high",
      health: "good",
    },
  ]

  const stats = [
    { label: "Active Projects", value: "12", icon: FolderKanban, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Team Members", value: "48", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Tasks This Week", value: "124", icon: Target, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Overdue", value: "7", icon: Clock, color: "text-red-600", bgColor: "bg-red-50" },
  ]

  const statusConfig = {
    "on-track": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
    "at-risk": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    "ahead": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
    "delayed": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
  }

  const priorityConfig = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-blue-100 text-blue-700",
  }

  return (
    <DashboardLayout
      title="Projects"
      description="Track and manage all active projects"
      stageId="PROJECTS-013"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className={`p-4 ${stat.bgColor} rounded-lg border border-gray-200/50`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 uppercase">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <button className="px-4 py-2 text-sm bg-[#2D7A3E] text-white rounded-lg">All Projects</button>
        <button className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Active</button>
        <button className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">At Risk</button>
        <button className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Completed</button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => {
          const config = statusConfig[project.status as keyof typeof statusConfig]
          return (
            <div
              key={project.id}
              className={`p-5 border rounded-lg ${config.border} ${config.bg} hover:shadow-md transition-all cursor-pointer`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderKanban className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badge}`}>
                      {project.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityConfig[project.priority as keyof typeof priorityConfig]}`}>
                      {project.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
                  <div className="text-xs text-gray-500">complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-white/60 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${config.text.replace('text-', 'bg-')}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-white/60 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {project.tasksCompleted}/{project.tasksTotal}
                  </div>
                  <div className="text-xs text-gray-600">Tasks</div>
                </div>
                <div className="text-center p-2 bg-white/60 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{project.team}</div>
                  <div className="text-xs text-gray-600">Team</div>
                </div>
                <div className="text-center p-2 bg-white/60 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="text-xs font-semibold text-gray-900">{project.dueDate}</div>
                  <div className="text-xs text-gray-600">Due</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Circle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
