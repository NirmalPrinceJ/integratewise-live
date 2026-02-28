import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

const navLinks = [
  { to: "/platform", label: "Platform" },
  { to: "/who-its-for", label: "Who It's For" },
  { to: "/pricing", label: "Pricing" },
  { to: "/integrations", label: "Integrations" },
  { to: "/security", label: "Security" },
  { to: "/story", label: "Story" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
        }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo — left */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo className="h-7 sm:h-8 w-auto text-foreground" />
          <span className="text-foreground tracking-tight text-[17px] font-normal hidden sm:inline">
            Integrate<span className="opacity-35">Wise</span>
          </span>
        </Link>

        {/* Nav — center */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-[13px] transition-colors ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[1.5px] bg-foreground rounded-full"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA — right */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden md:inline-flex text-[13px] text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>

          {/* Dark pill CTA — Antigravity style */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              size="sm"
              className="rounded-full px-5 bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] text-[13px] shadow-sm"
              asChild
            >
              <a href="https://app.integratewise.com" target="_blank" rel="noopener noreferrer">
                Start Free
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </a>
            </Button>
          </motion.div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden border-t border-black/[0.04] bg-white/95 backdrop-blur-xl overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.to;
                return (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm transition-colors ${isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div className="pt-3 border-t border-black/[0.04] mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">Sign In</Button>
                <Button className="w-full mt-2 rounded-full bg-[#0a0a0a]" asChild>
                  <a href="https://app.integratewise.com" target="_blank" rel="noopener noreferrer">
                    Start Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
