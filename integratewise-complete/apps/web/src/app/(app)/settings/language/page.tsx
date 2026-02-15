"use client"

import { useState } from "react"
import { DashboardLayout, Section } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, Check, Clock, Calendar, DollarSign, 
  Save, Languages, MapPin
} from "lucide-react"

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [currency, setCurrency] = useState("USD")
  const [timezone, setTimezone] = useState("America/Los_Angeles")

  const languages = [
    { code: "en-US", name: "English (US)", native: "English", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", native: "English", flag: "🇬🇧" },
    { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
    { code: "pt-BR", name: "Portuguese (Brazil)", native: "Português", flag: "🇧🇷" },
    { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
    { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳" },
  ]

  const dateFormats = [
    { format: "MM/DD/YYYY", example: "01/31/2026" },
    { format: "DD/MM/YYYY", example: "31/01/2026" },
    { format: "YYYY-MM-DD", example: "2026-01-31" },
    { format: "MMM DD, YYYY", example: "Jan 31, 2026" },
    { format: "DD MMM YYYY", example: "31 Jan 2026" },
  ]

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
  ]

  const timezones = [
    { id: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8" },
    { id: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
    { id: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
    { id: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
    { id: "Europe/London", label: "London (GMT)", offset: "UTC+0" },
    { id: "Europe/Paris", label: "Central European (CET)", offset: "UTC+1" },
    { id: "Asia/Tokyo", label: "Japan (JST)", offset: "UTC+9" },
    { id: "Asia/Shanghai", label: "China (CST)", offset: "UTC+8" },
  ]

  return (
    <DashboardLayout
      title="Language & Region"
      description="Configure language, date, time, and currency preferences"
      stageId="SETTINGS-LANGUAGE-001"
      actions={
        <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      }
    >
      {/* Language Selection */}
      <Section title="Display Language">
        <p className="text-sm text-gray-500 mb-4">
          Choose the language for the IntegrateWise OS interface
        </p>
        <div className="grid grid-cols-4 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                selectedLanguage === lang.code 
                  ? 'border-[#2D7A3E] bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">{lang.name}</p>
                <p className="text-xs text-gray-500">{lang.native}</p>
              </div>
              {selectedLanguage === lang.code && (
                <Check className="w-4 h-4 text-[#2D7A3E] ml-auto" />
              )}
            </button>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-6">
        {/* Date & Time Format */}
        <Section title="Date & Time">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Format
              </label>
              <div className="space-y-2">
                {dateFormats.map((df) => (
                  <button
                    key={df.format}
                    onClick={() => setDateFormat(df.format)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      dateFormat === df.format 
                        ? 'border-[#2D7A3E] bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-mono text-sm text-gray-600">{df.format}</span>
                    <span className="text-sm text-gray-900">{df.example}</span>
                    {dateFormat === df.format && <Check className="w-4 h-4 text-[#2D7A3E]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Time Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTimeFormat("12h")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    timeFormat === "12h" 
                      ? 'border-[#2D7A3E] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">12-hour</p>
                  <p className="text-sm text-gray-500">2:30 PM</p>
                </button>
                <button
                  onClick={() => setTimeFormat("24h")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    timeFormat === "24h" 
                      ? 'border-[#2D7A3E] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">24-hour</p>
                  <p className="text-sm text-gray-500">14:30</p>
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Currency & Timezone */}
        <Section title="Region">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white"
              >
                {timezones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Current time:</strong> {new Date().toLocaleString('en-US', { 
                  timeZone: timezone,
                  hour: timeFormat === '12h' ? 'numeric' : '2-digit',
                  minute: '2-digit',
                  hour12: timeFormat === '12h'
                })}
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Number Format Preview */}
      <Section title="Format Preview">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
            <p className="text-lg font-medium text-gray-900">
              {dateFormats.find(d => d.format === dateFormat)?.example}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</p>
            <p className="text-lg font-medium text-gray-900">
              {timeFormat === '12h' ? '2:30 PM' : '14:30'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Currency</p>
            <p className="text-lg font-medium text-gray-900">
              {currencies.find(c => c.code === currency)?.symbol}1,234.56
            </p>
          </div>
        </div>
      </Section>

      {/* AI Translation */}
      <Section title="AI Translation">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Auto-translate AI Insights</p>
              <p className="text-xs text-gray-500">Translate AI-generated content to your language</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A3E]"></div>
          </label>
        </div>
      </Section>
    </DashboardLayout>
  )
}
