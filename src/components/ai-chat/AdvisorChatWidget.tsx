import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import {
	ArrowUp,
	Bot,
	Loader2,
	Maximize2,
	Minimize2,
	Sparkles,
	Square,
	User,
	X,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useAdvisorChat } from "./advisor-chat-context";

const SUGGESTIONS = [
	"How much did I spend this month?",
	"What's my biggest spending category?",
	"How does this month compare to last month?",
];

const TOOL_LABELS: Record<string, string> = {
	getSpendingSummary: "Summarizing your spending",
	getSpendingByCategory: "Breaking down by category",
	getMonthlyTrend: "Analyzing monthly trends",
	listTransactions: "Searching your transactions",
};

const markdownClass =
	"prose prose-sm dark:prose-invert max-w-none [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_p]:leading-relaxed [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-[0.85em] [&_table]:my-2 [&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:px-2 [&_td]:py-1";

function ChatMessages() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [input, setInput] = useState("");

	const chat = useChat({
		transport: new DefaultChatTransport({ api: "/api/chat" }),
	});

	const { messages, sendMessage, status, stop, error, setMessages } = chat;
	const busy = status === "submitted" || status === "streaming";

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll whenever the stream advances
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
						const label =
							TOOL_LABELS[getToolName(part)] ?? "Checking your data";
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
								{label}
								{done && <span className="opacity-60">✓</span>}
							</div>
						);
					}

					return null;
				}),
			})),
		[messages],
	);

	return (
		<>
			<div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
				{rendered.length === 0 && !busy ? (
					<div className="flex h-full flex-col items-center justify-center gap-4 text-center">
						<div className="rounded-full bg-primary/10 p-4">
							<Bot className="h-8 w-8 text-primary" />
						</div>
						<div className="space-y-1">
							<p className="font-medium">Your money, on demand</p>
							<p className="max-w-xs text-sm text-muted-foreground">
								Ask about spending, trends, budgets — the advisor queries your
								actual transactions to answer.
							</p>
						</div>
						<div className="flex max-w-xs flex-wrap justify-center gap-2">
							{SUGGESTIONS.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
									onClick={() => void sendMessage({ text: suggestion })}
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
							className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : ""}`}
						>
							{message.role === "assistant" && (
								<div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
									<Bot className="h-3.5 w-3.5 text-primary" />
								</div>
							)}
							<div
								className={`max-w-[85%] space-y-2 rounded-xl px-3 py-2 text-sm ${
									message.role === "user"
										? "bg-primary text-primary-foreground"
										: "bg-muted/60"
								}`}
							>
								{message.parts}
							</div>
							{message.role === "user" && (
								<div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
									<User className="h-3.5 w-3.5 text-primary" />
								</div>
							)}
						</div>
					))
				)}
				{busy && rendered.at(-1)?.role === "user" && (
					<div className="flex gap-2.5">
						<div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<Bot className="h-3.5 w-3.5 text-primary" />
						</div>
						<div className="rounded-xl bg-muted/60 px-3 py-2">
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

			<div className="border-t p-3">
				<div className="flex items-end gap-2 rounded-xl border bg-background p-2 shadow-xs focus-within:ring-2 focus-within:ring-ring/40">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						rows={1}
						placeholder="Ask about your money…"
						className="max-h-28 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
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
							disabled={!input.trim()}
							aria-label="Send message"
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
		</>
	);
}

/**
 * Global AI advisor: floating action button + slide-in panel with a
 * fullscreen mode. Mounted once in the authenticated layout so the
 * conversation persists across navigation.
 */
export function AdvisorChatWidget() {
	const { isOpen, isFullscreen, openChat, closeChat, toggleFullscreen } =
		useAdvisorChat();

	return (
		<>
			{/* Floating action button */}
			<button
				type="button"
				onClick={openChat}
				aria-label="Open AI advisor"
				className={`fixed bottom-20 right-4 z-[45] md:bottom-6 md:right-6 flex h-13 w-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl active:scale-95 ${
					isOpen ? "pointer-events-none scale-0 opacity-0" : ""
				}`}
			>
				<Sparkles className="h-5 w-5" />
				<span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
			</button>

			{/* Backdrop */}
			{isOpen && !isFullscreen && (
				<div
					className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-[2px]"
					onClick={closeChat}
					aria-hidden
				/>
			)}

			{/* Panel */}
			<section
				aria-label="AI financial advisor"
				className={`fixed z-[70] flex flex-col overflow-hidden bg-background shadow-2xl transition-transform duration-300 ease-out ${
					isFullscreen
						? "inset-0"
						: "inset-y-0 right-0 w-full sm:w-[420px] border-l rounded-none sm:rounded-l-2xl"
				} ${isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"}`}
			>
				<header className="flex items-center justify-between gap-2 border-b px-4 py-3">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Sparkles className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-sm font-semibold leading-tight">AI Advisor</p>
							<p className="text-xs leading-tight text-muted-foreground">
								Answers from your real transactions
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={toggleFullscreen}
							aria-label={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
						>
							{isFullscreen ? (
								<Minimize2 className="h-4 w-4" />
							) : (
								<Maximize2 className="h-4 w-4" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={closeChat}
							aria-label="Close advisor"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</header>

				{/* Keep mounted so the conversation survives open/close and navigation */}
				<div
					className={`${isOpen ? "flex flex-col" : "hidden"} flex-1 min-h-0`}
				>
					<ChatMessages />
				</div>
			</section>
		</>
	);
}
