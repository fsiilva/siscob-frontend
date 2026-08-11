import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { formatCustomer360Company } from "@/components/customers/customer-360.presenter";
import { ApiRequestError } from "@/services/api";
import { getWorkPlanErrorMessage } from "./work-plan.error";

const source = readFileSync(fileURLToPath(new URL("./work-plan.tsx", import.meta.url)), "utf8");

describe("work plan UI", () => {
  it("exibe os dois tipos, o primeiro item destacado e os dados da policy sem recalcular", () => {
    for (const text of ["Operation ativa", "Oportunidade", "COBRAR AGORA", "item.score", "item.suggestedPriority", "item.reasons", "Prioridade persistida", "Next Action", "Operador responsável"]) expect(source).toContain(text);
    expect(source).toContain("featured={index === 0}");
    expect(source).not.toMatch(/\.sort\(/);
    expect(source).not.toMatch(/score\s*[+*/-]/);
  });
  it("reutiliza drawers, preserva prefill e não envia score", () => {
    for (const text of ["OperationDetailsDrawer", "InteractionDrawer", "CreateOperationDrawer", "customerId: item.customer.id", "companyId: item.company.id", "receivableId: item.receivable.id", "suggestedPriority: item.suggestedPriority"]) expect(source).toContain(text);
    expect(source).not.toContain("score: item.score");
  });
  it("mantém navegação sem prefetch e não cria N+1", () => {
    expect(source).toContain("prefetch={false}");
    expect(source).not.toMatch(/use(Customer360|OperationDetails|Receivables)\([^)]*item/);
  });
  it("usa o fallback compartilhado de empresa", () => expect(formatCustomer360Company({ id: "2", name: null })).toBe("Empresa #2"));
  it("oferece filtros reais, paginação e limita controles de ADMIN", () => {
    for (const text of ['onChange("kind"', 'onChange("companyId"', 'onChange("customerId"', 'onChange("priority"', 'onChange("status"', 'onChange("overdueOnly"', "Pagination", "isAdmin ? <Filter label=\"Tipo\""]) expect(source).toContain(text);
    expect(source).not.toContain('onChange("assignedOperatorId"');
  });
  it("cobre loading, erro, retry e vazio", () => { for (const text of ["query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Nenhuma cobrança disponível para os filtros selecionados."]) expect(source).toContain(text); });
  it.each([[400, "filtros"], [401, "sessão"], [403, "acesso"], [404, "não foi encontrado"], [409, "alterados"], [422, "regras"]])("trata HTTP %s", (status, message) => expect(getWorkPlanErrorMessage(new ApiRequestError({ status, message: "interno", url: "/x" }))).toContain(message));
  it("trata rede e ZodError", () => { expect(getWorkPlanErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede"); expect(getWorkPlanErrorMessage(new ZodError([]))).toContain("formato inesperado"); });
});
