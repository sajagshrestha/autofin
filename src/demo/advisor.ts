import { DefaultChatTransport } from "ai";

/** Stream real AI replies from the sample-data-only public endpoint. */
export function createDemoAdvisorTransport(now = new Date()) {
	const demoDate = [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, "0"),
		String(now.getDate()).padStart(2, "0"),
	].join("-");
	return new DefaultChatTransport({
		api: "/api/demo/chat",
		credentials: "omit",
		prepareSendMessagesRequest: ({ messages }) => ({
			body: {
				demoDate,
				messages: messages.slice(-20).map(({ role, parts }) => ({
					role,
					content: parts
						.filter((part) => part.type === "text")
						.map((part) => part.text)
						.join("\n"),
				})),
			},
		}),
	});
}
