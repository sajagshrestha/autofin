import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Lenis from "lenis";
import {
	ArrowDown,
	ArrowUpRight,
	Bell,
	ChartNoAxesCombined,
	Check,
	ChevronDown,
	Expand,
	FileUp,
	HandCoins,
	MessageSquare,
	PencilLine,
	Search,
	SlidersHorizontal,
	Sparkles,
	TrendingDown,
	X,
} from "lucide-react";
import {
	AnimatePresence,
	motion,
	stagger,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
	type Variants,
} from "motion/react";
import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { CategoryBarChartContent } from "@/components/charts/CategoryBarChart";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSessionUserFn } from "@/server/functions/session.fns";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const { user } = await getSessionUserFn();
		if (user) throw redirect({ to: "/dashboard" });
	},
	head: () => ({
		meta: [
			{ title: "AutoFin — Automatic expense tracking from bank alerts" },
			{
				name: "description",
				content:
					"Turn bank alerts into organized transactions. Track spending, income, and loans, import statements or SMS, and ask AI questions about your money.",
			},
		],
	}),
	component: LandingPage,
});

const ACCESS_URL =
	"mailto:sajagshrestha0852@gmail.com?subject=AutoFin%20beta%20access";

const FLOW_STEPS: {
	no: string;
	title: string;
	description: string;
	example: {
		variant: "setup" | "statement" | "email" | "transaction" | "dashboard";
	};
}[] = [
	{
		no: "01",
		title: "Connect Gmail",
		description:
			"Connect Gmail, add your bank’s sender address, and enable email watching in Settings.",
		example: { variant: "setup" },
	},
	{
		no: "02",
		title: "Make a payment",
		description:
			"Pay as you normally would. Your bank records the transaction, like this NPR 850 purchase at Big Mart.",
		example: { variant: "statement" },
	},
	{
		no: "03",
		title: "Receive a bank alert",
		description:
			"Your bank emails the payment details. AutoFin watches for alerts from the senders you selected.",
		example: { variant: "email" },
	},
	{
		no: "04",
		title: "Get an organized transaction",
		description:
			"AutoFin extracts the amount, merchant, and date, then categorizes the purchase. You can correct any details.",
		example: { variant: "transaction" },
	},
	{
		no: "05",
		title: "See your spending",
		description:
			"The transaction joins your other records in the dashboard. Compare income and expenses, categories, and monthly savings.",
		example: { variant: "dashboard" },
	},
];

const FAQS = [
	{
		question: "How can I try AutoFin?",
		answer:
			"Explore the demo with sample data—no account or Gmail connection needed. AutoFin is in closed beta; Request beta access opens an email to the team to ask for an invitation. If you already have access, log in.",
	},
	{
		question: "Do I have to connect Gmail?",
		answer:
			"No. You can import a PDF or image of a bank statement, paste a transaction SMS, or add a transaction manually. Gmail is optional and automates imports from the sender addresses you choose.",
	},
	{
		question: "Will it work with my bank?",
		answer:
			"Automatic imports need transaction alerts delivered to Gmail. Add your bank’s sender address as a source and enable email watching. Email and statement formats vary, so check your first imports for accuracy. You can also use SMS or manual entry.",
	},
	{
		question: "What does connecting Gmail allow?",
		answer:
			"AutoFin uses Gmail permissions to read matching alerts, manage the labels and filters used for imports, and mark processed messages as read. You choose the sender addresses in Settings, and can stop email watching or disconnect Gmail there.",
	},
	{
		question: "Can I correct transactions and categories?",
		answer:
			"Yes. Edit transaction details, add notes, change categories, or create your own. You can also add custom instructions for AI categorization in Settings. AI can make mistakes, so review imported records.",
	},
	{
		question: "Can I track money I lend or borrow?",
		answer:
			"Yes. Track loans given or taken, counterparties, due dates, repayments, and remaining balances. Link transactions to a loan, and use the dashboard filter to exclude loan-linked transfers from your spending and income totals.",
	},
	{
		question: "What can I ask the AI assistant?",
		answer:
			"Ask questions such as “How much did I spend on food this month?” or “Which loans are still outstanding?” The assistant uses your recorded transactions and loans to answer. You can also connect compatible external AI assistants from Settings.",
	},
	{
		question: "Is the savings figure my bank balance?",
		answer:
			"No. Savings is income minus expenses in your recorded transactions for the selected period. It is not a live bank balance, and missing transactions will affect the totals.",
	},
];

