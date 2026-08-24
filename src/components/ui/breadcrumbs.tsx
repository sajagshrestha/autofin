import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
	/** Display label for this crumb. */
	label: ReactNode;
	/**
	 * Route to link to. The last item with no `to` is treated as the current
	 * page and rendered as plain emphasized text.
	 */
	to?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
}

/**
 * Geist-style breadcrumbs showing the current location within the app.
 * Ancestors are muted links separated by chevrons; the current page is
 * rendered as emphasized text.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={cn("flex items-center gap-1 text-sm", className)}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				const isCurrent = isLast && !item.to;
				return (
					<div key={index} className="flex items-center gap-1">
						{index > 0 && (
							<ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
						)}
						{item.to && !isCurrent ? (
							<Link
								to={item.to as never}
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								{item.label}
							</Link>
						) : (
							<span
								aria-current={isCurrent ? "page" : undefined}
								className={cn(
									"font-medium",
									isCurrent ? "text-foreground" : "text-muted-foreground",
								)}
							>
								{item.label}
							</span>
						)}
					</div>
				);
			})}
		</nav>
	);
}
