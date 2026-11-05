/**
 * Tokens that describe payment rails or legal/document noise rather than the
 * merchant itself. Removing them lets the same merchant match across messages
 * that mention UPI/NEFT/POS or a company suffix.
 */
const NOISE_TOKENS = new Set([
	"AUTOPAY",
	"ATM",
	"CARD",
	"COLLECTION",
	"COLLECT",
	"CREDIT",
	"DEBIT",
	"IMPS",
	"MANDATE",
	"MPAY",
	"NEFT",
	"P2M",
	"P2P",
	"PAID",
	"PAY",
	"PAYMENT",
	"POS",
	"PVT",
	"REF",
	"REFERENCE",
	"REFNO",
	"RTGS",
	"SI",
	"TRANSACTION",
	"TRANSFER",
	"TXN",
	"UPI",
	// Common domain suffixes so "Netflix.com" and "NETFLIX" match.
	"COM",
	"NET",
	"ORG",
	// Legal suffixes.
	"CO",
	"INC",
	"LIMITED",
	"LTD",
	"PRIVATE",
]);

/**
 * Canonical merchant key used for learned category memory.
 *
 * Normalization is intentionally conservative: it strips reference numbers,
 * UPI handles/emails, dates, masked account digits, URLs, punctuation, and
 * payment-rail words, but keeps the merchant tokens themselves (including
 * non-Latin scripts) in their original order.
 *
 * Examples:
 *   "MPAY MBLNNPKA"                        -> "MBLNNPKA"
 *   "UPI/P2M/412345678901/BHATBHATENI"     -> "BHATBHATENI"
 *   "NEFT-ACME PVT LTD-REF123456"          -> "ACME"
 *   "****1234" / "abc@ybl"                 -> null
 */
export function normalizeMerchantKey(
	merchant: string | null | undefined,
): string | null {
	if (!merchant) return null;

	const cleaned = merchant
		.normalize("NFKC")
		.toUpperCase()
		.replace(/[’'`]/g, "")
		// UPI handles and email addresses.
		.replace(/\b[\p{L}\p{N}._+-]+@[\p{L}\p{N}.-]+\b/gu, " ")
		// URLs.
		.replace(/\b(?:HTTPS?:\/\/|WWW\.)\S+/giu, " ")
		// Dates such as 01/02/2025, 01-02-25, 2025.01.02.
		.replace(/\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g, " ")
		// Long alphanumeric reference tokens (must contain a digit).
		.replace(/\b(?=[A-Z0-9]*\d[A-Z0-9]*)[A-Z0-9]{7,}\b/g, " ")
		// Remaining long digit runs (account numbers, card masks, refs).
		.replace(/\b\d{4,}\b/g, " ")
		// Drop punctuation/emoji but keep letters, combining marks, and digits
		// in any script.
		.replace(/[^\p{L}\p{M}\p{N} ]+/gu, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!cleaned) return null;

	const tokens = cleaned
		.split(" ")
		.filter((token) => token.length > 0 && !NOISE_TOKENS.has(token));

	const key = tokens.join(" ").slice(0, 120).trim();
	return key || null;
}

/**
 * Bank reference tokens: long digit runs and long alphanumerics containing a
 * digit (e.g. "412345678901", "L122065"). These are the parts of a narration
 * that carry no categorizable meaning on their own.
 */
const REFERENCE_TOKEN_PATTERN =
	/\b(?:\d{5,}|(?=[A-Z0-9]*\d[A-Z0-9]*)[A-Z0-9]{6,})\b/;

function hasReferenceToken(value: string): boolean {
	return REFERENCE_TOKEN_PATTERN.test(value.normalize("NFKC").toUpperCase());
}

/**
 * True when reference-only remarks still name the merchant/counterparty.
 *
 * Banks often send narrations such as
 * `CPCRM-L122065-2026 B-O UPSTEM TECHNOLOGIES PTY LTD`, where everything
 * except the counterparty is reference noise. That explicit merchant is
 * meaningful evidence even though the remarks do not state a purpose, so the
 * eligibility gate must not reject it as opaque.
 */
export function referenceRemarksNameMerchant(
	remarks: string | null | undefined,
	merchant: string | null | undefined,
): boolean {
	if (!remarks?.trim() || !hasReferenceToken(remarks)) return false;

	const merchantKey = normalizeMerchantKey(merchant);
	const remarksKey = normalizeMerchantKey(remarks);
	if (!merchantKey || !remarksKey) return false;

	const merchantTokens = merchantKey.split(" ");
	// Ignore initials or noise-only keys; they are not a named counterparty.
	if (!merchantTokens.some((token) => token.length >= 3)) return false;

	const remarksTokens = new Set(remarksKey.split(" "));
	return merchantTokens.every((token) => remarksTokens.has(token));
}
