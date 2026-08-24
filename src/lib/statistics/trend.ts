export type TrendDirection = 'Increasing' | 'Stable' | 'Decreasing';

export interface TrendAnalysisResult {
  slope: number;
  direction: TrendDirection;
  percentageChangePerMonth: number;
}

/**
 * Classifies the trend direction of total monthly expenses.
 * Uses a relative threshold of 1% of the mean monthly expense.
 * An absolute change of less than 1% of the mean is considered Stable.
 */
export function analyzeTrend(slope: number, meanExpense: number): TrendAnalysisResult {
  if (meanExpense <= 0) {
    return {
      slope,
      direction: slope > 0 ? 'Increasing' : slope < 0 ? 'Decreasing' : 'Stable',
      percentageChangePerMonth: 0,
    };
  }

  const percentageChangePerMonth = (slope / meanExpense) * 100;
  
  let direction: TrendDirection = 'Stable';
  // If the expense increases/decreases by more than 1% of the mean per month, it is flagged
  if (percentageChangePerMonth > 1.0) {
    direction = 'Increasing';
  } else if (percentageChangePerMonth < -1.0) {
    direction = 'Decreasing';
  }

  return {
    slope,
    direction,
    percentageChangePerMonth,
  };
}
