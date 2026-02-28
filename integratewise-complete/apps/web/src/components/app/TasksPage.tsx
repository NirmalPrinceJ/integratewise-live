import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Loader2, Plus } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function TasksPage() {
  const { tasks, loading, complete, addTask } = useTasks();
  const { user } = useAuth();
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    await addTask({
      tenant_id: user?.workspaceId || "default",
      title: newTask,
      priority: "medium",
    });
    setNewTask("");
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Tasks</h1>
        <p className="text-gray-500">Your daily focus and action items</p>
      </div>

      {/* Add task form */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* Pending tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Focus ({pendingTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={false}
                  onCheckedChange={() => complete(task.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                    {task.due_date && (
                      <span className="text-xs text-gray-500">
                        Due {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">from {task.source}</span>
                  </div>
                </div>
              </div>
            ))}

            {pendingTasks.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No pending tasks. Great job!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-500">Completed ({completedTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-2 opacity-60"
                >
                  <Checkbox checked={true} disabled />
                  <div className="flex-1">
                    <p className="line-through text-gray-500">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
