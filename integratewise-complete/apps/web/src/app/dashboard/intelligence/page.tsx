"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  X,
  User,
  Brain,
  Layers,
  Zap,
  MessageSquare,
  Activity,
  CheckCircle,
  Shield,
  RefreshCw,
  Clock,
  Settings,
  Users,
  Copy
} from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "context", label: "Context", icon: User },
  { id: "iq-hub", label: "IQ Hub", icon: Brain },
  { id: "evidence", label: "Evidence", icon: Layers },
  { id: "signals", label: "Signals", icon: Zap },
  { id: "think", label: "Think Engine", icon: MessageSquare },
  { id: "act", label: "Act", icon: CheckCircle },
  { id: "approval", label: "Approval", icon: CheckCircle },
  { id: "governance", label: "Governance", icon: Shield },
  { id: "adjust", label: "Adjust", icon: RefreshCw },
  { id: "loop", label: "Loop", icon: RefreshCw },
  { id: "audit", label: "Audit", icon: Clock },
  { id: "agents", label: "Agents", icon: Settings },
  { id: "twin", label: "Twin", icon: Copy },
];

const spineNodes = [
  { id: "A1", name: "Canonical Account Node 1", source: "Salesforce", updated: "2m ago", goal: "GOAL_100" },
  { id: "A2", name: "Canonical Account Node 2", source: "Salesforce", updated: "2m ago", goal: "GOAL_200" },
  { id: "A3", name: "Canonical Account Node 3", source: "Salesforce", updated: "2m ago", goal: "GOAL_300" },
  { id: "A4", name: "Canonical Account Node 4", source: "Salesforce", updated: "2m ago", goal: "GOAL_400" },
];

export default function IntelligencePanel() {
  const [activeTab, setActiveTab] = useState("context");
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 w-12 h-12 bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-900 transition-colors z-50"
      >
        <Zap className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5" />
          <div>
            <h2 className="font-medium text-black">Intelligence Engine</h2>
            <p className="text-xs text-gray-400">CTX_BIZOPS</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-gray-400 hidden sm:block">
            "Intelligence is not a dashboard. It's a loop." · ⌘J to close
          </p>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "context" && (
          <div className="space-y-6">
            {/* Active Spine Nodes */}
            <div className="border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <h3 className="font-medium text-sm">Active Spine Nodes (CTX_BIZOPS)</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {spineNodes.map((node) => (
                  <div key={node.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        {node.id}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{node.name}</p>
                        <p className="text-xs text-gray-400">Source: {node.source} · Updated {node.updated}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 font-mono">
                      goal_ref: {node.goal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Normalization Health */}
            <div className="border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Normalization Health</h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-light text-black">98.4%</span>
              </div>
              <div className="h-2 bg-gray-100 mb-2">
                <div className="h-full bg-black" style={{ width: "98.4%" }} />
              </div>
              <p className="text-xs text-gray-500">Sectorizer active · 0 collisions</p>
            </div>
          </div>
        )}

        {activeTab === "iq-hub" && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">IQ Hub</h3>
            <p className="text-gray-500 text-sm">AI-powered insights and recommendations will appear here.</p>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Evidence</h3>
            <p className="text-gray-500 text-sm">Evidence-backed claims and data provenance tracking.</p>
          </div>
        )}

        {activeTab === "signals" && (
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Signals</h3>
            <p className="text-gray-500 text-sm">Real-time signals detected across your data sources.</p>
          </div>
        )}

        {activeTab === "think" && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Think Engine</h3>
            <p className="text-gray-500 text-sm">AI reasoning and situation assessment.</p>
          </div>
        )}

        {activeTab === "act" && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Act</h3>
            <p className="text-gray-500 text-sm">Execute approved actions across your tool stack.</p>
          </div>
        )}

        {activeTab === "approval" && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Approval</h3>
            <p className="text-gray-500 text-sm">Human-in-the-loop approval queue.</p>
          </div>
        )}

        {activeTab === "governance" && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Governance</h3>
            <p className="text-gray-500 text-sm">Policy enforcement and compliance tracking.</p>
          </div>
        )}

        {activeTab === "adjust" && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Adjust</h3>
            <p className="text-gray-500 text-sm">Feedback loop and system calibration.</p>
          </div>
        )}

        {activeTab === "loop" && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Loop</h3>
            <p className="text-gray-500 text-sm">Continuous improvement cycle tracking.</p>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Audit</h3>
            <p className="text-gray-500 text-sm">Complete audit trail of all actions.</p>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Agents</h3>
            <p className="text-gray-500 text-sm">Configure and manage AI agents.</p>
          </div>
        )}

        {activeTab === "twin" && (
          <div className="text-center py-12">
            <Copy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Digital Twin</h3>
            <p className="text-gray-500 text-sm">Workspace simulation and testing environment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
