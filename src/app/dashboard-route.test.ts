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

  it("exposes /dashboard/management in the authenticated layout", () => {
    const page = source("./(dashboard)/dashboard/management/page.tsx");

    expect(page).toMatch(/export\s+default\s+function\s+ManagementDashboardPage/);
    expect(page).toContain('from "@/components/dashboard/management-dashboard"');
    expect(page).toContain("<ManagementDashboard />");
    expect(page).not.toMatch(/redirect\s*\(/);
  });

  it("links Dashboard Gerencial to the canonical management route", () => {
    const sidebar = source("../components/layout/app-sidebar.tsx");

    expect(sidebar).toContain(
      '{ label: "Dashboard Gerencial", icon: BarChart3, href: "/dashboard/management", adminOnly: true }',
    );
    expect(sidebar).not.toContain('href: "/management"');
    expect(sidebar).not.toContain('href: "/dashboard-management"');
    expect(sidebar).not.toContain('href: "/dashboard/manager"');
  });

  it("exposes productivity to ADMIN and USER in the authenticated layout", () => {
    const page = source("./(dashboard)/dashboard/productivity/page.tsx");
    const sidebar = source("../components/layout/app-sidebar.tsx");
    expect(page).toContain("<ProductivityDashboard />");
    expect(sidebar).toContain('{ label: "Produtividade", icon: CalendarDays, href: "/dashboard/productivity" }');
    expect(sidebar).not.toContain('{ label: "Produtividade", icon: CalendarDays, href: "/dashboard/productivity", adminOnly: true }');
  });
});
