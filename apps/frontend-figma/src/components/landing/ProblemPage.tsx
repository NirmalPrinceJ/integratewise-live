import React from "react";
import { Problem } from "./Problem";
import { Layout } from "./Layout";

export function ProblemPage() {
  return (
    <Layout>
      <div className="pt-16 md:pt-20">
        <Problem />
        <div className="py-16 md:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h3 className="text-xl md:text-2xl font-black text-[#1E2A4A] mb-6 uppercase tracking-tight">The high cost of "Good Enough" integrations</h3>
                <p className="text-slate-600 mb-8">
                    Most companies lose 15-20% of their potential NRR simply because their data is siloed and context-less. 
                    IntegrateWise solves this by creating a unified cognitive layer that understands the relationship between your tools and your goals.
                </p>
            </div>
        </div>
      </div>
    </Layout>
  );
}