import { useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   ANTI-GRAVITY CONFETTI CANVAS
   Inspired by Google Antigravity download page — colorful DASHES and
   small lines floating UPWARD on a clean white background.
   Light, playful, airy. Viewport-only rendering for performance.
   ═══════════════════════════════════════════════════════════════════════ */

interface Particle {
  x: number;
  y: number;
  length: number;
  width: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  shape: "dash" | "dot" | "line";
}

// Emerald-themed palette — greens, teals, with subtle warm accents
const COLORS = [
  "#059669", // emerald-600
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#6ee7b7", // emerald-300
  "#047857", // emerald-700
  "#14b8a6", // teal-500
  "#2dd4bf", // teal-400
  "#064e3b", // emerald-900
  "#0d9488", // teal-600
  "#a7f3d0", // emerald-200 (light accent)
];

const PARTICLE_COUNT = 55;

export function AntiGravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const initRef = useRef(false);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const shape = Math.random() < 0.65 ? "dash" : Math.random() < 0.7 ? "line" : "dot";
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: shape === "dot" ? 0 : Math.random() * 12 + 4, // dash/line length
        width: shape === "dot" ? Math.random() * 2.5 + 1 : Math.random() * 1.8 + 0.8,
        speedY: -(Math.random() * 0.3 + 0.06), // UPWARD — gentle
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.55 + 0.15,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        shape,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      // VIEWPORT ONLY — not full document height (performance fix)
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      if (!initRef.current) {
        initParticles(w, h);
        initRef.current = true;
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      if (!prefersReduced) {
        particlesRef.current.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotSpeed;

          // Wrap around
          if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;

          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.strokeStyle = p.color;

          if (p.shape === "dot") {
            // Small circle dot
            ctx.beginPath();
            ctx.arc(0, 0, p.width, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "dash") {
            // Rounded dash — the signature Antigravity look
            ctx.lineCap = "round";
            ctx.lineWidth = p.width;
            ctx.beginPath();
            ctx.moveTo(-p.length / 2, 0);
            ctx.lineTo(p.length / 2, 0);
            ctx.stroke();
          } else {
            // Thin line
            ctx.lineCap = "round";
            ctx.lineWidth = p.width * 0.6;
            ctx.beginPath();
            ctx.moveTo(-p.length / 2, 0);
            ctx.lineTo(p.length / 2, 0);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
