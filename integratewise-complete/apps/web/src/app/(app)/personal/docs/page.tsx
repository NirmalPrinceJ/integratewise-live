"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText, Plus, Search, Filter, LayoutGrid, List,
    Download, Eye, MoreHorizontal, Folder, Image,
    FileSpreadsheet, FileCode, File, Calendar, User
} from "lucide-react";

// Mock data
const mockDocs = [
    {
        id: "doc-1",
        name: "Q1 Strategy Document",
        type: "document",
        format: "pdf",
        size: "2.4 MB",
        owner: "Alice Johnson",
        lastModified: "2026-02-01",
        folder: "Strategy",
        shared: true,
        views: 24
    },
    {
        id: "doc-2",
        name: "Product Roadmap 2026",
        type: "spreadsheet",
        format: "xlsx",
        size: "1.2 MB",
        owner: "Bob Smith",
        lastModified: "2026-01-28",
        folder: "Product",
        shared: true,
        views: 56
    },
    {
        id: "doc-3",
        name: "Customer Success Playbook",
        type: "document",
        format: "docx",
        size: "3.8 MB",
        owner: "Carol Davis",
        lastModified: "2026-01-25",
        folder: "Playbooks",
        shared: false,
        views: 12
    },
    {
        id: "doc-4",
        name: "Brand Guidelines",
        type: "image",
        format: "pdf",
        size: "15.2 MB",
        owner: "Design Team",
        lastModified: "2026-01-20",
        folder: "Brand",
        shared: true,
        views: 89
    },
    {
        id: "doc-5",
        name: "API Integration Guide",
        type: "code",
        format: "md",
        size: "156 KB",
        owner: "Dev Team",
        lastModified: "2026-02-02",
        folder: "Technical",
        shared: true,
        views: 34
    },
    {
        id: "doc-6",
        name: "Acme Corp - Contract",
        type: "document",
        format: "pdf",
        size: "890 KB",
        owner: "Legal",
        lastModified: "2026-01-15",
        folder: "Contracts",
        shared: false,
        views: 5
    }
];

const typeIcons = {
    document: FileText,
    spreadsheet: FileSpreadsheet,
    image: Image,
    code: FileCode,
    other: File
};

const typeColors = {
    document: "text-blue-500",
    spreadsheet: "text-green-500",
    image: "text-purple-500",
    code: "text-orange-500",
    other: "text-gray-500"
};

export default function DocsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("all");

    const filteredDocs = mockDocs.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.folder.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" ||
            doc.type === activeTab ||
            (activeTab === "shared" && doc.shared);
        return matchesSearch && matchesTab;
    });

    const folders = [...new Set(mockDocs.map(d => d.folder))];
    const stats = {
        total: mockDocs.length,
        shared: mockDocs.filter(d => d.shared).length,
        folders: folders.length,
        totalSize: "24.6 MB"
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground">Manage files, contracts, and resources</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Folder className="h-4 w-4" />
                        New Folder
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Shared</CardTitle>
                        <User className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.shared}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Folders</CardTitle>
                        <Folder className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.folders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSize}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search documents..."
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
                    <TabsTrigger value="all">All Files</TabsTrigger>
                    <TabsTrigger value="document">Documents</TabsTrigger>
                    <TabsTrigger value="spreadsheet">Spreadsheets</TabsTrigger>
                    <TabsTrigger value="image">Images</TabsTrigger>
                    <TabsTrigger value="shared">Shared</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    {viewMode === "grid" ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredDocs.map((doc) => {
                                const TypeIcon = typeIcons[doc.type as keyof typeof typeIcons] || File;
                                const iconColor = typeColors[doc.type as keyof typeof typeColors] || "text-gray-500";

                                return (
                                    <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <div className="p-4 rounded-lg bg-muted">
                                                    <TypeIcon className={`h-10 w-10 ${iconColor}`} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium truncate max-w-full">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">{doc.format.toUpperCase()} • {doc.size}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{doc.folder}</Badge>
                                                    {doc.shared && <Badge variant="secondary">Shared</Badge>}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {doc.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(doc.lastModified).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredDocs.map((doc) => {
                                const TypeIcon = typeIcons[doc.type as keyof typeof typeIcons] || File;
                                const iconColor = typeColors[doc.type as keyof typeof typeColors] || "text-gray-500";

                                return (
                                    <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-muted">
                                                    <TypeIcon className={`h-5 w-5 ${iconColor}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{doc.name}</p>
                                                    <p className="text-sm text-muted-foreground">{doc.folder} • {doc.owner}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-sm text-muted-foreground">{doc.size}</span>
                                                <span className="text-sm text-muted-foreground w-24">
                                                    {new Date(doc.lastModified).toLocaleDateString()}
                                                </span>
                                                {doc.shared && <Badge variant="secondary">Shared</Badge>}
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
