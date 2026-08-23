import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

export type AIProviderName = "openai" | "anthropic" | "google";
const DEFAULT_PROVIDER: AIProviderName = "google";

/**
 * Get the configured AI provider based on environment variable.
 * Defaults to OpenAI if not specified.
 *
 * Set AI_PROVIDER environment variable to switch:
 * - 'openai' (default) - requires OPENAI_API_KEY
 * - 'anthropic' - requires ANTHROPIC_API_KEY
 * - 'google' - requires GOOGLE_GENERATIVE_AI_API_KEY
 */
export function getAIProvider() {
	const provider = (process.env.AI_PROVIDER ||
		DEFAULT_PROVIDER) as AIProviderName;

	switch (provider) {
		case "anthropic":
			return createAnthropic();
		case "google":
			return createGoogleGenerativeAI();
		default:
			return createOpenAI();
	}
}

/**
 * Get the default model ID for the configured provider.
 * These are cost-effective models suitable for structured extraction tasks.
 */
export function getDefaultModelId(): string {
	const provider = (process.env.AI_PROVIDER ||
		DEFAULT_PROVIDER) as AIProviderName;

	switch (provider) {
		case "anthropic":
			return "claude-sonnet-4-20250514";
		case "google":
			return "gemini-2.5-flash-lite";
		default:
			return "gpt-4o-mini";
	}
}

/**
 * Get the AI model instance ready for use with generateObject/generateText
 */
export function getAIModel() {
	const provider = getAIProvider();
	const modelId = getDefaultModelId();

	return provider(modelId);
}

/** Model ID for the full (non-lite) model — used for the advisor chat. */
const ADIVISOR_MODEL_IDS: Record<AIProviderName, string> = {
	google: "gemini-2.5-flash",
	openai: "gpt-4o",
	anthropic: "claude-sonnet-4-20250514",
};

/**
 * Model for the financial-advisor chat: full-size variant of the configured
 * provider for better multi-step tool reasoning.
 */
export function getAdvisorModel() {
	const providerName = (process.env.AI_PROVIDER ||
		DEFAULT_PROVIDER) as AIProviderName;
	return getAIProvider()(ADIVISOR_MODEL_IDS[providerName]);
}
