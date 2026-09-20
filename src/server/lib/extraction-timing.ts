export type ExtractionStep =
	| "llm_extraction"
	| "jev_classification"
	| "jev_remarks_eligibility"
	| "llm_category_proposal";
export interface ExtractionTiming {
	step: ExtractionStep;
	durationMs: number;
	status: "ok" | "error";
}
export type TimingObserver = (timing: ExtractionTiming) => void;

/** Measures the complete operation, including SDK retries and response parsing. */
export async function measureExtractionStep<T>(
	step: ExtractionStep,
	operation: () => Promise<T>,
	onTiming?: TimingObserver,
): Promise<T> {
	const start = performance.now();
	let status: ExtractionTiming["status"] = "error";
	try {
		const result = await operation();
		status = "ok";
		return result;
	} finally {
		onTiming?.({ step, durationMs: performance.now() - start, status });
	}
}
