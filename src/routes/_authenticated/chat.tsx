import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { ArrowUp, Bot, Loader2, Sparkles, Square, User } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/chat")({
	component: ChatPage,
});

const SUGGESTIONS = [
	"How much did I spend this month?",
	"What's my biggest spending category?",
	"How does this month compare to last month?",
	"Any trends I should worry about?",
];

const TOOL_LABELS: Record<string, string> = {
	getSpendingSummary: "Summarizing your spending…",
	getSpendingByCategory: "Breaking down by category…",
	getMonthlyTrend: "Analyzing monthly trends…",
	listTransactions: "Searching your transactions…",
};

const markdownClass =
	"prose prose-sm dark:prose-invert max-w-none [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_p]:leading-relaxed [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-[0.85em] [&_table]:my-2 [&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:px-2 [&_td]:py-1";

function ChatPage() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [input, setInput] = useState("");

	const chat = useChat({
		transport: new DefaultChatTransport({ api: "/api/chat" }),
	});

	const { messages, sendMessage, status, stop, error, setMessages } = chat;
	const busy = status === "submitted" || status === "streaming";

	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages, status]);

	const onSend = () => {
		const text = input.trim();
		if (!text || busy) return;
		void sendMessage({ text });
		setInput("");
	};

	const rendered = useMemo(
		() =>
			messages.map((message) => ({
				id: message.id,
				role: message.role,
				parts: message.parts.map((part, index): ReactNode => {
					if (part.type === "text" && part.text) {
						return message.role === "assistant" ? (
							<div key={index} className={markdownClass}>
								<ReactMarkdown>{part.text}</ReactMarkdown>
							</div>
						) : (
							<p key={index} className="whitespace-pre-wrap">
								{part.text}
							</p>
						);
					}

					if (isToolUIPart(part)) {
						const name = getToolName(part);
						const label = TOOL_LABELS[name] ?? "Checking your data…";
						const done = part.state === "output-available";
						return (
							<div
								key={index}
								className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
							>
								{done ? (
									<Sparkles className="h-3 w-3" />
								) : (
									<Loader2 className="h-3 w-3 animate-spin" />
								)}
								{done ? label.replace("…", "") : label}
							</div>
						);
					}

					return null;
				}),
			})),
		[messages],
	);

	return (
		<div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col md:h-[calc(100vh-6rem)]">
			<div className="pb-4">
				<h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
					<Sparkles className="h-6 w-6 text-primary" />
					AI Advisor
				</h1>
				<p className="mt-1 text-muted-foreground">
					Ask anything about your money — it reads your real transactions.
				</p>
			</div>

			<div
				ref={scrollRef}
				className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card/40 p-4"
			>
				{rendered.length === 0 && !busy ? (
					<div className="flex h-full flex-col items-center justify-center gap-4 text-center">
						<div className="rounded-full bg-primary/10 p-4">
							<Bot className="h-8 w-8 text-primary" />
						</div>
						<div className="space-y-1">
							<p className="font-medium">Your money, on demand</p>
							<p className="max-w-sm text-sm text-muted-foreground">
								Ask about spending, trends, budgets — the advisor queries your
								actual transactions to answer.
							</p>
						</div>
						<div className="flex max-w-md flex-wrap justify-center gap-2">
							{SUGGESTIONS.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
									onClick={() => {
										void sendMessage({ text: suggestion });
									}}
								>
									{suggestion}
								</button>
							))}
						</div>
					</div>
				) : (
					rendered.map((message) => (
						<div
							key={message.id}
							className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
						>
							{message.role === "assistant" && (
								<div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
									<Bot className="h-4 w-4 text-primary" />
								</div>
							)}
							<div
								className={`max-w-[85%] space-y-2 rounded-xl px-3.5 py-2.5 text-sm ${
									message.role === "user"
										? "bg-primary text-primary-foreground"
										: "bg-muted/60"
								}`}
							>
								{message.parts}
							</div>
							{message.role === "user" && (
								<div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
									<User className="h-4 w-4 text-primary" />
								</div>
							)}
						</div>
					))
				)}
				{busy && rendered.at(-1)?.role === "user" && (
					<div className="flex gap-3">
						<div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<Bot className="h-4 w-4 text-primary" />
						</div>
						<div className="rounded-xl bg-muted/60 px-3.5 py-2.5">
							<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						</div>
					</div>
				)}
				{error && (
					<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
						{error.message}
					</div>
				)}
			</div>

			<div className="pt-3">
				<div className="flex items-end gap-2 rounded-xl border bg-background p-2 shadow-xs focus-within:ring-2 focus-within:ring-ring/40">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						rows={1}
						placeholder="Ask about your spending, trends, budgets…"
						className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								onSend();
							}
						}}
					/>
					{busy ? (
						<Button
							size="icon"
							variant="outline"
							className="h-9 w-9 shrink-0"
							onClick={() => stop()}
							aria-label="Stop generating"
						>
							<Square className="h-4 w-4" />
						</Button>
					) : (
						<Button
							size="icon"
							className="h-9 w-9 shrink-0"
							onClick={onSend}
							aria-label="Send message"
							disabled={!input.trim()}
						>
							<ArrowUp className="h-4 w-4" />
						</Button>
					)}
				</div>
				{messages.length > 0 && (
					<div className="pt-2 text-center">
						<button
							type="button"
							className="text-xs text-muted-foreground underline-offset-2 hover:underline"
							onClick={() => setMessages([])}
						>
							New conversation
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
