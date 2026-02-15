"use client"

import { Card } from "@/components/ui/card"

import { KBHeader } from "@/components/layouts/kb-header"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2F3E5F] mb-2">Autonomy Evidence</h1>
          <p className="text-gray-600">Read-only timeline of system decisions and execution outcomes.</p>
        </div>

        {/* Filters */}
        <Card className="bg-white p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Status</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Run Type</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                  <SelectItem value="assisted">Assisted</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button variant="link" className="text-[#4A6FA5]">
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Scope
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Decision
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    No evidence logs found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
