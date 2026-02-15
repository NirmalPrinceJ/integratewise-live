"use client"

import { useState } from "react"
import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Palette, Sun, Moon, Monitor, Type, Layout, 
  Grid3X3, Columns, Rows, Eye, Save, Check,
  Maximize2, Minimize2, PanelLeft, SidebarClose
} from "lucide-react"

export default function AppearancePage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [accentColor, setAccentColor] = useState("#2D7A3E")
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const themes = [
    { id: "light", name: "Light", icon: Sun, preview: "bg-white border-gray-200" },
    { id: "dark", name: "Dark", icon: Moon, preview: "bg-slate-900 border-slate-700" },
    { id: "system", name: "System", icon: Monitor, preview: "bg-gradient-to-r from-white to-slate-900 border-gray-400" },
  ]

  const accentColors = [
    { name: "Forest", color: "#2D7A3E" },
    { name: "Ocean", color: "#2563EB" },
    { name: "Sunset", color: "#EA580C" },
    { name: "Berry", color: "#9333EA" },
    { name: "Coral", color: "#E11D48" },
    { name: "Slate", color: "#475569" },
  ]

  return (
    <DashboardLayout
      title="Appearance"
      description="Customize the look and feel of your workspace"
      stageId="SETTINGS-APPEARANCE-001"
      actions={
        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      }
    >
      {/* Theme Selection */}
      <Section title="Theme">
        <div className="grid grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as typeof theme)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                theme === t.id 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {theme === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2D7A3E] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`w-full h-24 rounded-lg border mb-3 ${t.preview}`}></div>
              <div className="flex items-center gap-2">
                <t.icon className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{t.name}</span>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Accent Color */}
      <Section title="Accent Color">
        <p className="text-sm text-gray-500 mb-4">
          Choose your primary accent color for buttons, links, and highlights
        </p>
        <div className="flex gap-3">
          {accentColors.map((c) => (
            <button
              key={c.color}
              onClick={() => setAccentColor(c.color)}
              className={`relative w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                accentColor === c.color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: c.color }}
              title={c.name}
            >
              {accentColor === c.color && (
                <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">Custom:</span>
          <input 
            type="color" 
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <input 
            type="text" 
            value={accentColor.toUpperCase()}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-24 px-2 py-1 border border-gray-200 rounded text-sm font-mono"
          />
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-6">
        {/* Density */}
        <Section title="Display Density">
          <div className="space-y-3">
            <button
              onClick={() => setDensity("comfortable")}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                density === "comfortable" 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Comfortable</p>
                  <p className="text-xs text-gray-500">More spacing, easier to read</p>
                </div>
              </div>
              {density === "comfortable" && <Check className="w-5 h-5 text-[#2D7A3E]" />}
            </button>

            <button
              onClick={() => setDensity("compact")}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                density === "compact" 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Minimize2 className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Compact</p>
                  <p className="text-xs text-gray-500">More content on screen</p>
                </div>
              </div>
              {density === "compact" && <Check className="w-5 h-5 text-[#2D7A3E]" />}
            </button>
          </div>
        </Section>

        {/* Sidebar */}
        <Section title="Sidebar">
          <div className="space-y-3">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                !sidebarCollapsed 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <PanelLeft className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Expanded</p>
                  <p className="text-xs text-gray-500">Show full navigation labels</p>
                </div>
              </div>
              {!sidebarCollapsed && <Check className="w-5 h-5 text-[#2D7A3E]" />}
            </button>

            <button
              onClick={() => setSidebarCollapsed(true)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                sidebarCollapsed 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <SidebarClose className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Collapsed</p>
                  <p className="text-xs text-gray-500">Icons only, more workspace</p>
                </div>
              </div>
              {sidebarCollapsed && <Check className="w-5 h-5 text-[#2D7A3E]" />}
            </button>
          </div>
        </Section>
      </div>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Font Size</p>
                <p className="text-xs text-gray-500">Adjust base text size</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">A-</Button>
              <span className="w-12 text-center text-sm font-medium">100%</span>
              <Button variant="outline" size="sm">A+</Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Reduce Motion</p>
                <p className="text-xs text-gray-500">Minimize animations</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
            </label>
          </div>
        </div>
      </Section>

      {/* Preview */}
      <Section title="Preview">
        <div 
          className="p-6 rounded-xl border-2 border-dashed border-gray-300"
          style={{ 
            '--accent': accentColor,
          } as React.CSSProperties}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: accentColor }}
            >
              Primary Button
            </div>
            <div 
              className="px-4 py-2 rounded-lg border-2 font-medium"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Secondary Button
            </div>
            <a 
              href="#" 
              className="font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Link Text
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Badge style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              Status Badge
            </Badge>
            <div 
              className="h-2 w-32 rounded-full"
              style={{ backgroundColor: `${accentColor}30` }}
            >
              <div 
                className="h-full w-3/4 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
          </div>
        </div>
      </Section>
    </DashboardLayout>
  )
}
