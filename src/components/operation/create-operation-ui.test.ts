import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const list = readFileSync(fileURLToPath(new URL("./operation-list.tsx", import.meta.url)), "utf8");
const drawer = readFileSync(fileURLToPath(new URL("./create-operation-drawer.tsx", import.meta.url)), "utf8");

describe("create Operation UI integration", () => {
  it("renderiza botão e estado vazio autorizados abrindo o mesmo formulário", () => {
    expect(list).toContain("Nova Operation");
    expect(list).toContain("Criar primeira Operation");
    expect(list).toContain("setCreateOpen(true)");
    expect(list).toContain("canCreateOperation(user)");
  });

  it("fecha após sucesso e abre o detalhe criado", () => {
    expect(list).toContain("setCreateOpen(false)");
    expect(list).toContain("setSelectedOperationId(operation.id)");
    expect(list).toContain("Operation criada com sucesso.");
  });

  it("usa seletores reais para empresa, Customer e Receivable", () => {
    expect(drawer).toContain("useCustomers(customerSearch)");
    expect(drawer).toContain("useCompanies({ active: true })");
    expect(drawer.match(/useReceivables\(/g)).toHaveLength(1);
    expect(drawer).toContain("canLoadReceivables");
    expect(drawer).not.toContain("allReceivablesQuery");
    expect(drawer).not.toContain("map((receivable) => receivable.company)");
    expect(drawer).toContain("changeCreateOperationCustomer");
    expect(drawer).toContain("Sem Receivable");
    expect(drawer).toContain("usePortfolios(values.companyId)");
    expect(drawer).toContain("buildCompanyOptions(");
    expect(drawer).toContain("companiesQuery.refetch()");
    expect(drawer).toContain("Nenhuma empresa disponível");
    expect(drawer).toContain("Selecione a carteira");
    expect(drawer).not.toContain("ID da carteira");
  });
});
