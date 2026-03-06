# OpenRouter AI Provider Integration

## Overview

IntegrateWise OS now uses **OpenRouter** as the primary AI provider. OpenRouter is a unified API gateway that provides access to 50+ AI models from OpenAI, Anthropic, Google, Meta, and more through a single API key.

## Benefits

- **Single API Key**: One key for all AI models (GPT-4, Claude, Llama, Gemini, etc.)
- **Automatic Fallbacks**: If one model is unavailable, OpenRouter can route to alternatives
- **Cost Optimization**: Compare pricing across providers and choose the best value
- **Usage Tracking**: Unified billing and usage analytics
- **No Vendor Lock-in**: Easily switch models without code changes

## Getting Started

### 1. Get Your API Key

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Navigate to [Keys](https://openrouter.ai/keys)
3. Create a new API key
4. Copy the key (starts with `sk-or-v1-`)

### 2. Configure Secrets

Add your OpenRouter API key to `.secrets`:

```bash
# .secrets
OPENROUTER_API_KEY="sk-or-v1-your-key-here"
```

Then run the secrets setup:

```bash
./scripts/setup-secrets.sh staging
```

### 3. Environment Variables

For local development, add to your `.env.local`:

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## Available Models

### Chat/Completion Models

| Alias | Model ID | Best For |
|-------|----------|----------|
| `gpt-4o` | `openai/gpt-4o` | General purpose, high quality |
| `gpt-4o-mini` | `openai/gpt-4o-mini` | Fast, cost-effective |
| `claude-3.5-sonnet` | `anthropic/claude-3.5-sonnet` | Complex analysis, coding |
| `claude-3-opus` | `anthropic/claude-3-opus` | Highest quality reasoning |
| `llama-3.1-70b` | `meta-llama/llama-3.1-70b-instruct` | Open source, no data retention |
| `gemini-pro-1.5` | `google/gemini-pro-1.5` | Long context, multimodal |
| `deepseek-coder` | `deepseek/deepseek-coder` | Cost-effective coding |

### Embedding Models

| Alias | Model ID | Dimensions |
|-------|----------|------------|
| `text-embedding-3-small` | `openai/text-embedding-3-small` | 1536 |
| `text-embedding-3-large` | `openai/text-embedding-3-large` | 3072 |

## Architecture

### Services Using OpenRouter

| Service | Usage |
|---------|-------|
| **knowledge** | Document embeddings, semantic search |
| **think** | Semantic lookup, evidence analysis |
| **iq-hub** | Session search, memory retrieval |

### Code Example

```typescript
import { OpenRouterClient, DEFAULT_MODELS } from '@integratewise/lib';

// Create client
const client = new OpenRouterClient({
  apiKey: env.OPENROUTER_API_KEY,
  siteUrl: 'https://integratewise.co',
  siteName: 'IntegrateWise OS',
});

// Chat completion
const response = await client.chat({
  model: DEFAULT_MODELS.chat,  // anthropic/claude-3.5-sonnet
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Analyze this sales data...' },
  ],
  temperature: 0.7,
});

// Generate embedding
const embedding = await client.embedText('Document content here');
```

### Fallback Behavior

The services support fallback to direct OpenAI API if OpenRouter is not configured:

```typescript
function getEmbedder(env: Bindings): EmbeddingService {
    // Prefer OpenRouter if API key is available
    if (env.OPENROUTER_API_KEY) {
        return createOpenRouterEmbedder(env.OPENROUTER_API_KEY);
    }
    // Fallback to direct OpenAI API
    if (env.OPENAI_API_KEY) {
        return createOpenAIEmbedder(env.OPENAI_API_KEY);
    }
    throw new Error('No AI API key configured');
}
```

## Migration from Direct APIs

If you're migrating from direct Anthropic/OpenAI APIs:

1. **Get OpenRouter key** at openrouter.ai
2. **Update `.secrets`**:
   ```bash
   OPENROUTER_API_KEY="sk-or-v1-..."
   # Comment out or remove:
   # ANTHROPIC_API_KEY="..."
   # OPENAI_API_KEY="..."
   ```
3. **Redeploy services**:
   ```bash
   ./scripts/setup-secrets.sh staging
   pnpm deploy:staging
   ```

## Cost Optimization Tips

1. **Use GPT-4o-mini** for simple tasks (10x cheaper than GPT-4o)
2. **Use DeepSeek** for coding tasks (very cost-effective)
3. **Use Claude Haiku** for high-volume, simple classification
4. **Cache embeddings** - they're deterministic for the same input
5. **Monitor usage** at openrouter.ai/activity

## Troubleshooting

### "No AI API key configured"
- Check that `OPENROUTER_API_KEY` is set in `.secrets`
- Run `./scripts/setup-secrets.sh staging` to deploy secrets

### "OpenRouter embedding error: 401"
- Verify your API key is valid at openrouter.ai/keys
- Ensure the key has sufficient credits

### Rate Limiting
- OpenRouter has generous rate limits
- If hitting limits, the `EmbeddingService` has built-in retry logic

## Security

- **Never commit** `.secrets` or API keys to git
- **Rotate keys** regularly at openrouter.ai/keys
- **Use staging keys** for development/testing
- **Monitor usage** for unexpected activity

## Related Files

- [packages/lib/src/openrouter.ts](packages/lib/src/openrouter.ts) - OpenRouter client library
- [services/knowledge/src/embedding/service.ts](services/knowledge/src/embedding/service.ts) - Embedding service with OpenRouter support
- [services/think/src/semantic-lookup.ts](services/think/src/semantic-lookup.ts) - Semantic search with OpenRouter
- [scripts/setup-secrets.sh](scripts/setup-secrets.sh) - Secrets deployment script
