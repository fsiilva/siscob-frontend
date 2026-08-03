import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { dashboardOverviewKey } from "./useDashboardOverview";

describe("dashboard overview hook", () => {
  it("uses the required stable query key", () => {
    expect(dashboardOverviewKey).toEqual(["dashboard", "overview"]);
  });

  it("does not configure polling or automatic refresh", () => {
    const source = readFileSync(fileURLToPath(new URL("./useDashboardOverview.ts", import.meta.url)), "utf8");
    expect(source).not.toContain("refetchInterval");
    expect(source).not.toContain("setInterval");
  });
});
