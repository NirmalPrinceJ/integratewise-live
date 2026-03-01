import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Home, ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <section className="py-32 text-center relative overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/10"
            style={{
              left: `${10 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 30}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🔍
          </motion.span>
        </motion.div>
        <motion.h1
          className="text-6xl md:text-8xl tracking-tight mb-4 text-primary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          This page doesn't exist.
        </motion.p>
        <motion.p
          className="text-sm text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          The page you're looking for may have been moved or doesn't exist. Let's get you back on track.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button size="lg">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </motion.div>
          </Link>
          <Link to="/platform">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button size="lg" variant="outline">
                Explore Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}