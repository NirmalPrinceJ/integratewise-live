"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIMELINE } from "@/lib/data";

export function TimelineSection() {
  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Evolution log — every major milestone from infrastructure to launch.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 timeline-line hidden md:block" />

        <div className="space-y-6">
          {TIMELINE.map((item, index) => (
            <motion.div
              key={item.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-3 h-3 rounded-full bg-iw-cyan border-2 border-background hidden md:block -translate-x-1.5 z-10" />
              
              <Card className={`ml-0 md:ml-10 p-5 ${item.isLatest ? 'border-iw-cyan/50 bg-iw-cyan/5' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <div className="font-mono text-xs text-iw-cyan font-semibold uppercase tracking-wider">
                    {item.date}
                  </div>
                  {item.isLatest && (
                    <Badge variant="cyan" className="w-fit">
                      LATEST
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