const FEATURES = [
	{
		icon: ChartNoAxesCombined,
		title: "Understand your cash flow",
		description:
			"See income, expenses, and savings together. Switch date ranges and explore spending by day, month, or category.",
	},
	{
		icon: Search,
		title: "Find the transaction you need",
		description:
			"Search your records and filter by date, bank, category, or transaction type. Add notes and correct details in one place.",
	},
	{
		icon: HandCoins,
		title: "Keep track of loans",
		description:
			"See who owes you and what you owe, record repayments, and track due dates. Exclude loan transfers from dashboard totals when you need to.",
	},
	{
		icon: SlidersHorizontal,
		title: "Organize it your way",
		description:
			"Create categories, change AI suggestions, and add your own categorization rules. Manage bank email sources and their alternate names.",
	},
	{
		icon: Sparkles,
		title: "Ask questions about your money",
		description:
			"Ask the built-in AI assistant about spending, trends, and outstanding loans. Connect compatible AI assistants from Settings, too.",
	},
	{
		icon: Bell,
		title: "Stay up to date",
		description:
			"Enable browser notifications for import updates, then open your transactions to review what has been added.",
	},
];

const IMPORT_METHODS = [
	{
		icon: FileUp,
		title: "Import a statement",
		description:
			"Upload a PDF or statement image, review extracted transactions, and check possible duplicates before saving.",
	},
	{
		icon: MessageSquare,
		title: "Paste a bank SMS",
		description:
			"Turn a transaction message into a record without typing every field yourself.",
	},
	{
		icon: PencilLine,
		title: "Add it yourself",
		description:
			"Record cash purchases or any transaction that did not arrive as a bank alert.",
	},
];

