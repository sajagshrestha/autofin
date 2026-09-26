import { useEffect } from "react";

/** Keep mobile overlays inside the screen area left above the software keyboard. */
export function useMobileViewport() {
	useEffect(() => {
		const viewport = window.visualViewport;
		if (!viewport) return;
		const mobile = window.matchMedia("(max-width: 767px)");
		const style = document.documentElement.style;
		const properties = [
			"--mobile-viewport-height",
			"--mobile-viewport-top",
			"--mobile-viewport-bottom",
		];
		let frame = 0;
		let revealFocus = false;
		const clear = () => {
			for (const property of properties) style.removeProperty(property);
		};
		const update = () => {
			frame = 0;
			// Don't resize controls while the user is deliberately pinch-zooming.
			if (!mobile.matches || Math.abs(viewport.scale - 1) > 0.05) {
				clear();
				revealFocus = false;
				return;
			}
			const top = Math.max(0, viewport.offsetTop);
			const height = viewport.height;
			style.setProperty(properties[0], `${height}px`);
			style.setProperty(properties[1], `${top}px`);
			style.setProperty(
				properties[2],
				`${Math.max(0, window.innerHeight - top - height)}px`,
			);
			const focused = document.activeElement;
			if (
				revealFocus &&
				focused instanceof HTMLElement &&
				focused.matches("input, textarea, [contenteditable='true']")
			) {
				const overlay = focused.closest(
					'[data-slot="dialog-content"], [data-slot="sheet-content"]',
				);
				if (overlay) {
					const bounds = overlay.getBoundingClientRect();
					const field = focused.getBoundingClientRect();
					if (
						field.top < Math.max(top, bounds.top) + 16 ||
						field.bottom > Math.min(top + height, bounds.bottom) - 16
					) {
						focused.scrollIntoView({
							block: "nearest",
							inline: "nearest",
							behavior: "instant",
						});
					}
				}
			}
			revealFocus = false;
		};
		const schedule = (reveal: boolean) => {
			revealFocus ||= reveal;
			if (!frame) frame = requestAnimationFrame(update);
		};
		const resize = () => schedule(true);
		const scroll = () => schedule(false);
		viewport.addEventListener("resize", resize);
		viewport.addEventListener("scroll", scroll);
		window.addEventListener("resize", resize);
		mobile.addEventListener("change", resize);
		document.addEventListener("focusin", resize);
		schedule(false);
		return () => {
			cancelAnimationFrame(frame);
			viewport.removeEventListener("resize", resize);
			viewport.removeEventListener("scroll", scroll);
			window.removeEventListener("resize", resize);
			mobile.removeEventListener("change", resize);
			document.removeEventListener("focusin", resize);
			clear();
		};
	}, []);
}
