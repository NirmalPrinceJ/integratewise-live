"use client"

import { DashboardLayout, Card, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, CheckSquare, Clock, AlertTriangle, Users,
  Calendar, Filter, MoreHorizontal, ChevronRight,
  Play, Pause, CheckCircle2, Circle, ArrowUpRight
} from "lucide-react"
import { useState } from "react"

const SAMPLE_TASKS = [
  {
    id: "t-001",
    title: "Review Q1 Sales Pipeline",
    description: "Analyze pipeline health and identify at-risk deals",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Chen",
    department: "Sales",
    due_date: "2026-02-01",
    created_at: "2026-01-28",
    tags: ["pipeline", "review"],
  },
  {
    id: "t-002", 
    title: "Update Customer Health Scores",
    description: "Run quarterly health score calculations for all enterprise accounts",
    status: "pending",
    priority: "medium",
    assignee: "Mike Johnson",
    department: "Customer Success",
    due_date: "2026-02-03",
    created_at: "2026-01-29",
    tags: ["health-score", "enterprise"],
  },
  {
    id: "t-003",
    title: "Deploy Marketing Automation Flow",
    description: "Complete setup of new lead nurturing campaign",
    status: "completed",
    priority: "high",
    assignee: "Emma Wilson",
    department: "Marketing",
    due_date: "2026-01-30",
    created_at: "2026-01-25",
    tags: ["automation", "campaign"],
  },
  {
    id: "t-004",
    title: "System Integration Testing",
    description: "Test new Salesforce-HubSpot sync configuration",
    status: "blocked",
    priority: "critical",
    assignee: "Alex Kumar",
    department: "Engineering",
    due_date: "2026-02-02",
    created_at: "2026-01-27",
    tags: ["integration", "testing"],
  },
  {
    id: "t-005",
    title: "Prepare Board Meeting Materials",
    description: "Compile financial reports and metrics dashboard for Q4 review",
    status: "in-progress",
    priority: "high",
    assignee: "Linda Park",
    department: "Finance",
    due_date: "2026-02-05",
    created_at: "2026-01-30",
    tags: ["board", "reporting"],
  },
  {
    id: "t-006",
    title: "Onboard New Enterprise Client",
    description: "Complete implementation kickoff for Acme Corp",
    status: "pending",
    priority: "high",
    assignee: "David Lee",
    department: "Customer Success",
    due_date: "2026-02-04",
    created_at: "2026-01-31",
    tags: ["onboarding", "enterprise"],
  },
]

const TASK_STATS = {
  total: 24,
  completed: 8,
  inProgress: 10,
  pending: 4,
  blocked: 2,
}

const statusConfig = {
  "pending": { 
    label: "Pending", 
    icon: Circle,
    bg: "bg-slate-100", 
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-600 border-slate-200"
  },
  "in-progress": { 
    label: "In Progress", 
    icon: Play,
    bg: "bg-blue-50", 
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200"
  },
  "completed": { 
    label: "Completed", 
    icon: CheckCircle2,
    bg: "bg-green-50", 
    text: "text-green-600",
    badge: "bg-green-100 text-green-700 border-green-200"
  },
  "blocked": { 
    label: "Blocked", 
    icon: Pause,
    bg: "bg-red-50", 
    text: "text-red-600",
    badge: "bg-red-100 text-red-700 border-red-200"
  },
}

const priorityConfig = {
  "low": { label: "Low", color: "text-slate-500", dot: "bg-slate-400" },
  "medium": { label: "Medium", color: "text-blue-600", dot: "bg-blue-500" },
  "high": { label: "High", color: "text-amber-600", dot: "bg-amber-500" },
  "critical": { label: "Critical", color: "text-red-600", dot: "bg-red-500" },
}

export default function AdminTasksPage() {
  const [filter, setFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const filteredTasks = SAMPLE_TASKS.filter(task => {
    if (filter !== "all" && task.status !== filter) return false
    if (departmentFilter !== "all" && task.department !== departmentFilter) return false
    return true
  })

  const departments = [...new Set(SAMPLE_TASKS.map(t => t.department))]

  return (
    <DashboardLayout 
      title="Task Management" 
      description="Monitor and manage tasks across all departments"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      }
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Tasks</span>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{TASK_STATS.total}</p>
          <p className="text-xs text-slate-500 mt-1">Across all teams</p>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-700">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">{TASK_STATS.completed}</p>
          <p className="text-xs text-green-600 mt-1">{Math.round(TASK_STATS.completed / TASK_STATS.total * 100)}% done</p>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">In Progress</span>
            <Play className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{TASK_STATS.inProgress}</p>
          <p className="text-xs text-blue-600 mt-1">Active now</p>
        </Card>
        
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{TASK_STATS.pending}</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting start</p>
        </Card>
        
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-red-700">Blocked</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700">{TASK_STATS.blocked}</p>
          <p className="text-xs text-red-600 mt-1">Needs attention</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "in-progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "blocked", label: "Blocked" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === tab.key 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Department:</span>
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-md px-2 py-1"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const status = statusConfig[task.status as keyof typeof statusConfig]
          const priority = priorityConfig[task.priority as keyof typeof priorityConfig]
          const StatusIcon = status.icon
          const daysUntilDue = Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          const isOverdue = daysUntilDue < 0

          return (
            <Card 
              key={task.id} 
              className={`p-4 ${status.bg} border-l-4 ${task.status === 'blocked' ? 'border-l-red-500' : task.status === 'completed' ? 'border-l-green-500' : task.status === 'in-progress' ? 'border-l-blue-500' : 'border-l-slate-300'} hover:shadow-sm transition-shadow cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`p-2 rounded-lg ${status.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${status.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900">{task.title}</h3>
                        <Badge variant="outline" className={status.badge}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
                    </div>
                    <button className="p-1 hover:bg-white/50 rounded" title="More options">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
                      <span className={priority.color}>{priority.label}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {task.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {task.department}
                      </Badge>
                    </span>
                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                      <Calendar className="w-3 h-3" />
                      {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {task.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-white/60 text-slate-500 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="p-12 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 mb-2">No tasks found</h3>
          <p className="text-slate-500 mb-4">No tasks match the current filters.</p>
          <Button onClick={() => { setFilter("all"); setDepartmentFilter("all"); }} variant="outline">
            Clear Filters
          </Button>
        </Card>
      )}
    </DashboardLayout>
  )
}
