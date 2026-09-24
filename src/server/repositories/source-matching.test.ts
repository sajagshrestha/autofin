import { describe, expect, it } from "vitest";
import { normalizeSourceName, parseFromHeader } from "./source.repository";

describe("normalizeSourceName", () => {
	it("lowercases, trims, and collapses whitespace", () => {
		expect(normalizeSourceName("  Nabil   Bank ")).toBe("nabil bank");
		expect(normalizeSourceName("nBank")).toBe("nbank");
		expect(normalizeSourceName(null)).toBe("");
		expect(normalizeSourceName(undefined)).toBe("");
	});
});

describe("parseFromHeader", () => {
	it("splits display name and address", () => {
		expect(parseFromHeader('"Nabil Bank" <txn-alert@nabilbank.com>')).toEqual({
			address: "txn-alert@nabilbank.com",
			displayName: "Nabil Bank",
		});
	});

	it("handles bare addresses", () => {
		expect(parseFromHeader("Alerts@Bank.COM ")).toEqual({
			address: "alerts@bank.com",
			displayName: null,
		});
	});

	it("handles missing headers", () => {
		expect(parseFromHeader(null)).toEqual({
			address: null,
			displayName: null,
		});
		expect(parseFromHeader("")).toEqual({
			address: null,
			displayName: null,
		});
	});
});
