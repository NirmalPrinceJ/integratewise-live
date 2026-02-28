import { useState, useEffect, useCallback } from "react";
import { getEvents, getTodaysEvents, CalendarEvent } from "../lib/api";

export function useCalendar(options: {
  startDate?: string;
  endDate?: string;
} = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // Default to today if no dates provided
      const today = new Date();
      const start = options.startDate || today.toISOString().split("T")[0] + "T00:00:00Z";
      const end = options.endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const data = await getEvents({ startDate: start, endDate: end });
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.startDate, options.endDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useTodaysEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getTodaysEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch today's events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading };
}
