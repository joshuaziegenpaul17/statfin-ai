import { MonthlyData, calculateFinancialMetrics, calculateDescriptiveStats, FinancialMetrics, DescriptiveStats } from '../statistics/metrics';
import { detectAnomalies, AnomalyResult } from '../statistics/anomaly';
import { calculateLinearRegression, RegressionResult } from '../statistics/regression';
import { analyzeTrend, TrendAnalysisResult } from '../statistics/trend';
import { calculateRiskScore, RiskAssessmentResult } from '../risk/riskScore';
import { generateFinancialInsight } from './aiService';
import { AgentInsight, AgentInputData } from './fallbackAgent';

export interface CompleteAnalysisReport {
  timestamp: string;
  isHistorical: boolean;
  metrics: FinancialMetrics;
  descriptiveStats?: DescriptiveStats;
  anomalyResult?: AnomalyResult;
  regressionResult?: RegressionResult;
  trendResult?: TrendAnalysisResult;
  riskAssessment: RiskAssessmentResult;
  agentInsight: AgentInsight;
  rawIncome: number;
  rawExpenses: Record<string, number>;
  historicalData?: MonthlyData[];
}

/**
 * Main Orchestrator Agent that runs the statistical analysis pipeline and generates the final risk report.
 */
export async function runFinancialRiskAgent(
  income: number,
  expenses: Record<string, number>,
  historicalData?: MonthlyData[]
): Promise<CompleteAnalysisReport> {
  const isHistorical = !!historicalData && historicalData.length >= 3;

  // 1. Calculate Monthly Metrics (uses current or most recent month)
  const currentMetrics = calculateFinancialMetrics(income, expenses);

  // Calculate discretionary spending ratio
  // Categories: Shopping, Entertainment, and Other are treated as discretionary
  const discretionarySum =
    (expenses['Shopping'] || 0) +
    (expenses['Entertainment'] || 0) +
    (expenses['Other'] || 0);
  const discretionaryRatio =
    currentMetrics.totalExpenses > 0
      ? (discretionarySum / currentMetrics.totalExpenses) * 100
      : 0;

  // Determine top spending category
  let topCategory = 'None';
  let topCategoryPercentage = 0;
  for (const [cat, pct] of Object.entries(currentMetrics.categoryPercentages)) {
    if (pct > topCategoryPercentage) {
      topCategoryPercentage = pct;
      topCategory = cat;
    }
  }

  let descriptiveStats: DescriptiveStats | undefined;
  let anomalyResult: AnomalyResult | undefined;
  let regressionResult: RegressionResult | undefined;
  let trendResult: TrendAnalysisResult | undefined;

  if (isHistorical && historicalData) {
    // 2. Descriptive Stats of historical months
    const monthlyTotals = historicalData.map((d) =>
      Object.values(d.expenses).reduce((sum, val) => sum + val, 0)
    );
    descriptiveStats = calculateDescriptiveStats(monthlyTotals);

    // 3. Anomaly Detection
    const anomalyInputs = historicalData.map((d) => ({
      month: d.month,
      totalExpenses: Object.values(d.expenses).reduce((sum, val) => sum + val, 0),
    }));
    anomalyResult = detectAnomalies(anomalyInputs);

    // 4. Linear Regression
    regressionResult = calculateLinearRegression(monthlyTotals);

    // 5. Trend Analysis
    trendResult = analyzeTrend(regressionResult.slope, descriptiveStats.mean);
  }

  // 6. Risk Scoring Tool
  const riskAssessment = calculateRiskScore({
    expenseRatio: currentMetrics.expenseRatio,
    savingsRate: currentMetrics.savingsRate,
    discretionaryRatio,
    trendDirection: trendResult?.direction,
    trendSlopePct: trendResult?.percentageChangePerMonth,
    anomaliesCount: anomalyResult?.anomalies.length,
  });

  // Assemble inputs for the reasoning agent
  const agentInput: AgentInputData = {
    income,
    totalExpenses: currentMetrics.totalExpenses,
    savings: currentMetrics.savings,
    savingsRate: currentMetrics.savingsRate,
    expenseRatio: currentMetrics.expenseRatio,
    topCategory,
    topCategoryPercentage,
    riskScore: riskAssessment.score,
    riskLevel: riskAssessment.level,
    discretionaryRatio,
    expenseTrend: trendResult?.direction,
    trendSlope: regressionResult?.slope,
    trendSlopePct: trendResult?.percentageChangePerMonth,
    anomaliesCount: anomalyResult?.anomalies.length,
  };

  // 7. Execute Agent interpretation (AI with Fallback)
  const agentInsight = await generateFinancialInsight(agentInput);

  return {
    timestamp: new Date().toISOString(),
    isHistorical,
    metrics: currentMetrics,
    descriptiveStats,
    anomalyResult,
    regressionResult,
    trendResult,
    riskAssessment,
    agentInsight,
    rawIncome: income,
    rawExpenses: expenses,
    historicalData,
  };
}
