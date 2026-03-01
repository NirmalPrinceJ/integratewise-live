/**
 * Projects Views - Project Management
 * All views use UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  DashboardPageTemplate,
  KanbanPageTemplate,
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  FolderKanban,
  Milestone,
  CheckSquare,
  Calendar,
  Plus,
  Clock,
  Users,
  Target,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Flag,
  Circle,
  CheckCircle2
} from "lucide-react"

// ============================================================================
// Projects List View
// ============================================================================

const mockProjects = [
  { id: "proj-001", name: "Website Redesign", status: "in_progress", progress: 65, owner: "Sarah Chen", team: 5, deadline: "2024-03-15", priority: "high" },
  { id: "proj-002", name: "API Integration", status: "in_progress", progress: 40, owner: "Mike Johnson", team: 3, deadline: "2024-02-28", priority: "medium" },
  { id: "proj-003", name: "Mobile App v2", status: "planning", progress: 15, owner: "Alex Kim", team: 4, deadline: "2024-04-30", priority: "high" },
  { id: "proj-004", name: "Documentation Update", status: "completed", progress: 100, owner: "Emily Davis", team: 2, deadline: "2024-01-20", priority: "low" },
]

function ProjectStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    planning: { bg: "bg-blue-100", text: "text-blue-700" },
    in_progress: { bg: "bg-yellow-100", text: "text-yellow-700" },
    review: { bg: "bg-purple-100", text: "text-purple-700" },
    completed: { bg: "bg-green-100", text: "text-green-700" },
    on_hold: { bg: "bg-gray-100", text: "text-gray-600" },
  }
  const { bg, text } = config[status] || config.planning
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {status.replace("_", " ")}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    high: { bg: "bg-red-100", text: "text-red-700" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
    low: { bg: "bg-gray-100", text: "text-gray-600" },
  }
  const { bg, text } = config[priority] || config.medium
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {priority}
    </span>
  )
}

export function ProjectsListView() {
  const [projects] = useState(mockProjects)
  const [selected, setSelected] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const kpis: KPIItem[] = [
    { label: "Active Projects", value: "8", color: "primary", icon: <FolderKanban className="w-4 h-4" /> },
    { label: "In Progress", value: "5", color: "yellow" },
    { label: "On Track", value: "6", color: "green" },
    { label: "At Risk", value: "2", color: "red", icon: <AlertCircle className="w-4 h-4" /> },
  ]

  const selectedProject = projects.find(p => p.id === selected)

  return (
    <ListPageTemplate
      title="Projects"
      description="Manage all projects"
      stageId="PROJ-LIST-001"
      breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "All Projects" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />New Project</button>}
      rightPanel={selectedProject ? (
        <div className="space-y-4">
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Project</h4><p className="text-gray-900 font-medium">{selectedProject.name}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4><ProjectStatusBadge status={selectedProject.status} /></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Progress</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-[#2D7A3E] h-2 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div></div>
              <span className="text-sm text-gray-600">{selectedProject.progress}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4><p className="text-gray-900">{selectedProject.owner}</p></div>
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Team Size</h4><p className="text-gray-900">{selectedProject.team}</p></div>
          </div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Deadline</h4><p className="text-gray-900">{selectedProject.deadline}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Priority</h4><PriorityBadge priority={selectedProject.priority} /></div>
        </div>
      ) : null}
      rightPanelTitle="Project Details"
      rightPanelOpen={panelOpen}
      onRightPanelClose={() => setPanelOpen(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all" onClick={() => { setSelected(project.id); setPanelOpen(true); }}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg"><FolderKanban className="w-5 h-5 text-blue-600" /></div>
              <PriorityBadge priority={project.priority} />
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">{project.name}</h4>
            <div className="flex items-center gap-2 mb-3">
              <ProjectStatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-[#2D7A3E] h-2 rounded-full" style={{ width: `${project.progress}%` }}></div></div>
              <span className="text-xs text-gray-500">{project.progress}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.team}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Milestones View
// ============================================================================

export function MilestonesView() {
  const milestones = [
    { id: 1, name: "Design Complete", project: "Website Redesign", date: "2024-02-01", status: "completed" },
    { id: 2, name: "Beta Launch", project: "Mobile App v2", date: "2024-03-15", status: "upcoming" },
    { id: 3, name: "API Go-Live", project: "API Integration", date: "2024-02-28", status: "at_risk" },
    { id: 4, name: "Documentation v2", project: "Documentation Update", date: "2024-01-20", status: "completed" },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Milestones", value: "24", color: "primary" },
    { label: "Completed", value: "18", color: "green" },
    { label: "Upcoming", value: "4", color: "blue" },
    { label: "At Risk", value: "2", color: "red" },
  ]

  return (
    <ListPageTemplate
      title="Milestones"
      description="Track project milestones"
      stageId="PROJ-MILES-001"
      breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Milestones" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Milestone</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Milestone</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Project</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Due Date</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {milestones.map((ms) => (
              <tr key={ms.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${ms.status === 'completed' ? 'bg-green-50' : ms.status === 'at_risk' ? 'bg-red-50' : 'bg-blue-50'}`}><Milestone className={`w-4 h-4 ${ms.status === 'completed' ? 'text-green-600' : ms.status === 'at_risk' ? 'text-red-600' : 'text-blue-600'}`} /></div><span className="text-sm font-medium text-gray-900">{ms.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{ms.project}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{ms.date}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ms.status === 'completed' ? 'bg-green-100 text-green-700' : ms.status === 'at_risk' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{ms.status.replace("_", " ")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Project Tasks View
// ============================================================================

export function ProjectTasksView() {
  const tasks = [
    { id: 1, title: "Design homepage mockup", project: "Website Redesign", priority: "high", status: "in_progress", assignee: "Sarah" },
    { id: 2, title: "Implement auth endpoints", project: "API Integration", priority: "high", status: "todo", assignee: "Mike" },
    { id: 3, title: "Write API docs", project: "Documentation Update", priority: "medium", status: "done", assignee: "Emily" },
    { id: 4, title: "User testing", project: "Mobile App v2", priority: "medium", status: "todo", assignee: "Alex" },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Tasks", value: "156", color: "primary" },
    { label: "To Do", value: "45", color: "gray" },
    { label: "In Progress", value: "32", color: "yellow" },
    { label: "Done", value: "79", color: "green" },
  ]

  return (
    <ListPageTemplate
      title="Tasks"
      description="All project tasks"
      stageId="PROJ-TASKS-001"
      breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Tasks" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Task</button>}
    >
      <div className="grid grid-cols-3 gap-4">
        {["todo", "in_progress", "done"].map((status) => (
          <div key={status} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              {status === "todo" && <Circle className="w-4 h-4 text-gray-400" />}
              {status === "in_progress" && <Clock className="w-4 h-4 text-yellow-500" />}
              {status === "done" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              <h3 className="text-sm font-semibold text-gray-700 capitalize">{status.replace("_", " ")}</h3>
              <span className="text-xs text-gray-500">({tasks.filter(t => t.status === status).length})</span>
            </div>
            <div className="space-y-2">
              {tasks.filter(t => t.status === status).map((task) => (
                <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs text-gray-400">{task.assignee}</span>
                  </div>
                  <p className="text-sm text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.project}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Projects Today View
// ============================================================================

export function ProjectsTodayView() {
  const kpis: KPIItem[] = [
    { label: "Tasks Due", value: "8", color: "yellow" },
    { label: "Milestones This Week", value: "2", color: "blue" },
    { label: "Blockers", value: "1", color: "red" },
    { label: "Team Available", value: "12", color: "green" },
  ]

  return (
    <DashboardPageTemplate
      title="Today"
      description={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      stageId="PROJ-TODAY-001"
      breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Today" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Today's Tasks</h3>
            <div className="space-y-3">
              {[
                { title: "Review design mockups", project: "Website Redesign", priority: "high" },
                { title: "API endpoint testing", project: "API Integration", priority: "high" },
                { title: "Update user docs", project: "Documentation", priority: "medium" },
              ].map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <div><p className="text-sm font-medium text-gray-900">{task.title}</p><p className="text-xs text-gray-500">{task.project}</p></div>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Milestones</h3>
            <div className="space-y-2">
              {[
                { name: "Design Complete", project: "Website Redesign", date: "Feb 1" },
                { name: "API Go-Live", project: "API Integration", date: "Feb 28" },
              ].map((ms, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flag className="w-4 h-4 text-blue-600" />
                    <div><p className="text-sm font-medium text-gray-900">{ms.name}</p><p className="text-xs text-gray-500">{ms.project}</p></div>
                  </div>
                  <span className="text-sm text-gray-500">{ms.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-gradient-to-br from-[#2D7A3E] to-[#1d5a2e] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4" /><h3 className="text-sm font-semibold">AI Insights</h3></div>
          <div className="space-y-2">
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">Website Redesign is 2 days ahead of schedule. Consider pulling in next sprint items.</p></div>
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">API Integration has 1 blocker. Mike may need support from the backend team.</p></div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

export default {
  ProjectsListView,
  MilestonesView,
  ProjectTasksView,
  ProjectsTodayView,
}
