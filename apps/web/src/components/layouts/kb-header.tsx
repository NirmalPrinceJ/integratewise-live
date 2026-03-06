"use client"

import { Link, useLocation } from "react-router"

export function KBHeader() {
  const pathname = useLocation().pathname

  const navItems = [
    { label: "Bridge", href: "/bridge" },
    { label: "Knowledge", href: "/knowledge" },
    { label: "Search", href: "/search" },
    { label: "Think", href: "/think" },
    { label: "Evidence", href: "/evidence" },
    { label: "Spine", href: "/spine" },
  ]

  return (
    <header className="bg-[#2F3E5F] text-white border-b border-[#3d4f6f]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 8L10 4L16 8V16H4V8Z" fill="#4A6FA5" />
              </svg>
            </div>
            <span className="text-lg font-semibold">IntegrateWise Knowledge Bank</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#4A6FA5] text-white"
                      : "text-gray-300 hover:text-white hover:bg-[#3d4f6f]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