function FaqItem({ question, answer }: (typeof FAQS)[number]) {
	const [open, setOpen] = useState(false);
	const id = useId();
	const reduceMotion = useReducedMotion();

	return (
		<Reveal className="border-b border-border first:border-t">
			<h3>
				<button
					type="button"
					id={id}
					aria-expanded={open}
					aria-controls={`${id}-answer`}
					onClick={() => setOpen((value) => !value)}
					className="flex w-full items-center justify-between gap-6 rounded-sm py-6 text-left text-[15px] font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					{question}
					<ChevronDown
						aria-hidden="true"
						className={`size-5 shrink-0 text-muted-foreground transition-transform duration-250 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
					/>
				</button>
			</h3>
			<motion.div
				id={`${id}-answer`}
				aria-labelledby={id}
				aria-hidden={!open}
				inert={!open}
				initial={false}
				animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
				transition={{
					duration: reduceMotion ? 0 : 0.25,
					ease: [0.22, 1, 0.36, 1],
				}}
				className="overflow-hidden"
			>
				<p className="pb-6 pr-6 text-sm leading-[1.8] text-muted-foreground">
					{answer}
				</p>
			</motion.div>
		</Reveal>
	);
}

function AccessButton({ className = "" }: { className?: string }) {
	return (
		<Button
			asChild
			size="lg"
			className={`h-12 gap-2.5 rounded-[10px] border-0 bg-foreground px-6 font-semibold text-background transition-opacity duration-150 hover:bg-foreground hover:opacity-85 max-[359px]:gap-2 max-[359px]:px-[18px] max-[359px]:text-[13px] ${className}`}
		>
			<a href={ACCESS_URL}>
				Request beta access{" "}
				<ArrowUpRight aria-hidden="true" className="size-4" />
			</a>
		</Button>
	);
}

function SectionHeading({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	return (
		<h2
			id={id}
			className="text-center text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl"
		>
			{children}
		</h2>
	);
}

function TextLink({
	href,
	children,
	className = "",
}: {
	href: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<a
			href={href}
			className={`inline-flex items-center gap-3 text-[13px] font-medium underline-offset-[5px] hover:underline max-[359px]:gap-[7px] max-[359px]:text-xs ${className}`}
		>
			{children}
		</a>
	);
}

function Reveal({
	children,
	delay = 0,
	className,
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}) {
	const reduceMotion = useReducedMotion();
	return (
		<motion.div
			className={className}
			initial={reduceMotion ? false : { opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{
				duration: reduceMotion ? 0 : 0.7,
				delay: reduceMotion ? 0 : delay,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{children}
		</motion.div>
	);
}

function MockCard({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`relative z-[1] overflow-hidden rounded-[18px] border border-border bg-[color-mix(in_srgb,var(--foreground)_3%,var(--background))] p-[20px_22px] shadow-[0_24px_50px_-36px_#0008] ${className}`}
		>
			{children}
		</div>
	);
}

function ExampleShell({ children }: { children: React.ReactNode }) {
	return <MockCard className="mt-6">{children}</MockCard>;
}

const STATEMENT_ROWS = [
	{
		date: "Sep 12",
		desc: "Big Mart",
		amount: "− NPR 850.00",
		tone: "debit",
	},
	{
		date: "Sep 11",
		desc: "Salary — Himalayan Tech",
		amount: "+ NPR 85,000.00",
		tone: "credit",
	},
	{
		date: "Sep 10",
		desc: "eSewa wallet top-up",
		amount: "− NPR 2,000.00",
		tone: "debit",
	},
] as const;

function GmailSetupMock() {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-sm font-semibold">Gmail</p>
				<Badge variant="secondary" className="gap-1.5 font-normal">
					<Check aria-hidden="true" className="size-3.5" />
					Connected
				</Badge>
			</div>
			<dl className="divide-y divide-border rounded-lg border border-border px-3">
				<div className="py-3">
					<dt className="text-xs text-muted-foreground">Bank source</dt>
					<dd className="mt-1 text-sm font-medium">Nabil Bank</dd>
				</div>
				<div className="py-3">
					<dt className="text-xs text-muted-foreground">Sender email</dt>
					<dd className="mt-1 break-all text-sm">alerts@nabilbank.com</dd>
				</div>
				<div className="flex items-center justify-between gap-3 py-3">
					<dt className="text-sm">Email watching</dt>
					<dd className="flex items-center gap-1.5 text-sm font-medium">
						<Check aria-hidden="true" className="size-3.5" />
						Enabled
					</dd>
				</div>
			</dl>
		</div>
	);
}

function StatementMock() {
	return (
		<div>
			<div className="flex items-baseline justify-between gap-3">
				<p className="text-sm font-semibold">Nabil Bank · Savings ••4521</p>
				<p className="shrink-0 text-[11px] text-muted-foreground">
					September 2026
				</p>
			</div>
			<div
				className="mt-3 flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
				aria-hidden="true"
			>
				<span className="w-12 shrink-0">Date</span>
				<span className="min-w-0 flex-1">Remarks</span>
				<span className="shrink-0">Amount</span>
			</div>
			<div className="divide-y divide-border">
				{STATEMENT_ROWS.map((row) => (
					<div key={row.desc} className="flex items-baseline gap-3 py-2.5">
						<span className="w-12 shrink-0 text-[11px] tabular-nums text-muted-foreground">
							{row.date}
						</span>
						<span className="min-w-0 flex-1 truncate text-[13px]">
							{row.desc}
						</span>
						<span
							className={`shrink-0 text-[13px] font-medium tabular-nums ${row.tone === "debit" ? "text-ds-red-700 dark:text-ds-red-900" : "text-ds-green-700 dark:text-ds-green-900"}`}
						>
							{row.amount}
						</span>
					</div>
				))}
			</div>
			<div className="flex items-baseline justify-between gap-3 border-t border-border pt-2.5">
				<span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
					Closing balance
				</span>
				<span className="text-sm font-semibold tabular-nums">
					NPR 1,42,350.00
				</span>
			</div>
		</div>
	);
}

function EmailMock() {
	return (
		<div>
			<div className="flex items-center gap-3">
				<span
					className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
					aria-hidden="true"
				>
					N
				</span>
				<div className="min-w-0 flex-1">
					<p className="truncate text-[13px] font-semibold">
						Nabil Bank{" "}
						<span className="font-normal text-muted-foreground">
							&lt;alerts@nabilbank.com&gt;
						</span>
					</p>
					<p className="text-[11px] text-muted-foreground">
						to me · Sep 12, 6:42 PM
					</p>
				</div>
			</div>
			<p className="mt-3 text-sm font-semibold">
				Subject: Rs. 850 debited — Big Mart
			</p>
			<p className="mt-1.5 text-[13px] leading-[1.7] text-muted-foreground">
				Dear Customer, Rs. 850.00 has been debited from A/C XX4521 on
				12-Sep-2026. Avl Bal: Rs. 1,42,350.00. — Nabil Bank
			</p>
		</div>
	);
}

function TransactionMock() {
	return (
		<div>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<p className="truncate text-[15px] font-medium">Big Mart</p>
					<p className="mt-0.5 text-xs text-muted-foreground">
						Sep 12, 2026, 6:42 PM
					</p>
				</div>
				<p className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ds-red-700 dark:text-ds-red-900">
					<TrendingDown aria-hidden="true" className="size-4 shrink-0" />
					NPR 850.00
				</p>
			</div>
			<div className="mt-3 flex flex-wrap items-center gap-2">
				<Badge variant="secondary" className="font-normal">
					<span aria-hidden="true" className="mr-1">
						🛒
					</span>
					Groceries
				</Badge>
				<Badge variant="outline" className="uppercase">
					debit
				</Badge>
			</div>
			<p className="mt-3 text-[13px] text-muted-foreground">
				Nabil Bank · AI-categorized · Editable
			</p>
		</div>
	);
}

const DASHBOARD_CATEGORIES = [
	{ name: "Groceries", value: 8400, fill: "#0072f5" },
	{ name: "Dining out", value: 5200, fill: "#45a557" },
	{ name: "Transport", value: 3100, fill: "#ffb224" },
];

function DashboardMock() {
	return (
		<div>
			<div className="flex items-baseline justify-between gap-3">
				<p className="text-sm font-semibold">Your money, at a glance</p>
				<p className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
					September 2026
				</p>
			</div>
			<div className="mt-3 grid grid-cols-2 gap-2.5">
				<div className="relative overflow-hidden rounded-xl border border-border bg-card p-3">
					<span
						className="absolute inset-y-0 left-0 w-[3px] bg-ds-red-700"
						aria-hidden="true"
					/>
					<p className="pl-1.5 text-[11px] text-muted-foreground">
						Total Expenses
					</p>
					<p className="mt-0.5 truncate pl-1.5 text-base font-bold tabular-nums text-ds-red-700">
						NPR 24,310
					</p>
				</div>
				<div className="relative overflow-hidden rounded-xl border border-border bg-card p-3">
					<span
						className="absolute inset-y-0 left-0 w-[3px] bg-ds-green-700"
						aria-hidden="true"
					/>
					<p className="pl-1.5 text-[11px] text-muted-foreground">
						Total Income
					</p>
					<p className="mt-0.5 truncate pl-1.5 text-base font-bold tabular-nums text-ds-green-700">
						NPR 85,000
					</p>
				</div>
			</div>
			<p className="mt-4 text-[13px] font-semibold">Spending by category</p>
			<div className="mt-1">
				<CategoryBarChartContent data={DASHBOARD_CATEGORIES} height={150} />
			</div>
		</div>
	);
}

function FlowExample({ step }: { step: (typeof FLOW_STEPS)[number] }) {
	return (
		<ExampleShell>
			{step.example.variant === "setup" ? <GmailSetupMock /> : null}
			{step.example.variant === "statement" ? <StatementMock /> : null}
			{step.example.variant === "email" ? <EmailMock /> : null}
			{step.example.variant === "transaction" ? <TransactionMock /> : null}
			{step.example.variant === "dashboard" ? <DashboardMock /> : null}
		</ExampleShell>
	);
}

function RollingNumber({ current }: { current: number }) {
	const reduceMotion = useReducedMotion();
	return (
		<div
			className="flex items-center text-[clamp(150px,19vw,260px)] font-medium leading-none tracking-[-0.06em] text-muted-foreground tabular-nums select-none [font-weight:550] max-[900px]:text-[120px] max-md:text-[96px]"
			aria-hidden="true"
		>
			<span className="shrink-0 leading-none">0</span>
			<span className="h-screen shrink-0 leading-none max-[900px]:h-[1em]">
				<motion.span
					className="block will-change-transform"
					animate={{ y: `-${(current - 1) * (100 / FLOW_STEPS.length)}%` }}
					transition={
						reduceMotion
							? { duration: 0 }
							: { duration: 1.15, ease: [0.16, 1, 0.3, 1] }
					}
				>
					{FLOW_STEPS.map((s) => (
						<span
							key={s.no}
							className="flex h-screen items-center justify-center leading-none max-[900px]:h-[1em]"
						>
							{s.no[1]}
						</span>
					))}
				</motion.span>
			</span>
		</div>
	);
}

function TimelineStep({
	step,
	index,
	onActiveChange,
}: {
	step: (typeof FLOW_STEPS)[number];
	index: number;
	onActiveChange: (index: number, isActive: boolean) => void;
}) {
	const titleRef = useRef<HTMLHeadingElement>(null);

	// scrollYProgress hits 1 exactly when this step's title meets the middle
	// of the viewport — the moment it becomes the active step.
	const { scrollYProgress } = useScroll({
		target: titleRef,
		offset: ["start end", "start center"],
	});

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		onActiveChange(index, value >= 1);
	});

	return (
		<motion.li
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-64px" }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
		>
			<article
				className={
					index === 0
						? "relative pb-[clamp(32px,4vw,56px)] max-[900px]:pb-6"
						: "relative py-[clamp(32px,4vw,56px)] max-[900px]:border-t max-[900px]:border-border max-[900px]:py-6"
				}
			>
				<div className="relative z-[1] max-w-[520px] max-[900px]:max-w-none">
					<div className="max-[900px]:flex max-[900px]:items-center max-[900px]:gap-3">
						<p className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-xs font-medium text-muted-foreground tabular-nums max-[900px]:flex">
							{step.no}
						</p>
						<h3
							ref={titleRef}
							className="text-[clamp(30px,3.2vw,44px)] leading-[1.1] tracking-[-0.035em] text-balance [font-weight:550] max-[900px]:text-2xl"
						>
							{step.title}
						</h3>
					</div>
					<p className="mt-[14px] max-w-[44ch] text-base leading-[1.75] text-muted-foreground max-[900px]:max-w-none max-[900px]:text-sm">
						{step.description}
					</p>
					<FlowExample step={step} />
				</div>
			</article>
		</motion.li>
	);
}

