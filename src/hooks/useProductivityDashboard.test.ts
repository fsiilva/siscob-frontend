import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { productivityDashboardQueryKeys } from "./useProductivityDashboard";

describe("productivity dashboard hook", () => {
  it("usa a chave base centralizada com os filtros", () => {
    const filters = { from: "2026-08-01", to: "2026-08-10", operatorId: "operator-1" };
    expect(productivityDashboardQueryKeys.all).toEqual(["dashboard", "productivity"]);
    expect(productivityDashboardQueryKeys.filtered(filters)).toEqual(["dashboard", "productivity", filters]);
  });

  it("faz uma query por filtros sem polling", () => {
    const source = readFileSync(fileURLToPath(new URL("./useProductivityDashboard.ts", import.meta.url)), "utf8");
    expect(source).toContain("getProductivityDashboard(filters)");
    expect(source).not.toContain("refetchInterval");
  });
});
