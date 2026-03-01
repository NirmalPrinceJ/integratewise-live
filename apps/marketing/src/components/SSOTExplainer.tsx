import { motion, useInView } from "motion/react";
import { useRef, useCallback, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FadeIn } from "./motion/AnimateIn";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   "WHAT YOU'RE MISSING RIGHT NOW"
   
   Pure curiosity + anxiety. Zero technical language.
   
   Rule: Don't explain HOW it works. Show WHAT CHANGES.
   Make them feel the cost of not having it.
   Make them desperate to see more.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Animated Canvas: "Right now, your tools are hiding things from each other" ── */
const DPR = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

function MissedSignalsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h) / 280;
    const cx = w / 2;
    const cy = h / 2;

    // Phase logic: 0-5s "signals missed", 5-8s "signals found", repeat
    const cycle = t % 10;
    const isMissed = cycle < 5;
    const isFound = cycle >= 6;
    const transitioning = cycle >= 5 && cycle < 6;
    const foundAlpha = transitioning ? (cycle - 5) : isFound ? 1 : 0;

    // Signal bubbles — things your tools know but YOU don't
    const signals = [
      { label: "Overdue invoice", sub: "from 3 weeks ago", x: -80, y: -50, color: "#dc2626" },
      { label: "Customer went quiet", sub: "no reply in 12 days", x: 75, y: -45, color: "#d97706" },
      { label: "Stock running low", sub: "reorder by Friday", x: -70, y: 50, color: "#7c3aed" },
      { label: "Team blocked", sub: "waiting on approval", x: 85, y: 55, color: "#0891b2" },
      { label: "Deal about to close", sub: "follow up today", x: 0, y: -72, color: "#059669" },
      { label: "Payment received", sub: "but not matched", x: -5, y: 72, color: "#db2777" },
    ];

    signals.forEach((sig, i) => {
      const float = Math.sin(t * 0.6 + i * 1.2) * 4 * s;
      const bx = cx + sig.x * s;
      const by = cy + sig.y * s + float;

      if (isMissed) {
        // Fading in and out — signals exist but are invisible/scattered
        const fadePhase = Math.sin(t * 0.8 + i * 1.5);
        const alpha = 0.12 + 0.15 * Math.max(0, fadePhase);

        ctx.save();
        ctx.globalAlpha = alpha;

        // Blurred bubble
        ctx.fillStyle = sig.color;
        ctx.beginPath();
        ctx.arc(bx, by, 18 * s, 0, Math.PI * 2);
        ctx.fill();

        // "?" overlay
        ctx.globalAlpha = alpha * 1.5;
        ctx.fillStyle = sig.color;
        ctx.font = `600 ${12 * s}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", bx, by);
        ctx.restore();
      } else {
        // Connected — signals become visible and clear
        const entryDelay = i * 0.12;
        const entryAlpha = Math.min(1, Math.max(0, (foundAlpha - entryDelay) * 3));

        ctx.save();
        ctx.globalAlpha = entryAlpha;

        // Clean pill background
        const pillW = 120 * s;
        const pillH = 30 * s;
        const pillX = bx - pillW / 2;
        const pillY = by - pillH / 2;

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const r = 8 * s;
        ctx.moveTo(pillX + r, pillY);
        ctx.lineTo(pillX + pillW - r, pillY);
        ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
        ctx.lineTo(pillX + pillW, pillY + pillH - r);
        ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH);
        ctx.lineTo(pillX + r, pillY + pillH);
        ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
        ctx.lineTo(pillX, pillY + r);
        ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Color accent dot
        ctx.fillStyle = sig.color;
        ctx.beginPath();
        ctx.arc(pillX + 10 * s, by, 3 * s, 0, Math.PI * 2);
        ctx.fill();

        // Label text
        ctx.fillStyle = "#0a0a0a";
        ctx.font = `500 ${6 * s}px system-ui`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(sig.label, pillX + 17 * s, by - 4 * s);

        ctx.fillStyle = "#999";
        ctx.font = `400 ${4.5 * s}px system-ui`;
        ctx.fillText(sig.sub, pillX + 17 * s, by + 5 * s);

        // Connection line to center
        ctx.strokeStyle = sig.color;
        ctx.globalAlpha = entryAlpha * 0.2;
        ctx.lineWidth = 1 * s;
        ctx.setLineDash([2 * s, 3 * s]);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }
    });

    // Center indicator
    if (isMissed) {
      // Pulsing red "blind spot"
      const pulse = 0.3 + 0.15 * Math.sin(t * 3);
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(cx, cy, 20 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = pulse * 2;
      ctx.fillStyle = "#fff";
      ctx.font = `600 ${8 * s}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("BLIND", cx, cy - 3 * s);
      ctx.font = `400 ${5 * s}px system-ui`;
      ctx.fillText("SPOT", cx, cy + 5 * s);
      ctx.restore();
    } else if (foundAlpha > 0) {
      // Green "all clear"
      ctx.save();
      ctx.globalAlpha = foundAlpha;
      ctx.fillStyle = "#059669";
      ctx.beginPath();
      ctx.arc(cx, cy, 18 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `600 ${10 * s}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✓", cx, cy + 1 * s);
      ctx.restore();
    }

    // Phase label
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = `500 ${7 * s}px system-ui`;
    if (isMissed) {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#dc2626";
      ctx.fillText("Right now — signals your tools are hiding from you", cx, h - 10 * s);
    } else if (isFound) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#059669";
      ctx.fillText("With IntegrateWise — nothing hides anymore", cx, h - 10 * s);
    }
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };
    resize();
    window.addEventListener("resize", resize);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const t = prefersReduced ? 7 : (now - startRef.current) / 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      ctx.scale(DPR, DPR);
      draw(ctx, t, canvas.width / DPR, canvas.height / DPR);
      ctx.restore();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

/* ── Anxiety-building vignettes ─────────────────────────────────────── */
const missedMoments = [
  {
    time: "Monday 9:14 AM",
    what: "Your biggest client's payment is 18 days overdue.",
    but: "Your sales team just sent them a cheerful upsell email.",
    cost: "They're insulted. You don't know for 3 more weeks.",
  },
  {
    time: "Tuesday 2:30 PM",
    what: "A support ticket mentions 'switching to competitor.'",
    but: "The account manager won't see this until the quarterly review.",
    cost: "By then, the contract is already cancelled.",
  },
  {
    time: "Wednesday 11:00 AM",
    what: "Your warehouse is running low on your best-selling product.",
    but: "Marketing just launched a promotion for that exact product.",
    cost: "200 orders. Zero stock. Refunds and angry reviews.",
  },
  {
    time: "Thursday 4:45 PM",
    what: "A developer has been stuck on a task for 14 hours.",
    but: "The project manager sees 'on track' because Jira says 'In Progress.'",
    cost: "The sprint fails. The client deadline slips. Trust erodes.",
  },
];

/* ── Main Section ──────────────────────────────────────────────────────── */
export function SSOTExplainer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const storiesRef = useRef<HTMLDivElement>(null);
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.1 });

  return (
    <section className="py-28 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        {/* ── THE ANXIETY ── */}
        <FadeIn className="text-center mb-6">
          <Badge variant="secondary" className="mb-4">What You Can't See Is Costing You</Badge>
        </FadeIn>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-[2.75rem] tracking-tight mb-4 text-center leading-[1.15]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          Right now, your billing knows something
          <br className="hidden md:block" />
          <span className="text-muted-foreground italic">your sales team doesn't.</span>
        </motion.h2>

        <motion.p
          className="text-center text-muted-foreground max-w-xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          Your email has a warning your dashboard can't see.
          Your chat app has context your CRM will never have.
          Every tool knows a piece. None of them talk.
        </motion.p>

        {/* ── THE VISUAL — missed signals → found signals ── */}
        <motion.div
          className="max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="rounded-2xl border bg-[#fafafa] shadow-sm overflow-hidden">
            <div className="aspect-[16/9]">
              <MissedSignalsCanvas />
            </div>
          </div>
        </motion.div>

        {/* ── MISSED MOMENTS — anxiety builders ── */}
        <div ref={storiesRef}>
          <FadeIn className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl tracking-tight mb-3">
              This Happened Last Week. You Just Don't Know It Yet.
            </h3>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-4">
            {missedMoments.map((moment, i) => (
              <motion.div
                key={moment.time}
                className="group relative p-5 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all cursor-default"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={storiesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider whitespace-nowrap pt-0.5 w-28 shrink-0">
                    {moment.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-1">{moment.what}</p>
                    <p className="text-[13px] text-muted-foreground mb-1">
                      <span className="text-amber-600">But:</span> {moment.but}
                    </p>
                    <p className="text-[12px] text-red-500/70">
                      {moment.cost}
                    </p>
                  </div>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-2"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── THE CURIOSITY GAP ── */}
        <motion.div
          className="max-w-2xl mx-auto mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={storiesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="border-l-4 border-foreground bg-white rounded-r-xl shadow-md px-8 py-6">
            <p className="text-lg tracking-tight mb-2">
              What if you could see all of this — <em className="text-muted-foreground">before it became a problem?</em>
            </p>
            <p className="text-sm text-muted-foreground">
              Not by checking more dashboards. Not by hiring more people.
              <br />
              By letting your tools finally <strong className="text-foreground">see each other.</strong>
            </p>
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={storiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <Link to="/platform">
              <Button variant="outline" className="rounded-full">
                Show Me How
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
