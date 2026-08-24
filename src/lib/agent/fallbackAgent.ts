import { RiskLevel } from '../risk/riskScore';

export interface AgentInputData {
  income: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expenseRatio: number;
  topCategory: string;
  topCategoryPercentage: number;
  riskScore: number;
  riskLevel: RiskLevel;
  discretionaryRatio: number;
  expenseTrend?: 'Increasing' | 'Stable' | 'Decreasing';
  trendSlope?: number;
  trendSlopePct?: number;
  anomaliesCount?: number;
}

export interface AgentInsight {
  summary: string;
  findings: string[];
  recommendations: string[];
}

/**
 * Deterministically generates high-quality narrative insights, structured findings, and recommendations
 * based on numerical financial inputs and computed statistical attributes.
 */
export function generateFallbackInsight(data: AgentInputData): AgentInsight {
  const {
    income,
    totalExpenses,
    savings,
    savingsRate,
    expenseRatio,
    topCategory,
    topCategoryPercentage,
    riskScore,
    riskLevel,
    discretionaryRatio,
    expenseTrend = 'Stable',
    anomaliesCount = 0,
  } = data;

  const currencySymbol = '₹';

  // --- 1. Key Findings ---
  const findings: string[] = [];

  // Finding 1: Core metric status
  if (expenseRatio > 85) {
    findings.push(
      `Critical Expense Ratio: Your monthly expenses consume ${expenseRatio.toFixed(1)}% of your income, leaving virtually no buffer for financial shocks.`
    );
  } else if (expenseRatio > 70) {
    findings.push(
      `Elevated Expense Ratio: Expenses represent ${expenseRatio.toFixed(1)}% of your monthly income. This represents high operational costs relative to earnings.`
    );
  } else if (expenseRatio > 50) {
    findings.push(
      `Moderate Expense Ratio: You are spending ${expenseRatio.toFixed(1)}% of your income. Your budget has standard margins but remains exposed to cost increases.`
    );
  } else {
    findings.push(
      `Strong Budget Margin: Your expenses absorb only ${expenseRatio.toFixed(1)}% of your income, leaving a highly resilient margin for savings and investment.`
    );
  }

  // Finding 2: Savings rate evaluation
  if (savingsRate < 10) {
    findings.push(
      `Insufficient Saving Velocity: The savings rate is at a minimal ${savingsRate.toFixed(1)}%, which slows the accumulation of an emergency fund or long-term wealth.`
    );
  } else if (savingsRate < 20) {
    findings.push(
      `Moderate Savings Rate: A savings rate of ${savingsRate.toFixed(1)}% is healthy but provides limited capacity to fund major future life milestones quickly.`
    );
  } else {
    findings.push(
      `Excellent Capital Accumulation: Saving ${savingsRate.toFixed(1)}% of your income exceeds standard benchmarks, establishing a strong compounding trajectory.`
    );
  }

  // Finding 3: Category concentration
  if (topCategoryPercentage > 35) {
    findings.push(
      `High Spending Concentration: A single category, "${topCategory}", accounts for ${topCategoryPercentage.toFixed(1)}% of your total monthly expenditures, exposing you to category-specific inflation.`
    );
  } else {
    findings.push(
      `Distributed Category Exposure: Spending is relatively balanced. The leading category, "${topCategory}", represents a moderate ${topCategoryPercentage.toFixed(1)}% of total costs.`
    );
  }

  // Finding 4: Discretionary spending
  if (discretionaryRatio > 45) {
    findings.push(
      `Elevated Discretionary Costs: Shopping, entertainment, and miscellaneous spending make up ${discretionaryRatio.toFixed(1)}% of your expenses, showing potential for immediate tactical budget optimization.`
    );
  } else if (discretionaryRatio > 25) {
    findings.push(
      `Moderate Discretionary Allocations: Discretionary spending represents ${discretionaryRatio.toFixed(1)}% of expenses, reflecting a standard balance between lifestyle and essential needs.`
    );
  } else {
    findings.push(
      `Strict Budget Discipline: Less than ${discretionaryRatio.toFixed(1)}% of expenses are discretionary. While highly efficient, this offers minimal room to trim costs in an emergency.`
    );
  }

  // Finding 5: Trends & Anomalies (only if historical)
  if (data.expenseTrend !== undefined) {
    if (expenseTrend === 'Increasing') {
      findings.push(
        `Upward Expense Velocity: Linear regression models indicate a clear upward trend in monthly expenditures, signaling potential budget creep over time.`
      );
    } else if (expenseTrend === 'Decreasing') {
      findings.push(
        `Favorable Expense Trend: Spending shows a statistically significant decrease over the evaluated periods, indicating progressive budget stabilization.`
      );
    } else {
      findings.push(
        `Stable Spending Velocity: Expenditures are stationary and exhibit zero significant structural drift over time.`
      );
    }
  }

  if (anomaliesCount > 0) {
    findings.push(
      `Volatility Alerts: Outlier detection identified ${anomaliesCount} month(s) with statistically anomalous spending patterns, suggesting irregular or unplanned financial events.`
    );
  }

  // Limit to maximum 5 findings
  const finalFindings = findings.slice(0, 5);

  // --- 2. Executive Summary ---
  let paragraph1 = '';
  let paragraph2 = '';
  let paragraph3 = '';

  if (riskLevel === 'HIGH') {
    paragraph1 = `StatFin AI has classified your financial risk profile as HIGH (Prototype Risk Score: ${riskScore}/100). This classification reflects a critical vulnerability in your current budget model. Your expenses absorb a dominant share of your income (${expenseRatio.toFixed(1)}%), which actively suppresses your capacity to build liquid savings. Under these conditions, any sudden reduction in income or unplanned financial emergency could precipitate immediate cash flow distress.`;
    
    paragraph2 = `A structural analysis of your spending behavior indicates that your leading expense category is ${topCategory}, representing ${topCategoryPercentage.toFixed(1)}% of total expenditures. Furthermore, discretionary spending (including shopping and entertainment) consumes ${discretionaryRatio.toFixed(1)}% of your outgoing cash. This suggests that while essential costs may be high, a significant portion of your risk originates from non-essential spending that could be tactically deferred to restore stability.`;
    
    if (data.expenseTrend === 'Increasing') {
      paragraph3 = `Adding to these concerns, your historical data exhibits an Increasing trend (slope direction: positive). This regression slope suggests that expenses are scaling upwards over time, compounding your cash flow squeeze. Coupled with the detection of ${anomaliesCount} spending outliers, your financial profile is showing symptoms of high structural volatility that requires immediate corrective interventions.`;
    } else {
      paragraph3 = `While your overall trend remains stable or decreasing, the thinness of your savings buffer (${savingsRate.toFixed(1)}%) remains the primary risk accelerator. The absence of a robust capital reserve makes it mathematically difficult to absorb the variance associated with any future irregular expenditure.`;
    }
  } else if (riskLevel === 'MODERATE') {
    paragraph1 = `StatFin AI has classified your financial risk profile as MODERATE (Prototype Risk Score: ${riskScore}/100). This indicates a functional but highly sensitive financial system. While you currently maintain a positive net cash flow (monthly savings of ${currencySymbol}${Math.round(savings).toLocaleString('en-IN')}), the margin of safety is narrow. The expense ratio of ${expenseRatio.toFixed(1)}% creates susceptibility to cost-of-living fluctuations, restricting your rate of wealth accumulation.`;
    
    paragraph2 = `The data indicates that your expenses are led by ${topCategory} at ${topCategoryPercentage.toFixed(1)}%. Discretionary expenditures account for ${discretionaryRatio.toFixed(1)}% of your overall monthly spending. This moderate concentration highlights opportunities to redirect capital from non-essential lifestyle categories toward your savings rate, which sits at a moderate ${savingsRate.toFixed(1)}%.`;
    
    if (data.expenseTrend === 'Increasing') {
      paragraph3 = `Of note is the upward drift in your monthly expenditures (classified as Increasing). This trend suggests that unless spending limits are enforced, lifestyle inflation or structural price hikes may continue to erode your savings margins. The presence of ${anomaliesCount} irregular anomalies indicates occasional spikes that temporary strain your cash flow.`;
    } else {
      paragraph3 = `On a positive note, your expenditure trend is currently stable or decreasing, which implies you are keeping a firm handle on recurring overheads. Maintaining this discipline while systematically targeting discretionary cuts will allow you to migrate into the low-risk category.`;
    }
  } else {
    // LOW RISK
    paragraph1 = `StatFin AI has classified your financial risk profile as LOW (Prototype Risk Score: ${riskScore}/100). Your financial system exhibits strong structural resilience, characterized by a healthy savings rate of ${savingsRate.toFixed(1)}% and a controlled expense ratio of ${expenseRatio.toFixed(1)}%. This layout generates a substantial monthly surplus of ${currencySymbol}${Math.round(savings).toLocaleString('en-IN')}, positioning you well to withstand financial volatility.`;
    
    paragraph2 = `Your category allocation is highly balanced, with ${topCategory} representing your largest spending area at ${topCategoryPercentage.toFixed(1)}%. Discretionary categories constitute just ${discretionaryRatio.toFixed(1)}% of your outbound capital. This reflects excellent alignment between your financial goals and spending behaviors, showing strong budget discipline.`;
    
    if (data.expenseTrend === 'Decreasing') {
      paragraph3 = `This stability is reinforced by a decreasing expense trend over time, demonstrating progressive budgeting efficiency. Even with ${anomaliesCount} anomalies detected, your high savings rate and ample cash surplus provide an adequate buffer to absorb these irregular expenditures without compromising your broader financial integrity.`;
    } else {
      paragraph3 = `Your spending trend is stable, indicating predictable operational costs. By maintaining this trajectory, you can confidently allocate your surplus capital toward long-term investment portfolios, compounding your financial security.`;
    }
  }

  const summary = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;

  // --- 3. Recommendations ---
  const recommendations: string[] = [];

  // Target 1: Expense ratio and savings rate
  if (expenseRatio > 70) {
    const targetExpenses = income * 0.70;
    const savingsRequired = Math.round(totalExpenses - targetExpenses);
    recommendations.push(
      `Reduce monthly expenses by approximately ${currencySymbol}${savingsRequired.toLocaleString('en-IN')} to bring your overall Expense Ratio below the 70% threshold.`
    );
  } else if (savingsRate < 20) {
    const targetSavings = income * 0.20;
    const extraSavings = Math.round(targetSavings - savings);
    recommendations.push(
      `Increase savings allocation by ${currencySymbol}${extraSavings.toLocaleString('en-IN')} per month to establish a safer 20% savings velocity.`
    );
  } else {
    recommendations.push(
      `Maintain your current savings velocity and direct the excess cash surplus into low-volatility, income-generating assets to compound long-term wealth.`
    );
  }

  // Target 2: Top category mitigation
  if (topCategoryPercentage > 30) {
    recommendations.push(
      `Review your allocation for "${topCategory}" and attempt to reduce its dominance. Target a reduction of 10-15% in this category over the next two cycles.`
    );
  }

  // Target 3: Discretionary adjustments
  if (discretionaryRatio > 35) {
    const discretionarySavings = Math.round(totalExpenses * 0.10);
    recommendations.push(
      `Optimize discretionary spending (Shopping and Entertainment) to trim total expenses by ${currencySymbol}${discretionarySavings.toLocaleString('en-IN')} without impacting essential needs.`
    );
  } else {
    recommendations.push(
      `Establish a fixed, ring-fenced discretionary allowance within your budget to prevent spontaneous lifestyle expansion.`
    );
  }

  // Target 4: Trend and volatility issues
  if (data.expenseTrend === 'Increasing') {
    recommendations.push(
      `Conduct a detailed audit of the increasing spending trend to identify whether it is driven by structural price rises (e.g. rent, utilities) or non-essential creep.`
    );
  }
  if (anomaliesCount > 0) {
    recommendations.push(
      `Create a dedicated emergency liquid reserve equivalent to at least 3-6 months of average expenses to absorb future spending anomalies without drawing from regular savings.`
    );
  }

  // Ensure 3-5 recommendations
  const finalRecommendations = recommendations.slice(0, 5);
  while (finalRecommendations.length < 3) {
    finalRecommendations.push(
      `Systematically document monthly spending to maintain visibility over category allocations.`
    );
  }

  return {
    summary,
    findings: finalFindings,
    recommendations: finalRecommendations,
  };
}
