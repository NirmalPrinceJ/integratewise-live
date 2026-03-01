/**
 * Sales Tasks View - Task Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  User,
  Flag,
  MoreHorizontal,
  CheckCircle,
  Circle,
  AlertCircle
} from "lucide-react"

const mockTasks = [
  {
    id: "task-001",
    title: "Send proposal to Acme Corp",
    description: "Include pricing for enterprise tier",
    dueDate: "2024-01-15",
    priority: "high",
    status: "pending",
    assignee: "Sarah Chen",
    relatedTo: { type: "deal", name: "Acme Corp - Enterprise" }
  },
  {
    id: "task-002",
    title: "Follow up with TechStart",
    description: "Check on demo feedback",
    dueDate: "2024-01-16",
    priority: "medium",
    status: "in-progress",
    assignee: "Mike Johnson",
    relatedTo: { type: "lead", name: "TechStart Inc" }
  },
  {
    id: "task-003",
    title: "Update CRM with meeting notes",
    description: "Document GlobalTech call outcomes",
    dueDate: "2024-01-14",
    priority: "low",
    status: "overdue",
    assignee: "Lisa Park",
    relatedTo: { type: "account", name: "GlobalTech" }
  },
  {
    id: "task-004",
    title: "Prepare quarterly review deck",
    description: "Q4 performance summary for leadership",
    dueDate: "2024-01-20",
    priority: "high",
    status: "completed",
    assignee: "David Lee",
    relatedTo: null
  },
]

const kpis: KPIItem[] = [
  { label: "Total Tasks", value: "45", color: "primary" },
  { label: "Due Today", value: "8", color: "yellow", icon: <Clock className="w-4 h-4" /> },
  { label: "Overdue", value: "3", color: "red", icon: <AlertCircle className="w-4 h-4" /> },
  { label: "Completed", value: "23", color: "green", icon: <CheckCircle className="w-4 h-4" /> },
]

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    high: { bg: "bg-red-100", text: "text-red-700" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
    low: { bg: "bg-gray-100", text: "text-gray-600" },
  }
  const { bg, text } = config[priority] || config.low
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Flag className="w-3 h-3" />
      {priority}
    </span>
  )
}

function StatusIcon({ status }: { status: string }) {
  const config: Record<string, { icon: any; color: string }> = {
    pending: { icon: Circle, color: "text-gray-400" },
    "in-progress": { icon: Clock, color: "text-blue-500" },
    completed: { icon: CheckCircle, color: "text-green-500" },
    overdue: { icon: AlertCircle, color: "text-red-500" },
  }
  const { icon: Icon, color } = config[status] || config.pending
  return <Icon className={`w-5 h-5 ${color}`} />
}

export function SalesTasksView() {
  const [tasks] = useState(mockTasks)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = tasks.find(t => t.id === selectedTask)

  return (
    <ListPageTemplate
      title="Tasks"
      description="Manage your sales tasks and follow-ups"
      stageId="SALES-TASKS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Tasks" }
      ]}
      kpis={kpis}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Task</h4>
            <p className="text-gray-900 font-medium">{selected.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-gray-600 text-sm">{selected.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Priority</h4>
              <PriorityBadge priority={selected.priority} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <div className="flex items-center gap-1">
                <StatusIcon status={selected.status} />
                <span className="text-sm text-gray-600 capitalize">{selected.status}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
            <p className="text-gray-900 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              {new Date(selected.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Assignee</h4>
            <p className="text-gray-900 flex items-center gap-1">
              <User className="w-3 h-3 text-gray-400" />
              {selected.assignee}
            </p>
          </div>
          {selected.relatedTo && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Related To</h4>
              <p className="text-gray-900">
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-1 capitalize">{selected.relatedTo.type}</span>
                {selected.relatedTo.name}
              </p>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200">
            {selected.status !== 'completed' ? (
              <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </button>
            ) : (
              <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
                <Circle className="w-4 h-4" />
                Reopen Task
              </button>
            )}
          </div>
        </div>
      ) : null}
      rightPanelTitle="Task Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={tasks.length === 0}
      emptyState={{
        icon: <CheckSquare className="w-12 h-12" />,
        title: "No Tasks Yet",
        description: "Create your first task to start tracking your work.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Add First Task
          </button>
        )
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedTask(task.id)
                setRightPanelOpen(true)
              }}
            >
              <StatusIcon status={task.status} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  {task.relatedTo && (
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                      {task.relatedTo.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {task.assignee}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={task.priority} />
                <span className={`text-sm flex items-center gap-1 ${
                  task.status === 'overdue' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <Calendar className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ListPageTemplate>
  )
}

export default SalesTasksView
