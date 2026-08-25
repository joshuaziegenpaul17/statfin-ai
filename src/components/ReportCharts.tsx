'use client';

import React, { useState } from 'react';
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

interface PieSegment {
  name: string;
  value: number;
  percentage: number;
  fill: string;
}

interface HistoricalChartItem {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  fittedExpenses: number | null;
}

interface RegressionResult {
  slope: number;
  intercept: number;
  forecast: number;
  rSquared: number;
  fittedValues: number[];
}

interface ReportChartsProps {
  pieData: PieSegment[];
  historicalChartData: HistoricalChartItem[];
  totalExpenses: number;
  isHistorical: boolean;
  regressionResult: RegressionResult | null | undefined;
  currencySymbol: string;
  formatCurrency: (val: number) => string;
  formatAxisValue: (val: number) => string;
}

// Custom tooltip
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

export default function ReportCharts({
  pieData,
  historicalChartData,
  totalExpenses,
  isHistorical,
  regressionResult,
  currencySymbol,
  formatCurrency,
  formatAxisValue,
}: ReportChartsProps) {
  const [activeSector, setActiveSector] = useState<PieSegment | null>(null);

  return (
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
  );
}
