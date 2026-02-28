import { useState, useEffect, useCallback } from "react";
import { getPendingActions, approveAction, rejectAction, Action } from "../lib/api";

export function usePendingActions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingActions();
      setActions(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const approve = useCallback(async (id: string) => {
    try {
      await approveAction(id, "current-user"); // Replace with actual user ID
      setActions((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to approve action:", err);
    }
  }, []);

  const reject = useCallback(async (id: string) => {
    try {
      await rejectAction(id);
      setActions((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to reject action:", err);
    }
  }, []);

  return { actions, loading, error, refetch: fetchActions, approve, reject };
}