function HowItWorksTimeline() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [current, setCurrent] = useState(1);
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start 0.85", "end 0.55"],
	});
	const drawProgress = useSpring(scrollYProgress, {
		stiffness: 90,
		damping: 25,
		mass: 0.5,
	});
	// Settle the sticky number a little lower as the section ends, so it
	// sits closer to the last step instead of floating at viewport center.
	const endNudge = useSpring(
		useTransform(scrollYProgress, [0.7, 1], [0, 110]),
		{
			stiffness: 90,
			damping: 25,
			mass: 0.5,
		},
	);
	// Steps are stacked top-to-bottom, so an active step means everything
	// above it is active too, and an inactive step means everything below it
	// is inactive. Those bounds make the updates order-independent.
	const handleStepActive = useCallback((index: number, isActive: boolean) => {
		setCurrent((prev) =>
			isActive ? Math.max(prev, index + 1) : Math.min(prev, Math.max(index, 1)),
		);
	}, []);

	return (
		<div ref={sectionRef} className="relative">
			<motion.div
				className="mb-8"
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			>
				<SectionHeading id="workflow-title">How it works</SectionHeading>
			</motion.div>
			<div className="relative">
				<svg
					className="pointer-events-none absolute left-[55%] top-[120px] z-0 h-[calc(100%-240px)] w-[160px] -translate-x-1/2 text-[color-mix(in_srgb,var(--foreground)_16%,transparent)] max-[900px]:hidden"
					aria-hidden="true"
					viewBox="0 0 100 800"
					preserveAspectRatio="none"
				>
					<path
						d="M50,0 C90,150 10,250 50,400 C90,550 10,650 50,800"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeDasharray="5 7"
					/>
					{reduceMotion ? null : (
						<motion.path
							d="M50,0 C90,150 10,250 50,400 C90,550 10,650 50,800"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-foreground"
							style={{ pathLength: drawProgress, opacity: 0.65 }}
						/>
					)}
				</svg>
				<div className="relative z-[1] grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] items-stretch gap-[clamp(32px,5vw,80px)] max-[900px]:grid-cols-1">
					<ol className="grid min-w-0 list-none max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[640px]">
						{FLOW_STEPS.map((step, i) => (
							<TimelineStep
								key={step.no}
								step={step}
								index={i}
								onActiveChange={handleStepActive}
							/>
						))}
					</ol>
					<div className="relative min-w-0 max-[900px]:hidden">
						<motion.div
							className="sticky top-0 flex h-screen items-center justify-end max-[900px]:static max-[900px]:h-auto max-[900px]:justify-start"
							style={reduceMotion ? undefined : { y: endNudge }}
						>
							<RollingNumber current={current} />
						</motion.div>
					</div>
				</div>
			</div>
			<Reveal className="mx-auto grid max-w-[580px] justify-items-center gap-4 px-6 pb-2 pt-[clamp(56px,7vw,96px)] text-center">
				<h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
					Other ways to add transactions
				</h3>
			</Reveal>
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{IMPORT_METHODS.map(({ icon: Icon, title, description }) => (
					<Reveal
						key={title}
						className="rounded-2xl border border-border bg-card p-6"
					>
						<Icon aria-hidden="true" className="size-5 text-muted-foreground" />
						<h4 className="mt-4 text-base font-semibold">{title}</h4>
						<p className="mt-2 text-sm leading-7 text-muted-foreground">
							{description}
						</p>
					</Reveal>
				))}
			</div>
		</div>
	);
}

