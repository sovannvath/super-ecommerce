import { describe, it, expect } from "vitest";
import { cn, formatCurrency } from "./utils";

describe("cn function", () => {
  it("should merge classes correctly", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    expect(cn("base-class", isActive && "active-class")).toBe(
      "base-class active-class",
    );
  });

  it("should handle false and null conditions", () => {
    const isActive = false;
    expect(cn("base-class", isActive && "active-class", null)).toBe(
      "base-class",
    );
  });

  it("should merge tailwind classes properly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should work with object notation", () => {
    expect(cn("base", { conditional: true, "not-included": false })).toBe(
      "base conditional",
    );
  });
});

describe("formatCurrency function", () => {
  it("should format number to currency", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("should format string number to currency", () => {
    expect(formatCurrency("1234.56")).toBe("$1,234.56");
  });

  it("should handle whole numbers", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should handle invalid string input", () => {
    expect(formatCurrency("invalid")).toBe("$0.00");
  });

  it("should handle large numbers", () => {
    expect(formatCurrency(1000000.99)).toBe("$1,000,000.99");
  });
});
