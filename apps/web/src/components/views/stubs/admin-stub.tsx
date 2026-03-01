"use client"

import { useEffect, useState } from "react"

export function AdminStubPage({ title, endpoint }: { title: string; endpoint: string }) {
  const [payload, setPayload] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { apiFetch } = await import("@/lib/api-client")
        const data = await apiFetch(endpoint, {}, `Admin(${title})`)
        setPayload(data)
      } catch (err: any) {
        setPayload({ error: err.message || "Failed to load" })
      }
    }
    load()
  }, [endpoint, title])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Admin</p>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold">View Stub — Connected to Registry</p>
        <p className="text-xs text-slate-500">Endpoint: {endpoint}</p>
        <pre className="mt-4 text-xs bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
{JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </div>
  )
}
