import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function PageLoadingBar() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined;
		let timeout: ReturnType<typeof setTimeout> | undefined;

		if (isLoading) {
			// Start from a small value (or restart if we just completed).
			setProgress((prev) => (prev === 0 || prev >= 90 ? 12 : prev));
			// Trickle toward 90% so the bar reflects real, slow progress.
			interval = setInterval(() => {
				setProgress((prev) =>
					prev >= 90 ? prev : prev + Math.max(0.5, (90 - prev) * 0.08),
				);
			}, 200);
		} else {
			// Finished: snap to 100%, then hide and reset.
			setProgress(100);
			timeout = setTimeout(() => setProgress(0), 250);
		}

		return () => {
			if (interval) clearInterval(interval);
			if (timeout) clearTimeout(timeout);
		};
	}, [isLoading]);

	if (progress === 0) return null;

	return (
		<div
			aria-hidden="true"
			className="fixed top-0 left-0 z-[100] h-0.5 w-full overflow-hidden"
		>
			<div
				className="h-full rounded-r-full bg-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)] transition-[width] duration-200 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