const FLIP_WORDS = ["pilot", "fin"] as const;
const FLIP_DURATION = 3000;
const FLIP_EASE = [0.22, 1, 0.36, 1] as const;

const flipContainer: Variants = {
	hidden: { opacity: 0, y: 12 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.35,
			ease: FLIP_EASE,
			delayChildren: stagger(0.045),
		},
	},
	hide: {
		opacity: 0,
		transition: {
			duration: 0.15,
			delay: 0.5,
			ease: FLIP_EASE,
			delayChildren: stagger(0.035, { from: "last" }),
		},
	},
};

const flipLetter: Variants = {
	hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
	show: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { duration: 0.4, ease: FLIP_EASE },
	},
	hide: {
		opacity: 0,
		transition: { duration: 0.32, ease: FLIP_EASE },
	},
};

function FlipBrandWord() {
	const reduceMotion = useReducedMotion();
	const [index, setIndex] = useState(0);
	const [widths, setWidths] = useState({ pilot: 0, fin: 0 });
	const [swapped, setSwapped] = useState(false);
	const pilotRef = useRef<HTMLSpanElement>(null);
	const finRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (reduceMotion) return;
		const id = setInterval(() => {
			setIndex((v) => (v + 1) % FLIP_WORDS.length);
			setSwapped(true);
		}, FLIP_DURATION);
		return () => clearInterval(id);
	}, [reduceMotion]);

	useLayoutEffect(() => {
		const measure = () => {
			if (pilotRef.current && finRef.current) {
				setWidths({
					pilot: pilotRef.current.offsetWidth,
					fin: finRef.current.offsetWidth,
				});
			}
		};
		measure();
		document.fonts?.ready.then(measure).catch(() => {});
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);

	const word = FLIP_WORDS[index];

	if (reduceMotion) {
		return <span className="whitespace-nowrap">pilot</span>;
	}

	// Fixed-width slot so the layout never jumps. The dot erases back
	// across the slot while the word exits, then glides out with the new
	// word — positions calculated per word from measured widths.
	const slotW = Math.max(widths.pilot + 4, widths.fin);
	const wordW = index === 0 ? widths.pilot + 4 : widths.fin;
	const prevW = index === 0 ? widths.fin : widths.pilot;

	return (
		<>
			<span
				className="inline-block whitespace-nowrap text-left"
				style={slotW ? { width: slotW } : undefined}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key={word}
						className="inline-block whitespace-nowrap"
						aria-hidden="true"
						variants={flipContainer}
						initial="hidden"
						animate="show"
						exit="hide"
					>
						{word.split("").map((letter, i) => (
							<motion.span
								key={`${word}-${i}`}
								className="inline-block"
								variants={flipLetter}
							>
								{letter}
							</motion.span>
						))}
					</motion.span>
				</AnimatePresence>
			</span>
			<motion.span
				aria-hidden="true"
				className="ml-[0.12em] inline-block size-[0.14em] rounded-full bg-[#A83533]"
				initial={false}
				animate={
					swapped ? { x: [prevW - slotW, -slotW, wordW - slotW] } : { x: 0 }
				}
				transition={{
					duration: 1,
					times: [0, 0.46, 1],
					ease: [0.22, 1, 0.36, 1],
				}}
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute invisible left-0 top-0 whitespace-nowrap"
			>
				<span ref={pilotRef} className="inline-block whitespace-nowrap">
					pilot
				</span>
				<span ref={finRef} className="inline-block whitespace-nowrap">
					fin
				</span>
			</span>
		</>
	);
}

