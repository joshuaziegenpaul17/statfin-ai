'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { motion, animate, useScroll, useTransform, useInView } from 'framer-motion';
import { Check } from 'lucide-react';

// Scroll Count-Up Helper component
function ScrollCountUp({ value, isCurrency = false }: { value: number; isCurrency?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);
  const { currencySymbol, selectedCurrency } = useCurrency();

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.4,
        ease: 'easeOut',
        onUpdate: (latest) => setDisplayValue(latest),
      });
      return () => controls.stop();
    }
  }, [isInView, value, selectedCurrency]);

  const formatter = new Intl.NumberFormat(
    selectedCurrency === 'INR' ? 'en-IN' : 'en-US',
    { maximumFractionDigits: 0 }
  );

  return (
    <span ref={ref}>
      {isCurrency && currencySymbol}
      {formatter.format(Math.round(displayValue))}
    </span>
  );
}

// Full-screen risk score radial gauge reveal component
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

export default function Home() {
  const { formatCurrency } = useCurrency();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Track scroll positioning for cinematic animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const orbitY = useTransform(scrollY, [0, 600], [0, -30]);

  // Sequential Agent container configurations
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
    <div className="relative bg-transparent text-white w-full min-h-screen flex flex-col items-center">
      
      {/* SECTION 1: CENTERED IMMERSIVE HERO WITH 3D ORBITS */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-border-subtle">
        
        {/* Centered 3D Perspective Elliptical Orbits */}
        <motion.div
          style={{ y: orbitY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20 [perspective:1000px] overflow-visible"
        >
          {/* Ring 1 (Income) */}
          <div className="absolute w-[850px] h-[850px] rounded-full border border-dashed border-white/5 [transform:rotateX(73deg)_rotateY(10deg)]">
            <motion.div
              animate={reducedMotion ? {} : { rotate: 360 }}
              transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-border-subtle rounded-md px-3 py-1.5 text-[9px] tracking-wider text-muted uppercase [transform:rotateX(-73deg)] font-mono shadow-2xl">
                INCOME {formatCurrency(30000)}
              </div>
            </motion.div>
          </div>

          {/* Ring 2 (Expenses) */}
          <div className="absolute w-[660px] h-[660px] rounded-full border border-dashed border-white/5 [transform:rotateX(73deg)_rotateY(-15deg)]">
            <motion.div
              animate={reducedMotion ? {} : { rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full relative"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black border border-border-subtle rounded-md px-3 py-1.5 text-[9px] tracking-wider text-muted uppercase [transform:rotateX(-73deg)] font-mono shadow-2xl">
                EXPENSES {formatCurrency(23000)}
              </div>
            </motion.div>
          </div>

          {/* Ring 3 (Savings & Risk) */}
          <div className="absolute w-[470px] h-[470px] rounded-full border border-dashed border-white/5 [transform:rotateX(73deg)_rotateY(5deg)]">
            <motion.div
              animate={reducedMotion ? {} : { rotate: 360 }}
              transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full relative"
            >
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-black border border-border-subtle rounded-md px-3 py-1.5 text-[9px] tracking-wider text-muted uppercase [transform:rotateX(-73deg)] font-mono shadow-2xl font-semibold">
                SAVINGS 23.3%
              </div>
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-black border border-border-subtle rounded-md px-3 py-1.5 text-[9px] tracking-wider text-muted uppercase [transform:rotateX(-73deg)] font-mono shadow-2xl font-semibold">
                RISK 61
              </div>
            </motion.div>
          </div>

          {/* Ring 4 (Trend) */}
          <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-white/5 [transform:rotateX(73deg)_rotateY(-5deg)]">
            <motion.div
              animate={reducedMotion ? {} : { rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-border-subtle rounded-md px-3 py-1.5 text-[9px] tracking-wider text-muted uppercase [transform:rotateX(-73deg)] font-mono shadow-2xl">
                TREND +4.2%
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hero typography content box */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-[1000px] flex flex-col items-center gap-8 relative z-10 select-none py-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            Statistical Financial Intelligence
          </span>
          
          <h1 className="text-5xl sm:text-7xl md:text-[88px] font-light tracking-tight leading-[1.05] text-white">
            Understand your money. <br />
            <span className="italic font-serif">Statistically.</span>
          </h1>

          <p className="font-sans text-sm sm:text-[17px] font-light leading-relaxed text-secondary-text max-w-xl text-center">
            StatFin AI transforms your financial data into statistical patterns, risk signals, and actionable insights. We isolate deterministic computation to guarantee privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black hover:bg-neutral-200 transition-colors"
            >
              Start Assessment →
            </Link>
            <Link
              href="/historical"
              className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-dark-surface px-6 py-3 text-[13px] font-medium text-white hover:bg-hover-surface transition-colors"
            >
              Analyze Historical Data
            </Link>
          </div>
        </motion.div>

        {/* Black gradient overlay fading the hero environment into pure black */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      </section>

      {/* Content wrapper matching maximum limits */}
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-32 py-20 select-none">
        
        {/* SECTION 2: "YOUR FINANCIAL DATA HAS PATTERNS" */}
        <section className="flex flex-col gap-12 border-b border-border-subtle pb-24 items-center text-center">
          <div className="max-w-2xl flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-widest text-muted">Section 02 / Dispersion</span>
            <h2 className="text-3xl sm:text-[44px] font-light tracking-tight text-white leading-tight">
              Your financial data has patterns.
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mx-auto">
              Behind simple transactions lie mathematical attributes. In view, we measure these base dimensions to isolate savings velocity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl text-left mt-4">
            {[
              { label: 'Observed Income', value: 30000, isCurrency: true },
              { label: 'Total Expenditures', value: 23000, isCurrency: true },
              { label: 'Monthly Surplus', value: 7000, isCurrency: true },
              { label: 'Spending Variability', value: 4200, isCurrency: true, desc: 'Calculated std deviation' },
            ].map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-1.5 hover:border-neutral-500 transition-colors"
              >
                <span className="text-[10px] uppercase text-muted tracking-wider">{kpi.label}</span>
                <span className="text-3xl font-light text-white font-sans">
                  <ScrollCountUp value={kpi.value} isCurrency={kpi.isCurrency} />
                </span>
                {kpi.desc && <span className="text-[9px] text-muted">{kpi.desc}</span>}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3: "STATISTICS FINDS THE SIGNAL" (Pipeline animation) */}
        <section className="flex flex-col gap-12 border-b border-border-subtle pb-24 items-center text-center">
          <div className="max-w-2xl flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-widest text-muted">Section 03 / Operations</span>
            <h2 className="text-3xl sm:text-[44px] font-light tracking-tight text-white leading-tight">
              Statistics finds the signal.
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mx-auto">
              StatFin AI processes variables through a sequence of classical descriptive models to fit trend vectors and filter anomalous spikes.
            </p>
          </div>

          {/* Sequential pipeline container */}
          <div className="relative w-full max-w-5xl mt-6">
            
            {/* Dashed connecting progress line behind cards */}
            <div className="absolute top-[85px] left-[12%] right-[12%] h-0.5 border-t border-dashed border-neutral-800 hidden lg:block z-0">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-gradient-to-r from-neutral-700 via-neutral-400 to-white"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 text-left">
              {[
                {
                  num: '01',
                  step: 'Measure',
                  title: 'Descriptive Statistics',
                  desc: 'Calculates mean parameters and standard deviations to measure structural spending variance.',
                },
                {
                  num: '02',
                  step: 'Analyze',
                  title: 'IQR Anomaly Detection',
                  desc: 'Applies quartile fencing bounds to identify irregular, high-magnitude cost spikes.',
                },
                {
                  num: '03',
                  step: 'Detect',
                  title: 'Linear Regression',
                  desc: 'Fits least-squares trend lines over chronological months to calculate cost direction.',
                },
                {
                  num: '04',
                  step: 'Assess',
                  title: 'Trend Forecasting',
                  desc: 'Projects future spending cycles based on slope coefficients relative to income limits.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-3 hover:border-neutral-500 transition-colors"
                >
                  <div className="flex justify-between items-baseline border-b border-border-subtle pb-2">
                    <span className="font-serif text-3xl italic text-muted">{item.num}</span>
                    <span className="text-[9px] uppercase tracking-widest text-muted">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mt-1">{item.title}</h3>
                  <p className="text-xs text-secondary-text leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: "AN AGENT TURNS FINDINGS INTO DECISIONS" (Staggered Highlights) */}
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

        {/* SECTION 5: "SEE YOUR FINANCIAL RISK" */}
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

        {/* SECTION 6: CENTARED CTA BLOCK */}
        <section className="flex flex-col items-center text-center py-12 gap-8 relative select-none">
          <div className="max-w-2xl flex flex-col gap-3">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white font-serif">
              Start understanding your money.
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto">
              Run your income and expense categories through the statistical scoring engine to map budget boundaries and compile risk reports locally.
            </p>
          </div>
          
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors z-10"
          >
            Start Assessment →
          </Link>
        </section>

      </div>
    </div>
  );
}
