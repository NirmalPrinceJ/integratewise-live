"use client"

import Link from "next/link"
import { IntegrateWiseLogo } from "@/components/integratewise-logo"
import { Button } from "@/components/ui/button"
import { Bell, Search, User } from "lucide-react"

export function NavBar() {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <IntegrateWiseLogo className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
