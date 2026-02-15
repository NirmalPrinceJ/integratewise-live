import { DashboardLayout, StatCard } from "@/components/layouts/page-layouts"
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
    <DashboardLayout
      title="Tasks"
      description="Manage and track your tasks"
      stageId="TASKS-012"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      }
    >
      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={taskStats.total} color="gray" />
        <StatCard label="To Do" value={taskStats.todo} color="blue" />
        <StatCard label="In Progress" value={taskStats.inProgress} color="yellow" />
        <StatCard label="Done" value={taskStats.done} color="green" />
      </div>

      {/* Task List */}
      <div className="bg-card rounded-xl border border-border">
        <div className="divide-y divide-border">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No tasks yet. Create your first task to get started.</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-muted">
                <input
                  type="checkbox"
                  checked={task.status === "done" || task.status === "completed"}
                  className="w-4 h-4 rounded border-border text-primary"
                  readOnly
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${task.status === "done" || task.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {task.title}
                  </p>
                  {task.description && <p className="text-sm text-muted-foreground truncate">{task.description}</p>}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.priority === "urgent" || task.priority === "high"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : task.priority === "medium"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {task.priority || "normal"}
                </span>
                <span className="text-sm text-muted-foreground">{task.due_date || "No due date"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
