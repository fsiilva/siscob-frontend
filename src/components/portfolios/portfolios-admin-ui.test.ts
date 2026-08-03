import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const page = readFileSync(fileURLToPath(new URL("./portfolios-admin-page.tsx", import.meta.url)), "utf8");

describe("portfolio administration company selection", () => {
  it("carrega empresas ativas pelo catálogo oficial e combina com o contexto", () => {
    expect(page).toContain("useCompanies({ active: true })");
    expect(page).toContain("buildCompanyOptions(");
    expect(page).not.toContain("useReceivables");
    expect(page).not.toContain("receivable.company");
  });

  it("representa loading, erro com retry e estado vazio", () => {
    expect(page).toContain("Carregando empresas...");
    expect(page).toContain("Nenhuma empresa disponível");
    expect(page).toContain("Não foi possível carregar todas as empresas.");
    expect(page).toContain("companiesQuery.refetch()");
    expect(page).toContain("companiesQuery.isLoading");
  });

  it("renderiza as opções e envia o companyId selecionado", () => {
    expect(page).toContain("value={x.id}>{x.name}");
    expect(page).toContain("x.code ? ` (${x.code})` : \"\"");
    expect(page).toContain("companyId:e.target.value");
    expect(page).toContain("companyId: editor.companyId");
  });
});
