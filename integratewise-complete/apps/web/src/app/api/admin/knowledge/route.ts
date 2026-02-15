import { ok, updated } from "@/app/api/admin/_mock"

const sources = [
  { id: "kn_001", name: "Google Drive", status: "healthy", indexedDocs: 1290, lastIndexAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
  { id: "kn_002", name: "Confluence", status: "warning", indexedDocs: 820, lastIndexAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString() },
]

export async function GET() {
  return ok({ sources, total: sources.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  return updated({ ok: true, operation: body?.operation ?? "reindex" })
}
