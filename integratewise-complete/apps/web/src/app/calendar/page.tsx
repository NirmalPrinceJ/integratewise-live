import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const events = [
  { id: 1, title: "FinanceFlow Renewal Review", time: "10:00 AM - 11:00 AM", type: "meeting" },
  { id: 2, title: "Q1 Planning Session", time: "2:00 PM - 3:30 PM", type: "meeting" },
  { id: 3, title: "Team Standup", time: "4:00 PM - 4:30 PM", type: "call" },
];

export default function CalendarPage() {
  return (
    <DashboardLayout title="Calendar" subtitle="3 events today">
      <div className="bg-white border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-medium text-black">February 2026</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1 text-sm border border-gray-200">Today</button>
            <button className="p-2 hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Events */}
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500 mb-4">Today</div>
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-4 p-4 border border-gray-200 mb-3 hover:border-gray-400 transition-colors cursor-pointer">
              <div className="w-1 h-12 bg-black" />
              <div className="flex-1">
                <h4 className="font-medium text-black">{event.title}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
