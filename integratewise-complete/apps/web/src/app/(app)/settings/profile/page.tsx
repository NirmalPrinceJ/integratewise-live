"use client"

import { useState } from "react"
import { DashboardLayout, Section, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, Camera, Mail, Phone, Building, MapPin, Calendar, 
  Shield, Key, Clock, Save, Upload, Briefcase, Globe, 
  CheckCircle2, AlertCircle, Sparkles
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  
  const user = {
    name: "Alex Chen",
    email: "alex.chen@company.com",
    phone: "+1 (555) 123-4567",
    role: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    timezone: "Pacific Time (PT)",
    joinDate: "March 15, 2024",
    lastActive: "2 minutes ago",
    avatar: null,
    bio: "Building intelligent systems that help teams work smarter. Passionate about AI-augmented workflows and operational excellence.",
    preferences: {
      aiAssistance: "assisted",
      defaultWorkspace: "accounts",
      evidenceDrawer: true,
      keyboardShortcuts: true
    }
  }

  return (
    <DashboardLayout
      title="Profile"
      description="Manage your personal information and preferences"
      stageId="SETTINGS-PROFILE-001"
      actions={
        <Button 
          className={isEditing ? "bg-[#2D7A3E] hover:bg-[#236B31]" : ""}
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            "Edit Profile"
          )}
        </Button>
      }
    >
      {/* Profile Header */}
      <Section>
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D7A3E] to-[#4A9B5F] flex items-center justify-center text-white text-3xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <Badge className="bg-[#E8F5E9] text-[#2D7A3E] hover:bg-[#E8F5E9]">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">{user.bio}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {user.role}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {user.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </span>
            </div>
          </div>

          {/* Activity Status */}
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online
            </div>
            <p className="text-xs text-gray-400">Active {user.lastActive}</p>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-6">
        {/* Contact Information */}
        <Section title="Contact Information">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>
              <Badge variant="outline" className="text-xs">Primary</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    defaultValue={user.phone}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{user.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Timezone</p>
                {isEditing ? (
                  <select className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>UTC</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{user.timezone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
                <p className="text-gray-900">{user.joinDate}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* AI & Workspace Preferences */}
        <Section title="AI & Workspace Preferences">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#2D7A3E]" />
                <div>
                  <p className="font-medium text-gray-900">AI Assistance Mode</p>
                  <p className="text-xs text-gray-500">How AI interacts with your workflow</p>
                </div>
              </div>
              {isEditing ? (
                <select className="bg-white border border-gray-200 rounded px-3 py-1 text-sm">
                  <option value="manual">Manual Only</option>
                  <option value="assisted" selected>Assisted</option>
                  <option value="autonomous">Autonomous</option>
                </select>
              ) : (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Assisted</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Evidence Drawer</p>
                  <p className="text-xs text-gray-500">Show data lineage and audit trails</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={user.preferences.evidenceDrawer} className="sr-only peer" disabled={!isEditing} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Keyboard Shortcuts</p>
                  <p className="text-xs text-gray-500">Enable quick actions (E for Evidence)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={user.preferences.keyboardShortcuts} className="sr-only peer" disabled={!isEditing} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Default Workspace</p>
                  <p className="text-xs text-gray-500">Landing page after login</p>
                </div>
              </div>
              {isEditing ? (
                <select className="bg-white border border-gray-200 rounded px-3 py-1 text-sm">
                  <option value="today">Today</option>
                  <option value="accounts" selected>Accounts</option>
                  <option value="pipeline">Pipeline</option>
                  <option value="tasks">Tasks</option>
                </select>
              ) : (
                <span className="text-sm text-gray-700">Accounts</span>
              )}
            </div>
          </div>
        </Section>
      </div>

      {/* Security Summary */}
      <Section title="Security Overview">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">2FA Enabled</span>
            </div>
            <p className="text-xs text-green-700">Authenticator app configured</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">SSO Active</span>
            </div>
            <p className="text-xs text-green-700">Google Workspace</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Password Age</span>
            </div>
            <p className="text-xs text-yellow-700">87 days old</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Sessions</span>
            </div>
            <p className="text-xs text-gray-600">3 active devices</p>
          </div>
        </div>
      </Section>

      {/* Connected Accounts */}
      <Section title="Connected Accounts">
        <div className="space-y-3">
          {[
            { name: "Google", email: "alex.chen@company.com", icon: "🔷", status: "connected" },
            { name: "GitHub", email: "alexchen", icon: "🐙", status: "connected" },
            { name: "Slack", email: "@alex.chen", icon: "💬", status: "connected" },
            { name: "Microsoft", email: null, icon: "🪟", status: "available" },
          ].map((account) => (
            <div key={account.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{account.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{account.name}</p>
                  {account.email && <p className="text-xs text-gray-500">{account.email}</p>}
                </div>
              </div>
              {account.status === "connected" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Connected</Badge>
              ) : (
                <Button variant="outline" size="sm">Connect</Button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </DashboardLayout>
  )
}
