"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Video, Plus, Search, Calendar, Clock, Users,
    MapPin, MoreHorizontal, PlayCircle, FileText,
    ExternalLink, CheckCircle2, AlertCircle
} from "lucide-react";

// Mock data - context-aware (adapts to personal/business/csm)
const mockMeetings = [
    {
        id: "meet-1",
        title: "Weekly Team Sync",
        type: "internal",
        date: "2026-02-02",
        time: "10:00 AM",
        duration: "30 min",
        location: "Zoom",
        attendees: [
            { name: "Alice Johnson", avatar: null },
            { name: "Bob Smith", avatar: null },
            { name: "Carol Davis", avatar: null }
        ],
        account: null,
        status: "upcoming",
        hasRecording: false,
        hasNotes: false
    },
    {
        id: "meet-2",
        title: "Acme Corp - QBR",
        type: "external",
        date: "2026-02-02",
        time: "2:00 PM",
        duration: "60 min",
        location: "Google Meet",
        attendees: [
            { name: "Sarah Chen", avatar: null },
            { name: "Michael Torres", avatar: null }
        ],
        account: "Acme Corporation",
        status: "upcoming",
        hasRecording: false,
        hasNotes: true
    },
    {
        id: "meet-3",
        title: "Product Demo - TechStart",
        type: "external",
        date: "2026-02-03",
        time: "11:00 AM",
        duration: "45 min",
        location: "Zoom",
        attendees: [
            { name: "Emily Watson", avatar: null }
        ],
        account: "TechStart Inc",
        status: "scheduled",
        hasRecording: false,
        hasNotes: false
    },
    {
        id: "meet-4",
        title: "Sprint Planning",
        type: "internal",
        date: "2026-02-01",
        time: "9:00 AM",
        duration: "90 min",
        location: "Conference Room A",
        attendees: [
            { name: "Dev Team", avatar: null }
        ],
        account: null,
        status: "completed",
        hasRecording: true,
        hasNotes: true
    },
    {
        id: "meet-5",
        title: "Global Retail - Escalation",
        type: "external",
        date: "2026-01-30",
        time: "3:00 PM",
        duration: "30 min",
        location: "Phone",
        attendees: [
            { name: "Lisa Patel", avatar: null },
            { name: "James Kim", avatar: null }
        ],
        account: "Global Retail Co",
        status: "completed",
        hasRecording: true,
        hasNotes: true
    }
];

const statusConfig = {
    upcoming: { label: "Upcoming", color: "bg-blue-500", variant: "default" as const },
    scheduled: { label: "Scheduled", color: "bg-yellow-500", variant: "secondary" as const },
    completed: { label: "Completed", color: "bg-green-500", variant: "outline" as const },
    cancelled: { label: "Cancelled", color: "bg-red-500", variant: "destructive" as const }
};

export default function MeetingsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

    const today = new Date().toISOString().split('T')[0];

    const filteredMeetings = mockMeetings.filter(meeting => {
        const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (meeting.account?.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTab = activeTab === "all" ||
            (activeTab === "upcoming" && (meeting.status === "upcoming" || meeting.status === "scheduled")) ||
            (activeTab === "completed" && meeting.status === "completed") ||
            (activeTab === "external" && meeting.type === "external") ||
            (activeTab === "internal" && meeting.type === "internal");
        return matchesSearch && matchesTab;
    });

    const todayMeetings = mockMeetings.filter(m => m.date === today && m.status !== "completed");
    const stats = {
        todayCount: todayMeetings.length,
        thisWeek: mockMeetings.filter(m => m.status === "upcoming" || m.status === "scheduled").length,
        external: mockMeetings.filter(m => m.type === "external").length,
        withRecordings: mockMeetings.filter(m => m.hasRecording).length
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
                    <p className="text-muted-foreground">Schedule, track, and review your meetings</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Meeting
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayCount}</div>
                        <p className="text-xs text-muted-foreground">meetings scheduled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisWeek}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">External</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.external}</div>
                        <p className="text-xs text-muted-foreground">customer meetings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Recordings</CardTitle>
                        <PlayCircle className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.withRecordings}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search meetings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="external">External</TabsTrigger>
                    <TabsTrigger value="internal">Internal</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <div className="space-y-4">
                        {filteredMeetings.map((meeting) => {
                            const status = statusConfig[meeting.status as keyof typeof statusConfig];
                            const isToday = meeting.date === today;

                            return (
                                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="py-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${meeting.type === "external" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                                                    <Video className={`h-5 w-5 ${meeting.type === "external" ? "text-blue-600" : "text-gray-600"}`} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{meeting.title}</h3>
                                                        <Badge variant={status.variant}>{status.label}</Badge>
                                                        {isToday && <Badge className="bg-orange-500">Today</Badge>}
                                                    </div>
                                                    {meeting.account && (
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <ExternalLink className="h-3 w-3" />
                                                            {meeting.account}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(meeting.date).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {meeting.time} ({meeting.duration})
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {meeting.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                                                        <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                                                            <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                                {attendee.name.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {meeting.attendees.length > 3 && (
                                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                                            +{meeting.attendees.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {meeting.hasRecording && (
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <PlayCircle className="h-4 w-4" />
                                                            Recording
                                                        </Button>
                                                    )}
                                                    {meeting.hasNotes && (
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <FileText className="h-4 w-4" />
                                                            Notes
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {filteredMeetings.length === 0 && (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="font-medium mb-1">No meetings found</h3>
                                    <p className="text-sm text-muted-foreground">Try adjusting your filters or schedule a new meeting</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
