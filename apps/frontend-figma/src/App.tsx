import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import faviconSrc from "figma:asset/bcaf13c3a18bdb4dbfd3ccee1dd81293eb966a9a.png";

// ── Error Boundary ──
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
              The application encountered an error. Please refresh the page to try again.
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

// ── Auth ──
import { LoginPage } from "./components/auth/login-page";
import { SignUpPage } from "./components/auth/signup-page";
import { AuthProvider, useAuth } from "./components/auth/auth-provider";

// ── NEW ARCHITECTURE ──
import {
  SpineProvider,
  useSpine,
} from "./components/spine/spine-client";
import { GoalProvider } from "./components/goal-framework/goal-context";
import { OnboardingFlowNew } from "./components/onboarding/onboarding-flow-new";
import { LoaderPhase1 } from "./components/workspace/loader-phase1";
import { WorkspaceShellNew } from "./components/workspace/workspace-shell-new";
import type { Domain } from "./components/workspace/workspace-config";
import { HydrationFabric } from "./components/hydration";

// ─── Workspace App ──────────────────────────────────────────────────────────

type WorkspaceStage = "login" | "signup" | "onboarding" | "loading" | "workspace";

function WorkspaceApp() {
  const spine = useSpine();
  const auth = useAuth();
  const [stage, setStage] = useState<WorkspaceStage>("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // New architecture state
  const [userName, setUserName] = useState("User");
  const [domain, setDomain] = useState<Domain>("CUSTOMER_SUCCESS");
  const [connectors, setConnectors] = useState<{
    crm?: string;
    task?: string;
    workspace?: string;
  }>({});

  // ── Auto-detect authenticated session (OAuth callback or existing session) ──
  useEffect(() => {
    if (auth.loading) return;
    if (auth.user && stage === "login") {
      // User is authenticated — extract name and proceed to onboarding
      const displayName =
        auth.user.user_metadata?.name ||
        auth.user.user_metadata?.full_name ||
        auth.user.email?.split("@")[0] ||
        "User";
      setUserName(displayName);
      console.log("[WorkspaceApp] Authenticated user detected, proceeding to onboarding:", displayName);
      setStage("onboarding");
    }
  }, [auth.loading, auth.user, stage]);

  // ── Email/Password Login ──
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoginLoading(true);
      auth.clearError();
      const success = await auth.signIn(email, password);
      setLoginLoading(false);
      if (success) {
        const displayName =
          auth.user?.user_metadata?.name ||
          email.split("@")[0] ||
          "User";
        setUserName(displayName);
        setStage("onboarding");
      }
    },
    [auth],
  );

  // ── Email/Password Sign Up ──
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

  // ── Google OAuth ──
  const handleGoogleAuth = useCallback(async () => {
    setGoogleLoading(true);
    auth.clearError();
    await auth.signInWithGoogle();
    // Browser will redirect — loading state stays until redirect happens
  }, [auth]);

  // NEW: Onboarding outputs domain + connectors → Loader Phase 1
  const handleOnboardingComplete = useCallback(
    async (data: {
      userName: string;
      domain: Domain;
      connectors: {
        crm?: string;
        task?: string;
        workspace?: string;
      };
      uploadedFiles?: File[];
      accelerator?: string;
    }) => {
      setUserName(data.userName || "User");
      setDomain(data.domain);
      setConnectors(data.connectors);

      // Initialize spine with the new architecture data
      try {
        // Map domain to old CTX format for spine compatibility
        const ctxMap: Record<string, string> = {
          CUSTOMER_SUCCESS: "CTX_CS",
          SALES: "CTX_SALES",
          REVOPS: "CTX_REVOPS",
          MARKETING: "CTX_MARKETING",
          PRODUCT_ENGINEERING: "CTX_PRODUCT",
          FINANCE: "CTX_FINANCE",
          SERVICE: "CTX_SERVICE",
          PROCUREMENT: "CTX_PROCUREMENT",
          IT_ADMIN: "CTX_IT",
          STUDENT_TEACHER: "CTX_EDUCATION",
          PERSONAL: "CTX_PERSONAL",
          BIZOPS: "CTX_BIZOPS",
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
        console.error("[WorkspaceApp] Spine initialization error:", err);
      }

      // Transition to loader
      setStage("loading");
    },
    [spine],
  );

  // Loader Phase 1 complete → Workspace
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

  // ── Auth loading screen ──
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

  // ── Render Stage ──
  switch (stage) {
    case "login":
      return (
        <LoginPage
          onLogin={handleLogin}
          onSignUp={() => {
            auth.clearError();
            setStage("signup");
          }}
          onForgotPassword={() => {}}
          onGoogleLogin={handleGoogleAuth}
          error={auth.error}
          loading={loginLoading}
          googleLoading={googleLoading}
        />
      );

    case "signup":
      return (
        <SignUpPage
          onSignUp={handleSignUp}
          onGoToLogin={() => {
            auth.clearError();
            setStage("login");
          }}
          onGoogleSignUp={handleGoogleAuth}
          error={auth.error}
          loading={signUpLoading}
          googleLoading={googleLoading}
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

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  // Set favicon
  useEffect(() => {
    const link =
      (document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement) || document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = faviconSrc;
    document.head.appendChild(link);
  }, []);

  // ── Detect OAuth callback ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // PKCE flow returns ?code=xxx after OAuth
    if (params.has("code")) {
      console.log("[App] OAuth callback detected (PKCE code)");
    }
    // Implicit flow fallback: check for access_token in hash
    if (window.location.hash.includes("access_token=")) {
      console.log("[App] OAuth callback detected (implicit token in hash)");
    }
  }, []);

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