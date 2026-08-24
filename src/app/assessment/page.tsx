'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { runFinancialRiskAgent } from '@/lib/agent/financialAgent';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const STANDARD_CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

export default function Assessment() {
  const router = useRouter();
  const { formatCurrency, currencySymbol } = useCurrency();

  // State values
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Record<string, number>>({
    Housing: 0,
    Food: 0,
    Transport: 0,
    Utilities: 0,
    Shopping: 0,
    Entertainment: 0,
    Healthcare: 0,
    Education: 0,
    Other: 0,
  });

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Live calculated metrics
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [savingsRate, setSavingsRate] = useState<number>(0);
  const [expenseRatio, setExpenseRatio] = useState<number>(0);

  // Recalculate KPIs live
  useEffect(() => {
    const total = Object.values(expenses).reduce((sum, val) => sum + val, 0);
    const save = income - total;
    const saveRate = income > 0 ? (save / income) * 100 : 0;
    const ratio = income > 0 ? (total / income) * 100 : 0;

    setTotalExpenses(total);
    setSavings(save);
    setSavingsRate(saveRate);
    setExpenseRatio(ratio);
  }, [income, expenses]);

  // Handle inputs
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setIncome(val >= 0 ? val : 0);
    setValidationError(null);
  };

  const handleExpenseChange = (category: string, value: string) => {
    const val = Number(value);
    setExpenses((prev) => ({
      ...prev,
      [category]: val >= 0 ? val : 0,
    }));
    setValidationError(null);
  };

  // Custom category addition
  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCatName.trim();
    if (!cleanName) return;

    if (expenses[cleanName] !== undefined || STANDARD_CATEGORIES.includes(cleanName)) {
      setValidationError('Category already exists.');
      return;
    }

    setExpenses((prev) => ({
      ...prev,
      [cleanName]: 0,
    }));
    setCustomCategories((prev) => [...prev, cleanName]);
    setNewCatName('');
    setValidationError(null);
  };

  // Custom category removal
  const handleRemoveCustomCategory = (category: string) => {
    setExpenses((prev) => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });
    setCustomCategories((prev) => prev.filter((cat) => cat !== category));
    setValidationError(null);
  };

  // Submit assessment to agent
  const handleAnalyze = async () => {
    if (income <= 0) {
      setValidationError('Income must be greater than zero to evaluate financial ratios.');
      return;
    }

    setIsAnalyzing(true);
    setValidationError(null);

    try {
      // Run agent pipeline
      const report = await runFinancialRiskAgent(income, expenses);
      
      // Save report in local storage for navigation to the report page
      localStorage.setItem('statfin_report', JSON.stringify(report));
      
      // Navigate to report
      router.push('/report');
    } catch (err: any) {
      setValidationError(err.message || 'An error occurred during analysis.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-2">
          Your financial picture.
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-xl">
          Enter your current monthly income and category allocations. The live statistical calculators will update the ratios dynamically below.
        </p>
      </div>

      {/* Live KPIs Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Monthly Income',
            value: formatCurrency(income),
          },
          {
            label: 'Total Expenses',
            value: formatCurrency(totalExpenses),
          },
          {
            label: 'Savings Surplus',
            value: formatCurrency(savings),
            isNegative: savings < 0,
          },
          {
            label: 'Savings Rate / Ratio',
            value: `${savingsRate.toFixed(1)}% / ${expenseRatio.toFixed(1)}%`,
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-1"
          >
            <span className="text-[11px] uppercase tracking-wider text-muted">{kpi.label}</span>
            <span
              className={`text-2xl font-light tracking-tight ${
                kpi.isNegative ? 'text-white font-semibold line-through decoration-neutral-500' : 'text-white'
              }`}
            >
              {kpi.value}
            </span>
          </div>
        ))}
      </section>

      {/* Assessment Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Form Column */}
        <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-dark-surface p-6 sm:p-8 flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-light text-white mb-6 pb-2 border-b border-border-subtle">
              Income & Expense Entries
            </h2>
            
            {/* Income field */}
            <div className="flex flex-col gap-2 mb-8">
              <label htmlFor="income-input" className="text-xs uppercase tracking-wider text-secondary-text">
                Monthly Net Income ({currencySymbol})
              </label>
              <input
                id="income-input"
                type="number"
                value={income === 0 ? '' : income}
                onChange={handleIncomeChange}
                placeholder="e.g. 35000"
                className="w-full bg-black border border-border-subtle rounded-md px-3 py-2 text-white placeholder-muted focus:ring-1 focus:ring-white text-base lg:text-[16px]"
              />
            </div>

            {/* Expenses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Standard Categories */}
              {STANDARD_CATEGORIES.map((category) => (
                <div key={category} className="flex flex-col gap-2">
                  <label
                    htmlFor={`expense-${category}`}
                    className="text-xs uppercase tracking-wider text-secondary-text"
                  >
                    {category} Spending ({currencySymbol})
                  </label>
                  <input
                    id={`expense-${category}`}
                    type="number"
                    value={expenses[category] === 0 ? '' : expenses[category]}
                    onChange={(e) => handleExpenseChange(category, e.target.value)}
                    placeholder="0"
                    className="w-full bg-black border border-border-subtle rounded-md px-3 py-2 text-white placeholder-muted focus:ring-1 focus:ring-white text-base lg:text-[16px]"
                  />
                </div>
              ))}

              {/* Custom Categories */}
              {customCategories.map((category) => (
                <div key={category} className="flex flex-col gap-2 relative">
                  <label
                    htmlFor={`expense-custom-${category}`}
                    className="text-xs uppercase tracking-wider text-secondary-text flex items-center justify-between"
                  >
                    <span>{category} (Custom, {currencySymbol})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomCategory(category)}
                      className="text-muted hover:text-white transition-colors"
                      aria-label={`Remove ${category}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </label>
                  <input
                    id={`expense-custom-${category}`}
                    type="number"
                    value={expenses[category] === 0 ? '' : expenses[category]}
                    onChange={(e) => handleExpenseChange(category, e.target.value)}
                    placeholder="0"
                    className="w-full bg-black border border-border-subtle rounded-md px-3 py-2 text-white placeholder-muted focus:ring-1 focus:ring-white text-base lg:text-[16px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add custom category form */}
          <form onSubmit={handleAddCustomCategory} className="border-t border-border-subtle pt-6 flex gap-4">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Custom category name (e.g. Subscriptions)"
              className="flex-1 bg-black border border-border-subtle rounded-md px-3 py-2 text-white placeholder-muted focus:ring-1 focus:ring-white text-base lg:text-[16px]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-black text-white px-4 hover:bg-hover-surface transition-colors"
            >
              <Plus size={16} className="mr-1" /> Add
            </button>
          </form>
        </div>

        {/* Action Column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-4">
            <h3 className="text-base uppercase tracking-wider text-white">Analysis Pipeline</h3>
            <p className="text-xs text-muted leading-relaxed">
              When you launch the analysis, StatFin AI runs your cash flows through the primary statistical scoring engine to determine:
            </p>
            <ul className="text-xs text-secondary-text space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span> Expense to Income ratio
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span> Discretionary spending density
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span> Score normalization (0 - 100)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span> Agentic risk narrative
              </li>
            </ul>
            
            {validationError && (
              <div className="flex items-start gap-2 bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs text-neutral-300">
                <AlertCircle size={16} className="text-white shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Elegant Disclaimer Panel */}
            <div className="rounded-xl border border-border-subtle bg-dark-surface p-6 flex flex-col gap-2.5 text-left mt-2 select-none">
              <h4 className="text-white uppercase tracking-wider text-xs font-semibold">
                Important Disclaimer
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed font-light">
                Disclaimer: StatFin AI is an educational statistical analysis prototype. The Prototype Risk Score is a project-specific analytical indicator and has not been financially validated. This application does not provide professional financial, investment, lending, insurance, or tax advice.
              </p>
            </div>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="w-full inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[14px] font-medium text-black hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-400 transition-all-custom mt-4"
            >
              {isAnalyzing ? 'Running Agent Engine...' : 'Analyze Financial Risk →'}
            </button>
          </div>

          <div className="rounded-xl border border-border-subtle bg-black p-6">
            <p className="text-xs text-muted leading-relaxed">
              <strong>Local Computation:</strong> All analytics are processed client-side. The agent compiles mathematical metrics directly in-browser. No details are transmitted.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
