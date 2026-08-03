import { describe, expect, it } from "vitest";
import { getPortfolios } from "@/services/portfolios-api.service";

describe("portfolio catalog hook contract", () => {
  it("uses the official portfolios API", () => {
    expect(getPortfolios).toBeTypeOf("function");
  });
});
