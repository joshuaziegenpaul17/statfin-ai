'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PipelineSection() {
  return (
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
  );
}
