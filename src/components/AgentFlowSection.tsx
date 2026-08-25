'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AgentFlowSection() {
  const agentContainerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const agentItemVariants = {
    hidden: { opacity: 0.25, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  };

  return (
    <section className="flex flex-col gap-12 border-b border-border-subtle pb-24 items-center text-center">
      <div className="max-w-2xl flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-muted">Section 04 / Agentic Flow</span>
        <h2 className="text-3xl sm:text-[44px] font-light tracking-tight text-white leading-tight">
          An agent turns findings into decisions.
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mx-auto">
          We separate arithmetic from narrative. The statistical engine computes coordinates, while the agentic layer compiles readable conclusions.
        </p>
      </div>

      {/* Sequential workflow mapping */}
      <motion.div
        variants={agentContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 items-center gap-4 mt-6"
      >
        {[
          {
            step: '01 / INPUT',
            title: 'Statistical Data',
            desc: 'Aggregated cash flow bounds and descriptive standard deviations.',
          },
          {
            step: '02 / COMPUTE',
            title: 'Analysis Engine',
            desc: 'Fits least-squares trend lines and screening fences.',
          },
          {
            step: '03 / WEIGHT',
            title: 'Risk Engine',
            desc: 'Applies factor weightings to calculate a normalized score.',
          },
          {
            step: '04 / INTERPRET',
            title: 'Financial Agent',
            desc: 'Prioritizes statistical findings in logical coordinates.',
          },
          {
            step: '05 / ADVISE',
            title: 'Actionable Insight',
            desc: 'Compiles readable advisory text and recommendations.',
          },
        ].map((node, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              variants={agentItemVariants}
              className="bg-dark-surface border border-border-subtle rounded-xl p-5 text-left flex flex-col gap-1.5 hover:border-white transition-all duration-300 w-full hover:scale-[1.02]"
            >
              <span className="text-[9px] text-muted font-mono">{node.step}</span>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{node.title}</h3>
              <p className="text-[10px] text-neutral-400 leading-normal">{node.desc}</p>
            </motion.div>
            {idx < 4 && (
              <div className="hidden md:block text-muted shrink-0 text-lg font-mono px-1 select-none">
                &rarr;
              </div>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  );
}
