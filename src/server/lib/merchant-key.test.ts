import { describe, expect, it } from "vitest";
import { normalizeMerchantKey } from "./merchant-key";

describe("normalizeMerchantKey", () => {
	it("strips payment rails and reference noise", () => {
		expect(normalizeMerchantKey("MPAY MBLNNPKA")).toBe("MBLNNPKA");
		expect(
			normalizeMerchantKey("UPI/P2M/412345678901/BHATBHATENI KATHMANDU"),
		).toBe("BHATBHATENI KATHMANDU");
		expect(normalizeMerchantKey("NEFT-ACME PVT LTD-REF123456")).toBe("ACME");
	});

	it("removes dates, account masks, UPI handles, and domains", () => {
		expect(normalizeMerchantKey("Netflix.com")).toBe("NETFLIX");
		expect(normalizeMerchantKey("ACME 01/02/2025")).toBe("ACME");
		expect(normalizeMerchantKey("****1234")).toBeNull();
		expect(normalizeMerchantKey("ram@ybl")).toBeNull();
	});

	it("keeps non-Latin merchant names", () => {
		expect(normalizeMerchantKey("भटभटेनी सुपरमार्केट")).toBe("भटभटेनी सुपरमार्केट");
	});

	it("returns null for blank or noise-only merchants", () => {
		expect(normalizeMerchantKey(null)).toBeNull();
		expect(normalizeMerchantKey(undefined)).toBeNull();
		expect(normalizeMerchantKey("   ")).toBeNull();
		expect(normalizeMerchantKey("UPI NEFT POS")).toBeNull();
	});
});
