"use client"

import { ReactNode } from "react"
import { SideNav } from "@/components/side-nav"
import { NavBar } from "@/components/nav-bar"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
