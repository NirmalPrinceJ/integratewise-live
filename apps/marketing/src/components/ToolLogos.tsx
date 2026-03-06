import { motion, useInView } from "motion/react";
import { useRef, useEffect } from "react";

/* ─── Real SVG Company Logos (Full Color) ────────────────────────────── */

export function TallyLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#E4002B" />
      <path d="M12 12h16v3H22v13h-4V15h-6v-3z" fill="white" />
    </svg>
  );
}

export function ZohoLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#C8202B" />
      <path d="M8 16l6-4h6l-6 4H8zm0 2l6 4h6l-6-4H8z" fill="#FFE512" />
      <path d="M20 12h6l-6 8h-6l6-8zm0 10h6l-6 8h-6l6-8z" fill="white" />
    </svg>
  );
}

export function WhatsAppLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#25D366" />
      <path d="M20 8c-6.627 0-12 5.373-12 12 0 2.12.553 4.112 1.52 5.84L8 32l6.34-1.48A11.94 11.94 0 0020 32c6.627 0 12-5.373 12-12S26.627 8 20 8z" fill="white" />
      <path d="M20 10.4c-5.302 0-9.6 4.298-9.6 9.6 0 1.818.51 3.513 1.392 4.96l-.912 3.36 3.456-.888A9.543 9.543 0 0020 29.6c5.302 0 9.6-4.298 9.6-9.6s-4.298-9.6-9.6-9.6z" fill="#25D366" />
      <path d="M16.4 14.8c-.24-.56-.48-.56-.68-.56h-.56c-.2 0-.52.08-.8.4-.28.32-1.04 1.04-1.04 2.52s1.08 2.92 1.2 3.12c.16.2 2.08 3.32 5.12 4.52 2.52 1 3.04.8 3.6.72.56-.04 1.8-.72 2.04-1.44.24-.72.24-1.32.16-1.44-.08-.12-.28-.2-.56-.36-.28-.16-1.68-.84-1.92-.92-.28-.12-.48-.16-.68.16-.2.32-.76.92-.92 1.12-.16.2-.36.2-.6.08-.28-.16-1.2-.44-2.24-1.4-.84-.76-1.4-1.68-1.56-1.96-.16-.28 0-.44.12-.56.12-.12.28-.32.4-.48.12-.16.16-.28.24-.48.08-.2.04-.36-.04-.48-.04-.16-.68-1.68-.92-2.28z" fill="white" />
    </svg>
  );
}

export function RazorpayLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#072654" />
      <path d="M14.5 10L24 30h-4.5L10 10h4.5z" fill="#3395FF" />
      <path d="M19 10L28.5 30H24L14.5 10H19z" fill="white" />
    </svg>
  );
}

export function FreshworksLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#F36D25" />
      <circle cx="20" cy="17" r="5" fill="white" />
      <path d="M12 28c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="white" fillOpacity="0.8" />
      <path d="M20 12c1.5-2 4-2 5 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ShopifyLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#95BF47" />
      <path d="M25 11c0 0-.5 0-1 .5s-.5 1-.5 1l-3 13 7-2-2.5-12.5z" fill="white" />
      <path d="M23.5 12.5L21 13l-2 1 1 13 3.5-1.5-2-13z" fill="white" fillOpacity="0.85" />
      <path d="M19 14s-1-1-2.5-1c-2 0-2.5 1.25-2.5 2 0 2.2 3 2.5 3 4.5 0 1.8-1.5 3-3.5 3s-3-1-3-1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function GoogleSheetsLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#0F9D58" />
      <path d="M11 9h12l6 6v16a2 2 0 01-2 2H11a2 2 0 01-2-2V11a2 2 0 012-2z" fill="white" />
      <path d="M23 9v6h6" fill="#0F9D58" fillOpacity="0.3" />
      <rect x="13" y="17" width="5" height="3" rx="0.5" fill="#0F9D58" />
      <rect x="20" y="17" width="5" height="3" rx="0.5" fill="#0F9D58" />
      <rect x="13" y="22" width="5" height="3" rx="0.5" fill="#0F9D58" />
      <rect x="20" y="22" width="5" height="3" rx="0.5" fill="#0F9D58" />
      <rect x="13" y="27" width="5" height="3" rx="0.5" fill="#0F9D58" />
      <rect x="20" y="27" width="5" height="3" rx="0.5" fill="#0F9D58" />
    </svg>
  );
}

export function MSTeamsLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#5B5FC7" />
      <circle cx="26" cy="14" r="4" fill="white" fillOpacity="0.6" />
      <circle cx="20" cy="16" r="5" fill="white" />
      <path d="M10 30c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="white" fillOpacity="0.7" />
      <path d="M26 18c3 0 6 2.686 6 6v4h-5" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

