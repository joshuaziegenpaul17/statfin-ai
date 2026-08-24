import { AgentInputData, AgentInsight, generateFallbackInsight } from './fallbackAgent';

/**
 * Attempts to generate financial insights via the server-side AI route handler.
 * If the server-side AI provider is not configured, or if the request fails,
 * it automatically falls back to the deterministic client-side reasoning engine.
 * Includes an 8-second request timeout safeguard using AbortController.
 */
export async function generateFinancialInsight(data: AgentInputData): Promise<AgentInsight> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    clearTimeout(timeoutId);
    console.warn('AI service failed, timed out, or is unconfigured. Triggering local statistical fallback agent:', error);
    return generateFallbackInsight(data);
  }
}
