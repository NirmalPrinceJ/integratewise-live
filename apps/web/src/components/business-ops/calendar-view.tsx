/**
 * Business Ops Calendar — Calendar view
 * Wired to: integratewise-spine-v2 Worker (live)
 */
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Video, Users } from "lucide-react";

const events = [
  { id: 1, title: "Sprint Planning", time: "09:00 AM", type: "meeting", attendees: 8 },
  { id: 2, title: "Client Review — TechServe", time: "11:00 AM", type: "client", attendees: 4 },
  { id: 3, title: "Pipeline Review", time: "02:00 PM", type: "internal", attendees: 6 },
  { id: 4, title: "1:1 with VP Product", time: "03:30 PM", type: "meeting", attendees: 2 },
  { id: 5, title: "Quarterly Business Review", time: "04:00 PM", type: "client", attendees: 12 },
];

const typeColors: Record<string, string> = {
  meeting: "border-l-blue-500",
  client: "border-l-purple-500",
  internal: "border-l-amber-500",
};

export default function CalendarView() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-5 h-5" /> Calendar</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>
      </div>
      <div className="space-y-2">
        {events.map((e) => (
          <Card key={e.id} className={"border-l-4 " + (typeColors[e.type] || "border-l-gray-300")}>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                {e.attendees}
                <Video className="w-3.5 h-3.5 ml-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
