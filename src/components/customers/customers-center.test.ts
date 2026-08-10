import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./customers-center.tsx", import.meta.url)), "utf8");

describe("Customers Center", () => {
  it("implementa pesquisa explícita por formulário, Enter e limpeza", () => {
    for (const text of ["onSubmit", "Pesquisar", "Limpar", "Nome, CPF ou CNPJ", "draftSearch.trim()", "search: value"]) expect(source).toContain(text);
    expect(source).not.toContain("useDebouncedValue");
  });
  it("implementa estado inicial, loading, erro, retry, vazio e resultados", () => {
    for (const text of ["Pesquise por um cliente para começar.", "query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Nenhum cliente encontrado para os critérios informados.", "query.data.data.map"]) expect(source).toContain(text);
  });
  it("renderiza os campos reais e paginação server-side", () => {
    for (const text of ["Cliente", "Documento", "Telefone", "E-mail", "Código/ID", "Pagination", "pagination.total", "pageSize: PAGE_SIZE"]) expect(source).toContain(text);
  });
  it("navega para Customer 360 sem prefetch ou consultas por linha", () => {
    expect(source).toContain("router.push(`/customers/${customer.id}`)");
    expect(source).not.toContain("prefetch");
    expect(source).not.toContain("useCustomer360");
    expect(source).not.toContain("getCustomer360");
  });
  it("não cria regras locais diferentes para USER e ADMIN", () => {
    expect(source).not.toContain("useAuth");
    expect(source).not.toContain("ADMIN");
    expect(source).not.toContain("USER");
  });
});
