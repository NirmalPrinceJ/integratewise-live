import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { OpenAIConnector } from "../../ai/openai";
import { AnthropicConnector } from "../../ai/anthropic";

/**
 * AI Domain Master — manages OpenAI, Anthropic (and future AI providers).
 */
export class AIMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "ai";
    readonly domainName = "AI & LLM Services";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "openai",
            name: "OpenAI",
            category: "llm",
            connectorClass: OpenAIConnector,
            authType: "api_key",
            requiredFields: ["apiKey"],
            description: "OpenAI — GPT models, embeddings, completions",
        },
        {
            id: "anthropic",
            name: "Anthropic",
            category: "llm",
            connectorClass: AnthropicConnector,
            authType: "api_key",
            requiredFields: ["apiKey"],
            description: "Anthropic — Claude models, messages API",
        },
    ];

    // ----- Unified AI operations -----

    async chat(messages: Array<{ role: "user" | "assistant"; content: string }>, options?: Record<string, any>): Promise<any> {
        const primary = this.primaryProviderId;
        if (primary === "openai") {
            const openai = this.getProvider<OpenAIConnector>("openai");
            return openai.createChatCompletion({
                model: options?.model || "gpt-4o",
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                max_tokens: options?.max_tokens || 4096,
                ...options,
            });
        }
        if (primary === "anthropic") {
            const anthropic = this.getProvider<AnthropicConnector>("anthropic");
            return anthropic.createMessage({
                model: options?.model || "claude-sonnet-4-20250514",
                max_tokens: options?.max_tokens || 4096,
                messages,
            });
        }
        throw new Error("No AI provider configured");
    }
}
