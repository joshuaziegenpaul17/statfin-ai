import { AgentInputData, AgentInsight, generateFallbackInsight } from './fallbackAgent';

/**
 * Attempts to generate financial insights via the server-side AI route handler.
 * If the server-side AI provider is not configured, or if the request fails,
 * it automatically falls back to the deterministic client-side reasoning engine.
 */
export async function generateFinancialInsight(data: AgentInputData): Promise<AgentInsight> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('AI analysis API returned non-OK status');
    }

    const result = await response.json();
    
    if (result.fallback || !result.summary) {
      return generateFallbackInsight(data);
    }

    return {
      summary: result.summary,
      findings: Array.isArray(result.findings) ? result.findings : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    };
  } catch (error) {
    console.warn('AI service failed or is unconfigured. Triggering local statistical fallback agent:', error);
    return generateFallbackInsight(data);
  }
}
