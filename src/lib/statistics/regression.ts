export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  forecast: number; // next month's predicted value
  fittedValues: number[]; // fitted Y values for each X
}

/**
 * Calculates a simple linear regression over the monthly expense sequence.
 * Independent variable X is the time index (0, 1, ..., n-1).
 * Dependent variable Y is the total expenses.
 */
export function calculateLinearRegression(monthlyExpenses: number[]): RegressionResult {
  const n = monthlyExpenses.length;
  
  if (n < 3) {
    // Regression requires at least 3 data points to be statistically meaningful here
    return { slope: 0, intercept: 0, rSquared: 0, forecast: 0, fittedValues: [] };
  }

  // X values are just 0, 1, ..., n-1
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = monthlyExpenses;

  const meanX = xValues.reduce((sum, val) => sum + val, 0) / n;
  const meanY = yValues.reduce((sum, val) => sum + val, 0) / n;

  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (xValues[i] - meanX) * (yValues[i] - meanY);
    den += Math.pow(xValues[i] - meanX, 2);
  }

  // In case all X values are identical (should not happen since index increases)
  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R-squared
  let tss = 0;
  let rss = 0;
  
  const fittedValues: number[] = [];
  for (let i = 0; i < n; i++) {
    const fitted = slope * xValues[i] + intercept;
    fittedValues.push(fitted);
    
    tss += Math.pow(yValues[i] - meanY, 2);
    rss += Math.pow(yValues[i] - fitted, 2);
  }

  const rSquared = tss !== 0 ? 1 - rss / tss : 1.0;
  const forecast = slope * n + intercept;

  return {
    slope,
    intercept,
    rSquared,
    forecast: Math.max(0, forecast), // Expenses cannot be negative
    fittedValues,
  };
}
