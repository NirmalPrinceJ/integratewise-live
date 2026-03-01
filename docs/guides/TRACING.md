# OpenTelemetry Tracing Setup

This application uses OpenTelemetry for distributed tracing to monitor AI operations and API calls.

## Setup

1. **Dependencies Installed:**
   - `@opentelemetry/exporter-trace-otlp-proto` - OTLP trace exporter
   - `@opentelemetry/instrumentation` - Instrumentation framework
   - `@opentelemetry/resources` - Resource attributes
   - `@opentelemetry/sdk-trace-node` - Node.js trace SDK
   - `@opentelemetry/api` - OpenTelemetry API
   - `@traceloop/instrumentation-openai` - OpenAI SDK instrumentation

2. **Initialization:**
   - Tracing is initialized in `src/app/layout.tsx` on server-side startup
   - Custom tracing spans are added to AI operations in `packages/api/src/ai.ts`

3. **Trace Collector:**
   - Uses AI Toolkit's trace collector at `http://localhost:4318`
   - Run `ai-mlstudio.tracing.open` command in VS Code to start the trace viewer

## Traced Operations

### AI Operations
- **Service:** `integratewise-ai`
- **Spans:**
  - `processWithClaude` - Main AI processing function
  - `anthropic-api-call` - Anthropic Claude API calls

### Attributes Captured
- `ai.input` - User input text
- `ai.provider` - AI provider (anthropic)
- `ai.model` - Model used (claude-3-haiku-20240307)
- `ai.response_time_ms` - API response time
- `ai.response_length` - Response text length
- `ai.parsed_action` - Parsed intent action
- `ai.error` - Error flag
- `http.status_code` - HTTP response status

## Usage

Traces are automatically collected when:
1. The application starts (tracing initialized)
2. AI commands are processed via `processWithClaude()`
3. Anthropic API calls are made

View traces in the AI Toolkit trace viewer opened via VS Code command.