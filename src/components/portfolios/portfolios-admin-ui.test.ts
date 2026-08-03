import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const page = readFileSync(fileURLToPath(new URL("./portfolios-admin-page.tsx", import.meta.url)), "utf8");

describe("portfolio administration company selection", () => {
  it("carrega empresas uma vez por meio de receivables e combina com o contexto", () => {
    expect(page).toContain("useReceivables({ page: 1, pageSize: 100 })");
    expect(page).toContain("buildCompanyOptions(");
    expect(page.match(/useReceivables\(/g)).toHaveLength(1);
  });

  it("representa loading, erro com retry e estado vazio", () => {
    expect(page).toContain("Carregando empresas...");
    expect(page).toContain("Nenhuma empresa disponível");
    expect(page).toContain("Não foi possível carregar todas as empresas.");
    expect(page).toContain("receivablesQuery.refetch()");
    expect(page).toContain("receivablesQuery.isLoading");
  });

  it("renderiza as opções e envia o companyId selecionado", () => {
    expect(page).toContain("value={x.id}>{x.name}");
    expect(page).toContain("companyId:e.target.value");
    expect(page).toContain("companyId: editor.companyId");
  });
});
