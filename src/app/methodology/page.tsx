export default function Methodology() {
  return (
    <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
      {/* Header */}
      <section className="max-w-4xl flex flex-col gap-4">
        <span className="text-xs uppercase tracking-[0.15em] text-muted">
          Academic Documentation & Specifications
        </span>
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-white">
          How StatFin thinks.
        </h1>
        <p className="font-sans text-base sm:text-lg font-light leading-relaxed text-secondary-text max-w-2xl">
          This document outlines the mathematical models, statistical criteria, and weight allocations utilized
          by the StatFin AI analytical engine. The codebase is structured to isolate deterministic calculations
          from interpretation, providing verifiable metrics to the agentic reasoning layer.
        </p>
      </section>

      {/* Methodology Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-border-subtle pt-12">
        
        {/* 1. Descriptive Statistics */}
        <div className="flex flex-col gap-4">
          <span className="font-serif text-3xl italic text-muted">01</span>
          <h2 className="text-xl font-light text-white">Descriptive Statistics</h2>
          <p className="text-xs text-muted leading-relaxed">
            In historical analysis mode, the system establishes a baseline spending profile by computing measures of central tendency and dispersion on the sequence of total monthly expenditures Y = [y₁, y₂, ..., yₙ].
          </p>
          <div className="border border-border-subtle bg-dark-surface rounded-lg p-4 font-mono text-[11px] text-white flex flex-col gap-3">
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Mean Expense (ȳ)</span>
              <span>ȳ = (Σ y_i) / n</span>
            </div>
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Sample Standard Deviation (s)</span>
              <span>s = √[ Σ(y_i - ȳ)² / (n - 1) ]</span>
            </div>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            <strong>Interpretation:</strong> The mean establishes the average cost base, while the sample standard deviation (s) quantifies budget volatility. A high standard deviation relative to the mean indicates structural spending instability.
          </p>
        </div>

        {/* 2. Primary Financial Ratios */}
        <div className="flex flex-col gap-4">
          <span className="font-serif text-3xl italic text-muted">02</span>
          <h2 className="text-xl font-light text-white">Core Financial Ratios</h2>
          <p className="text-xs text-muted leading-relaxed">
            Calculates base efficiency metrics comparing outbound expenditures and inbound capital. Ratios are calculated client-side in the browser.
          </p>
          <div className="border border-border-subtle bg-dark-surface rounded-lg p-4 font-mono text-[11px] text-white flex flex-col gap-3">
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Expense Ratio</span>
              <span>Expense Ratio = (Total Expenses / Monthly Income) × 100</span>
            </div>
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Savings Rate</span>
              <span>Savings Rate = (Savings / Income) × 100</span>
            </div>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            <strong>Interpretation:</strong> An expense ratio exceeding 70% or a savings rate below 10% indicates constrained capital flexibility, which reduces the capacity to build emergency liquidity.
          </p>
        </div>

        {/* 3. IQR Outlier Detection */}
        <div className="flex flex-col gap-4 border-t border-border-subtle pt-12">
          <span className="font-serif text-3xl italic text-muted">03</span>
          <h2 className="text-xl font-light text-white">IQR Anomaly Detection</h2>
          <p className="text-xs text-muted leading-relaxed">
            To identify anomalous expenditure shocks without assuming a normal distribution, the system utilizes the non-parametric Interquartile Range (IQR) method on historical monthly totals.
          </p>
          <div className="border border-border-subtle bg-dark-surface rounded-lg p-4 font-mono text-[11px] text-white flex flex-col gap-3">
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Interquartile Range (IQR)</span>
              <span>IQR = Q3 - Q1</span>
            </div>
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Upper & Lower Bounds</span>
              <span>Upper Bound = Q3 + 1.5 × IQR<br />Lower Bound = Q1 - 1.5 × IQR</span>
            </div>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            <strong>Interpretation:</strong> Any monthly expense exceeding the Upper Bound is flagged as a high outlier, signaling an irregular expenditure shock (e.g. emergency healthcare bills) that warrants a separate reserve fund.
          </p>
        </div>

        {/* 4. Linear Regression Model */}
        <div className="flex flex-col gap-4 border-t border-border-subtle pt-12">
          <span className="font-serif text-3xl italic text-muted">04</span>
          <h2 className="text-xl font-light text-white">Least-Squares Linear Regression</h2>
          <p className="text-xs text-muted leading-relaxed">
            Fits a linear trend line over chronological time index X = [0, 1, ..., n-1] and monthly expenses Y to identify spending drift.
          </p>
          <div className="border border-border-subtle bg-dark-surface rounded-lg p-4 font-mono text-[11px] text-white flex flex-col gap-3">
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Slope (m) & Intercept (c)</span>
              <span>m = Σ((x_i - x̄)(y_i - ȳ)) / Σ(x_i - x̄)²<br />c = ȳ - m x̄</span>
            </div>
            <div>
              <span className="text-muted block uppercase tracking-wider text-[9px] mb-1">Goodness-of-Fit Coefficient (R²)</span>
              <span>R² = 1 - (RSS / TSS) where RSS = Σ(y_i - ŷ_i)²</span>
            </div>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            <strong>Interpretation:</strong> A positive slope m signifies increasing monthly expenditures. If m exceeds 1% of the mean monthly expense, the trend is classified as "Increasing" (suggesting inflation or lifestyle creep).
          </p>
        </div>

        {/* 5. Adaptive Risk Scoring Weighting */}
        <div className="flex flex-col gap-4 border-t border-border-subtle pt-12">
          <span className="font-serif text-3xl italic text-muted">05</span>
          <h2 className="text-xl font-light text-white">Prototype Scoring Weights</h2>
          <p className="text-xs text-muted leading-relaxed">
            The normalized risk score (0–100) adaptively reallocates factor weights depending on the availability of historical parameters.
          </p>
          <div className="border border-border-subtle bg-dark-surface rounded-lg p-4 text-[11px] text-white flex flex-col gap-4 font-mono">
            <div className="grid grid-cols-2 gap-2 border-b border-border-subtle pb-2">
              <span className="text-muted">Factor</span>
              <span className="text-muted">Weight (Quick / Historical)</span>
            </div>
            <div className="flex justify-between">
              <span>Expense Ratio</span>
              <span>45% / 30%</span>
            </div>
            <div className="flex justify-between">
              <span>Savings Rate</span>
              <span>45% / 30%</span>
            </div>
            <div className="flex justify-between">
              <span>Discretionary Spending</span>
              <span>10% / 15%</span>
            </div>
            <div className="flex justify-between">
              <span>Expense Trend Direction</span>
              <span>0% / 15%</span>
            </div>
            <div className="flex justify-between">
              <span>Historical Anomalies</span>
              <span>0% / 10%</span>
            </div>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            <strong>Interpretation:</strong> Score thresholds: 0-39 (LOW), 40-69 (MODERATE), 70-100 (HIGH). This is a project-specific indicator designed to test adaptive mathematical weights and is not a clinical credit evaluation.
          </p>
          <div className="text-[10px] text-muted border-t border-border-subtle pt-2 mt-1 leading-relaxed font-light">
            StatFin AI is an educational statistical analysis prototype. The Prototype Risk Score is a project-specific analytical indicator and has not been financially validated. This application does not provide professional financial, investment, lending, insurance, or tax advice.
          </div>
        </div>

        {/* 6. AI Agent System Architecture */}
        <div className="flex flex-col gap-4 border-t border-border-subtle pt-12">
          <span className="font-serif text-3xl italic text-muted">06</span>
          <h2 className="text-xl font-light text-white">Agentic Separation Architecture</h2>
          <p className="text-xs text-muted leading-relaxed">
            StatFin AI uses a modular design separating numerical processing from text generation. The Agent layer does not perform arithmetic, avoiding typical LLM hallucination of mathematical figures.
          </p>
          <div className="border border-border-subtle rounded-lg p-4 bg-black font-mono text-[10px] text-muted flex flex-col gap-2">
            <span className="text-white">&bull; User Input</span>
            <span className="pl-3">&rarr; [Deterministic Calculation Engine]</span>
            <span className="pl-6">&rarr; [Fitted Regression, Outlier Indexes, Scores]</span>
            <span className="pl-3">&rarr; [Structured JSON Schema Interface]</span>
            <span className="pl-6">&rarr; [Financial Risk Agent Layer]</span>
            <span className="pl-9">&rarr; [AI API / Rule-based Fallback Narrative]</span>
          </div>
          <p className="text-xs text-secondary-text leading-relaxed">
            <strong>Interpretation:</strong> If the environment variables for OpenAI or Gemini are not set, the agent automatically runs the local rule-based compilation engine. This ensures the application remains zero-cost and never crashes.
          </p>
        </div>
      </section>
    </div>
  );
}
