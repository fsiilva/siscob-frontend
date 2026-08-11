import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("collection portfolio route and navigation", () => {
  it("expõe a rota no layout autenticado", () => expect(source("./(dashboard)/dashboard/collection-portfolio/page.tsx")).toContain("<CollectionPortfolioDashboard />"));
  it("exibe o menu somente para ADMIN", () => {
    const sidebar = source("../components/layout/app-sidebar.tsx");
    expect(sidebar).toContain('{ label: "Carteira de Cobrança", icon: BriefcaseBusiness, href: "/dashboard/collection-portfolio", adminOnly: true }');
    expect(sidebar).toContain("canViewNavigationItem(item.adminOnly, user?.role)");
  });
});
