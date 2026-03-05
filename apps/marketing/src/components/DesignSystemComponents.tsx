import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Check, X } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   COMPARISON CARDS - "Without Spine" vs "With Spine"
   Based on Figma Design System patterns
   ═══════════════════════════════════════════════════════════════════════ */

interface ComparisonCardsProps {
  withoutTitle?: string;
  withTitle?: string;
  withoutItems: string[];
  withItems: string[];
}

export function ComparisonCards({
  withoutTitle = "Disconnected Chaos",
  withTitle = "Connected Intelligence",
  withoutItems,
  withItems,
}: ComparisonCardsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl mx-auto"
    >
      {/* WITHOUT SPINE - Red Card */}
      <motion.div
        className="bg-white rounded-2xl border-2 border-[#ffc9c9] p-8 relative"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Badge */}
        <div className="absolute -top-3 left-6 bg-[#fb2c36] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-tight">
          WITHOUT SPINE
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#82181a] mb-6 mt-2">
          {withoutTitle}
        </h3>

        {/* Items */}
        <ul className="space-y-3">
          {withoutItems.map((item, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-sm text-[#404040]"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-[#ffe2e2] flex items-center justify-center mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fb2c36]" />
              </div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* WITH SPINE - Green/Black Card */}
      <motion.div
        className="bg-emerald-900 rounded-2xl border-2 border-[#00c950] p-8 relative"
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Badge */}
        <div className="absolute -top-3 left-6 bg-[#00c950] text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-tight">
          WITH SPINE
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#05df72] mb-6 mt-2">
          {withTitle}
        </h3>

        {/* Items */}
        <ul className="space-y-3">
          {withItems.map((item, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-sm text-[#e5e5e5]"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
            >
              <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-[#00c950] flex items-center justify-center mt-0.5">
                <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
              </div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NUMBERED FEATURE CARD
   Orange-accented cards with numbered badges
   ═══════════════════════════════════════════════════════════════════════ */

interface NumberedFeatureCardProps {
  number: number;
  title: string;
  description: string;
  example?: string;
  delay?: number;
}

export function NumberedFeatureCard({
  number,
  title,
  description,
  example,
  delay = 0,
}: NumberedFeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="bg-white border border-[#e5e5e5] rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Number Badge */}
      <div className="w-9 h-9 rounded-full bg-[#fef3c6] flex items-center justify-center mb-4">
        <span className="text-[#e17100] font-bold text-base">{number}</span>
      </div>

      {/* Title */}
      <h4 className="text-base font-bold text-black mb-3">{title}</h4>

      {/* Description */}
      <p className="text-xs text-[#525252] leading-relaxed mb-3">
        {description}
      </p>

      {/* Example */}
      {example && (
        <div className="bg-[#fafafa] border border-[#f5f5f5] rounded-lg p-3 mt-3">
          <p className="text-[10.5px] italic text-[#737373] leading-snug">
            {example}
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FEATURE GRID - "How Can One Spine Serve All Businesses?"
   ═══════════════════════════════════════════════════════════════════════ */

interface Feature {
  title: string;
  description: string;
  example?: string;
}

interface FeatureGridProps {
  title?: React.ReactNode;
  features: Feature[];
}

export function FeatureGrid({ title, features }: FeatureGridProps) {
  return (
    <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl p-10">
      {/* Title */}
      {title && (
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-tight">
          {title}
        </h3>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <NumberedFeatureCard
            key={i}
            number={i + 1}
            title={feature.title}
            description={feature.description}
            example={feature.example}
            delay={0.1 * i}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WORKSPACE MOCKUP FRAME
   Browser-style frame for screenshots/illustrations
   ═══════════════════════════════════════════════════════════════════════ */

interface WorkspaceMockupProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function WorkspaceMockup({
  children,
  title,
  subtitle,
}: WorkspaceMockupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-[#e5e5e5] overflow-hidden shadow-xl bg-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Browser Chrome */}
      <div className="bg-[#f5f5f5] border-b border-[#e5e5e5] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#d4d4d4]" />
            <div className="w-3 h-3 rounded-full bg-[#d4d4d4]" />
            <div className="w-3 h-3 rounded-full bg-[#d4d4d4]" />
          </div>

          {/* Address Bar */}
          {(title || subtitle) && (
            <div className="ml-3">
              {title && (
                <span className="text-xs font-medium text-[#09090b]">
                  {title}
                </span>
              )}
              {subtitle && (
                <span className="text-[10px] text-[#71717a] ml-2">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side URL bar simulation */}
        <div className="flex-1 max-w-md h-5 bg-[#e5e5e5] rounded ml-4" />
      </div>

      {/* Content */}
      <div className="bg-white">{children}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BULLET LIST with colored indicators
   ═══════════════════════════════════════════════════════════════════════ */

interface BulletItem {
  text: string;
  type?: "success" | "error" | "warning" | "info";
}

interface BulletListProps {
  items: BulletItem[];
  variant?: "success" | "error" | "warning" | "info";
}

export function BulletList({ items, variant = "success" }: BulletListProps) {
  const colors = {
    success: {
      bg: "bg-[#00c950]",
      text: "text-[#00c950]",
      icon: <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />,
    },
    error: {
      bg: "bg-[#ffe2e2]",
      text: "text-[#fb2c36]",
      icon: <div className="w-1.5 h-1.5 rounded-full bg-[#fb2c36]" />,
    },
    warning: {
      bg: "bg-[#fef3c6]",
      text: "text-[#e17100]",
      icon: <div className="w-1.5 h-1.5 rounded-full bg-[#e17100]" />,
    },
    info: {
      bg: "bg-[#e5e5e5]",
      text: "text-[#71717a]",
      icon: <div className="w-1.5 h-1.5 rounded-full bg-[#71717a]" />,
    },
  };

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const itemVariant = item.type || variant;
        const style = colors[itemVariant];

        return (
          <motion.li
            key={i}
            className="flex items-start gap-3 text-sm"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <div
              className={`flex-shrink-0 w-3.5 h-3.5 rounded-full ${style.bg} flex items-center justify-center mt-0.5`}
            >
              {style.icon}
            </div>
            <span className="text-[#404040]">{item.text}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}
