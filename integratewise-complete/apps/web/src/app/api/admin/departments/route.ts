import { ok } from "@/app/api/admin/_mock"

export async function GET() {
    const departments = [
        {
            id: "dept_001",
            name: "Engineering",
            head: "Nirmal Prince J",
            memberCount: 45,
            budget: "$1.2M",
            status: "active",
            createdAt: "2023-05-15T00:00:00Z"
        },
        {
            id: "dept_002",
            name: "Product Design",
            head: "Sarah Chen",
            memberCount: 12,
            budget: "$450K",
            status: "active",
            createdAt: "2023-06-20T00:00:00Z"
        },
        {
            id: "dept_003",
            name: "Sales",
            head: "Michael Scott",
            memberCount: 28,
            budget: "$800K",
            status: "active",
            createdAt: "2023-01-10T00:00:00Z"
        },
        {
            id: "dept_004",
            name: "Customer Success",
            head: "Elena Rodriguez",
            memberCount: 15,
            budget: "$300K",
            status: "active",
            createdAt: "2023-08-05T00:00:00Z"
        }
    ]

    return ok({ departments, total: departments.length })
}
