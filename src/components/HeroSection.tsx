'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCurrency } from '@/lib/context/CurrencyContext';

export default function HeroSection() {
  const { formatCurrency } = useCurrency();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setTimeout(() => {
      setReducedMotion(mediaQuery.matches);
    }, 0);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const orbitY = useTransform(scrollY, [0, 600], [0, -30]);

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-border-subtle">
      {/* Centered 3D Perspective Elliptical Orbits */}
      <motion.div
        style={{ y: orbitY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-15 sm:opacity-20 scale-[0.6] sm:scale-100 [perspective:1000px] overflow-visible"
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

        <p className="font-sans text-sm sm:text-[17px] font-light leading-relaxed text-secondary-text max-w-[340px] sm:max-w-xl text-center">
          StatFin AI transforms your financial data into statistical patterns, risk signals, and actionable insights. We isolate deterministic computation to guarantee privacy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-[340px] sm:w-auto sm:max-w-none px-4 sm:px-0">
          <Link
            href="/assessment"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-[13px] font-medium text-black hover:bg-neutral-200 transition-colors"
          >
            Start Assessment →
          </Link>
          <Link
            href="/historical"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-border-subtle bg-dark-surface px-6 py-3.5 text-[13px] font-medium text-white hover:bg-hover-surface transition-colors"
          >
            Analyze Historical Data
          </Link>
        </div>
      </motion.div>

      {/* Black gradient overlay fading the hero environment into pure black */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}
