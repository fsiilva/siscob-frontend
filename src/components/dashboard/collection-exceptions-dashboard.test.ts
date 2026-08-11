import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { formatCustomer360Company } from "@/components/customers/customer-360.presenter";
import { ApiRequestError } from "@/services/api";
import { getCollectionExceptionsErrorMessage } from "./collection-exceptions-dashboard.error";

const source = readFileSync(fileURLToPath(new URL("./collection-exceptions-dashboard.tsx", import.meta.url)), "utf8");

describe("collection exceptions dashboard UI", () => {
  it("renderiza cards de summary diretamente do backend", () => { for (const text of ["Total de exceções", "Críticas", "Atenção", "Informativas", "Críticas sem acompanhamento", "Acompanhamentos vencidos", "Ações para hoje", "Oportunidades relevantes sem cobrança ativa", "data.summary.totalExceptions", "data.summary.critical", "data.summary.warning", "data.summary.informational"]) expect(source).toContain(text); });
  it("renderiza agrupamento por empresa na ordem da API e fallback compartilhado", () => { expect(source).toContain("data.byCompany.map"); expect(source).toContain("formatCustomer360Company(item.company)"); expect(formatCustomer360Company({ id: "2", name: null })).toBe("Empresa #2"); expect(source).not.toContain("data.byCompany.sort"); });
  it("reutiliza alerts, cadence e severidade sem cálculo", () => { expect(source).toContain("CollectionAlertsPanel alerts={item.alerts} highestSeverity={item.highestAlertSeverity}"); expect(source).toContain("item.cadence ? <CollectionCadencePanel cadence={item.cadence}"); expect(source).not.toMatch(/score\s*[+*/-]/); expect(source).not.toMatch(/\.sort\(/); });
  it("oferece ações corretas e navegação sem prefetch", () => { for (const text of ["Abrir cobrança", "OperationDetailsDrawer", "Ver cliente", "prefetch={false}", 'item.kind === "OPERATION"', 'item.kind === "OPPORTUNITY"']) expect(source).toContain(text); expect(source).not.toContain("CreateOperationDrawer"); });
  it("implementa todos os filtros e paginação de API", () => { for (const text of ['onChange("companyId"', 'onChange("customerId"', 'onChange("severity"', 'onChange("alertType"', "Pagination", "pageSize"]) expect(source).toContain(text); });
  it("cobre autorização, loading, erro, retry, vazio e companies indisponíveis", () => { for (const text of ["user?.role !== \"ADMIN\"", "Este painel está disponível apenas para administradores.", "query.isLoading", "query.isError", "query.refetch()", "Nenhuma exceção encontrada para os filtros selecionados.", "companiesQuery.isError", "companiesQuery.refetch()"]) expect(source).toContain(text); });
  it("não cria N+1 ou dependência do Work Plan", () => { expect(source).not.toContain("useWorkPlan"); expect(source).not.toMatch(/use(Customer360|OperationDetails|Receivables)\([^)]*item/); });
  it.each([[400, "filtros"], [401, "sessão"], [403, "apenas para administradores"]])("trata HTTP %s", (status, message) => expect(getCollectionExceptionsErrorMessage(new ApiRequestError({ status, message: "interno", url: "/x" }))).toContain(message));
  it("trata rede e ZodError", () => { expect(getCollectionExceptionsErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede"); expect(getCollectionExceptionsErrorMessage(new ZodError([]))).toContain("resposta das exceções"); });
});
