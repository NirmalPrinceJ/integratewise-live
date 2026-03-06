import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

/* ═══════════════════════════════════════════════════════════════════════
   HTML5 Canvas — Cognitive HTTL (Human-in-the-Loop) Process Diagram
   Shows: Observe → Think → Suggest → Human Approves → Execute → Evidence → Learn → Repeat
   ═══════════════════════════════════════════════════════════════════════ */

const STAGES = [
  { id: "observe", label: "Observe", sub: "Data enters from all tools", emoji: "👁" },
  { id: "think", label: "Think", sub: "AI finds context & patterns", emoji: "🧠" },
  { id: "suggest", label: "Suggest", sub: "Recommendation prepared", emoji: "💡" },
  { id: "approve", label: "Human Approves", sub: "You review & confirm", emoji: "✋" },
  { id: "execute", label: "Execute", sub: "Action runs automatically", emoji: "⚡" },
  { id: "evidence", label: "Evidence", sub: "Results + audit trail shown", emoji: "📋" },
  { id: "learn", label: "Learn", sub: "System adjusts & improves", emoji: "🔄" },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function CognitiveLoopCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const animRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const cx = W / 2;
    const cy = H / 2;
    const N = STAGES.length;

    // Ellipse radii
    const rx = Math.min(W * 0.38, 320);
    const ry = Math.min(H * 0.35, 180);

    // Calculate node positions on ellipse
    function getNodePos(i: number) {
      const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
      return {
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        angle,
      };
    }

    // Particle trails
    const particles: {
      x: number;
      y: number;
      life: number;
      maxLife: number;
      size: number;
    }[] = [];

    startTime.current = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      const elapsed = (now - startTime.current) / 1000;
      ctx.clearRect(0, 0, W, H);

      // Cycle duration per stage
      const cycleDuration = 2.2;
      const totalCycle = cycleDuration * N;
      const loopTime = elapsed % totalCycle;
      const currentStage = Math.floor(loopTime / cycleDuration);
      const stageProgress = (loopTime % cycleDuration) / cycleDuration;

      // Update active stage for the overlay text
      setActiveStage(currentStage % N);

      // Draw the ellipse path (dashed)
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw progress arc on the ellipse
      const progressAngle =
        -Math.PI / 2 +
        ((currentStage + stageProgress) / N) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, progressAngle);
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw connector lines between nodes
      for (let i = 0; i < N; i++) {
        const from = getNodePos(i);
        const to = getNodePos((i + 1) % N);
        const isPast = i < currentStage;
        const isCurrent = i === currentStage;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);

        // Curved connector via midpoint offset
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        ctx.lineTo(midX, midY);
        ctx.lineTo(to.x, to.y);

        ctx.strokeStyle =
          isPast || isCurrent
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0.05)";
        ctx.lineWidth = isCurrent ? 2 : 1;
        ctx.stroke();

        // Arrow head on connector
        if (isPast || isCurrent) {
          const arrowSize = 5;
          const angle = Math.atan2(to.y - midY, to.x - midX);
          const ax = midX + (to.x - midX) * 0.5;
          const ay = midY + (to.y - midY) * 0.5;
          ctx.beginPath();
          ctx.moveTo(
            ax + arrowSize * Math.cos(angle - 0.4),
            ay + arrowSize * Math.sin(angle - 0.4)
          );
          ctx.lineTo(ax, ay);
          ctx.lineTo(
            ax + arrowSize * Math.cos(angle + 0.4),
            ay + arrowSize * Math.sin(angle + 0.4)
          );
          ctx.strokeStyle = "rgba(0,0,0,0.25)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (let i = 0; i < N; i++) {
        const { x, y } = getNodePos(i);
        const isActive = i === currentStage;
        const isPast = i < currentStage;
        const stage = STAGES[i];

        const nodeW = isActive ? 110 : 90;
        const nodeH = isActive ? 58 : 48;

        // Node background
        ctx.save();
        drawRoundedRect(ctx, x - nodeW / 2, y - nodeH / 2, nodeW, nodeH, 12);
        if (isActive) {
          ctx.fillStyle = "#0a0a0a";
          ctx.fill();

          // Pulsing glow ring
          const pulse = Math.sin(elapsed * 3) * 0.3 + 0.5;
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 15 + pulse * 10;
          drawRoundedRect(
            ctx,
            x - nodeW / 2 - 3,
            y - nodeH / 2 - 3,
            nodeW + 6,
            nodeH + 6,
            14
          );
          ctx.strokeStyle = `rgba(0,0,0,${0.15 + pulse * 0.15})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        } else {
          ctx.fillStyle = isPast ? "#f4f4f5" : "#fafafa";
          ctx.fill();
          ctx.strokeStyle = isPast ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.08)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        // Emoji
        ctx.font = isActive ? "18px sans-serif" : "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(stage.emoji, x, y - (isActive ? 10 : 6));

        // Label
        ctx.font = `${isActive ? 600 : 400} ${
          isActive ? 11 : 10
        }px Inter, system-ui, sans-serif`;
        ctx.fillStyle = isActive ? "#ffffff" : isPast ? "#0a0a0a" : "#71717a";
        ctx.fillText(stage.label, x, y + (isActive ? 10 : 10));

        // "HUMAN" badge on approve stage
        if (i === 3) {
          const badgeW = 48;
          const badgeH = 16;
          const bx = x + nodeW / 2 - 8;
          const by = y - nodeH / 2 - 6;
          drawRoundedRect(ctx, bx - badgeW / 2, by - badgeH / 2, badgeW, badgeH, 4);
          ctx.fillStyle = isActive ? "#ffffff" : "#0a0a0a";
          ctx.fill();
          ctx.font = "600 8px Inter, system-ui, sans-serif";
          ctx.fillStyle = isActive ? "#0a0a0a" : "#ffffff";
          ctx.fillText("HUMAN", bx, by + 1);
        }
      }

      // Traveling data dot
      const dotAngle =
        -Math.PI / 2 +
        ((currentStage + stageProgress) / N) * Math.PI * 2;
      const dotX = cx + rx * Math.cos(dotAngle);
      const dotY = cy + ry * Math.sin(dotAngle);

      // Dot trail particles
      if (Math.random() < 0.4) {
        particles.push({
          x: dotX + (Math.random() - 0.5) * 4,
          y: dotY + (Math.random() - 0.5) * 4,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          size: 1 + Math.random() * 2,
        });
      }

      // Draw particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const part = particles[p];
        part.life++;
        if (part.life > part.maxLife) {
          particles.splice(p, 1);
          continue;
        }
        const alpha = 1 - part.life / part.maxLife;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,10,10,${alpha * 0.3})`;
        ctx.fill();
      }

      // Main traveling dot
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0a0a";
      ctx.fill();

      // Dot glow
      const grad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14);
      grad.addColorStop(0, "rgba(10,10,10,0.2)");
      grad.addColorStop(1, "rgba(10,10,10,0)");
      ctx.beginPath();
      ctx.arc(dotX, dotY, 14, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Center label
      ctx.font = "500 13px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#0a0a0a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Cognitive", cx, cy - 14);
      ctx.fillText("Loop", cx, cy + 2);

      ctx.font = "400 9px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#71717a";
      ctx.fillText("Human-in-the-Loop", cx, cy + 20);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isInView]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: "min(460px, 55vw)" }}
        />

        {/* Active stage description overlay */}
        <motion.div
          key={activeStage}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border rounded-xl px-5 py-3 shadow-lg max-w-xs text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs text-muted-foreground">
            Stage {activeStage + 1} of {STAGES.length}
          </p>
          <p className="text-sm mt-0.5">{STAGES[activeStage].sub}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}