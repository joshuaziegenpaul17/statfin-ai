export interface AnomalyRecord {
  month: string;
  value: number;
  type: 'HIGH' | 'LOW';
}

export interface AnomalyResult {
  q1: number;
  q3: number;
  iqr: number;
  lowerBound: number;
  upperBound: number;
  anomalies: AnomalyRecord[];
}

/**
 * Calculates a percentile of a sorted list of numbers using linear interpolation.
 */
export function getPercentile(sorted: number[], percentile: number): number {
  if (sorted.length === 0) return 0;
  const index = percentile * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Identifies spending anomalies in historical data using the Interquartile Range (IQR) method.
 * A monthly total expense is classified as an anomaly if it falls below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR.
 */
export function detectAnomalies(
  monthlyData: { month: string; totalExpenses: number }[]
): AnomalyResult {
  const values = monthlyData.map((d) => d.totalExpenses);
  const n = values.length;

  if (n === 0) {
    return { q1: 0, q3: 0, iqr: 0, lowerBound: 0, upperBound: 0, anomalies: [] };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = getPercentile(sorted, 0.25);
  const q3 = getPercentile(sorted, 0.75);
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const anomalies: AnomalyRecord[] = [];
  
  // We only run anomaly detection if we have enough points to define variance, otherwise Q1=Q3
  // Generally requires at least 4 months to make statistical sense, but we run on what we have.
  if (n >= 4) {
    for (const record of monthlyData) {
      if (record.totalExpenses > upperBound) {
        anomalies.push({
          month: record.month,
          value: record.totalExpenses,
          type: 'HIGH',
        });
      } else if (record.totalExpenses < lowerBound) {
        anomalies.push({
          month: record.month,
          value: record.totalExpenses,
          type: 'LOW',
        });
      }
    }
  }

  return {
    q1,
    q3,
    iqr,
    lowerBound,
    upperBound,
    anomalies,
  };
}
