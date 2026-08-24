import { NextResponse } from 'next/server';

// Rate limiting local memory store fallback.
// In a serverless/production setting with multiple instances,
// you should connect a distributed database like Redis (e.g. Upstash or Vercel KV)
// to manage global shared rate limit states.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 20; // max 20 requests per minute per IP
  const windowMs = 60 * 1000;

  const current = rateLimitStore.get(ip);
  if (!current) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > current.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  current.count++;
  if (current.count > limit) {
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  // Edge-friendly rate limiting check
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { fallback: true, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const data = await request.json();

    const provider = process.env.AI_PROVIDER;
    const apiKey = process.env.AI_API_KEY;

    // Graceful fallback if AI is not configured
    if (!provider || !apiKey) {
      return NextResponse.json({ fallback: true });
    }

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
      trendSlope = 0,
      anomaliesCount = 0,
    } = data;

    // Strict Input Validation (Server-side defense)
    if (
      typeof income !== 'number' || isNaN(income) || !isFinite(income) || income < 0 ||
      typeof totalExpenses !== 'number' || isNaN(totalExpenses) || !isFinite(totalExpenses) || totalExpenses < 0 ||
      typeof savings !== 'number' || isNaN(savings) || !isFinite(savings) ||
      typeof savingsRate !== 'number' || isNaN(savingsRate) || !isFinite(savingsRate) ||
      typeof expenseRatio !== 'number' || isNaN(expenseRatio) || !isFinite(expenseRatio) ||
      typeof riskScore !== 'number' || isNaN(riskScore) || !isFinite(riskScore) || riskScore < 0 || riskScore > 100 ||
      typeof discretionaryRatio !== 'number' || isNaN(discretionaryRatio) || !isFinite(discretionaryRatio) || discretionaryRatio < 0
    ) {
      return NextResponse.json({ fallback: true, error: 'Invalid input parameters.' }, { status: 400 });
    }

    const systemPrompt = `You are the StatFin AI Financial Risk Agent. Your role is to interpret deterministic statistical results and generate a premium financial risk report.
You must return a JSON object with the following structure:
{
  "summary": "2 to 4 paragraphs explaining the risk profile, in professional MSc Statistics / financial analyst tone. Ensure paragraph breaks are included.",
  "findings": ["up to 5 key statistical findings, explaining a statistical fact and its direct implication."],
  "recommendations": ["3 to 5 actionable financial recommendations."]
}
CRITICAL RULES:
1. ONLY use the supplied statistical numbers. Never invent or extrapolate values.
2. The currency symbol to use is ₹ (Indian Rupee).
3. Do NOT provide investment, stock, tax, lending, or insurance advice. Keep recommendations strictly focused on budget optimization, saving margins, and risk mitigation.
4. Clearly state that this is an educational prototype risk score (not a validated financial system).`;

    const userPrompt = `Here are the statistical analysis results from the user's budget data:
Income: ₹${income.toLocaleString('en-IN')}
Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
Savings: ₹${savings.toLocaleString('en-IN')}
Savings Rate: ${savingsRate.toFixed(1)}%
Expense Ratio: ${expenseRatio.toFixed(1)}%
Discretionary Spending Ratio (Shopping + Entertainment + Other): ${discretionaryRatio.toFixed(1)}%
Top Spending Category: ${topCategory} (${topCategoryPercentage.toFixed(1)}%)
Risk Score: ${riskScore}/100 (${riskLevel})
Trend Direction: ${expenseTrend} (Slope: ${trendSlope.toFixed(2)})
Anomalies Detected: ${anomaliesCount} occurrences

Please interpret these metrics statistically and compile the risk report narrative.`;

    if (provider === 'gemini' || provider === 'google') {
      const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }

      const raw = await res.json();
      const text = raw.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini');

      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    if (provider === 'openai') {
      const apiURL = 'https://api.openai.com/v1/chat/completions';
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API returned status ${res.status}`);
      }

      const raw = await res.json();
      const text = raw.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from OpenAI');

      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    // Default to fallback if provider is unrecognized
    return NextResponse.json({ fallback: true });

  } catch (error) {
    // Technical errors are kept clean for public consumers (Cost/Security protection)
    console.error('API Route Error:', error);
    return NextResponse.json({ fallback: true, error: 'Something went wrong while generating the analysis. Please try again.' });
  }
}
