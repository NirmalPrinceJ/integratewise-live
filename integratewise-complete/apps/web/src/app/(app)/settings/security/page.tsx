"use client"

import { useState } from "react"
import { DashboardLayout, Section, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, Key, Smartphone, Monitor, Laptop, Globe, 
  Lock, Unlock, AlertTriangle, CheckCircle2, XCircle,
  Clock, MapPin, RefreshCw, Trash2, Eye, EyeOff,
  Fingerprint, Mail, LogOut
} from "lucide-react"

export default function SecurityPage() {
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)

  const sessions = [
    { 
      id: 1, 
      device: "MacBook Pro", 
      browser: "Chrome 120", 
      location: "San Francisco, CA",
      ip: "192.168.1.***",
      lastActive: "Active now",
      current: true,
      icon: Laptop
    },
    { 
      id: 2, 
      device: "iPhone 15 Pro", 
      browser: "Safari Mobile", 
      location: "San Francisco, CA",
      ip: "192.168.1.***",
      lastActive: "2 hours ago",
      current: false,
      icon: Smartphone
    },
    { 
      id: 3, 
      device: "Windows Desktop", 
      browser: "Firefox 121", 
      location: "New York, NY",
      ip: "10.0.0.***",
      lastActive: "Yesterday",
      current: false,
      icon: Monitor
    },
  ]

  const securityLog = [
    { action: "Password changed", time: "87 days ago", status: "success", ip: "192.168.1.***" },
    { action: "2FA enabled", time: "120 days ago", status: "success", ip: "192.168.1.***" },
    { action: "Login from new device", time: "3 days ago", status: "success", ip: "10.0.0.***" },
    { action: "Failed login attempt", time: "5 days ago", status: "warning", ip: "203.0.113.***" },
    { action: "API key generated", time: "14 days ago", status: "success", ip: "192.168.1.***" },
  ]

  return (
    <DashboardLayout
      title="Security"
      description="Manage your account security, authentication, and active sessions"
      stageId="SETTINGS-SECURITY-001"
    >
      {/* Security Score */}
      <Section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">85</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Security Score</h3>
              <p className="text-gray-500">Your account is well protected</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-700">2FA Enabled</Badge>
            <Badge className="bg-green-100 text-green-700">SSO Active</Badge>
            <Badge className="bg-yellow-100 text-yellow-700">Password: 87 days</Badge>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-6">
        {/* Password Section */}
        <Section title="Password">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Current Password</p>
                  <p className="text-xs text-gray-500">Last changed 87 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Password Recommendation</span>
              </div>
              <p className="text-xs text-yellow-700">
                Consider updating your password. It's been more than 90 days since your last change.
              </p>
            </div>
          </div>
        </Section>

        {/* Two-Factor Authentication */}
        <Section title="Two-Factor Authentication">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Authenticator App</p>
                  <p className="text-xs text-green-700">Google Authenticator configured</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Email Backup</p>
                  <p className="text-xs text-gray-500">Receive codes via email</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Recovery Codes</p>
                  <p className="text-xs text-gray-500">8 codes remaining</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
              >
                {showRecoveryCodes ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showRecoveryCodes ? "Hide" : "View"}
              </Button>
            </div>

            {showRecoveryCodes && (
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Recovery Codes (Store Securely)</p>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm text-green-400">
                  <span>A1B2-C3D4-E5F6</span>
                  <span>G7H8-I9J0-K1L2</span>
                  <span>M3N4-O5P6-Q7R8</span>
                  <span>S9T0-U1V2-W3X4</span>
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* Active Sessions */}
      <Section title="Active Sessions">
        <div className="space-y-3">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`flex items-center justify-between p-4 rounded-lg ${
                session.current ? 'bg-green-50 border border-green-100' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  session.current ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  <session.icon className={`w-5 h-5 ${session.current ? 'text-green-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{session.device}</p>
                    {session.current && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {session.browser} • {session.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">{session.lastActive}</p>
                  <p className="text-xs text-gray-400">{session.ip}</p>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out All Other Devices
          </Button>
        </div>
      </Section>

      {/* Security Activity Log */}
      <Section title="Security Activity">
        <div className="space-y-2">
          {securityLog.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {log.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : log.status === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-gray-900">{log.action}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{log.ip}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" className="text-gray-500">
            View Full Activity Log
          </Button>
        </div>
      </Section>

      {/* API Keys */}
      <Section title="API Keys & Tokens">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Personal Access Token</p>
                <p className="text-xs text-gray-500">Created 14 days ago • Expires in 351 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Read/Write</Badge>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline">
            <Key className="w-4 h-4 mr-2" />
            Generate New Token
          </Button>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section>
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
              Download My Data
            </Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
              Delete Account
            </Button>
          </div>
        </div>
      </Section>
    </DashboardLayout>
  )
}
