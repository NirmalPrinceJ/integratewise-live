import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AntiGravityBackground } from "../AntiGravityBackground";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Anti-gravity background */}
      <AntiGravityBackground />
      
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
