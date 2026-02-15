import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { getTasks } from "@/lib/supabase/queries"

export default async function TasksPage() {
  const tasks = await getTasks()

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo" || t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress" || t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done" || t.status === "completed").length,
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Tasks"
        description="Manage and track your tasks"
        stageId="TASKS-012"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-[#2D7A3E] hover:bg-[#236B31]">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        }
      />

      {/* Task Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: taskStats.total, color: "bg-gray-100" },
          { label: "To Do", value: taskStats.todo, color: "bg-blue-100" },
          { label: "In Progress", value: taskStats.inProgress, color: "bg-yellow-100" },
          { label: "Done", value: taskStats.done, color: "bg-green-100" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No tasks yet. Create your first task to get started.</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={task.status === "done" || task.status === "completed"}
                  className="w-4 h-4 rounded border-gray-300 text-[#2D7A3E]"
                  readOnly
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${task.status === "done" || task.status === "completed" ? "text-gray-400 line-through" : "text-gray-900"}`}
                  >
                    {task.title}
                  </p>
                  {task.description && <p className="text-sm text-gray-500 truncate">{task.description}</p>}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.priority === "urgent" || task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.priority || "normal"}
                </span>
                <span className="text-sm text-gray-500">{task.due_date || "No due date"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
