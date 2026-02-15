"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    UserCircle, Plus, Search, Filter, LayoutGrid, List,
    Mail, Phone, Building2, Briefcase, Calendar, MoreHorizontal,
    Star, MessageSquare, MapPin
} from "lucide-react";

// Mock data
const mockContacts = [
    {
        id: "contact-1",
        name: "Sarah Chen",
        email: "sarah.chen@acme.com",
        phone: "+1 (555) 123-4567",
        title: "VP of Engineering",
        company: "Acme Corporation",
        role: "champion",
        lastContact: "2026-02-01",
        notes: 5,
        avatar: null,
        linkedin: "linkedin.com/in/sarahchen",
        location: "San Francisco, CA"
    },
    {
        id: "contact-2",
        name: "Michael Torres",
        email: "mtorres@techstart.io",
        phone: "+1 (555) 234-5678",
        title: "CTO",
        company: "TechStart Inc",
        role: "decision_maker",
        lastContact: "2026-01-28",
        notes: 3,
        avatar: null,
        linkedin: "linkedin.com/in/michaeltorres",
        location: "Austin, TX"
    },
    {
        id: "contact-3",
        name: "Emily Watson",
        email: "emily.watson@globalretail.com",
        phone: "+1 (555) 345-6789",
        title: "Director of Operations",
        company: "Global Retail Co",
        role: "influencer",
        lastContact: "2026-01-15",
        notes: 8,
        avatar: null,
        linkedin: "linkedin.com/in/emilywatson",
        location: "New York, NY"
    },
    {
        id: "contact-4",
        name: "James Kim",
        email: "jkim@financehub.co",
        phone: "+1 (555) 456-7890",
        title: "Head of Product",
        company: "FinanceHub",
        role: "champion",
        lastContact: "2026-02-02",
        notes: 2,
        avatar: null,
        linkedin: "linkedin.com/in/jameskim",
        location: "Seattle, WA"
    },
    {
        id: "contact-5",
        name: "Lisa Patel",
        email: "lpatel@healthtech.io",
        phone: "+1 (555) 567-8901",
        title: "CEO",
        company: "HealthTech Solutions",
        role: "executive_sponsor",
        lastContact: "2026-01-30",
        notes: 4,
        avatar: null,
        linkedin: "linkedin.com/in/lisapatel",
        location: "Boston, MA"
    },
    {
        id: "contact-6",
        name: "David Lee",
        email: "david.lee@acme.com",
        phone: "+1 (555) 678-9012",
        title: "Senior Engineer",
        company: "Acme Corporation",
        role: "user",
        lastContact: "2026-01-25",
        notes: 1,
        avatar: null,
        linkedin: "linkedin.com/in/davidlee",
        location: "San Francisco, CA"
    }
];

const roleConfig = {
    champion: { label: "Champion", color: "bg-green-500", variant: "default" as const },
    decision_maker: { label: "Decision Maker", color: "bg-purple-500", variant: "default" as const },
    influencer: { label: "Influencer", color: "bg-blue-500", variant: "secondary" as const },
    executive_sponsor: { label: "Exec Sponsor", color: "bg-yellow-500", variant: "default" as const },
    user: { label: "User", color: "bg-gray-500", variant: "outline" as const }
};

export default function PersonalContactsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("all");

    const filteredContacts = mockContacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || contact.role === activeTab;
        return matchesSearch && matchesTab;
    });

    const stats = {
        total: mockContacts.length,
        champions: mockContacts.filter(c => c.role === "champion").length,
        decisionMakers: mockContacts.filter(c => c.role === "decision_maker").length,
        recentlyContacted: mockContacts.filter(c => {
            const lastContact = new Date(c.lastContact);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastContact >= weekAgo;
        }).length
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                    <p className="text-muted-foreground">Manage your relationships and stakeholder map</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Champions</CardTitle>
                        <Star className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.champions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Decision Makers</CardTitle>
                        <Briefcase className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.decisionMakers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contacted This Week</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentlyContacted}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
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
                    <TabsTrigger value="champion">Champions</TabsTrigger>
                    <TabsTrigger value="decision_maker">Decision Makers</TabsTrigger>
                    <TabsTrigger value="executive_sponsor">Executives</TabsTrigger>
                    <TabsTrigger value="influencer">Influencers</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    {viewMode === "grid" ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredContacts.map((contact) => {
                                const role = roleConfig[contact.role as keyof typeof roleConfig];

                                return (
                                    <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                                                            {contact.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                                                        <CardDescription>{contact.title}</CardDescription>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Badge variant={role.variant}>{role.label}</Badge>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{contact.company}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{contact.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{contact.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Last: {new Date(contact.lastContact).toLocaleDateString()}</span>
                                                </div>
                                                <Badge variant="outline">{contact.notes} notes</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredContacts.map((contact) => {
                                const role = roleConfig[contact.role as keyof typeof roleConfig];

                                return (
                                    <Card key={contact.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="flex items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                        {contact.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{contact.name}</p>
                                                    <p className="text-sm text-muted-foreground">{contact.title} at {contact.company}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <Badge variant={role.variant}>{role.label}</Badge>
                                                <span className="text-sm text-muted-foreground w-36">{contact.email}</span>
                                                <span className="text-sm text-muted-foreground w-28">
                                                    {new Date(contact.lastContact).toLocaleDateString()}
                                                </span>
                                                <Button variant="ghost" size="sm">
                                                    <Mail className="h-4 w-4" />
                                                </Button>
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
