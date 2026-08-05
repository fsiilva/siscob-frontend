import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { managementDashboardQueryKey } from "./useManagementDashboard";

describe("management dashboard hook", () => {
  it("uses the required stable query key", () => {
    expect(managementDashboardQueryKey).toEqual(["dashboard", "management"]);
  });

  it("supports authorization-based disabling and does not poll", () => {
    const source = readFileSync(fileURLToPath(new URL("./useManagementDashboard.ts", import.meta.url)), "utf8");
    expect(source).toContain("enabled");
    expect(source).not.toContain("refetchInterval");
  });
});
