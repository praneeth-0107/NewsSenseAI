import type { Article } from '../types';

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function summarizeArticle(article: Article): Promise<string> {
  if (!GROQ_KEY) {
    throw new Error('No Groq API key configured. Set VITE_GROQ_API_KEY in .env');
  }

  const prompt = `Summarize the following news article in exactly 3 bullet points. Focus on business or industry insight. Be concise. Do NOT include any introductory text, heading, or preamble — start directly with the first bullet point.\n\nArticle title: ${article.title}\nDescription: ${article.description ?? 'N/A'}\nContent: ${article.content ?? 'N/A'}`;

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 250,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = errorBody;

    try {
      const json = JSON.parse(errorBody);
      errorMessage = json.error?.message || json.message || JSON.stringify(json);
    } catch {
      // Keep raw text if JSON parsing fails.
    }

    throw new Error(`Summarization failed: ${errorMessage}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim() ?? 'Unable to summarize the article.';
  // Strip any introductory line before the first bullet point
  const firstBullet = raw.search(/^[•\-\*]/m);
  return firstBullet > 0 ? raw.slice(firstBullet).trim() : raw;
}
