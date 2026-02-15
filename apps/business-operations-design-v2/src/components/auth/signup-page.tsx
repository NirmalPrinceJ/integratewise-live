import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, CheckCircle2, Shield, Zap, Database, Brain } from "lucide-react";
import { Logo } from "../landing/logo";

interface SignUpPageProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onGoToLogin: () => void;
  onSocialSignUp?: () => void;
  error?: string;
  loading?: boolean;
}

const VALUE_PROPS = [
  { icon: Database, label: "Unified Data Spine", desc: "All your tools, one truth" },
  { icon: Brain, label: "AI Intelligence Loop", desc: "From reality to action" },
  { icon: Shield, label: "Governance Built-in", desc: "Human-in-the-loop always" },
  { icon: Zap, label: "Instant Integrations", desc: "40+ connectors, 2 min setup" },
];

export function SignUpPage({ onSignUp, onGoToLogin, onSocialSignUp, error, loading }: SignUpPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationError, setValidationError] = useState("");

  const passwordStrength = (() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
    if (score <= 3) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-emerald-500" };
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setValidationError("Please agree to the terms & conditions.");
      return;
    }

    onSignUp(fullName.trim(), email, password);
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex bg-[#0C1222]">
      {/* Left — Brand Panel (different from Login) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-gradient-to-br from-[#0C1222] via-[#131B2E] to-[#1E293B] flex-col justify-between p-10 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Logo width={36} />
            <span className="text-xl font-bold text-white">
              Integrate<span className="text-white/70">Wise</span>
            </span>
          </div>
          <p className="text-white/40 text-xs">Integration Intelligence Workspace</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-2">
              Start building your<br />
              <span className="text-[#F54476]">Intelligence Spine.</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Join 500+ B2B teams who replaced spreadsheet chaos with a single source of truth — powered by AI, governed by humans.
            </p>
          </div>

          {/* Value props */}
          <div className="space-y-3">
            {VALUE_PROPS.map((vp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <vp.icon className="w-4 h-4 text-white/80" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{vp.label}</div>
                  <div className="text-[10px] text-white/40">{vp.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/30 text-[10px]">
          &copy; 2026 IntegrateWise. All rights reserved.
        </div>
      </div>

      {/* Right — Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#131B2E]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl shadow-black/20"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Logo width={32} />
            <span className="text-lg font-bold text-[#0F172A]">
              Integrate<span className="text-sky-500">Wise</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Create your account</h1>
            <p className="text-sm text-slate-500">Start your 14-day free trial — no credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength.score ? passwordStrength.color : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{passwordStrength.label}</div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full bg-white border rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-300 focus:border-red-400"
                      : confirmPassword && confirmPassword === password
                        ? "border-emerald-300 focus:border-emerald-400"
                        : "border-slate-200 focus:border-sky-500"
                  }`}
                  required
                />
                {confirmPassword && confirmPassword === password && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to the{" "}
                <span className="text-sky-500 font-medium hover:underline">Terms of Service</span>
                {" "}and{" "}
                <span className="text-sky-500 font-medium hover:underline">Privacy Policy</span>
              </span>
            </label>

            {/* Error */}
            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                {displayError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F54476] hover:bg-[#E03A68] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#F54476]/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">or sign up with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSocialSignUp ? onSocialSignUp() : onSignUp("Demo User", "demo@integratewise.com", "demo1234")}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-2 text-sm font-medium hover:bg-slate-50 transition-all"
            >
              <span className="text-lg">G</span> Google
            </button>
            <button
              type="button"
              onClick={() => onSocialSignUp ? onSocialSignUp() : onSignUp("Demo User", "demo@integratewise.com", "demo1234")}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-2 text-sm font-medium hover:bg-slate-50 transition-all"
            >
              <span className="text-lg">🔑</span> SSO
            </button>
          </div>

          {/* Login */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <button onClick={onGoToLogin} className="text-sky-500 font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}