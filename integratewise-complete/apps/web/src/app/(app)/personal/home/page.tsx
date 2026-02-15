"use client"

/**
 * L1 Personal Home Page
 * 
 * Pure productivity workspace - NO AI/cognitive features here.
 * Contains: Calendar, Tasks, Projects, Notes, Documents
 * 
 * L2 Cognitive features (Signals, Intelligence, Evidence) are 
 * accessed via the CognitiveLayer overlay (⌘J / Ctrl+J)
 */

import { HomeSkeletonL1 } from "@/components/workspace/home-skeleton-l1"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Brain, Sparkles } from "lucide-react"

export default function PersonalHomePage() {
  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false)

  // L1 widgets - pure productivity (NO AI/signals)
  const availableWidgets = [
    { id: 'projects-active', name: 'Active Projects', description: 'View your active projects', module: 'projects' },
    { id: 'meetings-today', name: "Today's Meetings", description: 'Meetings scheduled for today', module: 'meetings' },
    { id: 'tasks-due', name: 'Tasks Due Soon', description: 'Tasks due in the next 7 days', module: 'tasks' },
    { id: 'notes-recent', name: 'Recent Notes', description: 'Your recently edited notes', module: 'notes' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Home</h1>
          <p className="text-sm text-slate-500 mt-1">
            Your workspace dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            onClick={() => {
              // Dispatch event to open Cognitive Layer
              window.dispatchEvent(new CustomEvent('open-cognitive-layer'))
            }}
          >
            <Brain className="w-4 h-4" />
            Intelligence
            <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-gray-100 rounded">⌘J</kbd>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWidgetPickerOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* L1 Home Skeleton - Pure productivity blocks */}
      <HomeSkeletonL1 onOpenWidgetPicker={() => setWidgetPickerOpen(true)} />

      {/* Widget Picker Dialog */}
      <Dialog open={widgetPickerOpen} onOpenChange={setWidgetPickerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Add Widget to Home
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {availableWidgets.map((widget) => (
              <button
                key={widget.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
                onClick={() => {
                  // TODO: Call pinWidget from WorkspaceBagContext
                  setWidgetPickerOpen(false)
                }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{widget.name}</p>
                  <p className="text-xs text-slate-500">{widget.description}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {widget.module}
                </Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
