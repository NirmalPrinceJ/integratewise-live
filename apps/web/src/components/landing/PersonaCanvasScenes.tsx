/**
 * Persona Canvas Scenes — Animated illustrations for PersonaCards
 *
 * Each scene shows the chaotic multi-tool experience of a persona
 * before IntegrateWise unifies their workflow.
 *
 * TODO: Replace placeholder animations with final Figma-designed illustrations.
 */
import { motion } from "motion/react";

function ScenePlaceholder({ label, color }: { label: string; color: string }) {
  return (
    <div className="w-full h-40 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{ background: `radial-gradient(circle at 30% 50%, ${color}, transparent 60%)` }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="text-xs text-gray-400 font-medium z-10">{label}</span>
    </div>
  );
}

export function DoctorScene() {
  return <ScenePlaceholder label="Three apps, one patient" color="#4285f4" />;
}

export function StudentScene() {
  return <ScenePlaceholder label="Notes scattered everywhere" color="#7c3aed" />;
}

export function SmallBizScene() {
  return <ScenePlaceholder label="Orders, invoices, stock — all apart" color="#059669" />;
}

export function FreelancerScene() {
  return <ScenePlaceholder label="Five clients, five tool stacks" color="#db2777" />;
}

export function ParentScene() {
  return <ScenePlaceholder label="Family life across ten apps" color="#0891b2" />;
}

export function ExecutiveScene() {
  return <ScenePlaceholder label="Dashboards, reports — partial context" color="#ea580c" />;
}
