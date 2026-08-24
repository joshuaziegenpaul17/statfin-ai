<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0f0f,100:2b2b2b&height=180&section=header&text=StatFin%20AI&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Statistical%20Intelligence%20for%20Smarter%20Financial%20Decisions&descAlignY=58&descSize=18" width="100%"/>

<a href="https://github.com">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&duration=3000&pause=800&color=CCCCCC&center=true&vCenter=true&width=650&lines=Deterministic+statistics.+Agentic+interpretation.;Client-side+risk+scoring+%E2%80%94+zero+persistent+databases.;Linear+regression+%2B+IQR+anomaly+detection.;100%25+free%2C+private%2C+and+works+without+an+API+key." alt="Typing SVG" />
</a>

</div>

<br/>

StatFin AI is a web-based personal financial risk assessment system that combines statistical analysis with an agentic reasoning layer. The system analyzes income, expenditure, savings behaviour, spending variability, anomalies, and trends to generate a transparent prototype financial risk score. A Financial Risk Agent then interprets the statistical findings and provides evidence-based recommendations. The architecture separates deterministic statistical computation from AI interpretation, allowing the system to operate without mandatory paid AI services.

## Overview

StatFin AI is designed as an MSc Statistics mini-project and agentic software prototype. It addresses a core limitation of modern personal finance tools: the lack of statistical interpretation. While standard budgeting applications visualize transactions as basic tables and charts, StatFin AI models your budget mathematically, fitting linear trend lines, detecting statistical spending outliers using quartile fences, and generating natural narrative explanations of cash flow health.

## Problem Statement

Young professionals and students frequently track their bank transactions, yet they struggle to extract core statistical insights:

- **Volatility & Dispersion:** Is spending standardly distributed, or does it suffer from high variance?
- **Trend Velocity:** Are expenses rising relative to income over time (lifestyle creep, inflation)?
- **Outlier Shocks:** Are anomalous expense spikes threatening capital reserves, and how frequent are they?
- **Risk Quantification:** How does savings velocity and spending concentration weigh against fixed income?

StatFin AI solves this by translating raw budget rows into a structured, mathematical risk assessment and explaining the results in natural language.

## Objectives

- **Deterministic Calculation:** Perform mathematically rigorous calculations (standard deviation, interquartile ranges, regression slope estimation) client-side in the browser.
- **Agentic Interpretation:** Run a dedicated financial risk agent that synthesizes calculated metrics and translates them into actionable guidelines, maintaining a strict boundary between calculations and interpretation.
- **Data Privacy:** Secure sensitive financial records by keeping processing entirely local (zero persistent databases).
- **Zero-Cost Deployment:** Ensure the MVP is completely functional out-of-the-box on Vercel without requiring paid AI API keys.

## How StatFin AI Works

The system operates as a deterministic pipe that triggers the reasoning agent upon compilation:

```
USER BUDGET INPUT (Form / CSV File)
               ↓
        DATA VALIDATION
               ↓
    FINANCIAL METRICS TOOL (Ratio and margin calculation)
               ↓
    SPENDING ANALYSIS TOOL (Discretionary concentration check)
               ↓
    ANOMALY DETECTION TOOL (IQR Outlier check)
               ↓
      TREND ANALYSIS TOOL (Simple linear regression fitting)
               ↓
      RISK SCORING TOOL (Adaptive weighted score compilation)
               ↓
     FINANCIAL RISK AGENT (Orchestrator consuming tool outputs)
               ↓
    AI SERVICE ROUTE / DETERMINISTIC FALLBACK AGENT
               ↓
    RISK REPORT & VISUAL MONOCHROME CHARTS
```

## Agent Architecture

A core design principle of StatFin AI is the separation of math and narrative:

- The **Statistical Engine** is responsible for all arithmetic calculations, outlier tests, and trend slopes. It does not write prose.
- The **Financial Risk Agent** is responsible for orchestrating the statistical tools, prioritizing the findings, interpreting the results, and generating recommendations. It does not calculate numbers.

Statistical calculations are performed deterministically by the application's statistical engine. The AI agent interprets these results and generates human-readable insights. If no AI API keys are configured, the agent delegates narrative duties to a local, rules-based fallback engine (`fallbackAgent.ts`), guaranteeing 100% application uptime and zero cost.

