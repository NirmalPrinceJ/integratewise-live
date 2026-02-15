"use client"

import { KBHeader } from "@/components/layouts/kb-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search as SearchIcon } from "lucide-react"
import { useState } from "react"

export default function SearchPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const topics = ["react", "typescript", "gcp", "vertex-ai", "llms", "python", "fastapi"]

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-12">
        <Card className="bg-white p-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-[#2F3E5F] mb-8">Discovery Search</h1>

          {/* Search Bar */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search across all session summaries..."
                className="h-14 pl-6 pr-4 text-lg bg-white border-gray-300"
              />
            </div>
            <Button className="h-14 px-8 bg-[#4A6FA5] hover:bg-[#3d5a8f] text-lg">
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>

          {/* Topic Filters */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-3">
              Filter by Topics
            </label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopics.includes(topic) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    selectedTopics.includes(topic)
                      ? "bg-[#E8F0FF] text-[#4A6FA5] border-[#4A6FA5]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#4A6FA5]"
                  }`}
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">From</label>
              <Input type="date" className="bg-white border-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">To</label>
              <Input type="date" className="bg-white border-gray-300" />
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
