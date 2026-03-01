import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  DoctorScene, StudentScene, SmallBizScene,
  FreelancerScene, ParentScene, ExecutiveScene,
} from "./PersonaCanvasScenes";

const personas = [
  { title: "The Doctor", desc: "Three apps open during a patient visit. History in one, prescription in another, lab report in a third. She becomes the copy-paste layer.", Scene: DoctorScene },
  { title: "The Student", desc: "Lecture notes in Docs. Research in ChatGPT. PDFs in Downloads. Assignment on a portal. Final version? Who knows which folder.", Scene: StudentScene },
  { title: "The Small Business Owner", desc: "Orders on WhatsApp. Invoices in email. Stock in a spreadsheet. Payments in an app. Things fall through cracks.", Scene: SmallBizScene },
  { title: "The Freelancer", desc: "Five clients, five different tools per client. Entire day spent context-switching, not creating.", Scene: FreelancerScene },
  { title: "The Parent", desc: "School group on one WhatsApp. Family on another. Bills in email. Photos in iCloud. Tax papers in... somewhere.", Scene: ParentScene },
  { title: "The Executive", desc: "Dashboards in five tabs. Reports in three formats. Decisions made on partial information because full context lives in ten places.", Scene: ExecutiveScene },
];

export function PersonaCardsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section className="py-24 bg-[#f7f7f7]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Sound Familiar?</p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] tracking-tight mb-3">
            This isn't a tech problem. <span className="italic text-muted-foreground">It's a human problem.</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            It does not matter what you do for a living. The chaos is the same.
            You are the human cable connecting things that should already know each other.
          </p>
        </motion.div>

        <div className="max-w-[984px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map((persona, i) => (
            <motion.div
              key={persona.title}
              className="group rounded-2xl bg-white overflow-hidden border shadow-sm hover:shadow-xl transition-shadow duration-400"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="h-44 overflow-hidden bg-[#f5f5f5] border-b">
                <persona.Scene />
              </div>
              <div className="px-6 pt-6 pb-6">
                <h3 className="text-[17.6px] mb-2 text-[#111]">{persona.title}</h3>
                <p className="text-[14.4px] text-[#666] leading-[1.7]">{persona.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-2xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="border-l-4 border-foreground bg-white rounded-r-xl shadow-md px-8 py-6 text-center">
            <p className="text-muted-foreground">
              End of the day — <strong className="text-foreground">15 tools touched. 4 devices used. Zero connected outcome.</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">The tools are not broken. The connections between them are.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
