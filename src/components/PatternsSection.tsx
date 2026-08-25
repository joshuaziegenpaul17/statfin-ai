'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import { useCurrency } from '@/lib/context/CurrencyContext';

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

export default function PatternsSection() {
  return (
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
  );
}
