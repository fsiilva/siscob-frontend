import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("collection exceptions route", () => {
  it("expõe a rota no layout autenticado", () => expect(source("./(dashboard)/dashboard/collection-exceptions/page.tsx")).toContain("<CollectionExceptionsDashboard />"));
  it("adiciona menu somente para ADMIN", () => { const sidebar = source("../components/layout/app-sidebar.tsx"); expect(sidebar).toContain('{ label: "Exceções de Cobrança", icon: ShieldCheck, href: "/dashboard/collection-exceptions", adminOnly: true }'); expect(sidebar).toContain("canViewNavigationItem(item.adminOnly, user?.role)"); });
});
