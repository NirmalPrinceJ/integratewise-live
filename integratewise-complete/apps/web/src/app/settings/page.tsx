import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      <div className="max-w-2xl">
        {/* Profile Section */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h3 className="font-medium text-black mb-6">Profile</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-gray-500">First Name</Label>
                <Input defaultValue="Nirmal" className="h-10 border-gray-200 rounded-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-gray-500">Last Name</Label>
                <Input defaultValue="Prince" className="h-10 border-gray-200 rounded-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-gray-500">Email</Label>
              <Input defaultValue="nirmal@integratewise.com" className="h-10 border-gray-200 rounded-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-gray-500">Job Title</Label>
              <Input defaultValue="Operations Lead" className="h-10 border-gray-200 rounded-none" />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h3 className="font-medium text-black mb-6">Password</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-gray-500">Current Password</Label>
              <Input type="password" className="h-10 border-gray-200 rounded-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-gray-500">New Password</Label>
              <Input type="password" className="h-10 border-gray-200 rounded-none" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none px-8">
            Save Changes
          </Button>
          <Button variant="outline" className="h-10 border-gray-200 rounded-none">
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
