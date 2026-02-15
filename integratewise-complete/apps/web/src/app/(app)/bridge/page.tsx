"use client"

import { KBHeader } from "@/components/layouts/kb-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scan, Circle } from "lucide-react"

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Control Panel */}
        <Card className="bg-white p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#2F3E5F] text-white rounded-lg font-semibold">
                <Scan className="w-5 h-5" />
                Analyze All Units
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  MANUAL
                </Button>
                <Button variant="default" size="sm" className="bg-[#2F3E5F]">
                  ASSISTED
                </Button>
                <Button variant="outline" size="sm">
                  AUTONOMOUS
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-700">
                <Circle className="w-2 h-2 fill-green-500 mr-2" />
                System Secure
              </Badge>
              <span className="text-sm text-green-700 font-medium">100% Signal Integrity</span>
            </div>
          </div>
        </Card>

        {/* 5-Step Workflow */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Column 1: Spine */}
          <Card className="bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#2F3E5F]">01 SPINE // TRUTH</h2>
              </div>
              <Badge variant="secondary" className="bg-[#10B981] text-white text-xs">
                RAW DATA
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-semibold text-[#2F3E5F]">Acme Corp</div>
                    <div className="text-xs text-gray-500">$1.2M ARR</div>
                  </div>
                  <Badge className="bg-[#10B981] text-white text-xs">CHAMPION</Badge>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#10B981] w-[85%]" />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-semibold text-[#2F3E5F]">Cyberdyne</div>
                    <div className="text-xs text-gray-500">$5.4M ARR</div>
                  </div>
                  <Badge className="bg-red-500 text-white text-xs">AT_RISK</Badge>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-red-500 w-[20%]" />
                </div>
              </div>

              <div className="pb-3">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-semibold text-[#2F3E5F]">Stark Ind.</div>
                    <div className="text-xs text-gray-500">$25M ARR</div>
                  </div>
                  <Badge className="bg-[#10B981] text-white text-xs">CHAMPION</Badge>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#10B981] w-[92%]" />
                </div>
              </div>
            </div>
          </Card>

          {/* Column 2: Memory */}
          <Card className="bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#2F3E5F]">02 MEMORY // SEMANTIC</h2>
              </div>
              <Badge variant="secondary" className="bg-[#4A6FA5] text-white text-xs">
                Vector DB Active
              </Badge>
            </div>

            <div className="relative h-64 flex items-center justify-center">
              {/* Knowledge Graph Visualization */}
              <svg width="100%" height="100%" viewBox="0 0 300 250">
                {/* Connections */}
                <line x1="150" y1="125" x2="80" y2="60" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="150" y1="125" x2="220" y2="70" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="150" y1="125" x2="70" y2="170" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="150" y1="125" x2="230" y2="160" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="150" y1="125" x2="155" y2="210" stroke="#CBD5E1" strokeWidth="1" />

                {/* Nodes */}
                <circle cx="80" cy="60" r="8" fill="#4A6FA5" />
                <text x="80" y="45" fontSize="11" fill="#64748B" textAnchor="middle">
                  Accounts
                </text>

                <circle cx="220" cy="70" r="8" fill="#4A6FA5" />
                <text x="220" y="55" fontSize="11" fill="#64748B" textAnchor="middle">
                  Tickets
                </text>

                <circle cx="70" cy="170" r="8" fill="#4A6FA5" />
                <text x="70" y="190" fontSize="11" fill="#64748B" textAnchor="middle">
                  Risks
                </text>

                <circle cx="150" cy="125" r="10" fill="#4A6FA5" />
                <text x="150" y="145" fontSize="11" fill="#64748B" textAnchor="middle" fontWeight="600">
                  ROI
                </text>

                <circle cx="230" cy="160" r="8" fill="#4A6FA5" />
                <text x="230" y="180" fontSize="11" fill="#64748B" textAnchor="middle">
                  Themes
                </text>

                <circle cx="155" cy="210" r="8" fill="#4A6FA5" />
              </svg>
            </div>

            <Card className="bg-[#F8FAFC] border-[#4A6FA5] p-3 mt-4">
              <div className="text-sm font-semibold text-[#4A6FA5] mb-1">Knowledge Pulse</div>
              <div className="text-xs text-gray-600 italic">
                "Retrieving associated conversation patterns for recent anomalies..."
              </div>
            </Card>
          </Card>

          {/* Column 3: Review */}
          <Card className="bg-white p-6 border-2 border-[#FF4D7D]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#2F3E5F]">05 REVIEW & APPROVE</h2>
              </div>
              <Badge variant="secondary" className="bg-[#FF4D7D] text-white text-xs">
                0 Pending
              </Badge>
            </div>

            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-500 italic">
                System Status: Balanced. No review required.
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Act/Motion */}
        <Card className="bg-white p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#2F3E5F]">04 ACT // MOTION</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#FF4D7D] text-white text-xs">
                IQ HUB: APPLYING DOMAIN POLICY
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { tool: "SLACK", action: "Internal Alert Sent", mode: "Autonomous", status: "EXECUTED", time: "2m ago" },
              { tool: "JIRA", action: "Created Critical Issue", mode: "Assisted", status: "APPROVED", time: "15m ago" },
              { tool: "HUBSPOT", action: "Update Lifecycle Stage", mode: "Policy", status: "PROPOSED", time: "1h ago" },
              { tool: "INTERCOM", action: "User Outreach Triggered", mode: "Autonomous", status: "PROPOSED", time: "1h ago" },
            ].map((item, idx) => (
              <Card key={idx} className="p-4 bg-[#F8FAFC] border-gray-200">
                <div className="text-xs font-bold text-gray-600 mb-2">{item.tool}</div>
                <div className="font-semibold text-[#2F3E5F] text-sm mb-2">{item.action}</div>
                <div className="flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className={
                      item.mode === "Autonomous"
                        ? "border-[#FF4D7D] text-[#FF4D7D] text-xs"
                        : item.mode === "Assisted"
                          ? "border-[#4A6FA5] text-[#4A6FA5] text-xs"
                          : "border-gray-400 text-gray-600 text-xs"
                    }
                  >
                    {item.mode}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <Badge
                  className={`mt-2 w-full justify-center ${
                    item.status === "EXECUTED"
                      ? "bg-[#10B981] text-white"
                      : item.status === "APPROVED"
                        ? "bg-[#4A6FA5] text-white"
                        : "bg-[#FF4D7D] text-white"
                  }`}
                >
                  {item.status}
                </Badge>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-[#4A6FA5]/10 to-[#FF4D7D]/10 p-4 mt-4">
            <div className="text-sm font-semibold text-[#2F3E5F] mb-1">OPERATIONAL ROI</div>
            <div className="text-xs text-gray-600">Efficient Workflows & Smarter Decisions</div>
          </Card>
        </Card>
      </main>
    </div>
  )
}