/* ─── NEW: Global SaaS Tool Logos ────────────────────────────────────── */

export function JiraLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#0052CC" />
      <path d="M28.8 11.2L20 20l-8.8-8.8a1.2 1.2 0 000 1.7L20 21.7l8.8-8.8a1.2 1.2 0 000-1.7z" fill="#2684FF" />
      <path d="M20 18.3l-8.8 8.8a1.2 1.2 0 001.7 1.7L20 21.7l7.1 7.1a1.2 1.2 0 001.7-1.7L20 18.3z" fill="white" />
      <path d="M20 18.3l-8.8 8.8a1.2 1.2 0 001.7 1.7L20 21.7" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

export function SlackLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#4A154B" />
      <rect x="10" y="18" width="8" height="3" rx="1.5" fill="#E01E5A" />
      <rect x="19" y="18" width="3" height="8" rx="1.5" fill="#E01E5A" />
      <rect x="22" y="10" width="8" height="3" rx="1.5" fill="#36C5F0" />
      <rect x="19" y="10" width="3" height="8" rx="1.5" fill="#36C5F0" />
      <rect x="22" y="27" width="8" height="3" rx="1.5" fill="#2EB67D" />
      <rect x="27" y="18" width="3" height="9" rx="1.5" fill="#2EB67D" />
      <rect x="10" y="10" width="8" height="3" rx="1.5" fill="#ECB22E" />
      <rect x="10" y="13" width="3" height="8" rx="1.5" fill="#ECB22E" />
    </svg>
  );
}

export function TogglLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#E57CD8" />
      <circle cx="20" cy="20" r="9" stroke="white" strokeWidth="2.5" fill="none" />
      <path d="M20 14v6l4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function GitHubLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#24292F" />
      <path d="M20 8C13.373 8 8 13.373 8 20c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0120 13.027c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C28.566 29.797 32 25.3 32 20c0-6.627-5.373-12-12-12z" fill="white" />
    </svg>
  );
}

export function StripeLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#635BFF" />
      <path d="M18.5 15.2c0-.97.8-1.35 2.1-1.35 1.88 0 4.25.57 6.13 1.59V10.2c-2.05-.81-4.08-1.13-6.13-1.13-5.01 0-8.35 2.62-8.35 7 0 6.83 9.4 5.74 9.4 8.68 0 1.15-1 1.52-2.4 1.52-2.07 0-4.72-.85-6.82-2V29.5c2.32 1 4.67 1.43 6.82 1.43 5.13 0 8.66-2.54 8.66-6.99-.02-7.38-9.41-6.06-9.41-8.74z" fill="white" />
    </svg>
  );
}

export function SalesforceLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#00A1E0" />
      <path d="M16 13c1.7-1.8 4-2.8 6.5-2.8 3.3 0 6.2 1.8 7.8 4.5 1.4-.6 3-.9 4.6-.9.3 0 .5 0 .8.05C34.1 15 32.4 16 31 17.5c.3.8.5 1.7.5 2.6 0 4-3.2 7.2-7.2 7.2-.7 0-1.4-.1-2-.3C21 29 18.8 30 16.5 30c-2.7 0-5.1-1.3-6.6-3.3-.5.1-1 .2-1.5.2-3.3 0-5.9-2.7-5.9-5.9 0-2.3 1.3-4.3 3.2-5.3-.2-.7-.3-1.5-.3-2.2C5.4 9.7 8.6 6.5 12.4 6.5c1.4 0 2.7.4 3.8 1.1" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

export function HubSpotLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#FF7A59" />
      <circle cx="24" cy="20" r="5" fill="white" />
      <circle cx="24" cy="20" r="2.5" fill="#FF7A59" />
      <rect x="14" y="12" width="3" height="11" rx="1.5" fill="white" />
      <line x1="17" y1="18" x2="19" y2="20" stroke="white" strokeWidth="2" />
      <circle cx="28" cy="28" r="2" fill="white" />
      <line x1="26.5" y1="24" x2="28" y2="26.5" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

export function ZendeskLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#03363D" />
      <path d="M18 12v16L8 12h10zm4 16V12l10 16H22z" fill="white" />
    </svg>
  );
}

export function QuickBooksLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#2CA01C" />
      <circle cx="20" cy="20" r="10" fill="white" />
      <path d="M15 15v10l3-2V17h4c1.1 0 2 .9 2 2s-.9 2-2 2h-1v3h1c2.76 0 5-2.24 5-5s-2.24-5-5-5h-7z" fill="#2CA01C" />
    </svg>
  );
}

