/**
 * AppShell — The Authenticated Workspace
 *
 * Lifecycle: Login → Onboarding (L0) → Loader → Workspace (L1 + L2)
 *
 * This is the full app experience from Dir 2 (IntegrateWise Business Operations Design),
 * now wired to Dir 3's backend Workers and properly integrated with React Router.
 *
 * Auth: Supabase PKCE (Google SSO, GitHub SSO, email/password)
 * Data: Spine SSOT via BFF Worker → Cloudflare → Supabase PostgreSQL
 * State: Hydration Fabric with 5 providers (Spine, REST, Doppler, KV, Static)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router";

// Auth
import { AuthProvider, useAuth } from "@/components/auth/auth-provider";

// API Client (v3.5 wiring)
import { initApiClient } from "@/lib/api-client";

// Spine + Goal Framework
import { SpineProvider, useSpine } from "@/components/spine/spine-client";
import { GoalProvider } from "@/components/goal-framework/goal-context";

// Core App Components
import { LoginPage } from "@/components/auth/login-page";
import { SignUpPage } from "@/components/auth/signup-page";
import { OnboardingFlowNew } from "@/components/onboarding/onboarding-flow-new";
import { LoaderPhase1 } from "@/components/workspace/loader-phase1";
import { WorkspaceShellNew } from "@/components/workspace/workspace-shell-new";
import { HydrationFabric } from "@/components/hydration";

// Types
import type { Domain } from "@/components/workspace/workspace-config";

// ─── Error Boundary ──────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0C1222] text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-gray-400">
              Please refresh the page to try again.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left bg-black/30 p-3 rounded overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:opacity-90 min-h-[44px]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Workspace App (Core authenticated experience) ───────────
type WorkspaceStage = "login" | "signup" | "onboarding" | "loading" | "workspace";

function WorkspaceApp() {
  const spine = useSpine();
  const auth = useAuth();
  const [stage, setStage] = useState<WorkspaceStage>("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const [userName, setUserName] = useState("User");
  const [domain, setDomain] = useState<Domain>("CUSTOMER_SUCCESS");
  const [connectors, setConnectors] = useState<{
    crm?: string;
    task?: string;
    workspace?: string;
  }>({});

  // ── Wire API client with auth accessors (v3.5) ─────────────────────
  const apiInitialized = useRef(false);
  useEffect(() => {
    if (apiInitialized.current) return;
    apiInitialized.current = true;

    initApiClient({
      getAccessToken: () => auth.accessToken,
      getTenantId: () => {
        // Extract tenant_id from user metadata or default
        const tenantId = auth.user?.user_metadata?.tenant_id
          || auth.user?.app_metadata?.tenant_id
          || "default";
        return tenantId;
      },
      getViewContext: () => {
        // Build view context string: domain + active view
        const ctxMap: Record<string, string> = {
          CUSTOMER_SUCCESS: "CTX_CS", SALES: "CTX_SALES", REVOPS: "CTX_REVOPS",
          MARKETING: "CTX_MARKETING", PRODUCT_ENGINEERING: "CTX_PRODUCT",
          FINANCE: "CTX_FINANCE", SERVICE: "CTX_SERVICE", PROCUREMENT: "CTX_PROCUREMENT",
          IT_ADMIN: "CTX_IT", STUDENT_TEACHER: "CTX_EDUCATION",
          PERSONAL: "CTX_PERSONAL", BIZOPS: "CTX_BIZOPS",
        };
        return ctxMap[domain] || "CTX_BIZOPS";
      },
    });
    console.log("[WorkspaceApp] API client initialized with auth wiring");
  }, [auth.accessToken, auth.user, domain]);

  // Auto-detect authenticated session (OAuth callback or existing session)
  useEffect(() => {
    if (auth.loading) return;
    if (auth.user && stage === "login") {
      const displayName =
        auth.user.user_metadata?.name ||
        auth.user.user_metadata?.full_name ||
        auth.user.email?.split("@")[0] ||
        "User";
      setUserName(displayName);
      setStage("onboarding");
    }
  }, [auth.loading, auth.user, stage]);

  // Email/Password Login
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoginLoading(true);
      auth.clearError();
      const success = await auth.signIn(email, password);
      setLoginLoading(false);
      if (success) {
        const displayName = auth.user?.user_metadata?.name || email.split("@")[0] || "User";
        setUserName(displayName);
        setStage("onboarding");
      }
    },
    [auth],
  );

  // Email/Password Sign Up
  const handleSignUp = useCallback(
    async (name: string, email: string, password: string) => {
      setSignUpLoading(true);
      auth.clearError();
      const success = await auth.signUp(name, email, password);
      setSignUpLoading(false);
      if (success) {
        setUserName(name);
        setStage("onboarding");
      }
    },
    [auth],
  );

  // Google OAuth
  const handleGoogleAuth = useCallback(async () => {
    setGoogleLoading(true);
    auth.clearError();
    await auth.signInWithGoogle();
  }, [auth]);

  // GitHub OAuth
  const handleGitHubAuth = useCallback(async () => {
    setGithubLoading(true);
    auth.clearError();
    await auth.signInWithGitHub();
  }, [auth]);

  // Onboarding complete → Loader Phase 1
  const handleOnboardingComplete = useCallback(
    async (data: {
      userName: string;
      domain: Domain;
      connectors: { crm?: string; task?: string; workspace?: string };
      uploadedFiles?: File[];
      accelerator?: string;
    }) => {
      setUserName(data.userName || "User");
      setDomain(data.domain);
      setConnectors(data.connectors);

      // Initialize Spine with selected domain + connectors
      try {
        const ctxMap: Record<string, string> = {
          CUSTOMER_SUCCESS: "CTX_CS", SALES: "CTX_SALES", REVOPS: "CTX_REVOPS",
          MARKETING: "CTX_MARKETING", PRODUCT_ENGINEERING: "CTX_PRODUCT",
          FINANCE: "CTX_FINANCE", SERVICE: "CTX_SERVICE", PROCUREMENT: "CTX_PROCUREMENT",
          IT_ADMIN: "CTX_IT", STUDENT_TEACHER: "CTX_EDUCATION",
          PERSONAL: "CTX_PERSONAL", BIZOPS: "CTX_BIZOPS",
        };
        const connectedApps = Object.values(data.connectors).filter(Boolean) as string[];
        await spine.initialize({
          connectedApps,
          userName: data.userName,
          role: data.domain,
          orgType: "PRODUCT",
          activeCtx: (ctxMap[data.domain] || "CTX_BIZOPS") as any,
        });
      } catch (err) {
        console.error("[AppShell] Spine initialization error:", err);
      }

      setStage("loading");
    },
    [spine],
  );

  // Loader complete → Workspace
  const handleLoaderComplete = useCallback(() => {
    setStage("workspace");
  }, []);

  // Logout → back to login
  const handleLogout = useCallback(async () => {
    await auth.signOut();
    setStage("login");
    setUserName("User");
    setDomain("CUSTOMER_SUCCESS");
    setConnectors({});
  }, [auth]);

  // Auth loading screen
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-[#0C1222] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Restoring session...</p>
        </div>
      </div>
    );
  }

  // Render by stage
  switch (stage) {
    case "login":
      return (
        <LoginPage
          onLogin={handleLogin}
          onSignUp={() => { auth.clearError(); setStage("signup"); }}
          onForgotPassword={() => {}}
          onGoogleLogin={handleGoogleAuth}
          onGitHubLogin={handleGitHubAuth}
          error={auth.error}
          loading={loginLoading}
          googleLoading={googleLoading}
          githubLoading={githubLoading}
        />
      );
    case "signup":
      return (
        <SignUpPage
          onSignUp={handleSignUp}
          onGoToLogin={() => { auth.clearError(); setStage("login"); }}
          onGoogleSignUp={handleGoogleAuth}
          onGitHubSignUp={handleGitHubAuth}
          error={auth.error}
          loading={signUpLoading}
          googleLoading={googleLoading}
          githubLoading={githubLoading}
        />
      );
    case "onboarding":
      return (
        <OnboardingFlowNew
          onComplete={handleOnboardingComplete}
          initialUserName={userName !== "User" ? userName : undefined}
        />
      );
    case "loading":
      return (
        <LoaderPhase1
          domain={domain}
          connectors={connectors}
          onComplete={handleLoaderComplete}
        />
      );
    case "workspace":
      return (
        <GoalProvider initialOrgType="PRODUCT">
          <HydrationFabric
            initialContext={{
              domain,
              role: domain,
              userName,
              connectedApps: Object.values(connectors).filter(Boolean) as string[],
              tenantId: "t1",
            }}
          >
            <WorkspaceShellNew
              domain={domain}
              userName={userName}
              onLogout={handleLogout}
            />
          </HydrationFabric>
        </GoalProvider>
      );
  }
}

// ─── AppShell (exported as default for lazy loading) ─────────
export default function AppShell() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SpineProvider>
          <WorkspaceApp />
        </SpineProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
