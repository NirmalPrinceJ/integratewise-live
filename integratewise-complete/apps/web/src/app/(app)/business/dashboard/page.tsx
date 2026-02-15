import { BusinessDashboard } from "@/components/views/business-dashboard"

export default function BusinessDashboardPage() {
    // In a real app, these would be fetched from the Spine/SSOT or IQ Hub
    const stats = {
        totalRevenue: "$1.24M",
        revenueGrowth: "+12.5%",
        activeUsers: 42,
        systemHealth: 99.8
    }

    const recentReleases = [
        {
            id: "rel-001",
            service: "Think Engine",
            version: "v11.11.2",
            status: "stable" as const,
            timestamp: "2 hours ago"
        },
        {
            id: "rel-002",
            service: "Normalizer",
            version: "v4.2.0",
            status: "deploying" as const,
            timestamp: "Just now"
        },
        {
            id: "rel-003",
            service: "IQ Hub",
            version: "v1.0.5",
            status: "stable" as const,
            timestamp: "Yesterday"
        }
    ]

    const provisioningSummary = {
        totalSeats: 50,
        activeSeats: 38,
        pendingInvites: 4
    }

    return (
        <BusinessDashboard
            stats={stats}
            recentReleases={recentReleases}
            provisioningSummary={provisioningSummary}
        />
    )
}
