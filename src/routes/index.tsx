import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Lenis from "lenis";
import {
	ArrowDown,
	ArrowUpRight,
	Check,
	ChevronDown,
	Expand,
	TrendingDown,
	X,
} from "lucide-react";
import {
	AnimatePresence,
	animate,
	motion,
	stagger,
	useMotionValue,
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
			{ title: "AutoFin — Expense tracking on autopilot" },
			{
				name: "description",
				content:
					"AutoFin automates your expense tracking. Connect Gmail and bank alerts become neat records and simple insights.",
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
		variant: "statement" | "email" | "transaction" | "dashboard";
	};
}[] = [
	{
		no: "01",
		title: "You pay as usual.",
		description:
			"Buy groceries, pay a bill, or send money. You don't need to do anything extra.",
		example: { variant: "statement" },
	},
	{
		no: "02",
		title: "Your bank sends an email.",
		description:
			"Your bank sends a receipt or alert to your Gmail, like it already does.",
		example: { variant: "email" },
	},
	{
		no: "03",
		title: "AutoFin sorts it for you.",
		description:
			"We pull out the amount and shop name, then put it in the right bucket, like Food or Travel.",
		example: { variant: "transaction" },
	},
	{
		no: "04",
		title: "You see simple insights.",
		description:
			"Open your dashboard to see what you spent, what you earned, and what is left.",
		example: { variant: "dashboard" },
	},
];

const FAQS = [
	{
		question: "How do I try it?",
		answer:
			"AutoFin is in closed beta. Tap Request access to email us. If you already have an account, just log in.",
	},
	{
		question: "Do I have to connect Gmail?",
		answer:
			"No. Gmail saves time, but you can also upload a bank statement, paste a bank SMS, or add a payment by hand.",
	},
	{
		question: "Can I fix a category?",
		answer:
			"Yes. You can change any category or make your own. If we are not sure, we leave it for you to check.",
	},
	{
		question: "What can I ask the AI helper?",
		answer:
			"Ask simple things like “How much did I spend on food this month?” It looks at your saved payments to answer.",
	},
];

function AccessButton({ className = "" }: { className?: string }) {
	return (
		<Button
			asChild
			size="lg"
			className={`h-12 gap-2.5 rounded-[10px] border-0 bg-foreground px-6 font-semibold text-background transition-opacity duration-150 hover:bg-foreground hover:opacity-85 max-[359px]:gap-2 max-[359px]:px-[18px] max-[359px]:text-[13px] ${className}`}
		>
			<a href={ACCESS_URL}>
				Request access <ArrowUpRight aria-hidden="true" className="size-4" />
			</a>
		</Button>
	);
}

function Eyebrow({ children }: { children: React.ReactNode }) {
	return (
		<p className="flex items-center gap-2.5 text-[10px] font-semibold leading-[1.6] tracking-[0.15em] text-muted-foreground max-md:text-[9px] max-md:tracking-[0.12em]">
			{children}
		</p>
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
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
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
				Bank: Nabil Bank · Created by AI · 98% sure
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
			<span className="h-screen shrink-0 overflow-hidden leading-none max-[900px]:h-[1em]">
				<motion.span
					className="block will-change-transform"
					animate={{ y: `-${(current - 1) * 25}%` }}
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
			<article className="relative py-[clamp(56px,7vw,96px)] max-[900px]:py-10">
				<div className="relative z-[1] max-w-[520px]">
					<p className="mb-3 hidden text-[13px] font-semibold tracking-[0.15em] text-muted-foreground tabular-nums max-[900px]:block">
						{step.no}
					</p>
					<h3
						ref={titleRef}
						className="text-[clamp(30px,3.2vw,44px)] leading-[1.1] tracking-[-0.035em] text-balance [font-weight:550]"
					>
						{step.title}
					</h3>
					<p className="mt-[14px] max-w-[44ch] text-base leading-[1.75] text-muted-foreground">
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
		<div ref={sectionRef} className="relative mt-2">
			<motion.div
				className="mb-4"
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			>
				<Eyebrow>HOW IT WORKS</Eyebrow>
				<h2 className="mt-[19px] text-[clamp(34px,3.6vw,48px)] font-medium leading-[1.13] tracking-[-0.045em] text-balance">
					Getting started is simple. The rest runs itself.
				</h2>
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
					<ol className="grid min-w-0 list-none">
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
			<div className="mx-auto grid max-w-[580px] justify-items-center gap-4 px-6 pb-2 pt-[clamp(56px,7vw,96px)] text-center">
				<h3 className="text-[clamp(28px,3vw,40px)] tracking-[-0.035em] text-balance [font-weight:550]">
					Every step runs itself.
				</h3>
				<p className="max-w-[46ch] text-base leading-[1.7] text-muted-foreground">
					Connect Gmail once — AutoFin handles every payment after that, at your
					pace.
				</p>
				<AccessButton className="mt-2" />
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

const heroContainer: Variants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.22, delayChildren: 0.35 },
	},
};

