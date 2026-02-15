
import { DashboardLayout, Section, StatCard } from "@/components/layouts/page-layouts"
import { getClient, getArtifacts } from "@/lib/supabase/queries"
import { Building2, Mail, Phone, MapPin, Activity, FileText, Calendar, Link as LinkIcon, AlertTriangle } from "lucide-react"

interface PageProps {
    params: {
        id: string
    }
}

export default async function ClientDetailPage({ params }: PageProps) {
    const client = await getClient(params.id)
    // In a real app, we would fetch artifacts/events filtered by client_id
    const artifacts = await getArtifacts(5)

    if (!client) {
        return <div className="p-12 text-center text-gray-500">Client not found</div>
    }

    return (
        <DashboardLayout
            title={client.name}
            description={client.industry || "Client Overview"}
            stageId="BUSINESS-018"
            actions={
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        Edit Client
                    </button>
                    <button className="px-3 py-2 bg-[#2D7A3E] text-white rounded-lg hover:bg-[#236030] text-sm font-medium">
                        New Deal
                    </button>
                </div>
            }
        >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Health Score"
                    value={`${client.health_score || 0}%`}
                    icon={Activity}
                    primary={client.health_score >= 80}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${(client.total_revenue || 0).toLocaleString()}`}
                    icon={Activity}
                />
                <div className="p-4 bg-white border border-gray-200 rounded-xl md:col-span-2 flex items-center gap-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {client.email || "No email"}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {client.phone || "No phone"}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {client.address || "No address"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Spine & Context */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Spine Section */}
                    <Section title="Spine: Key Metrics & Events">
                        <div className="mb-4 grid grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">Win Rate</p>
                                <p className="text-lg font-bold text-gray-900">45%</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">Avg Deal Size</p>
                                <p className="text-lg font-bold text-gray-900">$12k</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">Active Logic</p>
                                <p className="text-lg font-bold text-gray-900">3 Rules</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Signals</h4>
                            {[
                                { title: "Subscription Renewed", date: "2 days ago", type: "success" },
                                { title: "Usage dropped by 15%", date: "1 week ago", type: "warning" },
                            ].map((event, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                                    <div className={`w-2 h-2 rounded-full ${event.type === 'warning' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                    <span className="flex-1 text-sm font-medium text-gray-700">{event.title}</span>
                                    <span className="text-xs text-gray-400">{event.date}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Context Section */}
                    <Section title="Context: Timeline & Evidence">
                        <div className="space-y-4">
                            {artifacts.map((artifact: any, i: number) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#2D7A3E] group-hover:text-white transition-colors">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="w-0.5 h-full bg-gray-100 my-1"></div>
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-sm font-semibold text-gray-900">{artifact.title}</h5>
                                            <span className="text-xs text-gray-400">{new Date(artifact.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Referenced in 3 previous sessions.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* Sidebar: Relationships & Logic */}
                <div className="space-y-6">
                    <Section title="Entity Risk">
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${client.status === 'at_risk' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            <AlertTriangle className="w-5 h-5" />
                            <div>
                                <p className="font-semibold">{client.status === 'at_risk' ? 'At Risk' : 'Healthy'}</p>
                                <p className="text-xs opacity-80">Last check: 2 hours ago</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button className="text-sm text-[#2D7A3E] hover:underline flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                View Engine Logic
                            </button>
                        </div>
                    </Section>

                    <Section title="Linked Entities">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                <LinkIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-600">3 Active Deals</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                <LinkIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-600">Primary Contact: John Doe</span>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </DashboardLayout>
    )
}
