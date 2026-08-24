export interface MonthlyData {
  month: string;
  income: number;
  expenses: Record<string, number>;
}

export interface FinancialMetrics {
  income: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expenseRatio: number;
  categoryPercentages: Record<string, number>;
}

export interface DescriptiveStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
}

/**
 * Calculates financial metrics for a single month's data.
 */
export function calculateFinancialMetrics(
  income: number,
  expenses: Record<string, number>
): FinancialMetrics {
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const savings = income - totalExpenses;
  
  // Prevent division by zero if income is 0 or negative
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const expenseRatio = income > 0 ? (totalExpenses / income) * 100 : 0;

  const categoryPercentages: Record<string, number> = {};
  for (const [category, amount] of Object.entries(expenses)) {
    categoryPercentages[category] = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
  }

  return {
    income,
    totalExpenses,
    savings,
    savingsRate,
    expenseRatio,
    categoryPercentages,
  };
}

/**
 * Calculates descriptive statistics for an array of monthly total expenses.
 */
export function calculateDescriptiveStats(monthlyExpenses: number[]): DescriptiveStats {
  const n = monthlyExpenses.length;
  if (n === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  }

  const min = Math.min(...monthlyExpenses);
  const max = Math.max(...monthlyExpenses);
  
  const sum = monthlyExpenses.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Calculate Median
  const sorted = [...monthlyExpenses].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Calculate Sample Standard Deviation (with Bessel's correction)
  let stdDev = 0;
  if (n > 1) {
    const variance = monthlyExpenses.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    stdDev = Math.sqrt(variance);
  }

  return {
    mean,
    median,
    stdDev,
    min,
    max,
  };
}
