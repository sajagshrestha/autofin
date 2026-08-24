import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Geist-style Badge (vercel.com/geist/badge).
 * Colored variants use the Geist scale's 100 step as background and 1000 as
 * text — both tokens flip automatically between light and dark themes.
 * Legacy shadcn variants (default/secondary/destructive/outline) are kept as
 * aliases so existing call sites keep working.
 */
const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full font-medium transition-colors [&>svg]:pointer-events-none [&>svg]:size-3 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				gray: "bg-ds-gray-100 text-ds-gray-1000",
				blue: "bg-ds-blue-100 text-ds-blue-1000",
				purple: "bg-ds-purple-100 text-ds-purple-1000",
				amber: "bg-ds-amber-100 text-ds-amber-1000",
				red: "bg-ds-red-100 text-ds-red-1000",
				pink: "bg-ds-pink-100 text-ds-pink-1000",
				green: "bg-ds-green-100 text-ds-green-1000",
				teal: "bg-ds-teal-100 text-ds-teal-1000",
				inverted:
					"bg-ds-gray-1000 text-ds-background-100 [a&]:hover:bg-ds-gray-900",
				default:
					"bg-ds-gray-1000 text-ds-background-100 [a&]:hover:bg-ds-gray-900",
				secondary: "bg-ds-gray-100 text-ds-gray-1000",
				destructive: "bg-ds-red-100 text-ds-red-1000",
				outline:
					"border border-ds-gray-alpha-400 bg-transparent text-ds-gray-900 [a&]:hover:bg-ds-gray-100",
				ghost: "[a&]:hover:bg-ds-gray-100 [a&]:hover:text-ds-gray-1000",
				link: "text-primary underline-offset-4 [a&]:hover:underline",
			},
			contrast: {
				high: "",
				low: "",
			},
			size: {
				sm: "px-2 py-px text-[11px] leading-4",
				md: "px-2.5 py-0.5 text-xs leading-4",
				lg: "px-3 py-1 text-sm leading-5",
			},
		},
		compoundVariants: [
			{
				variant: "gray",
				contrast: "low",
				className: "bg-ds-gray-alpha-100 text-ds-gray-900",
			},
			{
				variant: "blue",
				contrast: "low",
				className: "bg-ds-blue-100/50 text-ds-blue-900",
			},
			{
				variant: "purple",
				contrast: "low",
				className: "bg-ds-purple-100/50 text-ds-purple-900",
			},
			{
				variant: "amber",
				contrast: "low",
				className: "bg-ds-amber-100/50 text-ds-amber-900",
			},
			{
				variant: "red",
				contrast: "low",
				className: "bg-ds-red-100/50 text-ds-red-900",
			},
			{
				variant: "pink",
				contrast: "low",
				className: "bg-ds-pink-100/50 text-ds-pink-900",
			},
			{
				variant: "green",
				contrast: "low",
				className: "bg-ds-green-100/50 text-ds-green-900",
			},
			{
				variant: "teal",
				contrast: "low",
				className: "bg-ds-teal-100/50 text-ds-teal-900",
			},
		],
		defaultVariants: {
			variant: "gray",
			contrast: "high",
			size: "md",
		},
	},
);

function Badge({
	className,
	variant,
	contrast,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			data-variant={variant}
			data-contrast={contrast}
			data-size={size}
			className={cn(badgeVariants({ variant, contrast, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
