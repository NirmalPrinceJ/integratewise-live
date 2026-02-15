"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FolderKanban, Plus, Search, Filter, LayoutGrid, List,
    Clock, Users, Target, ChevronRight, MoreHorizontal,
    CheckCircle2, Circle, AlertCircle
} from "lucide-react";

// Mock data - would come from Spine API
const mockProjects = [
    {
        id: "proj-1",
        name: "Q1 Product Launch",
        description: "Launch new enterprise features",
        status: "active",
        progress: 75,
        priority: "high",
        dueDate: "2026-03-15",
        team: ["Alice", "Bob", "Carol"],
        tasksComplete: 18,
        tasksTotal: 24,
        category: "Product"
    },
    {
        id: "proj-2",
        name: "Customer Onboarding Revamp",
        description: "Redesign onboarding flow for better activation",
        status: "active",
        progress: 45,
        priority: "medium",
        dueDate: "2026-02-28",
        team: ["David", "Eve"],
        tasksComplete: 9,
        tasksTotal: 20,
        category: "Growth"
    },
    {
        id: "proj-3",
        name: "API Documentation Update",
        description: "Complete API docs for v2.0",
        status: "completed",
        progress: 100,
        priority: "low",
        dueDate: "2026-01-31",
        team: ["Frank"],
        tasksComplete: 12,
        tasksTotal: 12,
        category: "Engineering"
    },
    {
        id: "proj-4",
        name: "Security Audit",
        description: "Annual security compliance review",
        status: "at_risk",
        progress: 30,
        priority: "critical",
        dueDate: "2026-02-15",
        team: ["Grace", "Henry", "Ivan"],
        tasksComplete: 6,
        tasksTotal: 20,
        category: "Operations"
    },
    {
        id: "proj-5",
        name: "Team Offsite Planning",
        description: "Q2 team building event",
        status: "planning",
        progress: 10,
        priority: "low",
        dueDate: "2026-04-20",
        team: ["Julia"],
        tasksComplete: 1,
        tasksTotal: 10,
        category: "Culture"
    }
];

const statusConfig = {
    active: { label: "Active", color: "bg-blue-500", icon: Circle },
    completed: { label: "Completed", color: "bg-green-500", icon: CheckCircle2 },
    at_risk: { label: "At Risk", color: "bg-red-500", icon: AlertCircle },
    planning: { label: "Planning", color: "bg-yellow-500", icon: Clock }
};

const priorityConfig = {
    critical: { label: "Critical", variant: "destructive" as const },
    high: { label: "High", variant: "default" as const },
    medium: { label: "Medium", variant: "secondary" as const },
    low: { label: "Low", variant: "outline" as const }
};

export default function PersonalProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("all");

    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || project.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const stats = {
        total: mockProjects.length,
        active: mockProjects.filter(p => p.status === "active").length,
        atRisk: mockProjects.filter(p => p.status === "at_risk").length,
        completed: mockProjects.filter(p => p.status === "completed").length
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your initiatives and track progress</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Circle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.atRisk}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
                <div className="flex items-center border rounded-md">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="at_risk">At Risk</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="planning">Planning</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    {viewMode === "grid" ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project) => {
                                const status = statusConfig[project.status as keyof typeof statusConfig];
                                const priority = priorityConfig[project.priority as keyof typeof priorityConfig];
                                const StatusIcon = status.icon;

                                return (
                                    <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                                    <Badge variant={priority.variant}>{priority.label}</Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                            <CardDescription>{project.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-medium">{project.progress}%</span>
                                                </div>
                                                <Progress value={project.progress} className="h-2" />
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Target className="h-4 w-4" />
                                                    <span>{project.tasksComplete}/{project.tasksTotal} tasks</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{project.team.length} members</span>
                                                </div>
                                                <Badge variant="outline">{project.category}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredProjects.map((project) => {
                                const status = statusConfig[project.status as keyof typeof statusConfig];
                                const priority = priorityConfig[project.priority as keyof typeof priorityConfig];

                                return (
                                    <Card key={project.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="flex items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-3 w-3 rounded-full ${status.color}`} />
                                                <div>
                                                    <p className="font-medium">{project.name}</p>
                                                    <p className="text-sm text-muted-foreground">{project.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <Badge variant={priority.variant}>{priority.label}</Badge>
                                                <div className="w-32">
                                                    <Progress value={project.progress} className="h-2" />
                                                </div>
                                                <span className="text-sm text-muted-foreground w-24">
                                                    {new Date(project.dueDate).toLocaleDateString()}
                                                </span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
