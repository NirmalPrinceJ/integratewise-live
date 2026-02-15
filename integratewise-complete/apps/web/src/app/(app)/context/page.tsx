"use client"

import { KBHeader } from "@/components/layouts/kb-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Zap, Brain } from "lucide-react"

export default function ContextPage() {
  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2F3E5F] mb-2">Context Engine</h1>
          <p className="text-gray-600">
            Unified context from Flow A (Spine) and Flow B (Knowledge) for intelligent decision-making
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="bg-white p-6">
            <div className="w-12 h-12 bg-[#4A6FA5]/10 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-[#4A6FA5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E5F] mb-2">Flow A: Spine Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Real-time verified data from 57 tables providing ground truth about your business state.
            </p>
            <Badge className="bg-green-100 text-green-700 border-0">Live</Badge>
          </Card>

          <Card className="bg-white p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E5F] mb-2">Flow B: Knowledge</h3>
            <p className="text-sm text-gray-600 mb-4">
              Semantic memory layer with vector embeddings capturing conversations and insights.
            </p>
            <Badge className="bg-purple-100 text-purple-700 border-0">Vector DB</Badge>
          </Card>

          <Card className="bg-white p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E5F] mb-2">Context Fusion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Combining structured data with unstructured knowledge for actionable intelligence.
            </p>
            <Badge className="bg-orange-100 text-orange-700 border-0">Active</Badge>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 mt-6">
          <h2 className="text-xl font-bold text-[#2F3E5F] mb-4">How Context Works</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong className="text-[#2F3E5F]">1. Data Ingestion:</strong> Flow A captures transactional
              data from all business systems in real-time.
            </p>
            <p>
              <strong className="text-[#2F3E5F]">2. Knowledge Extraction:</strong> Flow B processes
              conversations, documents, and interactions into semantic embeddings.
            </p>
            <p>
              <strong className="text-[#2F3E5F]">3. Context Fusion:</strong> Both flows merge to provide
              complete situational awareness for AI agents and human decision-makers.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
