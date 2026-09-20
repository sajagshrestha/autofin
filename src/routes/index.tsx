import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
	ArrowDown,
	ArrowRight,
	ArrowUpRight,
	Check,
	ChevronDown,
	FolderTree,
	LayoutDashboard,
	Mail,
	MessageSquareText,
	Sparkles,
	Wallet,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { getSessionUserFn } from "@/server/functions/session.fns";
import "@/styles/landing.css";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const { user } = await getSessionUserFn();
		if (user) throw redirect({ to: "/dashboard" });
	},
	head: () => ({
		meta: [
			{ title: "AutoFin — Your finances, on autopilot." },
			{
				name: "description",
				content:
					"Sync Gmail and let AI categorize your bank transactions automatically. Explore spending, income, and savings in one clear dashboard.",
			},
		],
	}),
	component: LandingPage,
});

const ACCESS_URL =
	"mailto:sajagshrestha0852@gmail.com?subject=AutoFin%20beta%20access";

const STEPS = [
	{
		number: "01",
		icon: Mail,
		title: "Connect Gmail once.",
		description:
			"Connect your Gmail account. AutoFin syncs your bank transaction alerts and extracts the details for you.",
		label: "Bank alerts · Automatic imports",
	},
	{
		number: "02",
		icon: FolderTree,
		title: "Let AI organize the details.",
		description:
			"AI matches transactions to your categories and creates new ones when needed. You can review and change any category.",
		label: "AI categorization · Your control",
	},
	{
		number: "03",
		icon: LayoutDashboard,
		title: "Your insights stay up to date.",
		description:
			"As your transactions sync, your spending charts, income totals, and savings overview update with them.",
		label: "Spending · Income · Savings",
	},
];

const FAQS = [
	{
		question: "How do I get access?",
		answer:
			"AutoFin is currently in closed beta. Use Request access to email the developer. If you already have an account, you can log in right away.",
	},
	{
		question: "Do I have to connect Gmail?",
		answer:
			"No. You can import a bank statement as a PDF or image, paste a transaction SMS, or enter a transaction manually. Connecting Gmail is an optional way to import bank alerts.",
	},
	{
		question: "Can I change a transaction’s category?",
		answer:
			"Yes. You can review and edit a transaction’s category, and create your own categories. When there isn’t enough information to categorize a transaction, it stays uncategorized for you to review.",
	},
	{
		question: "What can I ask the AI advisor?",
		answer:
			"Ask questions about your recorded transactions, spending patterns, or categories. The advisor uses your transaction history to help you explore where your money goes.",
	},
];

function AccessButton({ className = "" }: { className?: string }) {
	return (
		<Button asChild size="lg" className={`landing-cta ${className}`}>
			<a href={ACCESS_URL}>
				Request access <ArrowUpRight aria-hidden="true" className="size-4" />
			</a>
		</Button>
	);
}

