"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users, Search, Mail, Phone, MoreHorizontal, Briefcase,
  Building2, MapPin, Calendar, Activity, UserPlus,
  Star, TrendingUp
} from "lucide-react";

// Mock data
const mockTeamMembers = [
  {
    id: "tm-1",
    name: "Alice Johnson",
    email: "alice@company.com",
    phone: "+1 (555) 123-4567",
    role: "Customer Success Manager",
    department: "Customer Success",
    location: "San Francisco, CA",
    status: "active",
    avatar: null,
    accounts: 12,
    healthScore: 85,
    startDate: "2024-03-15",
    manager: "Sarah Chen"
  },
  {
    id: "tm-2",
    name: "Bob Smith",
    email: "bob@company.com",
    phone: "+1 (555) 234-5678",
    role: "Account Executive",
    department: "Sales",
    location: "New York, NY",
    status: "active",
    avatar: null,
    accounts: 8,
    healthScore: 78,
    startDate: "2023-08-01",
    manager: "Michael Torres"
  },
  {
    id: "tm-3",
    name: "Carol Davis",
    email: "carol@company.com",
    phone: "+1 (555) 345-6789",
    role: "Solutions Architect",
    department: "Engineering",
    location: "Seattle, WA",
    status: "active",
    avatar: null,
    accounts: 5,
    healthScore: 92,
    startDate: "2024-01-10",
    manager: "David Lee"
  },
  {
    id: "tm-4",
    name: "David Lee",
    email: "david@company.com",
    phone: "+1 (555) 456-7890",
    role: "Engineering Manager",
    department: "Engineering",
    location: "Seattle, WA",
    status: "active",
    avatar: null,
    accounts: 0,
    healthScore: 88,
    startDate: "2022-06-20",
    manager: "Emily Watson"
  },
  {
    id: "tm-5",
    name: "Emily Watson",
    email: "emily@company.com",
    phone: "+1 (555) 567-8901",
    role: "VP of Engineering",
    department: "Engineering",
    location: "Remote",
    status: "active",
    avatar: null,
    accounts: 0,
    healthScore: 90,
    startDate: "2021-02-14",
    manager: null
  },
  {
    id: "tm-6",
    name: "Frank Green",
    email: "frank@company.com",
    phone: "+1 (555) 678-9012",
    role: "Support Specialist",
    department: "Support",
    location: "Austin, TX",
    status: "away",
    avatar: null,
    accounts: 25,
    healthScore: 72,
    startDate: "2024-06-01",
    manager: "Sarah Chen"
  }
];

const departments = [...new Set(mockTeamMembers.map(m => m.department))];

const statusConfig = {
  active: { label: "Active", color: "bg-green-500" },
  away: { label: "Away", color: "bg-yellow-500" },
  offline: { label: "Offline", color: "bg-gray-500" }
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || member.department.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: mockTeamMembers.length,
    active: mockTeamMembers.filter(m => m.status === "active").length,
    departments: departments.length,
    avgHealth: Math.round(mockTeamMembers.reduce((sum, m) => sum + m.healthScore, 0) / mockTeamMembers.length)
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage your team and coverage</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHealth}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {departments.map(dept => (
            <TabsTrigger key={dept} value={dept.toLowerCase()}>{dept}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => {
              const status = statusConfig[member.status as keyof typeof statusConfig];

              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${status.color} ring-2 ring-background`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{member.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>

                    {member.accounts > 0 && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accounts</span>
                          <span className="font-medium">{member.accounts}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Performance</span>
                          <span className={`font-medium ${member.healthScore >= 80 ? "text-green-500" : member.healthScore >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                            {member.healthScore}%
                          </span>
                        </div>
                        <Progress value={member.healthScore} className="h-2" />
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
