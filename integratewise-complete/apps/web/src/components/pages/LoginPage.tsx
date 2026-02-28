import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Brain, Shield, Workflow, Lock, Cpu, Database, Network, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, register, loginWithOAuth, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLogin) {
            const success = await login(email, password);
            if (success) {
                navigate("/app/dashboard");
            }
        } else {
            const success = await register(email, password, name);
            if (success) {
                navigate("/app/dashboard");
            }
        }
    };

    const handleOAuth = async (provider: 'google' | 'github' | 'microsoft') => {
        await loginWithOAuth(provider);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
            {/* LEFT SIDE: Architecture & Technical Showcase */}
            <div className="md:w-[55%] lg:w-[60%] bg-[#0a0a0a] text-white p-8 lg:p-16 flex flex-col relative overflow-hidden hidden md:flex">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <motion.div
                        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-white/[0.05] to-transparent blur-3xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Back Link */}
                <div className="relative z-10 mb-12">
                    <Link to="/" className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl">
                    <Badge className="bg-white/10 text-white hover:bg-white/20 mb-6 w-fit border-white/5">
                        The Context Layer
                    </Badge>
                    <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                        Not another tool.<br />
                        <span className="text-white/50 italic font-normal">Your intelligence fabric.</span>
                    </h1>

                    <p className="text-lg text-white/50 mb-12 leading-relaxed">
                        IntegrateWise is built on a universal backend that connects your scattered data into a single context-aware layer. Powered by MCP (Model Context Protocol), it acts as the bridge between human intent and machine execution.
                    </p>

                    {/* Architecture Details */}
                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Brain className="w-5 h-5 text-white/70" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white/90 mb-1">AI-Native Architecture</h3>
                                <p className="text-sm text-white/40">Built with Model Context Protocol for seamless AI integration</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Shield className="w-5 h-5 text-white/70" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white/90 mb-1">Enterprise Security</h3>
                                <p className="text-sm text-white/40">Bank-grade encryption with regional data residency</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Workflow className="w-5 h-5 text-white/70" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white/90 mb-1">Universal Connectivity</h3>
                                <p className="text-sm text-white/40">200+ integrations with automatic schema adaptation</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <div className="grid grid-cols-3 gap-8">
                            <div>
                                <div className="text-3xl font-semibold text-white">200+</div>
                                <div className="text-sm text-white/40">Integrations</div>
                            </div>
                            <div>
                                <div className="text-3xl font-semibold text-white">&lt;200ms</div>
                                <div className="text-sm text-white/40">Response Time</div>
                            </div>
                            <div>
                                <div className="text-3xl font-semibold text-white">99.9%</div>
                                <div className="text-sm text-white/40">Uptime SLA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md mx-auto">
                    {/* Mobile Logo */}
                    <div className="md:hidden mb-12 flex justify-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Workflow className="h-6 w-6" />
                            <span className="font-semibold text-lg tracking-tight">IntegrateWise</span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight mb-2">
                            {isLogin ? "Welcome back" : "Create your workspace"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isLogin ? "Enter your credentials to access your context layer." : "Join thousands of users eliminating digital chaos."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="John Doe" 
                                    className="h-11"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="name@example.com" 
                                className="h-11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {isLogin && (
                                    <a href="#" className="text-sm text-gray-500 hover:text-black">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                className="h-11"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button 
                            type="submit"
                            className="w-full h-11 text-base bg-black hover:bg-black/90 text-white mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                isLogin ? "Sign in" : "Create account"
                            )}
                        </Button>
                    </form>

                    {/* OAuth Options */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuth('google')}
                                disabled={loading}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuth('github')}
                                disabled={loading}
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuth('microsoft')}
                                disabled={loading}
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-black font-medium hover:underline"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
