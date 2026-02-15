import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import faviconSrc from "figma:asset/bcaf13c3a18bdb4dbfd3ccee1dd81293eb966a9a.png";

// ── Landing Pages ──
import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { Problem } from "./components/landing/Problem";
import { Pillars } from "./components/landing/Pillars";
import { Audience } from "./components/landing/Audience";
import { Comparison } from "./components/landing/Comparison";
import { Differentiators } from "./components/landing/Differentiators";
import { Integrations } from "./components/landing/Integrations";
import { Pricing } from "./components/landing/Pricing";
import { Footer } from "./components/landing/Footer";
import { TechnicalPage } from "./components/landing/TechnicalPage";
import { ProblemPage } from "./components/landing/ProblemPage";
import { AudiencePage } from "./components/landing/AudiencePage";
import { PricingPage } from "./components/landing/PricingPage";
import { GenericPage } from "./components/landing/GenericPage";

// ── Auth ──
import { LoginPage } from "./components/auth/login-page";
import { SignUpPage } from "./components/auth/signup-page";

// ── Full Workspace System ──
import {
  SpineProvider,
  useSpine,
} from "./components/spine/spine-client";
import { GoalProvider } from "./components/goal-framework/goal-context";
import { OnboardingFlow } from "./components/onboarding/onboarding-flow";
import { WorkspaceShell } from "./components/workspace-shell";
import type {
  CTXEnum,
  OrgType,
} from "./components/spine/types";

// ── Page types ──
type Page = string;

const DEDICATED_PAGES = new Set([
  "home",
  "technical",
  "problem",
  "audience",
  "pricing",
  "app",
]);

const HASH_TO_PAGE: Record<string, string> = {
  technical: "technical",
  problem: "problem",
  audience: "audience",
  pricing: "pricing",
  app: "app",
  // Architecture alias
  architecture: "technical",
};

// All valid page hashes (includes both dedicated and generic pages)
const ALL_PAGES = new Set([
  "technical",
  "problem",
  "audience",
  "pricing",
  "app",
  "platform-overview",
  "architecture",
  "features",
  "security",
  "enterprise-integration",
  "connect",
  "context",
  "cognition",
  "action",
  "memory",
  "correct",
  "repeat",
  "solutions",
  "use-cases",
  "customer-data-unification",
  "automated-revops-billing-sync",
  "proactive-integration-monitoring",
  "zero-disruption-integration-upgrades",
  "ai-assisted-compliance-audit",
  "contextual-ai",
  "human-approved-actions",
  "evidence-backed-executions",
  "three-worlds-in-one-sync",
  "by-role",
  "csm",
  "revops-role",
  "founders-executives",
  "operations",
  "it-admin-security",
  "freelancers",
  "students",
  "blog",
  "blog-post",
  "newsletter",
  "resources",
  "guides",
  "webinars",
  "documentation",
  "case-studies",
  "contact",
  "legal",
  "support",
  "careers",
]);

const PAGE_TRANSITION = { duration: 0.3 };

// ─── Workspace App (Login → Onboarding → Workspace) ─────────────────────────

function WorkspaceApp() {
  const spine = useSpine();
  const [authState, setAuthState] = useState<
    "login" | "signup" | "onboarding" | "workspace"
  >("login");
  const [orgType, setOrgType] = useState<OrgType>("PRODUCT");
  const [activeCtx, setActiveCtx] =
    useState<CTXEnum>("CTX_BIZOPS");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoginLoading(true);
      setLoginError("");
      // Demo login — accepts any credentials
      await new Promise((r) => setTimeout(r, 800));
      setLoginLoading(false);
      setAuthState("onboarding");
    },
    [],
  );

  const handleSignUp = useCallback(
    async (name: string, email: string, password: string) => {
      setSignUpLoading(true);
      setSignUpError("");
      // Demo sign-up — accepts any input
      await new Promise((r) => setTimeout(r, 1000));
      setRegisteredName(name);
      setSignUpLoading(false);
      setAuthState("onboarding");
    },
    [],
  );

  const handleOnboardingComplete = useCallback(
    async (data: {
      userName: string;
      role: string;
      activeCtx: CTXEnum;
      connectedApps: string[];
      orgType: OrgType;
    }) => {
      // If user registered a name during sign-up, pass it forward
      const finalData = registeredName
        ? { ...data, userName: data.userName || registeredName }
        : data;

      setOrgType(finalData.orgType);
      setActiveCtx(finalData.activeCtx);
      try {
        await spine.initialize({
          connectedApps: finalData.connectedApps,
          userName: finalData.userName,
          role: finalData.role,
          orgType: finalData.orgType,
          activeCtx: finalData.activeCtx,
        });
      } catch (err) {}
      setAuthState("workspace");
    },
    [spine, registeredName],
  );

  if (authState === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSignUp={() => {
          setLoginError("");
          setAuthState("signup");
        }}
        onForgotPassword={() => {}}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  if (authState === "signup") {
    return (
      <SignUpPage
        onSignUp={handleSignUp}
        onGoToLogin={() => {
          setSignUpError("");
          setAuthState("login");
        }}
        error={signUpError}
        loading={signUpLoading}
      />
    );
  }

  if (authState === "onboarding") {
    return (
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    );
  }

  return (
    <GoalProvider initialOrgType={orgType}>
      <WorkspaceShell initialCtx={activeCtx} />
    </GoalProvider>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // Set favicon AND prevent dark mode flash for workspace AND prevent dark mode flash for workspace
  useEffect(() => {
    const link =
      (document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement) || document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = faviconSrc;
    document.head.appendChild(link);

    // Prevent flash: if navigating to #app, pre-apply dark mode
    if (window.location.hash === "#app") {
      document.documentElement.classList.add("dark");
    }

    // Prevent flash: if navigating to #app, pre-apply dark mode
    if (window.location.hash === "#app") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const resolved = HASH_TO_PAGE[hash] || hash;
      if (ALL_PAGES.has(resolved)) {
        setCurrentPage(resolved);
      } else if (hash === "") {
        setCurrentPage("home");
      } else {
        setCurrentPage(hash || "home");
      }
      window.scrollTo(0, 0);

      // Apply/remove dark mode based on route
      if (resolved === "app" || hash === "app") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Apply/remove dark mode based on route
      if (resolved === "app" || hash === "app") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () =>
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
  }, []);

  // ── Page content based on route (must be before any conditional returns) ──
  const pageContent = useMemo(() => {
    switch (currentPage) {
      case "technical":
        return <TechnicalPage />;
      case "problem":
        return <ProblemPage />;
      case "audience":
        return <AudiencePage />;
      case "pricing":
        return <PricingPage />;
      case "home":
        return (
          <>
            <Hero />
            <Problem />
            <Pillars />
            <Audience />
            <Comparison />
            <Integrations />
            <Differentiators />
            <Pricing />
          </>
        );
      default:
        // All other routes render a generic page
        return <GenericPage pageId={currentPage} />;
    }
  }, [currentPage]);

  // ── Full Workspace ──
  if (currentPage === "app") {
    return (
      <SpineProvider>
        <WorkspaceApp />
      </SpineProvider>
    );
  }

  // ── Marketing Site ──
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-sky-500/30">
      <Navbar
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={PAGE_TRANSITION}
        >
          {pageContent}
          <Footer />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}