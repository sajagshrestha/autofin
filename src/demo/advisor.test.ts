import type { UIMessage } from "ai";
import { afterEach, expect, it, vi } from "vitest";
import { createDemoAdvisorTransport } from "./advisor";

afterEach(() => vi.unstubAllGlobals());

it("sends text-only history to the public demo endpoint without session credentials", async () => {
	const network = vi.fn().mockResolvedValue(
		new Response("data: [DONE]\n\n", {
			headers: {
				"content-type": "text/event-stream",
				"x-vercel-ai-ui-message-stream": "v1",
			},
		}),
	);
	vi.stubGlobal("fetch", network);
	const messages: UIMessage[] = Array.from({ length: 25 }, (_, index) => ({
		id: String(index),
		role: index % 2 ? "assistant" : "user",
		parts: [{ type: "text", text: `Message ${index}` }],
	}));
	await createDemoAdvisorTransport(new Date(2026, 8, 26)).sendMessages({
		trigger: "submit-message",
		chatId: "demo",
		messageId: undefined,
		abortSignal: undefined,
		messages,
	});
	const [url, options] = network.mock.calls[0];
	expect(url).toBe("/api/demo/chat");
	expect(options.credentials).toBe("omit");
	const body = JSON.parse(options.body);
	expect(body.demoDate).toBe("2026-09-26");
	expect(body.messages).toHaveLength(20);
	expect(body.messages.at(-1)).toEqual({ role: "user", content: "Message 24" });
	expect(body).not.toHaveProperty("data");
});
