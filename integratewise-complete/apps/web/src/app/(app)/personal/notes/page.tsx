"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileEdit, Plus, Search, Calendar, Pin, Tag,
    MoreHorizontal, Link2, Star, Clock, Folder
} from "lucide-react";

// Mock data
const mockNotes = [
    {
        id: "note-1",
        title: "Q1 Strategy Meeting Notes",
        content: "Key decisions: Focus on enterprise expansion, reduce churn by 15%, launch 3 new integrations...",
        createdAt: "2026-02-02",
        updatedAt: "2026-02-02",
        isPinned: true,
        isStarred: true,
        tags: ["Strategy", "Meeting"],
        linkedTo: { type: "meeting", name: "Q1 Planning" },
        folder: "Work"
    },
    {
        id: "note-2",
        title: "Acme Corp Account Review",
        content: "Health score improved to 85. Main champion Sarah Chen is engaged. Need to schedule QBR...",
        createdAt: "2026-02-01",
        updatedAt: "2026-02-01",
        isPinned: true,
        isStarred: false,
        tags: ["Account", "Review"],
        linkedTo: { type: "account", name: "Acme Corporation" },
        folder: "Accounts"
    },
    {
        id: "note-3",
        title: "Product Ideas Brainstorm",
        content: "- AI-powered health scoring\n- Automated playbook triggers\n- Slack integration improvements\n- Custom dashboards...",
        createdAt: "2026-01-28",
        updatedAt: "2026-01-30",
        isPinned: false,
        isStarred: true,
        tags: ["Ideas", "Product"],
        linkedTo: null,
        folder: "Ideas"
    },
    {
        id: "note-4",
        title: "Sprint 12 Retrospective",
        content: "What went well: Deployment velocity improved. What to improve: Better estimation...",
        createdAt: "2026-01-25",
        updatedAt: "2026-01-25",
        isPinned: false,
        isStarred: false,
        tags: ["Sprint", "Retro"],
        linkedTo: { type: "project", name: "Engineering" },
        folder: "Work"
    },
    {
        id: "note-5",
        title: "Customer Feedback Themes",
        content: "Top requests: 1. Better reporting, 2. Mobile app, 3. Slack notifications, 4. API improvements...",
        createdAt: "2026-01-20",
        updatedAt: "2026-01-22",
        isPinned: false,
        isStarred: false,
        tags: ["Feedback", "Research"],
        linkedTo: null,
        folder: "Research"
    },
    {
        id: "note-6",
        title: "1:1 with Manager",
        content: "Discussion topics: Career goals, project priorities, skill development opportunities...",
        createdAt: "2026-01-15",
        updatedAt: "2026-01-15",
        isPinned: false,
        isStarred: false,
        tags: ["1:1", "Personal"],
        linkedTo: { type: "meeting", name: "Weekly 1:1" },
        folder: "Personal"
    }
];

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredNotes = mockNotes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" ||
            (activeTab === "pinned" && note.isPinned) ||
            (activeTab === "starred" && note.isStarred) ||
            (activeTab === "recent" && new Date(note.updatedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        return matchesSearch && matchesTab;
    });

    const pinnedNotes = mockNotes.filter(n => n.isPinned);
    const folders = [...new Set(mockNotes.map(n => n.folder))];
    const allTags = [...new Set(mockNotes.flatMap(n => n.tags))];

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                    <p className="text-muted-foreground">Capture ideas and meeting notes</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Note
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                        <FileEdit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockNotes.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pinned</CardTitle>
                        <Pin className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pinnedNotes.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Folders</CardTitle>
                        <Folder className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{folders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Tags</CardTitle>
                        <Tag className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allTags.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Notes</TabsTrigger>
                    <TabsTrigger value="pinned">Pinned</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredNotes.map((note) => (
                            <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            {note.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                                            {note.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>

                                    {note.linkedTo && (
                                        <div className="flex items-center gap-1 text-sm text-blue-600">
                                            <Link2 className="h-3 w-3" />
                                            <span>{note.linkedTo.name}</span>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-1">
                                        {note.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                        <div className="flex items-center gap-1">
                                            <Folder className="h-3 w-3" />
                                            <span>{note.folder}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredNotes.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileEdit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-medium mb-1">No notes found</h3>
                                <p className="text-sm text-muted-foreground">Try a different search or create a new note</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
