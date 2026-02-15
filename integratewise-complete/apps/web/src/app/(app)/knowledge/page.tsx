"use client"

import { KBHeader } from "@/components/layouts/kb-header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#2F3E5F] text-center mb-12">Inbox</h1>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="Filter by topic..."
              className="h-12 pl-4 pr-12 text-base bg-white border-gray-300"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Empty State */}
          <Card className="bg-white p-16">
            <div className="text-center text-gray-500">No session summaries found.</div>
          </Card>
        </div>
      </main>
    </div>
  )
}