## Statistical Methods

### 1. Descriptive Statistics

We calculate measures of central tendency and dispersion on total monthly expenditures:

- Mean: $\bar{y} = \frac{1}{n}\sum_{i=1}^{n} y_i$
- Sample Standard Deviation: $s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (y_i - \bar{y})^2}$ (measures volatility)

### 2. IQR Anomaly Detection

To find spending shocks, we utilize interquartile ranges (IQR):

- $IQR = Q3 - Q1$
- Lower Boundary: $Q1 - 1.5 \times IQR$
- Upper Boundary: $Q3 + 1.5 \times IQR$

Values outside this interval are flagged as outliers.

### 3. Linear Regression Trend

We model spending over time index $X = \{0, 1, \dots, n-1\}$ and expenses $Y$:

- Slope: $m = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sum(x_i - \bar{x})^2}$
- Intercept: $c = \bar{y} - m\bar{x}$
- Fitted Value: $\hat{y}_i = m x_i + c$
- Forecast: $\hat{y}_{n} = m n + c$

## Risk Score

The StatFin AI Prototype Risk Score (0–100) classifies user risk into three tiers:

| Range | Tier | Description |
|---|---|---|
| 0–39 | 🟢 LOW RISK | Stable surplus, healthy savings, flat trend |
| 40–69 | 🟡 MODERATE RISK | Narrowing margin, lifestyle creep warnings |
| 70–100 | 🔴 HIGH RISK | Critical expense ratio, negative savings, upward trend |

### Adaptive Weights

The scoring system automatically adapts based on historical data availability:

- **Quick Mode** (ratios only): Expense Ratio (45%), Savings Rate (45%), Discretionary Share (10%).
- **Historical Mode** (full model): Expense Ratio (30%), Savings Rate (30%), Discretionary Share (15%), Trend Direction (15%), Outliers (10%).

## Technology Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge)

</div>

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Monochrome, Soft Dark theme)
- **Icons:** Lucide React
- **Charts:** Recharts (monochrome line, bar, pie rendering)
- **Spreadsheet Parsing:** XLSX (Excel and CSV reader)

## Local Development

Follow these steps to run the application locally:

1. Clone the repository and navigate to the project directory:
   ```bash
   cd statfin-ai
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application can be deployed to Vercel or any other hosting provider that supports Next.js App Router applications.

## Environment Variables

To enhance narratives using Generative AI, copy `.env.example` to `.env.local` and configure your API keys:

```env
# AI_PROVIDER option: "gemini" (or "google") or "openai"
AI_PROVIDER=gemini
AI_API_KEY=your_api_key_here
```

If these keys are left empty, the application runs entirely client-side using the local fallback engine, maintaining a 100% free, private experience.

## Supported Currencies

The application features a global currency selector that updates all formatting displays dynamically:

INR (₹) · USD ($) · EUR (€) · GBP (£) · JPY (¥) · CAD (C$) · AUD (A$) · SGD (S$) · AED (د.إ)

> **Note:** Currency selection updates display formatting only. Exchange-rate conversion is not currently performed.

## Sample Dataset

A sample dataset containing 8 months of budget history is available for repository users and downloads:

- Repository path: `sample-data/sample-financial-data.csv`
- Public path: `public/sample-financial-data.csv`

You can download the template directly from the Analysis tab to test file uploads and time-series outliers.

## Privacy

Data security is built-in. StatFin AI stores your financial records strictly in browser `localStorage`. No database is utilized, and no financial records are transmitted externally unless you explicitly configure an AI provider env key.

## Limitations

- **Educational Prototype:** The risk indicator is a project-specific mathematical score and is not a clinical credit evaluation or certified financial rating.
- **Regression Sensitivity:** Linear regression models assume linear trends. Rapid changes or massive anomalies may distort forecasting accuracy.

## Future Improvements

- Incorporate non-linear time-series forecasting (e.g., ARIMA models in browser WASM).
- Add client-side PDF export with automated tables.

## Disclaimer

StatFin AI is an educational statistical analysis prototype. The Prototype Risk Score is a project-specific analytical indicator and has not been financially validated. This application does not provide professional financial, investment, lending, insurance, or tax advice.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2b2b2b,100:0f0f0f&height=100&section=footer" width="100%"/>
</div>
