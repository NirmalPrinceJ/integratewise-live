import { PageHeader } from "@/components/spine/page-header"
import { User, Bell, Shield, Palette, Globe, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6">
      <PageHeader title="Settings" description="Manage your account and preferences" stageId="SETTINGS-020" />

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: User, label: "Profile", description: "Update your personal information" },
          { icon: Bell, label: "Notifications", description: "Configure notification preferences" },
          { icon: Shield, label: "Security", description: "Password and 2FA settings" },
          { icon: Palette, label: "Appearance", description: "Theme and display options" },
          { icon: Globe, label: "Language", description: "Language and region settings" },
          { icon: CreditCard, label: "Billing", description: "Subscription and payments" },
        ].map((setting) => (
          <div
            key={setting.label}
            className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-[#2D7A3E] transition-colors"
          >
            <setting.icon className="w-8 h-8 text-[#2D7A3E] mb-3" />
            <p className="font-semibold text-gray-900">{setting.label}</p>
            <p className="text-sm text-gray-500">{setting.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
