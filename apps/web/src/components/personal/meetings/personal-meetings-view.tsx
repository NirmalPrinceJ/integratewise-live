"use client";

import { useState, useEffect } from "react";
import { workspace } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, RotateCcw, Clock, Users, CheckCircle2 } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration?: number;
  attendees?: string[];
  attendeeCount?: number;
  actionItems?: number;
  status?: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export function PersonalMeetingsView() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  async function loadMeetings() {
    try {
      setLoading(true);
      setError(null);
      const result = await workspace.view("meetings");
      const data = result.data || result.meetings || [];
      const meetingList = Array.isArray(data) ? data : [];
      // Sort by date - upcoming first
      const sorted = meetingList.sort((a, b) => {
        const statusOrder = { upcoming: 0, completed: 1, cancelled: 2 };
        const aStatus = statusOrder[a.status as keyof typeof statusOrder] ?? 0;
        const bStatus = statusOrder[b.status as keyof typeof statusOrder] ?? 0;
        if (aStatus !== bStatus) return aStatus - bStatus;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      setMeetings(sorted);
    } catch (err: any) {
      setError(err.message || "Failed to load meetings");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const upcomingCount = meetings.filter(m => m.status === "upcoming").length;
  const completedCount = meetings.filter(m => m.status === "completed").length;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Meetings</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadMeetings} className="mt-2">
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
          <h2 className="text-xl font-semibold">Meetings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{meetings.length} total</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadMeetings}>
          Refresh
        </Button>
      </div>

      {meetings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Upcoming
              </p>
              <span className="text-2xl font-bold text-blue-700">{upcomingCount}</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </p>
              <span className="text-2xl font-bold text-emerald-700">{completedCount}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-350px)]">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No meetings scheduled</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 pr-4">
            {meetings.map(meeting => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{meeting.title}</h3>
                      {meeting.status && (
                        <Badge className={`mt-1 text-xs ${statusColors[meeting.status] || "bg-gray-100 text-gray-700"}`}>
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(meeting.date).toLocaleDateString()}</span>
                      {meeting.time && <span>at {meeting.time}</span>}
                      {meeting.duration && <span>({meeting.duration}m)</span>}
                    </div>
                    {(meeting.attendeeCount || meeting.attendees?.length) && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>
                          {meeting.attendeeCount || meeting.attendees?.length} attendee{(meeting.attendeeCount || meeting.attendees?.length) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {meeting.actionItems && meeting.actionItems > 0 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{meeting.actionItems} action items</span>
                      </div>
                    )}
                  </div>
                  {meeting.notes && (
                    <div className="mt-2 p-2 rounded bg-secondary/50 text-xs">
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="line-clamp-2">{meeting.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
