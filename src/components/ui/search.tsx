import { Search as SearchIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface SearchProps extends React.ComponentProps<typeof Input> {
	className?: string;
}

export function Search({ className, ...props }: SearchProps) {
	return (
		<div className={cn("relative min-w-0", className)}>
			<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
			<Input aria-label="Search records" className="pl-9" {...props} />
		</div>
	);
}
