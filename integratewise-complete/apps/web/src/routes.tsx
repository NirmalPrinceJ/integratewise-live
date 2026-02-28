import { createBrowserRouter, Outlet } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/pages/HomePage";
import { PlatformPage } from "./components/pages/PlatformPage";
import { WhoItsForPage } from "./components/pages/WhoItsForPage";
import { PricingPage } from "./components/pages/PricingPage";
import { SecurityPage } from "./components/pages/SecurityPage";
import { StoryPage } from "./components/pages/StoryPage";
import { IntegrationsPage } from "./components/pages/IntegrationsPage";
import { LoginPage } from "./components/pages/LoginPage";
import { NotFound } from "./components/pages/NotFound";

// App Dashboard Imports
import { ProtectedRoute } from "./components/app/ProtectedRoute";
import { AppLayout } from "./components/app/AppLayout";
import { DashboardPage } from "./components/app/DashboardPage";
import { AccountsPage } from "./components/app/AccountsPage";
import { TasksPage } from "./components/app/TasksPage";
import { CalendarPage } from "./components/app/CalendarPage";
import { IntelligencePage } from "./components/app/IntelligencePage";
import { SettingsPage } from "./components/app/SettingsPage";

// Protected app wrapper
function ProtectedAppLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  // Marketing Site Routes
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "platform", Component: PlatformPage },
      { path: "who-its-for", Component: WhoItsForPage },
      { path: "pricing", Component: PricingPage },
      { path: "security", Component: SecurityPage },
      { path: "story", Component: StoryPage },
      { path: "integrations", Component: IntegrationsPage },
      { path: "login", Component: LoginPage },
    ],
  },
  // App Dashboard Routes (Protected)
  {
    path: "/app",
    Component: ProtectedAppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "accounts", Component: AccountsPage },
      { path: "tasks", Component: TasksPage },
      { path: "calendar", Component: CalendarPage },
      { path: "intelligence", Component: IntelligencePage },
      { path: "settings", Component: SettingsPage },
    ],
  },
  // Catch all
  { path: "*", Component: NotFound },
]);
