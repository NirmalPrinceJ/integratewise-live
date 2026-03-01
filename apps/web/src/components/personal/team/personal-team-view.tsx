"use client";

import { useState, useEffect } from "react";
import { workspace } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw, Users, Circle } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role?: string;
  status?: "active" | "idle" | "offline";
  avatar?: string;
  email?: string;
  lastActivity?: string;
  department?: string;
}

export function PersonalTeamView() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    try {
      setLoading(true);
      setError(null);
      const result = await workspace.view("team");
      const data = result.data || result.members || [];
      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load team members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, { bg: string; dot: string }> = {
    active: { bg: "bg-emerald-50", dot: "bg-emerald-500" },
    idle: { bg: "bg-amber-50", dot: "bg-amber-500" },
    offline: { bg: "bg-gray-50", dot: "bg-gray-400" },
  };

  const activeCount = members.filter(m => m.status === "active").length;
  const idleCount = members.filter(m => m.status === "idle").length;

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Team</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadTeam} className="mt-2">
                <RotateCcw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{members.length} members</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadTeam}>
          Refresh
        </Button>
      </div>

      {members.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Active Now</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{activeCount}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Idle</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{idleCount}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{members.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-350px)]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : members.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No team members</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
            {members.map(member => {
              const status = member.status || "offline";
              const colors = statusColors[status];
              return (
                <Card key={member.id} className={`hover:shadow-md transition-shadow cursor-pointer border ${colors.bg}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${colors.dot} border border-white`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{member.name}</h3>
                        {member.role && (
                          <Badge variant="outline" className="mt-1 text-xs">{member.role}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground pl-13">
                      {member.department && (
                        <p>{member.department}</p>
                      )}
                      {member.lastActivity && (
                        <p>Last active: {new Date(member.lastActivity).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