function DemoFrame() {
	const reduceMotion = useReducedMotion();
	const [isReady, setIsReady] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Mount after hydration so the iframe load event cannot fire before React listens.
	useEffect(() => setIsMounted(true), []);
	const [isOpen, setIsOpen] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// Lock page scroll (including Lenis smooth scroll) while the modal is open.
	useEffect(() => {
		if (!isOpen) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prevOverflow;
			window.removeEventListener("keydown", onKey);
		};
	}, [isOpen]);

	// A single iframe instance lives for the whole page lifetime. Opening the
	// "modal" never mounts a second copy — the same node morphs from its
	// inline slot into a centered overlay via a FLIP layout animation, so
	// the demo keeps its state and never reloads.
	const closeRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (!isOpen) return;
		closeRef.current?.focus({ preventScroll: true });
		return () => {
			requestAnimationFrame(() =>
				triggerRef.current?.focus({ preventScroll: true }),
			);
		};
	}, [isOpen]);

	return (
		<>
			{/* Keep the inline slot stable throughout both layout transitions. */}
			<div className="relative h-[780px] w-full max-md:h-[680px]">
				<motion.div
					layout={!reduceMotion}
					onLayoutAnimationStart={() => setIsTransitioning(true)}
					onLayoutAnimationComplete={() => setIsTransitioning(false)}
					style={{ zIndex: isOpen || isTransitioning ? 100 : undefined }}
					transition={
						reduceMotion
							? { duration: 0 }
							: { type: "spring", stiffness: 300, damping: 36, mass: 0.8 }
					}
					animate={{ borderRadius: isOpen ? 16 : 12 }}
					{...(isOpen
						? {
								role: "dialog",
								"aria-modal": true,
								"aria-label": "AutoFin full demo",
							}
						: {})}
					className={`group flex flex-col overflow-hidden border border-border bg-background shadow-2xl ${
						isOpen
							? "fixed inset-0 z-[100] m-auto h-[min(860px,calc(100dvh-3rem))] w-[min(1200px,calc(100vw-3rem))] max-md:w-[calc(100vw-1rem)] max-md:h-[calc(100dvh-1rem)]"
							: "relative w-full h-[780px] max-md:h-[680px]"
					}`}
				>
					<AnimatePresence initial={false}>
						{isOpen && (
							<motion.div
								key="demo-header"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={
									reduceMotion
										? { duration: 0 }
										: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
								}
								className="shrink-0 overflow-hidden border-b border-border"
							>
								<div className="flex min-h-[56px] items-center justify-between gap-3 px-5 py-2.5">
									<span className="flex items-center gap-2 whitespace-nowrap text-xs font-medium">
										<span className="size-2 shrink-0 rounded-full bg-emerald-600" />{" "}
										Live demo{" "}
										<span className="hidden font-normal text-muted-foreground sm:inline">
											· Sample data
										</span>
									</span>
									<div className="flex items-center gap-2">
										<a
											href="/demo"
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
										>
											New tab{" "}
											<ArrowUpRight aria-hidden="true" className="size-4" />
										</a>
										<button
											ref={closeRef}
											type="button"
											onClick={() => setIsOpen(false)}
											aria-label="Close demo"
											className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
										>
											<X aria-hidden="true" className="size-4" />
										</button>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="relative min-h-0 flex-1">
						{isMounted && (
							<iframe
								src="/demo"
								title="Interactive AutoFin demo with sample data"
								onLoad={() => setIsReady(true)}
								tabIndex={isOpen ? 0 : -1}
								aria-hidden={!isOpen}
								className={`absolute inset-0 block h-full w-full border-0 bg-background ${
									isOpen ? "" : "pointer-events-none"
								}`}
							/>
						)}
						{!isReady && (
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background p-6 text-center">
								<p role="status" className="text-sm text-muted-foreground">
									Loading the sample workspace…
								</p>
								<a
									href="/demo"
									target="_blank"
									rel="noreferrer"
									className="text-sm underline underline-offset-4"
								>
									Open demo in a new tab
								</a>
							</div>
						)}
						{/* Overlay blocks the iframe's scroll so it never hijacks page
					    scroll. On hover it invites opening the semi-fullscreen view. */}
						{isReady && !isOpen && (
							<button
								type="button"
								ref={triggerRef}
								onClick={() => setIsOpen(true)}
								aria-label="Open full demo"
								aria-haspopup="dialog"
								className="absolute inset-0 z-10 flex cursor-zoom-in items-center justify-center bg-black/10 transition-colors duration-200 hover:bg-black/55 focus-visible:bg-black/55 focus-visible:outline-none"
							>
								<span className="flex translate-y-1 items-center gap-2.5 rounded-full border border-border bg-background/90 px-5 py-3 text-sm font-semibold shadow-xl opacity-100 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100">
									<Expand aria-hidden="true" className="size-4" />
									Open full demo
								</span>
							</button>
						)}
					</div>
				</motion.div>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.button
						type="button"
						aria-label="Close full demo"
						onClick={() => setIsOpen(false)}
						data-lenis-prevent
						className="fixed inset-0 z-[90] cursor-zoom-out bg-black/60 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={
							reduceMotion
								? { duration: 0 }
								: { duration: 0.25, ease: "easeOut" }
						}
					/>
				)}
			</AnimatePresence>
		</>
	);
}

