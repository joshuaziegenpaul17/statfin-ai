'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CompleteAnalysisReport } from '@/lib/agent/financialAgent';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { getCategoryColor } from '@/lib/utils/colors';
import { motion, animate } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Tooltip,
} from 'recharts';
import { ArrowLeft, Printer, ShieldAlert } from 'lucide-react';

// Number count-up helper
function CountUp({ value, suffix = '', prefix = '', maxFractionDigits = 0 }: { value: number; suffix?: string; prefix?: string; maxFractionDigits?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  const formatted = displayValue.toLocaleString('en-IN', {
    maximumFractionDigits: maxFractionDigits,
  });

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// Currency count-up helper
function CurrencyCountUp({ value }: { value: number }) {
  const { currencySymbol, selectedCurrency } = useCurrency();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value, selectedCurrency]);

  const formatter = new Intl.NumberFormat(
    selectedCurrency === 'INR' ? 'en-IN' : 'en-US',
    { maximumFractionDigits: 0 }
  );

  return (
    <span>
      {currencySymbol}
      {formatter.format(Math.round(displayValue))}
    </span>
  );
}

// Custom tooltip declared outside of render to prevent cascade rerenders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, formatCurrency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black border border-border-subtle rounded-xl p-4 text-[11px] font-mono text-white flex flex-col gap-1.5 shadow-2xl select-none">
        <p className="font-semibold uppercase tracking-wider text-[10px] text-muted">
          {data.name || data.month || 'Category'}
        </p>
        <p className="text-secondary-text">
          AMOUNT SPENT: <span className="text-white font-medium">{formatCurrency(payload[0].value)}</span>
        </p>
        {data.percentage !== undefined && (
          <p className="text-secondary-text">
            PERCENTAGE: <span className="text-white font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Animated circular progress gauge for mobile
function RiskCircularRing({ score, level }: { score: number; level: string }) {
  const radius = 50;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#FFFFFF';
  if (level === 'HIGH') color = '#D4D4D4';
  else if (level === 'MODERATE') color = '#A3A3A3';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-dark-surface border border-border-subtle rounded-xl max-w-sm mx-auto w-full select-none">
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted mb-4 font-semibold">Financial Risk Score</span>
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={70}
            cy={70}
            className="w-[140px] h-[140px] origin-center scale-[1.35]"
          />
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            r={normalizedRadius}
            cx={70}
            cy={70}
            className="w-[140px] h-[140px] origin-center scale-[1.35] stroke-linecap-round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-light text-white">
            <CountUp value={score} />
          </span>
          <span className="text-[10px] text-muted uppercase tracking-wider mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-light text-white uppercase tracking-widest mt-5">{level} RISK</span>
    </div>
  );
}

// Responsive Agent pipeline diagram timeline
function AgentTimeline() {
  const steps = [
    { title: 'STATISTICAL ENGINE', desc: 'Descriptive, variance, and anomaly analysis.' },
    { title: 'RISK ENGINE', desc: 'Weighted score calculation (0-100).' },
    { title: 'FINANCIAL AGENT', desc: 'Interpretation of metrics and data points.' },
    { title: 'ACTIONABLE INSIGHT', desc: 'Premium risk analysis summary.' },
  ];

  return (
    <div className="w-full py-4 select-none">
      {/* Desktop Pipeline (Horizontal) */}
      <div className="hidden md:flex items-start justify-between w-full relative">
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-neutral-900 z-0"></div>
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="flex-1 flex flex-col items-center text-center relative z-10 px-2"
          >
            <div className="w-12 h-12 rounded-full border border-border-subtle bg-black flex items-center justify-center font-mono text-white text-xs font-semibold mb-3">
              0{idx + 1}
            </div>
            <h4 className="text-[9px] tracking-widest uppercase font-semibold text-white">{step.title}</h4>
            <p className="text-[9px] text-muted max-w-[125px] mt-1 font-light leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Pipeline (Vertical Timeline) */}
      <div className="flex md:hidden flex-col items-center gap-6 relative w-full px-2">
        <div className="absolute top-6 bottom-6 w-0.5 bg-neutral-900 left-1/2 -translate-x-1/2 z-0"></div>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm rounded-xl border border-border-subtle bg-dark-surface p-4 flex gap-4 items-center relative z-10"
            >
              <div className="w-10 h-10 rounded-full border border-border-subtle bg-black flex items-center justify-center font-mono text-white text-[11px] font-semibold shrink-0">
                0{idx + 1}
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-[10px] tracking-wider uppercase font-semibold text-white">{step.title}</h4>
                <p className="text-[10px] text-muted mt-0.5 leading-relaxed font-light">{step.desc}</p>
              </div>
            </motion.div>
            
            {idx < steps.length - 1 && (
              <div className="text-muted text-xs z-10 my-[-8px]">↓</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Report() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [report, setReport] = useState<CompleteAnalysisReport | null>(null);
  
  // State for active pie segment hover feedback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeSector, setActiveSector] = useState<any>(null);

  const { formatCurrency, replaceCurrencySymbols, currencySymbol } = useCurrency();

  // Load report from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem('statfin_report');
    setTimeout(() => {
      setMounted(true);
      if (data) {
        try {
          setReport(JSON.parse(data));
        } catch (e) {
          console.error('Failed to parse local report:', e);
        }
      }
    }, 0);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-muted text-sm animate-pulse font-sans">Initializing report renderer...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 flex flex-col items-center justify-center gap-6 text-center">
        <ShieldAlert size={48} className="text-muted" />
        <h1 className="text-3xl font-light text-white">No active report.</h1>
        <p className="text-muted text-sm leading-relaxed">
          You have not generated a financial risk report yet. Please enter your data in the assessment form or upload historical statements to compile insights.
        </p>
        <div className="flex gap-4">
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-black hover:bg-neutral-200 transition-colors"
          >
            Start Assessment
          </Link>
          <Link
            href="/historical"
            className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-black px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white hover:bg-hover-surface transition-colors"
          >
            Upload History
          </Link>
        </div>
      </div>
    );
  }

  const {
    metrics,
    descriptiveStats,
    anomalyResult,
    regressionResult,
    riskAssessment,
    agentInsight,
    isHistorical,
    rawExpenses,
    historicalData = [],
  } = report;

  const totalExpenses = metrics.totalExpenses;

  // Process categories data with color matching
  const pieData = Object.entries(rawExpenses)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      fill: getCategoryColor(name),
    }))
    .sort((a, b) => b.value - a.value);

  // Assemble historical timeline charts
  const historicalChartData = historicalData.map((d, index) => {
    const total = Object.values(d.expenses).reduce((sum, val) => sum + val, 0);
    const fitted = regressionResult?.fittedValues?.[index] !== undefined
      ? Math.max(0, regressionResult.fittedValues[index])
      : null;

    return {
      month: d.month,
      income: d.income,
      expenses: total,
      savings: d.income - total,
      fittedExpenses: fitted,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  // Compress labels to keep margins clean on small viewports
  const formatAxisValue = (val: number) => {
    if (Math.abs(val) >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
    return `${currencySymbol}${val}`;
  };

  return (
    <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16 print:bg-white print:text-black print:py-0 print:px-4">
      {/* Top Action Header */}
      <div className="flex justify-between items-center border-b border-border-subtle pb-6 print:hidden">
        <Link
          href={isHistorical ? '/historical' : '/assessment'}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to entry
        </Link>
        
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-dark-surface px-4 py-2 text-xs uppercase tracking-wider text-white hover:bg-hover-surface transition-colors"
        >
          <Printer size={13} /> Print / PDF
        </button>
      </div>

      {/* Hero Header with Responsive Layout */}
      <section className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 select-none">
        <div className="flex flex-col gap-4 max-w-2xl text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.15em] text-muted animate-fade-in">
            StatFin AI Prototype Risk Score
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white print:text-black">
            Financial Risk Report.
          </h1>
          {/* Large text version displayed on desktop only */}
          <div className="hidden md:flex items-baseline gap-4 mt-2">
            <span className="text-[120px] font-serif leading-none text-white tracking-tighter print:text-black">
              <CountUp value={riskAssessment.score} />
            </span>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.1em] text-muted">Classification</span>
              <span className="text-xl font-light text-white uppercase tracking-wider print:text-black">
                {riskAssessment.level} Risk
              </span>
            </div>
          </div>
        </div>
        
        {/* Animated Circular Progress Gauge displayed on mobile, and next to title on desktop */}
        <div className="w-full md:w-auto flex justify-center shrink-0">
          <RiskCircularRing score={riskAssessment.score} level={riskAssessment.level} />
        </div>
      </section>

      {/* KPI Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-b border-border-subtle py-8 print:border-neutral-300">
        {[
          { label: 'Observed Income', val: metrics.income },
          { label: 'Total Expenditures', val: metrics.totalExpenses },
          { label: 'Monthly Surplus', val: metrics.savings },
          { label: 'Savings Rate', val: metrics.savingsRate, suffix: '%' },
          { label: 'Expense Ratio', val: metrics.expenseRatio, suffix: '%' },
        ].map((kpi, idx) => (
          <div key={idx} className="flex flex-col gap-1 pr-4 md:border-r border-border-subtle last:border-0 print:border-neutral-300">
            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">{kpi.label}</span>
            <span className="text-xl font-light text-white print:text-black">
              {kpi.suffix ? (
                <CountUp value={kpi.val} suffix={kpi.suffix} maxFractionDigits={1} />
              ) : (
                <CurrencyCountUp value={kpi.val} />
              )}
            </span>
          </div>
        ))}
      </section>

      {/* Risk Scoring Analysis Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Risk Score Breakdown Chart */}
        <div className="lg:col-span-1 flex flex-col gap-6 select-none">
          <h2 className="text-xl font-light text-white print:text-black">Score Composition</h2>
          <p className="text-xs text-muted leading-relaxed">
            The Prototype Risk Score is calculated using weighted statistical factors. Quick assessment relies on ratios, while historical analysis incorporates dispersion, outliers, and slope trends.
          </p>
          
          {/* Custom SVG Risk Scale Representation */}
          <div className="w-full h-8 bg-neutral-900 border border-border-subtle rounded-full overflow-hidden relative flex items-center print:border-neutral-300 print:bg-neutral-100">
            <div className="absolute top-0 bottom-0 left-0 right-0 flex divide-x divide-border-subtle text-[9px] uppercase tracking-wider text-muted z-0 print:divide-neutral-300">
              <div className="flex-1 flex items-center justify-center bg-neutral-950/20">Low (0-39)</div>
              <div className="flex-1 flex items-center justify-center bg-neutral-950/40">Mod (40-69)</div>
              <div className="flex-1 flex items-center justify-center bg-neutral-950/60">High (70-100)</div>
            </div>
            
            {/* Pointer Pin indicator */}
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `calc(${riskAssessment.score}% - 4px)` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute w-2 h-full bg-white z-10 print:bg-black"
            ></motion.div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {riskAssessment.breakdown.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-secondary-text font-medium">{item.name}</span>
                  <span className="text-muted font-mono text-[11px]">{replaceCurrencySymbols(item.value)}</span>
                </div>
                <div className="flex justify-between items-center text-muted text-[10px]">
                  <span>Component Score: {item.score}/100</span>
                  <span>Contribution: +{Math.round(item.contribution)} pts ({item.weight}%)</span>
                </div>
                <div className="w-full bg-neutral-950 h-1 rounded overflow-hidden print:bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.1 }}
                    className="bg-white h-full print:bg-neutral-800"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Findings List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-light text-white print:text-black">Key Findings</h2>
          <div className="flex flex-col gap-4">
            {agentInsight.findings.map((finding, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="rounded-xl border border-border-subtle bg-dark-surface p-5 flex gap-4 items-start print:border-neutral-300 print:bg-neutral-50"
              >
                <span className="font-mono text-xs text-muted border border-border-subtle rounded-full w-5 h-5 flex items-center justify-center shrink-0 print:border-neutral-300">
                  {idx + 1}
                </span>
                <p className="text-xs text-secondary-text leading-relaxed">{replaceCurrencySymbols(finding)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Charts Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border-subtle pt-16 print:border-neutral-300">
        
        {/* Donut Category Breakdown (LEFT Panel) */}
        <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4 print:border-neutral-300 print:bg-white relative">
          <h3 className="text-sm uppercase tracking-wider text-white print:text-black">Expense Category Share</h3>
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1200}
                  onMouseEnter={(_, index) => setActiveSector(pieData[index])}
                  onMouseLeave={() => setActiveSector(null)}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="#18181a"
                      strokeWidth={2}
                      className="cursor-pointer hover:opacity-85 hover:scale-105 origin-center transition-all duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Interactive Center display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              {activeSector ? (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-white/90 truncate max-w-[120px] font-sans font-bold">
                    {activeSector.name}
                  </span>
                  <span className="text-xl font-light text-white mt-0.5">
                    {activeSector.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    {formatCurrency(activeSector.value)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-sans font-medium">
                    Total Expense
                  </span>
                  <span className="text-xl font-light text-white mt-0.5">
                    {formatCurrency(totalExpenses)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Two-column legend */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[12px] border-t border-border-subtle pt-6 print:border-neutral-200">
            {pieData.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
                onMouseEnter={() => setActiveSector(item)}
                onMouseLeave={() => setActiveSector(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: item.fill }}
                  ></span>
                  <span className="text-muted font-sans font-light">{item.name}</span>
                </div>
                <span className="text-white font-mono font-medium print:text-black">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Expense Bar Chart (RIGHT Panel) */}
        <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4 print:border-neutral-300 print:bg-white">
          <h3 className="text-sm uppercase tracking-wider text-white print:text-black">Category Allocations ({currencySymbol})</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  stroke="#949494"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#2A2A2D' }}
                />
                <YAxis
                  stroke="#949494"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#2A2A2D' }}
                  tickFormatter={formatAxisValue}
                />
                <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} cursor={{ fill: '#242427', opacity: 0.3 }} />
                
                <Bar
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1200}
                  radius={[4, 4, 0, 0]}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Charts (only shown if historicalData exists) */}
        {isHistorical && historicalChartData.length > 0 && (
          <>
            {/* Income vs Expenses Bar Chart */}
            <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4 print:border-neutral-300 print:bg-white">
              <h3 className="text-sm uppercase tracking-wider text-white print:text-black">Historical Income vs Expenses</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalChartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#949494"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#2A2A2D' }}
                    />
                    <YAxis
                      stroke="#949494"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#2A2A2D' }}
                      tickFormatter={formatAxisValue}
                    />
                    <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} cursor={{ fill: '#242427', opacity: 0.3 }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Bar dataKey="income" name="Income" fill="#ffffff" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#404040" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regression Trend and fitted values */}
            <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4 print:border-neutral-300 print:bg-white">
              <h3 className="text-sm uppercase tracking-wider text-white print:text-black">Expense Trend & Forecast</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalChartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#949494"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#2A2A2D' }}
                    />
                    <YAxis
                      stroke="#949494"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#2A2A2D' }}
                      tickFormatter={formatAxisValue}
                    />
                    <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      name="Observed Expenses"
                      stroke="#ffffff"
                      strokeWidth={2}
                      dot={{ r: 3, stroke: '#ffffff', strokeWidth: 1, fill: '#000000' }}
                    />
                    {regressionResult && regressionResult.slope !== 0 && (
                      <Line
                        type="monotone"
                        dataKey="fittedExpenses"
                        name="Linear Regression Trend"
                        stroke="#949494"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[11px] text-muted flex justify-between border-t border-border-subtle pt-4 print:border-neutral-200">
                <span>R² Fit: {regressionResult?.rSquared.toFixed(3)}</span>
                <span>Next Month Forecast: {formatCurrency(regressionResult?.forecast || 0)}</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Historical statistics list (only shown if historicalData exists) */}
      {isHistorical && descriptiveStats && anomalyResult && (
        <section className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-6 print:border-neutral-300 print:bg-white select-none">
          <h3 className="text-sm uppercase tracking-wider text-white print:text-black">Descriptive Dispersion Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            <div className="p-2 sm:px-4">
              <span className="text-[10px] uppercase text-muted block mb-1">Mean Spending</span>
              <span className="text-lg sm:text-xl font-light text-white print:text-black">
                <CurrencyCountUp value={descriptiveStats.mean} />
              </span>
            </div>
            <div className="p-2 sm:px-4">
              <span className="text-[10px] uppercase text-muted block mb-1">Median Spending</span>
              <span className="text-lg sm:text-xl font-light text-white print:text-black">
                <CurrencyCountUp value={descriptiveStats.median} />
              </span>
            </div>
            <div className="p-2 sm:px-4">
              <span className="text-[10px] uppercase text-muted block mb-1">Standard Dev (S)</span>
              <span className="text-lg sm:text-xl font-light text-white print:text-black">
                <CurrencyCountUp value={descriptiveStats.stdDev} />
              </span>
            </div>
            <div className="p-2 sm:px-4">
              <span className="text-[10px] uppercase text-muted block mb-1">IQR / Spacing</span>
              <span className="text-lg sm:text-xl font-light text-white print:text-black">
                <CurrencyCountUp value={anomalyResult.iqr} />
              </span>
            </div>
            <div className="p-2 sm:px-4">
              <span className="text-[10px] uppercase text-muted block mb-1">Outliers Found</span>
              <span className="text-lg sm:text-xl font-light text-white print:text-black">
                <CountUp value={anomalyResult.anomalies.length} />
              </span>
            </div>
          </div>
          
          {anomalyResult.anomalies.length > 0 && (
            <div className="border-t border-border-subtle pt-4 flex flex-col gap-2 print:border-neutral-200">
              <span className="text-[11px] text-white font-medium uppercase tracking-wider">Outlier Outlines:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {anomalyResult.anomalies.map((anom, idx) => (
                  <div key={idx} className="bg-black/50 border border-border-subtle rounded p-3 text-xs text-muted flex justify-between items-center print:border-neutral-200">
                    <span>Month: <strong className="text-white print:text-black">{anom.month}</strong></span>
                    <span>Value: <strong className="text-white print:text-black">{formatCurrency(anom.value)}</strong></span>
                    <span className="text-[10px] uppercase bg-neutral-900 border border-border-subtle px-2 py-0.5 rounded text-white print:bg-neutral-100">
                      {anom.type} OUTLIER
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Agent Reasoning Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-border-subtle pt-16 print:border-neutral-300">
        
        {/* Step checklist representation using unified AgentTimeline */}
        <div className="lg:col-span-1 flex flex-col gap-6 select-none">
          <span className="text-xs uppercase tracking-wider text-muted">Agent Workflow</span>
          <h2 className="text-xl font-light text-white print:text-black">StatFin Agent</h2>
          <p className="text-xs text-muted leading-relaxed">
            The Financial Risk Agent coordinates discrete tools sequentially, prioritizing metrics before drafting the final text.
          </p>

          <AgentTimeline />
        </div>

        {/* Narrative conclusions output */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <span className="text-xs uppercase tracking-wider text-muted">Agent Conclusion</span>
          <h2 className="text-xl font-light text-white print:text-black">AI Financial Insight</h2>
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-secondary-text font-light leading-relaxed whitespace-pre-wrap">
            {replaceCurrencySymbols(agentInsight.summary)}
          </div>
        </div>
      </section>

      {/* Actionable Recommendations */}
      <section className="border-t border-border-subtle pt-16 flex flex-col gap-8 print:border-neutral-300">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted mb-2 block">Agent Action Points</span>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white print:text-black">
            Recommendations
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentInsight.recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4 print:border-neutral-300 print:bg-neutral-50"
            >
              <span className="text-xl font-serif italic text-muted">#0{idx + 1}</span>
              <p className="text-xs sm:text-[13px] text-secondary-text leading-relaxed">
                {replaceCurrencySymbols(rec)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full Disclaimer below Agent Interpretation */}
      <div className="w-full mt-12 border-t border-border-subtle pt-6 text-[10px] text-muted text-center leading-relaxed font-light select-none print:text-neutral-500">
        StatFin AI is an educational statistical analysis prototype. The Prototype Risk Score is a project-specific analytical indicator and has not been financially validated. This application does not provide professional financial, investment, lending, insurance, or tax advice.
      </div>
    </div>
  );
}
