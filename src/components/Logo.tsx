import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
	return (
		<span className={cn("inline-flex aspect-[152/48] shrink-0", className)}>
			<img
				src="/logo-light.svg"
				alt="AutoFin"
				className="h-full w-auto dark:hidden"
			/>
			<img
				src="/logo-dark.svg"
				alt="AutoFin"
				className="hidden h-full w-auto dark:block"
			/>
		</span>
	);
}
