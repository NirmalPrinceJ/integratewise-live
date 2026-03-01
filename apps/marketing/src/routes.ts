import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/pages/HomePage";
import { PlatformPage } from "./components/pages/PlatformPage";
import { WhoItsForPage } from "./components/pages/WhoItsForPage";
import { PricingPage } from "./components/pages/PricingPage";
import { SecurityPage } from "./components/pages/SecurityPage";
import { StoryPage } from "./components/pages/StoryPage";
import { IntegrationsPage } from "./components/pages/IntegrationsPage";
import { LoginPage } from "./components/pages/LoginPage";
import { ContactPage } from "./components/pages/ContactPage";
import { NotFound } from "./components/pages/NotFound";

export const router = createBrowserRouter([
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
      { path: "contact", Component: ContactPage },
      { path: "login", Component: LoginPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
