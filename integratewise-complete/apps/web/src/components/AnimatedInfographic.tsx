import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface InfographicProps {
  title: string;
  description: string;
  stats?: { label: string; value: string; color?: string }[];
  reverse?: boolean;
  illustration: React.ReactNode;
}

export function AnimatedInfographic({
  title,
  description,
  stats,
  reverse = false,
  illustration,
}: InfographicProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Illustration Side */}
      <motion.div
        className={`relative ${reverse ? "lg:order-2" : ""}`}
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <motion.div
            initial={{ scale: 1.05 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-video flex items-center justify-center p-8"
          >
            {illustration}
          </motion.div>

          {/* Floating Stats Badges */}
          {stats && (
            <>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="absolute bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border"
                  style={{
                    top: `${20 + i * 30}%`,
                    left: i % 2 === 0 ? "8%" : "auto",
                    right: i % 2 === 1 ? "8%" : "auto",
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: {
                            delay: 0.5 + i * 0.15,
                            type: "spring",
                            stiffness: 200,
                          },
                        }
                      : {}
                  }
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <div
                    className="text-2xl font-semibold mb-0.5"
                    style={{ color: stat.color || "currentColor" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-foreground/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>

      {/* Content Side */}
      <motion.div
        className={reverse ? "lg:order-1" : ""}
        initial={{ opacity: 0, x: reverse ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <motion.h3
          className="text-2xl md:text-3xl tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
}

/* Video Player Component with Animated Thumbnail */
interface VideoPlayerProps {
  title: string;
  duration?: string;
  thumbnail: React.ReactNode;
}

export function VideoPlayer({
  title,
  duration = "3:00",
  thumbnail,
}: VideoPlayerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden shadow-2xl border cursor-pointer group bg-muted/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        {thumbnail}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Play Button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <svg
              className="w-8 h-8 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>

        {/* Duration Badge */}
        <motion.div
          className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          {duration}
        </motion.div>

        {/* Title Overlay */}
        <motion.div
          className="absolute bottom-4 left-4 right-20"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-white font-semibold drop-shadow-lg">{title}</h4>
        </motion.div>
      </div>

      {/* Animated Border Glow */}
      
    </motion.div>
  );
}

/* Real-Time Data Counter Animation */
interface DataCounterProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  color?: string;
}

export function DataCounter({
  value,
  label,
  icon,
  trend,
  color = "currentColor",
}: DataCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {icon && (
        <motion.div
          className="p-3 rounded-lg bg-muted"
          style={{ color }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
      )}
      <div className="flex-1">
        <motion.div
          className="text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {value}
          {trend && (
            <motion.span
              className={`ml-2 text-sm ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              {trend === "up" ? "↑" : "↓"}
            </motion.span>
          )}
        </motion.div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>

      {/* Pulse Animation for Live Data */}
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.6, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}