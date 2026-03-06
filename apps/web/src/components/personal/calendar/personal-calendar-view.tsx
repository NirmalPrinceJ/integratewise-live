"use client";

import { useState, useEffect } from "react";
import { workspace } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar as CalendarIcon, Users, RotateCcw } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration?: number;
  attendees?: number;
  location?: string;
  type?: string;
}

export function PersonalCalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCalendar();
  }, []);

  async function loadCalendar() {
    try {
      setLoading(true);
      setError(null);
      const result = await workspace.view("calendar");
      const data = result.data || result.events || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load calendar");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  // Group events by date
  const groupedEvents = events.reduce((acc: Record<string, CalendarEvent[]>, event) => {
    const date = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Calendar</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadCalendar} className="mt-2">
                <RotateCcw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Calendar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{events.length} upcoming events</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadCalendar}>
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 pr-4">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">{date}</h3>
                <div className="space-y-2">
                  {groupedEvents[date].map(event => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            {event.type && (
                              <Badge variant="outline" className="mt-1 text-xs">{event.type}</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            {event.time && (
                              <p className="text-sm font-medium">{event.time}</p>
                            )}
                            {event.duration && (
                              <p className="text-xs text-muted-foreground">{event.duration}m</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {event.location && (
                            <span>{event.location}</span>
                          )}
                          {event.attendees && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {event.attendees} attendees
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
