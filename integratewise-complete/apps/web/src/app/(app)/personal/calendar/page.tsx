"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
    Clock, Video, Users, MapPin, MoreHorizontal
} from "lucide-react";

// Generate calendar days
const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days = [];

    // Previous month padding
    const prevMonth = new Date(year, month, 0);
    for (let i = startPadding - 1; i >= 0; i--) {
        days.push({
            date: prevMonth.getDate() - i,
            isCurrentMonth: false,
            fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
        });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({
            date: i,
            isCurrentMonth: true,
            fullDate: new Date(year, month, i)
        });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            date: i,
            isCurrentMonth: false,
            fullDate: new Date(year, month + 1, i)
        });
    }

    return days;
};

// Mock events
const mockEvents = [
    {
        id: "evt-1",
        title: "Team Standup",
        date: "2026-02-02",
        time: "9:00 AM",
        duration: "15 min",
        type: "meeting",
        color: "bg-blue-500"
    },
    {
        id: "evt-2",
        title: "Acme Corp QBR",
        date: "2026-02-02",
        time: "2:00 PM",
        duration: "1 hour",
        type: "external",
        color: "bg-purple-500"
    },
    {
        id: "evt-3",
        title: "Sprint Review",
        date: "2026-02-05",
        time: "3:00 PM",
        duration: "1 hour",
        type: "meeting",
        color: "bg-green-500"
    },
    {
        id: "evt-4",
        title: "TechStart Demo",
        date: "2026-02-07",
        time: "11:00 AM",
        duration: "45 min",
        type: "external",
        color: "bg-orange-500"
    },
    {
        id: "evt-5",
        title: "Board Meeting",
        date: "2026-02-10",
        time: "10:00 AM",
        duration: "2 hours",
        type: "important",
        color: "bg-red-500"
    },
    {
        id: "evt-6",
        title: "Renewal: Global Retail",
        date: "2026-03-01",
        time: "All Day",
        duration: "",
        type: "renewal",
        color: "bg-yellow-500"
    }
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = generateCalendarDays(year, month);

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return mockEvents.filter(evt => evt.date === dateStr);
    };

    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    const upcomingEvents = mockEvents
        .filter(evt => new Date(evt.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                    <p className="text-muted-foreground">Manage your schedule and events</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Event
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar Grid */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-xl font-semibold">
                                {MONTHS[month]} {year}
                            </h2>
                            <Button variant="outline" size="icon" onClick={goToNextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="outline" onClick={goToToday}>Today</Button>
                    </CardHeader>
                    <CardContent>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, idx) => {
                                const isToday = day.isCurrentMonth &&
                                    day.date === today.getDate() &&
                                    month === today.getMonth() &&
                                    year === today.getFullYear();
                                const isSelected = selectedDate &&
                                    day.fullDate.toDateString() === selectedDate.toDateString();
                                const dayEvents = getEventsForDate(day.fullDate);

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedDate(day.fullDate)}
                                        className={`
                      min-h-[80px] p-1 border rounded-md cursor-pointer transition-colors
                      ${!day.isCurrentMonth ? "bg-muted/50 text-muted-foreground" : "hover:bg-muted/50"}
                      ${isToday ? "border-primary border-2" : ""}
                      ${isSelected ? "bg-primary/10" : ""}
                    `}
                                    >
                                        <div className={`
                      text-sm font-medium mb-1
                      ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}
                    `}>
                                            {day.date}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 2).map(evt => (
                                                <div key={evt.id} className={`${evt.color} text-white text-xs px-1 py-0.5 rounded truncate`}>
                                                    {evt.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{dayEvents.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Selected Date Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "Select a date"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedDateEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedDateEvents.map(evt => (
                                        <div key={evt.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                                            <div className={`w-1 h-full min-h-[40px] rounded-full ${evt.color}`} />
                                            <div className="flex-1">
                                                <p className="font-medium">{evt.title}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{evt.time}</span>
                                                    {evt.duration && <span>• {evt.duration}</span>}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No events scheduled</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Upcoming</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingEvents.map(evt => (
                                    <div key={evt.id} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${evt.color}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{evt.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(evt.date).toLocaleDateString()} • {evt.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
