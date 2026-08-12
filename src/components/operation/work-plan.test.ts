import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { formatCustomer360Company } from "@/components/customers/customer-360.presenter";
import { ApiRequestError } from "@/services/api";
import { getWorkPlanErrorMessage } from "./work-plan.error";
import { workPlanLabels } from "./work-plan.labels";

const source = readFileSync(fileURLToPath(new URL("./work-plan.tsx", import.meta.url)), "utf8");

describe("work plan UI", () => {
  it("exibe os dois tipos, o primeiro item destacado e os dados da policy sem recalcular", () => {
    for (const text of ["workPlanLabels.activeOperation", "Oportunidade", "COBRAR AGORA", "item.score", "item.suggestedPriority", "item.reasons", "workPlanLabels.definedPriority", "workPlanLabels.nextAction", "Operador responsável"]) expect(source).toContain(text);
    expect(source).toContain("featured={index === 0}");
    expect(source).not.toMatch(/\.sort\(/);
    expect(source).not.toMatch(/score\s*[+*/-]/);
    expect(source).toContain("item.cadence ? <CollectionCadencePanel cadence={item.cadence}");
    expect(source).not.toMatch(/sort\([^)]*cadence/);
    expect(source).toContain("<CollectionAlertsPanel alerts={item.alerts} highestSeverity={item.highestAlertSeverity} />");
    expect(source).not.toMatch(/sort\([^)]*alerts/);
    expect(source.indexOf("CollectionCadencePanel cadence={item.cadence}")).toBeLessThan(source.indexOf("CollectionAlertsPanel alerts={item.alerts}"));
  });
  it("apresenta a promessa da API sem cálculo temporal nem reordenação", () => {
    for (const text of ["item.paymentPromise ?", "Promessa de pagamento", "formatPaymentPromiseAmount(item.paymentPromise.promisedAmount)", "formatPaymentPromiseDate(item.paymentPromise.promisedDate)", "paymentPromiseStatusLabels[item.paymentPromise.status]"]) expect(source).toContain(text);
    expect(source).not.toMatch(/paymentPromise[\s\S]*\.sort|\.sort\([^)]*paymentPromise/);
    expect(source).not.toMatch(/promisedDate\s*[<>]=?\s*(new Date|Date\.now|today)/);
    expect(source.indexOf("item.paymentPromise ?")).toBeLessThan(source.indexOf("CollectionAlertsPanel alerts={item.alerts}"));
  });
  it("renderiza a nomenclatura em português nos pontos visíveis da cobrança", () => {
    const html = renderToStaticMarkup(createElement("section", null, workPlanLabels.activeOperation, `${workPlanLabels.definedPriority}: Alta`, workPlanLabels.receivable, workPlanLabels.nextAction, workPlanLabels.openOperation));
    for (const text of ["Cobrança ativa", "Prioridade definida: Alta", "TÍTULO", "PRÓXIMA AÇÃO", "Abrir cobrança"]) expect(html).toContain(text);
    for (const text of ["Operation ativa", "Prioridade persistida", "RECEIVABLE", "NEXT ACTION", "Abrir Operation"]) expect(html).not.toContain(text);
  });
  it("renderiza Status da cobrança sem alterar o valor técnico do filtro", () => {
    const html = renderToStaticMarkup(createElement("label", null, workPlanLabels.operationStatus, createElement("select", null, createElement("option", { value: "OPERATION" }, workPlanLabels.operations), createElement("option", { value: "OPPORTUNITY" }, "Oportunidades"))));
    expect(html).toContain("Status da cobrança");
    expect(html).not.toContain("Status da Operation");
    expect(html).toContain('value="OPERATION"');
    expect(html).toContain('value="OPPORTUNITY"');
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
    expect(source).toContain('onChange("assignedOperatorId"');
    expect(source).toContain('isAdmin ? <Filter label="Operador"');
  });
  it("cobre loading, erro, retry e vazio", () => { for (const text of ["query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Nenhuma cobrança disponível para os filtros selecionados."]) expect(source).toContain(text); });
  it.each([[400, "filtros"], [401, "sessão"], [403, "acesso"], [404, "não foi encontrado"], [409, "alterados"], [422, "regras"]])("trata HTTP %s", (status, message) => expect(getWorkPlanErrorMessage(new ApiRequestError({ status, message: "interno", url: "/x" }))).toContain(message));
  it("trata rede e ZodError", () => { expect(getWorkPlanErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede"); expect(getWorkPlanErrorMessage(new ZodError([]))).toContain("formato inesperado"); });
});
