import { Search as SearchIcon, X } from "lucide-react";
import type * as React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface SearchProps extends React.ComponentProps<typeof Input> {
	className?: string;
	/** Called when the clear button is pressed. Omit to hide the clear button. */
	onClear?: () => void;
}

export function Search({ className, onClear, value, ...props }: SearchProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const showClear = onClear != null && String(value ?? "").length > 0;

	const clear = () => {
		onClear?.();
		inputRef.current?.focus();
	};

	return (
		<div className={cn("relative min-w-0", className)}>
			<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
			<Input
				ref={inputRef}
				aria-label="Search records"
				{...props}
				value={value}
				className={cn("pl-9", showClear && "pr-9")}
			/>
			{showClear && (
				<button
					type="button"
					aria-label="Clear search"
					title="Clear search"
					onClick={clear}
					className="absolute inset-y-0 right-0 flex items-center pl-1 pr-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
