'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView } from 'framer-motion';

function AnimatedRiskScore() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [score, setScore] = useState(0);
  const [showLevel, setShowLevel] = useState(false);
  const [showFactors, setShowFactors] = useState(false);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, 61, {
        duration: 1.8,
        ease: 'easeOut',
        onUpdate: (latest) => setScore(Math.round(latest)),
        onComplete: () => {
          setShowLevel(true);
          setTimeout(() => {
            setShowFactors(true);
          }, 400);
        },
      });
      return () => controls.stop();
    }
  }, [isInView]);

  const circumference = 2 * Math.PI * 90; // r = 90
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div ref={ref} className="flex flex-col items-center gap-8 w-full max-w-3xl bg-dark-surface rounded-xl border border-border-subtle p-8 sm:p-12 text-center relative overflow-hidden">
      
      {/* Radial Gauge */}
      <div className="relative w-52 h-52 flex items-center justify-center select-none">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="90"
            className="stroke-neutral-900"
            strokeWidth="10"
            fill="transparent"
          />
          <motion.circle
            cx="104"
            cy="104"
            r="90"
            className="stroke-white"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-serif text-white tracking-tighter">{score}</span>
          <span className="text-xs uppercase text-muted tracking-wider mt-1">/ 100</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col items-center gap-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={showLevel ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider text-muted">Assessment Profile</span>
          <span className="text-xs font-semibold uppercase tracking-widest bg-neutral-900 border border-border-subtle rounded-full px-4 py-1 text-white">
            Moderate Risk
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={showLevel ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs text-secondary-text leading-relaxed font-light"
        >
          This score represents a budget subject to volatility. Adequate monthly surplus exists, but categorical concentrations and standard deviation dispersion indicate potential cash-flow constraints during expenditure spikes.
        </motion.p>

        {/* Risk factors list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={showFactors ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full grid grid-cols-2 gap-4 border-t border-border-subtle pt-6 mt-2"
        >
          {[
            { name: 'Expense Ratio', status: 'Moderate' },
            { name: 'Savings Rate', status: 'Stable' },
            { name: 'Spending Trend', status: 'Slight Creep' },
            { name: 'Anomalies', status: 'Low Spike' },
          ].map((factor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={showFactors ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="bg-black border border-border-subtle rounded-lg p-3 text-left flex justify-between items-center hover:border-neutral-500 transition-colors"
            >
              <span className="text-[10px] uppercase text-neutral-400 font-medium">{factor.name}</span>
              <span className="text-[10px] text-white font-mono">{factor.status}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function RiskGaugeSection() {
  return (
    <section className="flex flex-col gap-10 border-b border-border-subtle pb-24 items-center text-center">
      <div className="max-w-2xl flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-widest text-muted">Section 05 / Risk Model</span>
        <h2 className="text-3xl sm:text-[44px] font-light tracking-tight text-white leading-tight">
          See your financial risk.
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mx-auto">
          StatFin AI normalizes scores to map budget safety boundaries. A circular radial gauge reveals structural vulnerabilities on entry.
        </p>
      </div>

      <div className="w-full flex justify-center mt-6">
        <AnimatedRiskScore />
      </div>
    </section>
  );
}
