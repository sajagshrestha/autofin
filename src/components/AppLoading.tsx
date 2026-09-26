export function AppLoading() {
	return (
		<div className="flex min-h-dvh items-center justify-center px-4">
			<div
				role="status"
				className="flex items-center gap-3 text-muted-foreground"
			>
				<span
					aria-hidden="true"
					className="size-5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
				/>
				<span>Loading AutoFin…</span>
			</div>
		</div>
	);
}
