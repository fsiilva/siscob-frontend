import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

describe("administração de carteiras", () => {
  it("expõe a rota no layout autenticado e no menu", () => {
    expect(source("./(dashboard)/administracao/carteiras/page.tsx")).toContain("PortfoliosAdminPage");
    expect(source("../components/layout/app-sidebar.tsx")).toContain('href: "/administracao/carteiras"');
  });

  it("cobre lista, filtros, CRUD lógico e integração do catálogo ativo", () => {
    const page = source("../components/portfolios/portfolios-admin-page.tsx");
    expect(page).toContain("Filtrar por empresa");
    expect(page).toContain("Nova Carteira");
    expect(page).toContain("confirm(");
    expect(source("../hooks/usePortfolios.ts")).toContain('active: true');
    expect(source("../components/operation/create-operation-drawer.tsx")).toContain("usePortfolios(values.companyId)");
  });
});
