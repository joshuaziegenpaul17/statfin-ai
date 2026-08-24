export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface RiskBreakdownItem {
  name: string;
  score: number;
  weight: number;
  value: string;
  contribution: number;
}

export interface RiskAssessmentResult {
  score: number;
  level: RiskLevel;
  breakdown: RiskBreakdownItem[];
  isHistorical: boolean;
}

/**
 * Calculates the StatFin AI Prototype Risk Score (0–100) based on financial metrics,
 * spending patterns, trends, and anomalies.
 * If trend and anomaly count are omitted, it operates in Quick Assessment Mode and adjusts weights.
 */
export function calculateRiskScore(params: {
  expenseRatio: number;
  savingsRate: number;
  discretionaryRatio: number; // (Shopping + Entertainment + Other) as % of total expenses
  trendDirection?: 'Increasing' | 'Stable' | 'Decreasing';
  trendSlopePct?: number; // percentage change per month
  anomaliesCount?: number;
}): RiskAssessmentResult {
  const isHistorical = params.trendDirection !== undefined && params.anomaliesCount !== undefined;

  // 1. Expense Ratio Score
  let expenseRatioScore = 10;
  if (params.expenseRatio > 85) expenseRatioScore = 100;
  else if (params.expenseRatio > 70) expenseRatioScore = 75;
  else if (params.expenseRatio > 50) expenseRatioScore = 40;

  // 2. Savings Rate Score
  let savingsRateScore = 10;
  if (params.savingsRate < 10) savingsRateScore = 100;
  else if (params.savingsRate < 20) savingsRateScore = 75;
  else if (params.savingsRate <= 30) savingsRateScore = 40;

  // 3. Discretionary Concentration Score
  let discretionaryScore = 10;
  if (params.discretionaryRatio > 60) discretionaryScore = 100;
  else if (params.discretionaryRatio > 40) discretionaryScore = 75;
  else if (params.discretionaryRatio > 20) discretionaryScore = 40;

  let totalWeightedScore = 0;
  const breakdown: RiskBreakdownItem[] = [];

  if (isHistorical) {
    // 4. Trend Score
    let trendScore = 30;
    if (params.trendDirection === 'Decreasing') {
      trendScore = 10;
    } else if (params.trendDirection === 'Increasing') {
      const slopePct = params.trendSlopePct || 0;
      trendScore = slopePct > 5.0 ? 100 : 70; // >5% change per month is strong increase
    }

    // 5. Anomalies Score
    let anomalyScore = 10;
    const count = params.anomaliesCount || 0;
    if (count >= 2) anomalyScore = 100;
    else if (count === 1) anomalyScore = 50;

    // Weights: Expense Ratio (30%), Savings Rate (30%), Discretionary (15%), Trend (15%), Anomalies (10%)
    const weights = {
      expenseRatio: 0.30,
      savingsRate: 0.30,
      discretionary: 0.15,
      trend: 0.15,
      anomalies: 0.10,
    };

    totalWeightedScore =
      expenseRatioScore * weights.expenseRatio +
      savingsRateScore * weights.savingsRate +
      discretionaryScore * weights.discretionary +
      trendScore * weights.trend +
      anomalyScore * weights.anomalies;

    breakdown.push(
      {
        name: 'Expense Ratio',
        score: expenseRatioScore,
        weight: weights.expenseRatio * 100,
        value: `${params.expenseRatio.toFixed(1)}%`,
        contribution: expenseRatioScore * weights.expenseRatio,
      },
      {
        name: 'Savings Rate',
        score: savingsRateScore,
        weight: weights.savingsRate * 100,
        value: `${params.savingsRate.toFixed(1)}%`,
        contribution: savingsRateScore * weights.savingsRate,
      },
      {
        name: 'Discretionary Spending',
        score: discretionaryScore,
        weight: weights.discretionary * 100,
        value: `${params.discretionaryRatio.toFixed(1)}%`,
        contribution: discretionaryScore * weights.discretionary,
      },
      {
        name: 'Spending Trend',
        score: trendScore,
        weight: weights.trend * 100,
        value: params.trendDirection || 'Stable',
        contribution: trendScore * weights.trend,
      },
      {
        name: 'Spending Anomalies',
        score: anomalyScore,
        weight: weights.anomalies * 100,
        value: `${params.anomaliesCount} detected`,
        contribution: anomalyScore * weights.anomalies,
      }
    );
  } else {
    // Quick Assessment weights: Expense Ratio (45%), Savings Rate (45%), Discretionary Ratio (10%)
    const weights = {
      expenseRatio: 0.45,
      savingsRate: 0.45,
      discretionary: 0.10,
    };

    totalWeightedScore =
      expenseRatioScore * weights.expenseRatio +
      savingsRateScore * weights.savingsRate +
      discretionaryScore * weights.discretionary;

    breakdown.push(
      {
        name: 'Expense Ratio',
        score: expenseRatioScore,
        weight: weights.expenseRatio * 100,
        value: `${params.expenseRatio.toFixed(1)}%`,
        contribution: expenseRatioScore * weights.expenseRatio,
      },
      {
        name: 'Savings Rate',
        score: savingsRateScore,
        weight: weights.savingsRate * 100,
        value: `${params.savingsRate.toFixed(1)}%`,
        contribution: savingsRateScore * weights.savingsRate,
      },
      {
        name: 'Discretionary Spending',
        score: discretionaryScore,
        weight: weights.discretionary * 100,
        value: `${params.discretionaryRatio.toFixed(1)}%`,
        contribution: discretionaryScore * weights.discretionary,
      }
    );
  }

  // Final score rounded to integer
  const score = Math.round(totalWeightedScore);

  let level: RiskLevel = 'MODERATE';
  if (score < 40) {
    level = 'LOW';
  } else if (score > 69) {
    level = 'HIGH';
  }

  return {
    score,
    level,
    breakdown,
    isHistorical,
  };
}