function LandingPage() {
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) return;
		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
		let raf = 0;
		const loop = (time: number) => {
			lenis.raf(time);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			lenis.destroy();
		};
	}, [reduceMotion]);

	return (
		<div className="min-h-screen overflow-x-clip bg-background text-foreground">
			<a
				href="#home-content"
				className="fixed left-3 top-3 z-[100] -translate-y-[200%] bg-foreground px-[18px] py-3 text-background focus:translate-y-0"
			>
				Skip to content
			</a>
			<header className="border-b border-border bg-background">
				<nav
					aria-label="Main navigation"
					className="mx-auto flex h-20 w-[min(1200px,calc(100%-96px))] items-center justify-between gap-5 max-lg:w-[calc(100%-56px)] max-md:h-[72px] max-md:w-[calc(100%-40px)]"
				>
					<Link to="/" aria-label="AutoFin home">
						<Logo className="h-9" />
					</Link>
					<div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
						<a
							href="#product"
							className="transition-colors duration-150 hover:text-foreground"
						>
							Live demo
						</a>
						<a
							href="#features"
							className="transition-colors duration-150 hover:text-foreground"
						>
							Features
						</a>
						<a
							href="#how-it-works"
							className="transition-colors duration-150 hover:text-foreground"
						>
							How it works
						</a>
						<a
							href="#questions"
							className="transition-colors duration-150 hover:text-foreground"
						>
							FAQ
						</a>
					</div>
					<div className="flex items-center gap-2 sm:gap-4">
						<ThemeSwitcher />
						<Button variant="outline" asChild className="rounded-full px-5">
							<Link to="/login">
								Log in <ArrowUpRight aria-hidden="true" className="size-3.5" />
							</Link>
						</Button>
					</div>
				</nav>
				<nav
					aria-label="Page sections"
					className="mx-auto flex w-[calc(100%-40px)] flex-wrap items-center justify-between gap-x-4 border-t border-border text-xs text-muted-foreground md:hidden"
				>
					{[
						["#product", "Live demo"],
						["#features", "Features"],
						["#how-it-works", "How it works"],
						["#questions", "FAQ"],
					].map(([href, label]) => (
						<a
							key={href}
							href={href}
							className="inline-flex min-h-11 items-center hover:text-foreground"
						>
							{label}
						</a>
					))}
				</nav>
			</header>

			<main
				id="home-content"
				className="flex flex-col gap-24 py-24 max-md:gap-16 max-md:py-16"
			>
				<section className="mx-auto w-[min(1200px,calc(100%-96px))] max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]">
					<div className="relative mx-auto max-w-[800px]">
						<div className="@container flex min-w-0 flex-col items-center text-center">
							<motion.p
								initial={reduceMotion ? false : { opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: reduceMotion ? 0 : 0.7,
									delay: reduceMotion ? 0 : 0,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
							>
								Personal finance tracking · Closed beta
							</motion.p>
							<motion.h1
								className="relative text-[clamp(28px,11.5cqw,76px)] leading-[1.05] tracking-[-0.065em] [font-weight:550]"
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
							>
								<span className="whitespace-nowrap">Expense tracking,</span>
								<br />
								<span aria-hidden="true">
									on Auto
									<FlipBrandWord />
								</span>
								<span className="sr-only">on Autopilot.</span>
							</motion.h1>
							<motion.p
								initial={reduceMotion ? false : { opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: reduceMotion ? 0 : 0.7,
									delay: reduceMotion ? 0 : 0.15,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="mt-6 max-w-[48ch] text-base leading-8 text-muted-foreground sm:text-lg"
							>
								AutoFin turns bank alerts in Gmail into organized transactions.
								See what you spend, what you earn, and who owes what—with less
								manual entry.
							</motion.p>
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.7,
									delay: 0.3,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<div className="mt-8 flex flex-wrap items-center justify-center gap-5 max-[359px]:gap-[14px]">
									<AccessButton />
									<TextLink href="#product">
										Explore the demo{" "}
										<ArrowDown aria-hidden="true" className="size-4" />
									</TextLink>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				<section
					id="product"
					aria-label="Live demo"
					className="mx-auto w-[min(1200px,calc(100%-96px))] scroll-mt-6 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]"
				>
					<motion.div
						className="rounded-2xl border border-border bg-muted shadow-[0_24px_65px_-40px_#0006]"
						initial={{ opacity: 0, y: 16, scale: 0.99 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					>
						<div className="flex min-h-[62px] rounded-t-2xl items-center justify-between gap-3 border-b border-border px-5 py-2.5 max-md:min-h-[54px] max-md:p-2">
							<span className="flex items-center gap-2 text-xs font-medium">
								<span className="size-2 rounded-full bg-emerald-600" /> Live
								demo{" "}
								<span className="font-normal text-muted-foreground">
									· Sample data
								</span>
							</span>
							<a
								href="/demo"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-3 text-[13px] font-medium underline-offset-[5px] hover:underline"
							>
								Open full demo{" "}
								<ArrowUpRight aria-hidden="true" className="size-4" />
							</a>
						</div>
						<DemoFrame />
					</motion.div>
				</section>

				<section
					id="features"
					aria-labelledby="features-title"
					className="mx-auto w-[min(1200px,calc(100%-96px))] scroll-mt-6 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]"
				>
					<Reveal>
						<SectionHeading id="features-title">What you can do</SectionHeading>
					</Reveal>
					<div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
						{FEATURES.map(({ icon: Icon, title, description }) => (
							<Reveal key={title}>
								<article className="border-t border-border pt-8">
									<Icon
										aria-hidden="true"
										className="size-6 text-muted-foreground"
									/>
									<h3 className="mt-5 text-lg font-semibold tracking-tight">
										{title}
									</h3>
									<p className="mt-3 text-sm leading-7 text-muted-foreground">
										{description}
									</p>
								</article>
							</Reveal>
						))}
					</div>
				</section>

				<section
					id="how-it-works"
					aria-labelledby="workflow-title"
					className="mx-auto w-[min(1200px,calc(100%-96px))] scroll-mt-6 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]"
				>
					<HowItWorksTimeline />
				</section>

				<section
					id="questions"
					aria-labelledby="questions-title"
					className="mx-auto w-[min(1200px,calc(100%-96px))] scroll-mt-6 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]"
				>
					<Reveal>
						<div className="text-center">
							<SectionHeading id="questions-title">
								Common questions
							</SectionHeading>
						</div>
					</Reveal>
					<div className="mx-auto mt-8 max-w-3xl">
						{FAQS.map((faq) => (
							<FaqItem key={faq.question} {...faq} />
						))}
					</div>
				</section>

				<section
					className="mx-auto w-[min(1200px,calc(100%-96px))] max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]"
					aria-labelledby="start-title"
				>
					<Reveal>
						<div className="flex flex-col items-center rounded-2xl border border-border bg-muted/40 px-6 py-12 text-center sm:px-12 sm:py-16">
							<h2
								id="start-title"
								className="max-w-[19ch] text-4xl font-medium leading-[1.1] tracking-[-0.045em] sm:text-5xl"
							>
								Spend less time tracking expenses.
							</h2>
							<div className="mt-8 flex flex-wrap justify-center gap-3">
								<AccessButton />
								<Button
									asChild
									variant="outline"
									size="lg"
									className="h-12 rounded-[10px] px-6"
								>
									<Link to="/demo">
										Explore demo{" "}
										<ArrowUpRight aria-hidden="true" className="size-4" />
									</Link>
								</Button>
							</div>
						</div>
					</Reveal>
				</section>
			</main>

			<footer className="mx-auto flex w-[min(1200px,calc(100%-96px))] items-center justify-between gap-[30px] border-t border-border py-9 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)] max-md:flex-col max-md:items-start">
				<div>
					<Logo className="h-7" />
					<p className="mt-3 text-xs text-muted-foreground">
						Bank alerts, spending insights, and loans in one place.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
					<a
						href="mailto:sajagshrestha0852@gmail.com"
						className="transition-colors duration-150 hover:text-foreground"
					>
						Get in touch
					</a>
					<Link
						to="/privacy"
						className="transition-colors duration-150 hover:text-foreground"
					>
						Privacy
					</Link>
					<Link
						to="/terms"
						className="transition-colors duration-150 hover:text-foreground"
					>
						Terms
					</Link>
					<span>© {new Date().getFullYear()} AutoFin</span>
				</div>
			</footer>
		</div>
	);
}
