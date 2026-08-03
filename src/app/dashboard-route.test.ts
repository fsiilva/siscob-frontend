import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("dashboard route and navigation", () => {
  it("exposes /dashboard in the authenticated layout", () => {
    expect(source("./(dashboard)/dashboard/page.tsx")).toContain("OperationalDashboard");
  });

  it("keeps Dashboard as the first navigation item", () => {
    const sidebar = source("../components/layout/app-sidebar.tsx");
    const dashboard = sidebar.indexOf('label: "Dashboard"');
    const receivables = sidebar.indexOf('label: "Carteira"');
    expect(dashboard).toBeGreaterThan(-1);
    expect(dashboard).toBeLessThan(receivables);
    expect(sidebar).toContain('href: "/dashboard"');
  });
});
