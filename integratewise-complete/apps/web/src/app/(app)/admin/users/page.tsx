"use client"

import { useState } from "react"
import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { UserPlus, MoreHorizontal, RefreshCw } from "lucide-react"
import { useAdminUsers, AdminUser } from "@/hooks/useAdminUsers"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function UserManagementPage() {
  const { users, loading, error, refresh, inviteUser } = useAdminUsers()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "member"
  })

  const handleInvite = async () => {
    if (!newUserData.email || !newUserData.name) {
      toast.error("Please fill in all fields")
      return
    }

    setIsInviting(true)
    try {
      await inviteUser(newUserData)
      toast.success("User invited successfully")
      setIsInviteOpen(false)
      setNewUserData({ name: "", email: "", role: "member" })
      refresh()
    } catch (err) {
      toast.error("Failed to invite user")
    } finally {
      setIsInviting(false)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          Failed to load users.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="User Management"
        description="Manage team members and access"
        stageId="USERADMIN-021"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => refresh()}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUserData.role}
                      onValueChange={(val) => setNewUserData({ ...newUserData, role: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="readonly">Read Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                  <Button
                    className="bg-[#2D7A3E] hover:bg-[#236B31]"
                    onClick={handleInvite}
                    disabled={isInviting}
                  >
                    {isInviting ? "Sending..." : "Send Invitation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">User</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && users.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4" colSpan={4}>
                    <Skeleton className="h-12 w-full" />
                  </td>
                </tr>
              ))
            ) : (
              users.map((user: AdminUser) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2D7A3E] rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={`capitalize ${user.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                        user.status === "invited" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                          "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="p-10 text-center text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  )
}
