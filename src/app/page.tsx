import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';

// Dynamically import below-the-fold animated components to allow chunk splitting and faster initial render
const PatternsSection = dynamic(() => import('@/components/PatternsSection'), {
  ssr: true,
  loading: () => <div className="h-96 w-full animate-pulse bg-neutral-950/20 rounded-xl border border-neutral-900" />,
});

const PipelineSection = dynamic(() => import('@/components/PipelineSection'), {
  ssr: true,
  loading: () => <div className="h-96 w-full animate-pulse bg-neutral-950/20 rounded-xl border border-neutral-900" />,
});

const AgentFlowSection = dynamic(() => import('@/components/AgentFlowSection'), {
  ssr: true,
  loading: () => <div className="h-96 w-full animate-pulse bg-neutral-950/20 rounded-xl border border-neutral-900" />,
});

const RiskGaugeSection = dynamic(() => import('@/components/RiskGaugeSection'), {
  ssr: true,
  loading: () => <div className="h-[500px] w-full animate-pulse bg-neutral-950/20 rounded-xl border border-neutral-900" />,
});

export default function Home() {
  return (
    <div className="relative bg-transparent text-white w-full min-h-screen flex flex-col items-center">
      {/* SECTION 1: CENTERED IMMERSIVE HERO WITH 3D ORBITS */}
      <HeroSection />

      {/* Content wrapper matching maximum limits */}
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-32 py-20 select-none">
        {/* SECTION 2: "YOUR FINANCIAL DATA HAS PATTERNS" */}
        <PatternsSection />

        {/* SECTION 3: "STATISTICS FINDS THE SIGNAL" (Pipeline animation) */}
        <PipelineSection />

        {/* SECTION 4: "AN AGENT TURNS FINDINGS INTO DECISIONS" (Staggered Highlights) */}
        <AgentFlowSection />

        {/* SECTION 5: "SEE YOUR FINANCIAL RISK" */}
        <RiskGaugeSection />

        {/* SECTION 6: CENTERED CTA BLOCK */}
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
