import { createFileRoute } from "@tanstack/react-router";
import { DemoApp } from "@/demo/DemoApp";

export const Route = createFileRoute("/demo")({
	ssr: false,
	head: () => ({
		meta: [
			{ title: "AutoFin — Interactive demo" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: DemoApp,
});
