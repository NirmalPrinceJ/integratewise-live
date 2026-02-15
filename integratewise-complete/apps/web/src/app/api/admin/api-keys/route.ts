import { ok } from "@/app/api/admin/_mock"

export async function GET() {
    const keys = [
        {
            id: "key_001",
            name: "Production Gateway",
            prefix: "ak_live_...",
            lastUsed: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            status: "active",
            createdAt: "2024-01-10T00:00:00Z"
        },
        {
            id: "key_002",
            name: "Staging Connector",
            prefix: "ak_test_...",
            lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            status: "active",
            createdAt: "2024-01-12T00:00:00Z"
        },
        {
            id: "key_003",
            name: "Legacy Integration",
            prefix: "ak_live_...",
            lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            status: "revoked",
            createdAt: "2023-11-05T00:00:00Z"
        }
    ]

    return ok({ keys, total: keys.length })
}

export async function POST(request: Request) {
    const body = await request.json()
    return ok({
        success: true,
        key: {
            id: `key_${Math.random().toString(36).substr(2, 9)}`,
            name: body.name,
            value: `ak_live_${Math.random().toString(36).substr(2, 32)}`, // Only shown once
            prefix: "ak_live_...",
            status: "active",
            createdAt: new Date().toISOString()
        }
    })
}
