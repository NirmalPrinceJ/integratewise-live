// src/services/think/think-worker.ts
import { Ai } from '@cloudflare/ai';
import { withTracing, tracer } from '../../utils/tracing';

interface ThinkRequest {
  context: {
    category: 'personal' | 'csm' | 'business';
    scope: Record<string, any>;
    user_id: string;
  };
  data: any; // Filtered Spine data
  query: string; // User's question or insight request
}

interface ThinkResponse {
  insights: string[];
  recommendations: string[];
  confidence: number;
}

const thinkHandler = async (request: Request, env: any) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const ai = new Ai(env.AI);

  try {
    const body: ThinkRequest = await request.json();

    const spanId = tracer.startSpan('think_process', 'think-service', {
      category: body.context.category,
      user_id: body.context.user_id
    });

    // Context-aware prompt engineering
    const prompt = buildContextAwarePrompt(body);
    tracer.setAttribute(spanId, 'prompt_length', prompt.length);

    // Use Workers AI for inference
    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are an AI assistant providing insights for business intelligence.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const insights = parseAIResponse(response.response);
    tracer.setAttribute(spanId, 'insights_count', insights.insights.length);

    // Log to Analytics Engine
    await logToAnalytics(env, {
      event: 'think_insight_generated',
      context: body.context,
      confidence: insights.confidence,
      timestamp: Date.now()
    });

    tracer.endSpan(spanId);

    return new Response(JSON.stringify(insights), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Think Worker error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export default withTracing(thinkHandler);

function buildContextAwarePrompt(body: ThinkRequest): string {
  const { context, data, query } = body;

  let prompt = `Context: ${context.category} user`;

  if (context.category === 'personal') {
    prompt += ` (ID: ${context.scope.owner_id}). Data: ${JSON.stringify(data)}. Query: ${query}`;
  } else if (context.category === 'csm') {
    prompt += ` managing account ${context.scope.account_id}. Data: ${JSON.stringify(data)}. Query: ${query}`;
  } else if (context.category === 'business') {
    prompt += ` viewing portfolio. Data: ${JSON.stringify(data)}. Query: ${query}`;
  }

  return prompt + '. Provide actionable insights and recommendations.';
}

function parseAIResponse(response: string): ThinkResponse {
  // Parse the AI response into structured format
  // This is a simplified example
  return {
    insights: [response],
    recommendations: [],
    confidence: 0.8
  };
}

async function logToAnalytics(env: any, data: any) {
  // Send to Cloudflare Analytics Engine
  const response = await fetch(`https://analytics.cloudflare.com/write`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.ANALYTICS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error('Failed to log to Analytics:', response.statusText);
  }
}