function LandingPage() {
	return (
		<div className="landing min-h-screen bg-background text-foreground">
			<a href="#home-content" className="landing-skip">
				Skip to content
			</a>
			<header className="landing-header">
				<nav
					aria-label="Main navigation"
					className="landing-container flex h-20 items-center justify-between gap-5"
				>
					<Link to="/" aria-label="AutoFin home">
						<Logo className="h-9" />
					</Link>
					<div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
						<a href="#product" className="landing-nav-link">
							The product
						</a>
						<a href="#how-it-works" className="landing-nav-link">
							How it works
						</a>
						<a href="#questions" className="landing-nav-link">
							FAQs
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
				<section className="landing-container landing-hero">
					<div className="landing-eyebrow">
						<span className="landing-status" /> GMAIL CONNECTED. FINANCES
						SORTED.
					</div>
					<div className="landing-hero-copy">
						<h1>
							Your finances.
							<br />
							<span className="landing-accent">On autopilot.</span>
						</h1>
						<div className="landing-hero-aside">
							<p>Connect Gmail. Let AI handle the tracking.</p>
							<p className="landing-description">
								AutoFin syncs your bank alerts, categorizes transactions with
								AI, and keeps your spending picture up to date. The routine work
								happens automatically.
							</p>
							<div className="landing-hero-actions mt-7 flex flex-wrap items-center gap-5">
								<AccessButton />
								<a href="#product" className="landing-text-link">
									Try it live{" "}
									<ArrowDown aria-hidden="true" className="size-4" />
								</a>
							</div>
							<p className="mt-4 text-xs text-muted-foreground">
								Currently in closed beta. Built for everyday money.
							</p>
						</div>
					</div>
				</section>

				<section
					id="product"
					aria-labelledby="product-title"
					className="landing-container landing-product"
				>
					<h2 id="product-title" className="sr-only">
						A look inside AutoFin
					</h2>

					<div className="landing-product-tabs">
						<div className="landing-preview-toolbar">
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
								className="landing-text-link"
							>
								Open full demo{" "}
								<ArrowUpRight aria-hidden="true" className="size-4" />
							</a>
						</div>
						<iframe
							src="/demo"
							title="Interactive AutoFin demo with read-only sample data"
							className="landing-demo-frame"
							loading="lazy"
						/>
					</div>
					<div className="landing-preview-caption">
						<span>The real app. Ready to explore.</span>
						<span>Try the filters, charts, and transaction details.</span>
					</div>

					<div className="landing-capabilities">
						<span>
							<Mail aria-hidden="true" /> Gmail auto-sync
						</span>
						<span>
							<Sparkles aria-hidden="true" /> AI categorization
						</span>
						<span>
							<FolderTree aria-hidden="true" /> Automatic insights
						</span>
						<span>
							<Sparkles aria-hidden="true" /> Cash-flow tracking
						</span>
					</div>
				</section>

				<section
					id="how-it-works"
					aria-labelledby="workflow-title"
					className="landing-container landing-section"
				>
					<div className="landing-section-intro">
						<div>
							<p className="landing-eyebrow">
								CONNECT ONCE. KEEP GETTING CLARITY.
							</p>
							<h2 id="workflow-title">
								Less busywork.
								<br />
								More big picture.
							</h2>
						</div>
						<p className="landing-description max-w-sm">
							From a bank email to a categorized transaction to a spending
							insight. AutoFin connects the steps, so you don’t have to.
						</p>
					</div>
					<div className="landing-steps">
						{STEPS.map(({ number, icon: Icon, title, description, label }) => (
							<article key={number} className="landing-step">
								<div className="mb-8 flex items-center justify-between">
									<span className="landing-step-number">{number}</span>
									<Icon
										aria-hidden="true"
										className="size-6 text-muted-foreground"
									/>
								</div>
								<h3>{title}</h3>
								<p className="landing-description mt-3">{description}</p>
								<p className="landing-step-label">{label}</p>
							</article>
						))}
					</div>
				</section>

				<section aria-labelledby="everyday-title" className="landing-everyday">
					<div className="landing-container landing-everyday-grid">
						<div className="landing-everyday-copy">
							<p className="landing-eyebrow">
								<Sparkles aria-hidden="true" className="size-4" /> AUTOMATION
								THAT ADDS UP
							</p>
							<h2 id="everyday-title">
								The alerts keep coming.
								<br />
								The admin doesn’t.
							</h2>
							<p className="landing-description mt-6 max-w-md">
								Stop copying amounts from emails and sorting them into a
								spreadsheet. Gmail sync and AI categorization do the repetitive
								work, while you stay in control.
							</p>
							<div className="landing-benefits">
								<div>
									<Wallet aria-hidden="true" />
									<div>
										<h3>Your cash flow, at a glance.</h3>
										<p>See what came in, what went out, and what’s left.</p>
									</div>
								</div>
								<div>
									<FolderTree aria-hidden="true" />
									<div>
										<h3>Details when you need them.</h3>
										<p>
											Follow a spending category back to the transactions behind
											it.
										</p>
									</div>
								</div>
								<div>
									<MessageSquareText aria-hidden="true" />
									<div>
										<h3>A question? Just ask.</h3>
										<p>Explore your recorded spending with the AI advisor.</p>
									</div>
								</div>
							</div>
							<a href="#questions" className="landing-text-link">
								A few things worth knowing{" "}
								<ArrowRight aria-hidden="true" className="size-4" />
							</a>
						</div>
						<section
							className="landing-automation-flow"
							aria-label="Automatic transaction workflow"
						>
							<div className="landing-automation-item">
								<span className="landing-automation-icon">
									<Mail aria-hidden="true" />
								</span>
								<div>
									<span className="landing-eyebrow">01 · GMAIL SYNC</span>
									<h3>Your bank sends an alert.</h3>
									<p>AutoFin imports the transaction details.</p>
								</div>
								<Check aria-hidden="true" className="size-4 text-emerald-600" />
							</div>
							<div className="landing-flow-connector">
								<ArrowDown aria-hidden="true" className="size-4" />
							</div>
							<div className="landing-automation-item">
								<span className="landing-automation-icon">
									<Sparkles aria-hidden="true" />
								</span>
								<div>
									<span className="landing-eyebrow">
										02 · AI CATEGORIZATION
									</span>
									<h3>AI puts it in the right place.</h3>
									<p>Groceries, dining, transport, and more.</p>
								</div>
								<Check aria-hidden="true" className="size-4 text-emerald-600" />
							</div>
							<div className="landing-flow-connector">
								<ArrowDown aria-hidden="true" className="size-4" />
							</div>
							<div className="landing-automation-item">
								<span className="landing-automation-icon">
									<LayoutDashboard aria-hidden="true" />
								</span>
								<div>
									<span className="landing-eyebrow">03 · YOUR BIG PICTURE</span>
									<h3>Your overview catches up.</h3>
									<p>Spending, income, and savings in one view.</p>
								</div>
								<Check aria-hidden="true" className="size-4 text-emerald-600" />
							</div>
							<p className="mt-6 text-center text-xs text-muted-foreground">
								From bank alert to insight. Automatically.
							</p>
						</section>
					</div>
				</section>

				<section
					id="questions"
					aria-labelledby="questions-title"
					className="landing-container landing-section landing-faq-grid"
				>
					<div>
						<p className="landing-eyebrow">GOOD TO KNOW</p>
						<h2 id="questions-title">
							A little clarity,
							<br />
							before you start.
						</h2>
						<p className="landing-description mt-5 max-w-xs">
							Have something else on your mind?
						</p>
						<a href={ACCESS_URL} className="landing-text-link mt-3">
							Get in touch{" "}
							<ArrowUpRight aria-hidden="true" className="size-4" />
						</a>
					</div>
					<div>
						{FAQS.map(({ question, answer }) => (
							<details key={question} className="landing-faq">
								<summary>
									{question}
									<ChevronDown aria-hidden="true" className="size-5 shrink-0" />
								</summary>
								<p>{answer}</p>
							</details>
						))}
					</div>
				</section>

				<section
					className="landing-container pb-16 sm:pb-24"
					aria-labelledby="start-title"
				>
					<div className="landing-closing">
						<div>
							<p className="landing-eyebrow">
								<span className="landing-status" /> NOW IN CLOSED BETA
							</p>
							<h2 id="start-title">
								Make room for
								<br />a clearer picture.
							</h2>
							<p className="mt-5 text-muted-foreground">
								Less time piecing it together. More time getting on with life.
							</p>
						</div>
						<div className="landing-closing-action">
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
				</section>
			</main>

			<footer className="landing-footer landing-container">
				<div>
					<Logo className="h-7" />
					<p className="mt-3 text-xs text-muted-foreground">
						A little more clarity, every day.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
					<Link to="/privacy" className="landing-nav-link">
						Privacy policy
					</Link>
					<Link to="/terms" className="landing-nav-link">
						Terms of use
					</Link>
					<span>© {new Date().getFullYear()} AutoFin</span>
				</div>
			</footer>
		</div>
	);
}
