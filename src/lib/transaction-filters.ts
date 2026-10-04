/** Tax categories include Tax, Taxes, Income Tax, and other tax-specific labels. */
export function isTaxCategory(name?: string | null): boolean {
	return /\btax(?:es)?\b/i.test(name ?? "");
}
