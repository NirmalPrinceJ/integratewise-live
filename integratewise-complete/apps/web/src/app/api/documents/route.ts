import { NextResponse } from "next/server"

// Mock documents database
const MOCK_DOCUMENTS = [
  {
    id: "1",
    name: "Q4 Financial Report.pdf",
    size: "2.4 MB",
    modified: "2 hours ago",
    type: "PDF",
    status: "processed",
  },
  {
    id: "2",
    name: "AI Integration Guide.docx",
    size: "1.2 MB",
    modified: "1 day ago",
    type: "Document",
    status: "processed",
  },
  {
    id: "3",
    name: "Strategy Document.xlsx",
    size: "856 KB",
    modified: "3 days ago",
    type: "Spreadsheet",
    status: "processed",
  },
]

export async function GET() {
  return NextResponse.json(MOCK_DOCUMENTS)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      modified: "now",
      type: file.type.split("/")[1].toUpperCase() || "File",
      status: "processing" as const,
    }

    return NextResponse.json(newDoc, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
