import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

const siteOrigin = createIsomorphicFn()
	.server(() => getRequestUrl().origin)
	.client(() => window.location.origin);

export function socialMeta() {
	const image = new URL("/social-preview.png", siteOrigin()).href;
	const title = "AutoFin — Your money, clearly organized";
	const description =
		"Automatically track expenses, plan category budgets, manage loans, and understand your money with AI insights.";
	return [
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: "AutoFin" },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image", content: image },
		{ property: "og:image:type", content: "image/png" },
		{ property: "og:image:width", content: "1731" },
		{ property: "og:image:height", content: "909" },
		{
			property: "og:image:alt",
			content:
				"AutoFin — Your money, clearly organized. Expense tracking, budgets and AI insights.",
		},
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: image },
		{
			name: "twitter:image:alt",
			content: "AutoFin — Your money, clearly organized",
		},
	];
}
