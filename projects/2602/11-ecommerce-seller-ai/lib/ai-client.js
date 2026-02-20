/**
 * ListingPro AI - Claude API Client
 * Service worker용 API 래퍼 (DOM 접근 없음)
 */

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_TOKENS = 2048;

/**
 * Claude API 호출
 * @param {string} apiKey - Anthropic API key
 * @param {string} systemPrompt - 시스템 프롬프트
 * @param {string} userMessage - 사용자 메시지
 * @returns {Promise<string>} 응답 텍스트
 */
export async function callClaude(apiKey, systemPrompt, userMessage) {
  if (!apiKey) {
    throw new Error('API key is not set. Please add your Claude API key in the extension settings.');
  }

  let response;
  try {
    response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
  } catch (err) {
    throw new Error('Network error: Unable to reach the AI service. Check your internet connection.');
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 401) {
      throw new Error('Invalid API key. Please check your key in extension settings.');
    }
    if (status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (status === 529 || status >= 500) {
      throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
    // 기타 에러
    let detail = '';
    try {
      const body = await response.json();
      detail = body.error?.message || JSON.stringify(body);
    } catch { /* ignore parse error */ }
    throw new Error(`API error (${status}): ${detail || 'Unknown error'}`);
  }

  const data = await response.json();

  // content 배열에서 텍스트 추출
  const textBlock = data.content?.find(b => b.type === 'text');
  if (!textBlock?.text) {
    throw new Error('Empty response from AI. Please try again.');
  }
  return textBlock.text;
}

/**
 * Claude 응답에서 JSON 파싱 (코드블록 처리 포함)
 * @param {string} text - Claude 응답 텍스트
 * @returns {object} 파싱된 JSON
 */
export function parseJsonResponse(text) {
  // ```json ... ``` 코드블록 제거
  let cleaned = text.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
