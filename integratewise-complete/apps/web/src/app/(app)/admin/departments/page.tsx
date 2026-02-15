"use client"

import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { FolderOpen, Plus, RefreshCw, Users, DollarSign, User } from "lucide-react"
import { useAdminDepartments, Department } from "@/hooks/useAdminDepartments"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DepartmentsPage() {
    const { departments, loading, error, refresh } = useAdminDepartments()

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                    Failed to load departments.
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-8">
            <PageHeader
                title="Departments"
                description="Organize your workspace into departments and teams"
                stageId="DEPTS-088"
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => refresh()}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Department
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && departments.length === 0 ? (
                    [...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))
                ) : (
                    departments.map((dept: Department) => (
                        <Card key={dept.id} className="hover:border-[#2D7A3E] transition-all group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold group-hover:text-[#2D7A3E]">
                                    {dept.name}
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className={dept.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}
                                >
                                    {dept.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Department Head
                                        </p>
                                        <p className="text-sm font-medium">{dept.head}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Members
                                        </p>
                                        <p className="text-sm font-medium">{dept.memberCount}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span>Budget: <span className="font-bold text-gray-900">{dept.budget}</span></span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-[#2D7A3E] hover:bg-[#E8F5E9]">
                                        Manage
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {departments.length === 0 && !loading && (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No departments found</h3>
                    <p className="text-gray-500">Create your first department to get started.</p>
                </div>
            )}
        </div>
    )
}
