"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GAPS } from "@/lib/data";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const severityIcons = {
  critical: <AlertTriangle className="h-4 w-4 text-red-400" />,
  medium: <AlertCircle className="h-4 w-4 text-yellow-400" />,
  low: <Info className="h-4 w-4 text-blue-400" />,
};

export function GapsSection() {
  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Known blockers and technical debt. Critical items block launch.
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">System</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Issue</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Severity</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {GAPS.map((gap) => (
                  <tr key={gap.system} className="border-b last:border-0">
                    <td className="p-4 font-medium">{gap.system}</td>
                    <td className="p-4 text-muted-foreground">{gap.issue}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {severityIcons[gap.severity]}
                        <Badge variant={gap.severity} className="capitalize">
                          {gap.severity}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{gap.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {GAPS.map((gap) => (
          <Card key={gap.system} className="p-4">
            <div className="font-medium mb-2">{gap.system}</div>
            <div className="text-sm text-muted-foreground mb-3">{gap.issue}</div>
            <div className="flex items-center gap-2">
              {severityIcons[gap.severity]}
              <Badge variant={gap.severity} className="capitalize">
                {gap.severity}
              </Badge>
              <Badge variant="outline" className="ml-auto">
                {gap.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
