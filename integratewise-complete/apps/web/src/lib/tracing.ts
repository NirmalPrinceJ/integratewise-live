/** Set up for OpenTelemetry tracing **/
import { Resource } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import {
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

// Initialize tracing only once
let tracingInitialized = false;

export function initializeTracing() {
  if (tracingInitialized) {
    return;
  }

  try {
    const exporter = new OTLPTraceExporter({
      url: "http://localhost:4318/v1/traces",
    });

    const resource = new Resource({
      [ATTR_SERVICE_NAME]: "integratewise-os",
      [ATTR_SERVICE_VERSION]: "1.0.0",
    });

    const provider = new NodeTracerProvider({
      resource,
      spanProcessors: [
        new SimpleSpanProcessor(exporter)
      ],
    });

    provider.register();

    // Register instrumentations for AI SDKs
    registerInstrumentations({
      instrumentations: [
        new OpenAIInstrumentation({
          // Configure OpenAI instrumentation if needed
          traceContent: true,
        }),
      ],
    });

    tracingInitialized = true;
    console.log("✅ OpenTelemetry tracing initialized");
  } catch (error) {
    console.warn("⚠️ Failed to initialize tracing:", error);
  }
}

/** Set up for OpenTelemetry tracing **/