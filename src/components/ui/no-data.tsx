import { Inbox, SearchX } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

interface NoDataProps {
	title: string;
	description?: string;
	isSearchResults?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export function NoData({
	title,
	description,
	isSearchResults,
	className,
	children,
}: NoDataProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-12 px-4",
				className,
			)}
		>
			<div className="mb-4 flex size-12 items-center justify-center rounded-2xl border bg-muted/60 text-muted-foreground">
				{isSearchResults ? (
					<SearchX className="size-5" />
				) : (
					<Inbox className="size-5" />
				)}
			</div>
			<div className="max-w-sm text-center space-y-2">
				<h3 className="text-lg font-semibold">{title}</h3>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
				{isSearchResults && (
					<p className="text-sm text-muted-foreground">
						Try adjusting your search terms or filters.
					</p>
				)}
			</div>
			{children && <div className="mt-4">{children}</div>}
		</div>
	);
}