export function XeroLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#13B5EA" />
      <path d="M12 12l8 8m0-8l-8 8" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="20" r="4" stroke="white" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function ZohoBookLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#1B9AD4" />
      <path d="M10 14h20v2H10zm0 5h20v2H10zm0 5h14v2H10z" fill="white" />
      <circle cx="28" cy="27" r="4" fill="white" fillOpacity="0.8" />
      <path d="M26.5 27l1 1 2-2" stroke="#1B9AD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExcelLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#217346" />
      <path d="M11 9h12l6 6v16a2 2 0 01-2 2H11a2 2 0 01-2-2V11a2 2 0 012-2z" fill="white" />
      <path d="M23 9v6h6" fill="#217346" fillOpacity="0.3" />
      <path d="M14 18l4 4m0-4l-4 4" stroke="#217346" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 18l4 4m0-4l-4 4" stroke="#217346" strokeWidth="2" strokeLinecap="round" />
      <rect x="13" y="26" width="5" height="2" rx="0.5" fill="#217346" />
      <rect x="20" y="26" width="5" height="2" rx="0.5" fill="#217346" />
    </svg>
  );
}

export function APILogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#0F172A" />
      <path d="M16 12l-4 8 4 8m8-16l4 8-4 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="14" x2="22" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const logoMap: Record<string, React.FC<{ size?: number }>> = {
  QuickBooks: QuickBooksLogo,
  Salesforce: SalesforceLogo,
  WhatsApp: WhatsAppLogo,
  Stripe: StripeLogo,
  Freshworks: FreshworksLogo,
  Shopify: ShopifyLogo,
  "Google Sheets": GoogleSheetsLogo,
  "MS Teams": MSTeamsLogo,
  Jira: JiraLogo,
  Slack: SlackLogo,
  Toggl: TogglLogo,
  GitHub: GitHubLogo,
  HubSpot: HubSpotLogo,
  Zendesk: ZendeskLogo,
  Xero: XeroLogo,
  Excel: ExcelLogo,
  API: APILogo,
};

/* ─── Animated Logo Marquee (HTML5 CSS Keyframes) ────────────────────── */
export function ToolLogoBar() {
  const tools = ["QuickBooks", "Salesforce", "WhatsApp", "Slack", "Jira", "Stripe", "Shopify", "HubSpot", "GitHub", "Zendesk", "Google Sheets", "MS Teams", "Xero"];
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-marquee {
          animation: marquee 30s linear infinite;
        }
        .logo-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="logo-marquee flex items-center gap-12 md:gap-16 w-max" style={{ opacity: isInView ? 1 : 0, transition: "opacity 0.8s" }}>
        {[...tools, ...tools].map((tool, i) => {
          const LogoComponent = logoMap[tool];
          return (
            <div key={`${tool}-${i}`} className="flex flex-col items-center gap-2 group cursor-default shrink-0">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                {LogoComponent && <LogoComponent size={36} />}
              </div>
              <span className="text-xs text-muted-foreground/60 group-hover:text-foreground transition-colors whitespace-nowrap">
                {tool}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Static Grid for Platform page ──────────────────────────────────── */
export function ToolLogoGrid() {
  const tools = ["QuickBooks", "Salesforce", "WhatsApp", "Slack", "Jira", "Stripe", "Shopify", "HubSpot", "GitHub", "Zendesk", "Google Sheets", "MS Teams", "Freshworks", "Xero"];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
      {tools.map((tool, i) => {
        const LogoComponent = logoMap[tool];
        return (
          <motion.div
            key={tool}
            className="flex flex-col items-center gap-2 group cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -3 }}
          >
            <motion.div
              whileHover={{ scale: 1.12, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {LogoComponent && <LogoComponent size={36} />}
            </motion.div>
            <span className="text-xs text-muted-foreground/60 group-hover:text-foreground transition-colors whitespace-nowrap">
              {tool}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Canvas-based Data Flow Animation for Hero ──────────────────────── */
export function DataFlowCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function initParticles(W: number, H: number) {
      const particles: typeof particlesRef.current = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 0.3 + 0.1,
          r: Math.random() * 2 + 0.5,
          life: Math.random() * 200,
          maxLife: 200 + Math.random() * 100,
        });
      }
      particlesRef.current = particles;
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      const ctx = canvas!.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;
      const rect = canvas!.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life > p.maxLife || p.y > H || p.x < 0 || p.x > W) {
          p.x = Math.random() * W;
          p.y = -5;
          p.life = 0;
        }

        const alpha = Math.min(1, p.life / 30) * Math.max(0, 1 - p.life / p.maxLife) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fill();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}