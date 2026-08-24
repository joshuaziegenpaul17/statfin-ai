import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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
Leading Category: "${topCategory}" (${topCategoryPercentage.toFixed(1)}% of total expenses)
StatFin AI Prototype Risk Score: ${riskScore}/100
Risk Level: ${riskLevel}
Expense Trend: ${expenseTrend} (Slope: ₹${trendSlope.toFixed(1)}/month)
Anomalies Detected: ${anomaliesCount}

Please interpret these metrics, explain the risk level, and provide findings and recommendations.`;

    if (provider.toLowerCase() === 'gemini' || provider.toLowerCase() === 'google') {
      // Gemini API Call
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Data:\n${userPrompt}` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                summary: { type: 'STRING' },
                findings: { type: 'ARRAY', items: { type: 'STRING' } },
                recommendations: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: ['summary', 'findings', 'recommendations'],
            },
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.statusText}`);
      }

      const raw = await res.json();
      const text = raw.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini');
      
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);

    } else if (provider.toLowerCase() === 'openai') {
      // OpenAI API Call
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API error: ${res.statusText}`);
      }

      const raw = await res.json();
      const text = raw.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty response from OpenAI');

      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    // Default to fallback if provider is unrecognized
    return NextResponse.json({ fallback: true });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ fallback: true, error: error.message });
  }
}
