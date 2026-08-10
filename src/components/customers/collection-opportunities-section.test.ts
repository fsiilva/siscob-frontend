import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { ApiRequestError } from "@/services/api";

import { getCollectionOpportunitiesErrorMessage } from "./collection-opportunities.error";

const section = readFileSync(fileURLToPath(new URL("./collection-opportunities-section.tsx", import.meta.url)), "utf8");
const dashboard = readFileSync(fileURLToPath(new URL("./customer-360-dashboard.tsx", import.meta.url)), "utf8");
const drawer = readFileSync(fileURLToPath(new URL("../operation/create-operation-drawer.tsx", import.meta.url)), "utf8");

describe("collection opportunities UI", () => {
  it("integra a seção próxima aos recebíveis sem derrubar o Customer 360", () => {
    expect(dashboard).toContain("<ReceivablesSection");
    expect(dashboard).toContain("<CollectionOpportunitiesSection");
    expect(section).toContain("useCollectionOpportunities(customerId)");
  });
  it("cobre loading, erro, retry e vazio", () => {
    for (const text of ["query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Nenhuma oportunidade de cobrança disponível para este cliente."]) expect(section).toContain(text);
  });
  it("renderiza os campos devolvidos pela API e fallback da empresa", () => {
    for (const text of ["item.dueDate", "item.amount", "item.balance", "item.daysOverdue", "item.suggestedPriority", "item.reasons", "Empresa não informada"]) expect(section).toContain(text);
  });
  it("reutiliza o drawer real com prefill e mantém carteira, objetivo e prioridade editáveis", () => {
    expect(section).toContain("<CreateOperationDrawer context={createContext}");
    for (const text of ["customerId", "companyId", "receivableId", "suggestedPriority"]) expect(section).toContain(text);
    expect(drawer).toContain("usePortfolios(values.companyId)");
    expect(drawer).toContain("Objetivo operacional");
    expect(drawer).toContain("priority: context?.suggestedPriority");
    expect(drawer).toContain("disabled={Boolean(context)");
  });
  it("trata Operation ativa sem inventar ID e abre o drawer existente", () => {
    expect(section).toContain("item.hasActiveOperation ? item.activeOperationId ?");
    expect(section).toContain("Abrir Operation");
    expect(section).toContain("Operation ativa");
    expect(dashboard).toContain("OperationDetailsDrawer");
  });
  it.each([[401, "sessão expirou"], [403, "não possui acesso"], [404, "não foram encontradas"]])("traduz HTTP %s", (status, expected) => expect(getCollectionOpportunitiesErrorMessage(new ApiRequestError({ status, message: "interno", url: "/x" }))).toContain(expected));
  it("trata rede e resposta inválida com segurança", () => {
    expect(getCollectionOpportunitiesErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede");
    expect(getCollectionOpportunitiesErrorMessage(new ZodError([]))).toContain("formato inesperado");
  });
});
