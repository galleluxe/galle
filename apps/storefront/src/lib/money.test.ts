import { describe, expect, it } from "vitest";
import { formatINR } from "./money";

describe("formatINR", () => {
  it("formats paise as INR rupees", () => {
    expect(formatINR(299900)).toMatch(/2,999/);
  });

  it("handles zero", () => {
    expect(formatINR(0)).toMatch(/0/);
  });
});
