import { useRouterState } from "@tanstack/react-router";

export function PageLoadingBar() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	if (!isLoading) return null;

	return (
		<div
			aria-hidden="true"
			className="page-loading-bar fixed top-0 left-0 z-[100] h-0.5 w-full overflow-hidden"
		>
			<div className="page-loading-bar-inner" />
		</div>
	);
}
