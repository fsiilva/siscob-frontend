import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { ApiRequestError } from "@/services/api";
import { getCustomer360ErrorMessage } from "./customer-360.error";

const source = readFileSync(fileURLToPath(new URL("./customer-360-dashboard.tsx", import.meta.url)), "utf8");

describe("Customer 360 dashboard", () => {
  it("usa somente a query agregada", () => {
    expect(source).toContain("useCustomer360(customerId)");
    for (const hook of ["useCustomer(", "useCustomerSummary", "useCustomerTimeline", "useCustomerNextActions", "useOperations", "useReceivables"]) expect(source).not.toContain(hook);
  });
  it("renderiza cabeçalho e resumo financeiro", () => {
    for (const text of ["Documento", "Telefone", "E-mail", "Total em aberto", "Total vencido", "Quantidade de títulos", "Títulos vencidos", "Título mais antigo"]) expect(source).toContain(text);
  });
  it("renderiza todas as seções e reutiliza os componentes existentes", () => {
    for (const text of ["Recebíveis", "Operations", "Próximas ações", "Interações", "Timeline", "OperationDetailsDrawer", "NextActionCard", "TimelineItem", "presentTimelineEvent"]) expect(source).toContain(text);
    expect(source).toContain("Abrir Operation");
  });
  it("implementa loading, erro, retry e vazios individuais", () => {
    for (const text of ["query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Cliente sem recebíveis", "Cliente sem Operations", "Sem Next Actions", "Sem Interactions", "TimelineEmpty"]) expect(source).toContain(text);
  });
  it("trata 401, 403 e 404 sem mensagens técnicas", () => {
    expect(source).toContain("status === 403");
    expect(source).toContain("status === 404");
    expect(source).toContain("status !== 401");
    expect(source).toContain("Você não possui acesso a este cliente.");
    expect(source).toContain("Cliente não encontrado.");
  });
  it.each([[401, "sessão expirou"], [403, "não possui acesso"], [404, "não encontrado"]])("traduz HTTP %s com segurança", (status, text) => {
    const message = getCustomer360ErrorMessage(new ApiRequestError({ status, message: "stack trace interno", url: "/customers/123/360" }));
    expect(message).toContain(text);
    expect(message).not.toContain("stack trace");
  });
  it("trata falha de rede", () => expect(getCustomer360ErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede"));
  it("trata ZodError como resposta inesperada sem expor detalhes técnicos", () => {
    const message = getCustomer360ErrorMessage(new ZodError([]));
    expect(message).toBe("Os dados recebidos do cliente possuem um formato inesperado. Tente novamente.");
    expect(message).not.toContain("Zod");
  });
  it("renderiza a empresa por meio do presenter seguro", () => {
    expect(source).toContain("formatCustomer360Company(item.company)");
    expect(source).not.toContain("<TableCell>{item.company}</TableCell>");
  });
});
