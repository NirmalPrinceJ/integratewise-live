import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { useState } from "react";
import { Clock, Video, Users, Loader2 } from "lucide-react";
import { useCalendar } from "../../hooks/useCalendar";

export function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { events, loading } = useCalendar();

  // Filter events for selected date
  const selectedDateEvents = events.filter((event) => {
    if (!date) return false;
    const eventDate = new Date(event.start_time).toDateString();
    return eventDate === date.toDateString();
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Calendar</h1>
        <p className="text-gray-500">Your schedule across all connected tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 text-sm font-medium text-gray-500">
                    {new Date(event.start_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.round(
                          (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / 60000
                        )} min
                      </span>
                      {event.attendees && event.attendees.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees.length} attendees
                        </span>
                      )}
                      {event.location?.includes("zoom") && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Video className="h-3 w-3" />
                          Video call
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}

              {selectedDateEvents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No events scheduled for this day</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
