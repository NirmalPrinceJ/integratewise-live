import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Mail, MoreHorizontal } from "lucide-react";

const team = [
  { id: 1, name: "Nirmal Prince", role: "Operations Lead", email: "nirmal@integratewise.com", status: "active" },
  { id: 2, name: "Sarah Chen", role: "Customer Success Manager", email: "sarah@integratewise.com", status: "active" },
  { id: 3, name: "Mike Ross", role: "Sales Engineer", email: "mike@integratewise.com", status: "active" },
  { id: 4, name: "Emily Davis", role: "Product Manager", email: "emily@integratewise.com", status: "away" },
  { id: 5, name: "Rajesh Kumar", role: "Account Executive", email: "rajesh@integratewise.com", status: "active" },
];

export default function TeamPage() {
  return (
    <DashboardLayout title="Team" subtitle="5 members · 4 active">
      <div className="flex justify-end mb-6">
        <Button className="h-10 bg-black hover:bg-gray-900 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Status</div>
        </div>
        {team.map((member) => (
          <div key={member.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center">
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm font-medium text-black">{member.name}</span>
            </div>
            <div className="col-span-3 text-sm text-gray-600">{member.role}</div>
            <div className="col-span-3 text-sm text-gray-500">{member.email}</div>
            <div className="col-span-2 flex items-center justify-between">
              <span className={`text-xs px-2 py-1 ${
                member.status === 'active' ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'
              }`}>
                {member.status}
              </span>
              <button className="p-1 hover:bg-gray-200">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
