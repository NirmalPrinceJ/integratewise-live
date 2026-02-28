import { useState, useEffect, useCallback } from "react";
import { getTasks, completeTask, createTask, Task } from "../lib/api";

export function useTasks(options: {
  status?: string;
  priority?: string;
} = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks(options);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.status, options.priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const complete = useCallback(async (id: string) => {
    try {
      await completeTask(id);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "completed", completed_at: new Date().toISOString() } : t
        )
      );
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  }, []);

  const addTask = useCallback(async (task: Parameters<typeof createTask>[0]) => {
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error("Failed to create task:", err);
      throw err;
    }
  }, []);

  return { tasks, loading, error, refetch: fetchTasks, complete, addTask };
}