const heroCard: Variants = {
	hidden: { opacity: 0, y: 28 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
	},
};

function HeroVisual() {
	const reduceMotion = useReducedMotion();

	if (reduceMotion) {
		return (
			<div className="relative mx-auto w-full max-w-[420px]" aria-hidden="true">
				<MockCard>
					<EmailMock />
				</MockCard>
				<div className="flex justify-center py-1.5 text-muted-foreground">
					<ArrowDown className="size-4" />
				</div>
				<MockCard>
					<TransactionMock />
				</MockCard>
			</div>
		);
	}

	return (
		<motion.div
			className="relative mx-auto w-full max-w-[420px]"
			aria-hidden="true"
			variants={heroContainer}
			initial="hidden"
			animate="show"
		>
			<motion.div variants={heroCard}>
				<MockCard>
					<EmailMock />
				</MockCard>
			</motion.div>
			<motion.div
				variants={heroCard}
				className="flex justify-center py-1.5 text-muted-foreground"
			>
				<motion.span
					className="block"
					animate={{ y: [0, 4, 0] }}
					transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
				>
					<ArrowDown className="size-4" />
				</motion.span>
			</motion.div>
			<motion.div variants={heroCard}>
				<motion.div
					animate={{ y: [0, -6, 0] }}
					transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
				>
					<MockCard>
						<TransactionMock />
					</MockCard>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

function DemoFrame() {
	const reduceMotion = useReducedMotion();
	const [phase, setPhase] = useState<"loading" | "booting" | "ready">(
		"loading",
	);
	const [isOpen, setIsOpen] = useState(false);
	const pct = useMotionValue(4);
	const pctText = useTransform(pct, (v) => `${Math.round(v)}%`);
	const barWidth = useTransform(pct, (v) => `${v}%`);

	// Hold a fake loader on screen while the hero entrance finishes, then
	// boot the full demo app behind it. The iframe only reveals once it has
	// actually painted, so there is no flash of empty frame.
	useEffect(() => {
		const t = setTimeout(() => setPhase("booting"), reduceMotion ? 400 : 1500);
		return () => clearTimeout(t);
	}, [reduceMotion]);

	useEffect(() => {
		if (phase === "loading") {
			const controls = animate(
				pct,
				88,
				reduceMotion ? { duration: 0 } : { duration: 2.4, ease: "easeOut" },
			);
			return () => controls.stop();
		}
		if (phase === "ready") {
			const controls = animate(pct, 100, { duration: 0.35 });
			return () => controls.stop();
		}
	}, [phase, pct, reduceMotion]);

	useEffect(() => {
		if (phase !== "booting") return;
		const t = setTimeout(() => setPhase("ready"), 9000);
		return () => clearTimeout(t);
	}, [phase]);

	// Lock page scroll (including Lenis smooth scroll) while the modal is open.
	useEffect(() => {
		if (!isOpen) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
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
		if (isOpen) closeRef.current?.focus();
	}, [isOpen]);

	return (
		<>
			{/* Placeholder keeps the page flow stable while the frame is fixed. */}
			{isOpen && (
				<div aria-hidden="true" className="h-[780px] w-full max-md:h-[680px]" />
			)}
			<motion.div
				layout={!reduceMotion}
				transition={
					reduceMotion
						? { duration: 0 }
						: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
				}
				animate={{ borderRadius: isOpen ? 16 : 12 }}
				{...(isOpen
					? {
							role: "dialog",
							"aria-modal": true,
							"aria-label": "AutoFin full demo",
						}
					: {})}
				className={`group flex w-full flex-col overflow-hidden border border-border bg-background shadow-2xl ${
					isOpen
						? "fixed inset-0 z-[100] m-auto h-[min(860px,calc(100dvh-3rem))] w-[75vw] max-w-7xl"
						: "relative h-[780px] max-md:h-[680px]"
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
								<span className="flex items-center gap-2 text-xs font-medium">
									<span className="size-2 rounded-full bg-emerald-600" /> Live
									demo{" "}
									<span className="font-normal text-muted-foreground">
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
										Open in new tab{" "}
										<ArrowUpRight aria-hidden="true" className="size-4" />
									</a>
									<button
										ref={closeRef}
										type="button"
										onClick={() => setIsOpen(false)}
										aria-label="Close demo"
										className="inline-flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
									>
										<X aria-hidden="true" className="size-4" />
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="relative min-h-0 flex-1">
					{phase !== "loading" && (
						<iframe
							src="/demo"
							title="Interactive AutoFin demo with sample data"
							onLoad={() => setPhase("ready")}
							tabIndex={isOpen ? 0 : -1}
							aria-hidden={!isOpen}
							className={`absolute inset-0 block h-full w-full border-0 bg-background ${
								isOpen ? "" : "pointer-events-none"
							}`}
						/>
					)}
					{phase !== "ready" && (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
							<p className="text-sm text-muted-foreground">
								{phase === "loading"
									? "Preparing demo workspace"
									: "Loading sample data"}
							</p>
							<div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
								<motion.div
									className="h-full rounded-full bg-foreground"
									style={{ width: barWidth }}
								/>
							</div>
							<p className="text-xs tabular-nums text-muted-foreground">
								<motion.span>{pctText}</motion.span>
							</p>
						</div>
					)}
					{/* Overlay blocks the iframe's scroll so it never hijacks page
					    scroll. On hover it invites opening the semi-fullscreen view. */}
					{phase === "ready" && !isOpen && (
						<button
							type="button"
							onClick={() => setIsOpen(true)}
							aria-label="Open full demo"
							aria-haspopup="dialog"
							className="absolute inset-0 z-10 flex cursor-zoom-in items-center justify-center bg-black/25 backdrop-blur-[1px] transition-colors duration-200 hover:bg-black/55 focus-visible:bg-black/55 focus-visible:outline-none"
						>
							<span className="flex translate-y-1 items-center gap-2.5 rounded-full border border-border bg-background/90 px-5 py-3 text-sm font-semibold shadow-xl opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100">
								<Expand aria-hidden="true" className="size-4" />
								Open full demo
							</span>
						</button>
					)}
				</div>
			</motion.div>

			<AnimatePresence>
				{isOpen && (
					<motion.button
						type="button"
						aria-label="Close full demo"
						onClick={() => setIsOpen(false)}
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
							Product
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
			</header>

			<main id="home-content">
				<section className="mx-auto w-[min(1200px,calc(100%-96px))] pb-[72px] pt-[88px] max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)] max-md:pb-9 max-md:pt-11">
					<div className="relative grid grid-cols-[1.2fr_1fr] items-center gap-[clamp(40px,5vw,80px)] max-lg:gap-[35px] max-md:grid-cols-1 max-md:gap-10">
						<div>
							<motion.h1
								className="relative text-[clamp(60px,7vw,100px)] leading-none tracking-[-0.065em] text-balance [font-weight:550] max-lg:text-[64px] max-md:text-[clamp(42px,13vw,78px)]"
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
							>
								Expense tracking,
								<br />
								<span aria-hidden="true">
									on Auto
									<FlipBrandWord />
								</span>
								<span className="sr-only">on Autopilot.</span>
							</motion.h1>
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.7,
									delay: 0.3,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<div className="mt-8 flex flex-wrap items-center gap-5 max-[359px]:gap-[14px]">
									<AccessButton />
									<TextLink href="#how-it-works">
										See how it works{" "}
										<ArrowDown aria-hidden="true" className="size-4" />
									</TextLink>
								</div>
							</motion.div>
						</div>
						<HeroVisual />
					</div>
				</section>

				<section
					id="product"
					aria-labelledby="product-title"
					className="mx-auto w-[min(1200px,calc(100%-96px))] scroll-mt-6 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)]"
				>
					<Reveal>
						<Eyebrow>TRY IT NOW</Eyebrow>
						<h2
							id="product-title"
							className="mt-[19px] max-w-xl text-[clamp(34px,3.6vw,48px)] font-medium leading-[1.13] tracking-[-0.045em] text-balance"
						>
							See your money, clearly.
						</h2>
						<p className="mt-4 max-w-md text-base leading-[1.75] text-muted-foreground">
							A live demo with sample data. Try the filters and charts.
						</p>
					</Reveal>

					<motion.div
						className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_24px_65px_-40px_#0006]"
						initial={{ opacity: 0, y: 16, scale: 0.99 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					>
						<div className="flex min-h-[62px] items-center justify-between gap-3 border-b border-border px-5 py-2.5 max-md:min-h-[54px] max-md:p-2">
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
					<div className="flex justify-between gap-4 pt-[15px] text-[11px] text-muted-foreground max-md:gap-2.5 max-md:text-[9px]">
						<span>The real app, with sample data.</span>
						<span>Click around — nothing will break.</span>
					</div>
				</section>

				<section
					id="how-it-works"
					aria-labelledby="workflow-title"
					className="mx-auto w-[min(1200px,calc(100%-96px))] scroll-mt-6 py-[108px] max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)] max-md:py-16"
				>
					<h2 id="workflow-title" className="sr-only">
						How it works
					</h2>
					<HowItWorksTimeline />
				</section>

				<section
					id="questions"
					aria-labelledby="questions-title"
					className="mx-auto grid w-[min(1200px,calc(100%-96px))] scroll-mt-6 grid-cols-[1fr_1.2fr] gap-[85px] py-[108px] max-lg:w-[calc(100%-56px)] max-lg:gap-[45px] max-md:w-[calc(100%-40px)] max-md:grid-cols-1 max-md:gap-8 max-md:py-16"
				>
					<Reveal>
						<div>
							<Eyebrow>GOOD TO KNOW</Eyebrow>
							<h2 className="mt-[19px] text-[clamp(34px,3.6vw,48px)] font-medium leading-[1.13] tracking-[-0.045em] text-balance">
								Questions,
								<br />
								answered simply.
							</h2>
							<p className="mt-5 max-w-xs text-base leading-[1.75] text-muted-foreground">
								Still curious? Email us and we will reply.
							</p>
							<TextLink href={ACCESS_URL} className="mt-3">
								Get in touch{" "}
								<ArrowUpRight aria-hidden="true" className="size-4" />
							</TextLink>
						</div>
					</Reveal>
					<div>
						{FAQS.map(({ question, answer }, i) => (
							<motion.details
								key={question}
								className="group border-b border-border first:border-t"
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-40px" }}
								transition={{ duration: 0.7, delay: i * 0.05 }}
							>
								<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
									{question}
									<ChevronDown
										aria-hidden="true"
										className="size-5 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180"
									/>
								</summary>
								<p className="pb-6 pr-6 text-sm leading-[1.8] text-muted-foreground">
									{answer}
								</p>
							</motion.details>
						))}
					</div>
				</section>

				<section
					className="mx-auto w-[min(1200px,calc(100%-96px))] pb-16 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)] sm:pb-24"
					aria-labelledby="start-title"
				>
					<Reveal>
						<div className="flex items-center justify-between gap-10 rounded-[20px] border border-border bg-muted p-[52px] max-lg:p-9 max-md:flex-col max-md:items-start max-md:gap-[30px] max-md:p-[30px_24px]">
							<div>
								<p className="flex items-center gap-2.5 text-[10px] font-semibold leading-[1.6] tracking-[0.15em] text-muted-foreground max-md:text-[9px] max-md:tracking-[0.12em]">
									<span
										className="size-1.5 shrink-0 rounded-full bg-emerald-500"
										aria-hidden="true"
									/>{" "}
									NOW IN CLOSED BETA
								</p>
								<h2 className="mt-[19px] text-[clamp(34px,3.6vw,48px)] font-medium leading-[1.13] tracking-[-0.045em] text-balance">
									See your money
									<br />
									more clearly.
								</h2>
								<p className="mt-5 text-muted-foreground max-md:text-sm max-md:leading-[1.7]">
									Less manual work. More peace of mind.
								</p>
							</div>
							<div className="flex shrink-0 flex-col items-center gap-5 max-md:items-start">
								<AccessButton />
								<span className="flex items-center gap-2 text-xs text-muted-foreground">
									<Check aria-hidden="true" className="size-3.5" /> Already have
									access?{" "}
									<Link to="/login" className="underline underline-offset-4">
										Log in
									</Link>
								</span>
							</div>
						</div>
					</Reveal>
				</section>
			</main>

			<footer className="mx-auto flex w-[min(1200px,calc(100%-96px))] items-center justify-between gap-[30px] border-t border-border py-9 max-lg:w-[calc(100%-56px)] max-md:w-[calc(100%-40px)] max-md:flex-col max-md:items-start">
				<div>
					<Logo className="h-7" />
					<p className="mt-3 text-xs text-muted-foreground">
						Clear money, every day.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
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
