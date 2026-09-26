import { useCallback, useEffect, useRef, useState } from "react";

/** Reveal a locally filtered list in batches without disturbing desktop paging. */
export function useProgressiveList({
	total,
	resetKey,
	enabled,
	batchSize = 20,
}: {
	total: number;
	resetKey: string;
	enabled: boolean;
	batchSize?: number;
}) {
	const [window, setWindow] = useState({ key: resetKey, count: batchSize });
	const count = window.key === resetKey ? window.count : batchSize;
	const visibleCount = Math.min(count, total);
	const hasMore = visibleCount < total;
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setWindow({ key: resetKey, count: batchSize });
	}, [resetKey, batchSize]);

	const loadMore = useCallback(() => {
		setWindow({ key: resetKey, count: Math.min(total, count + batchSize) });
	}, [resetKey, total, batchSize, count]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (
			!enabled ||
			!hasMore ||
			!sentinel ||
			typeof IntersectionObserver === "undefined"
		)
			return;
		let consumed = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (consumed || !entries.some((entry) => entry.isIntersecting)) return;
				consumed = true;
				observer.disconnect();
				loadMore();
			},
			{ rootMargin: "0px 0px 240px 0px" },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [enabled, hasMore, loadMore]);

	return { visibleCount, hasMore, sentinelRef, loadMore };
}
