import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { ApiRequestError } from "@/services/api";
import { getProductivityErrorMessage } from "./productivity-dashboard.error";

const source = readFileSync(fileURLToPath(new URL("./productivity-dashboard.tsx", import.meta.url)), "utf8");

describe("productivity dashboard UI", () => {
  it("renderiza filtros, atalhos e condiciona operador a ADMIN", () => {
    for (const text of ["Data inicial", "Data final", "Hoje", "Últimos 7 dias", "Últimos 30 dias", "Aplicar filtros"]) expect(source).toContain(text);
    expect(source).toContain("{isAdmin ? <label");
    expect(source).toContain("Operador");
  });

  it("renderiza todos os cards do contrato", () => {
    for (const text of ["Interações", "Contatos realizados", "Sem resposta", "Promessas de pagamento", "Next Actions concluídas", "Next Actions vencidas", "Operations concluídas"]) expect(source).toContain(text);
  });

  it("renderiza percentuais derivados, tabela ADMIN e visão USER", () => {
    for (const text of ["Taxa de contato", "Taxa de promessa", "Produtividade por operador", "Minha produtividade", "sortProductivityOperators"]) expect(source).toContain(text);
  });

  it("implementa loading, erro, retry e estado vazio", () => {
    for (const text of ["query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Nenhuma atividade registrada no período selecionado."]) expect(source).toContain(text);
  });

  it.each([[400, "período"], [401, "sessão expirou"], [403, "permissão"]])("trata HTTP %s sem mensagem técnica", (status, expected) => {
    const message = getProductivityErrorMessage(new ApiRequestError({ status, message: "stack trace interno", url: "/dashboard/productivity" }));
    expect(message).toContain(expected);
    expect(message).not.toContain("stack trace");
  });

  it("distingue falha de rede e resposta inválida", () => {
    expect(getProductivityErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede");
    expect(getProductivityErrorMessage(new ZodError([]))).toContain("resposta de produtividade");
  });
});
