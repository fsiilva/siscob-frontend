import { describe, expect, it } from "vitest";

import { collectionExceptionsDashboardSchema } from "./collection-exceptions-dashboard.schema";

const alert = { type: "CRITICAL_WITHOUT_FOLLOW_UP" as const, severity: "CRITICAL" as const, label: "Crítico sem acompanhamento", reason: "Cobrança prioritária sem próxima ação definida" };
export const collectionExceptionsFixture = {
  summary: { totalExceptions: 2, critical: 1, warning: 0, informational: 1, criticalWithoutFollowUp: 1, overdueFollowUp: 0, dueToday: 0, highValueWithoutActiveCollection: 1 },
  byCompany: [{ company: { id: "2", name: null }, total: 2, critical: 1, warning: 0, informational: 1 }],
  items: [
    { kind: "OPERATION" as const, customer: { id: "10", name: "Cliente" }, company: { id: "2", name: null }, operationId: "op-1", receivableId: null, score: 180, suggestedPriority: "URGENT" as const, cadence: { status: "OVERDUE_FOLLOW_UP" as const, label: "Acompanhamento vencido", attention: "CRITICAL" as const, reasons: ["Próxima ação vencida"] }, alerts: [alert, { ...alert, type: "DUE_TODAY" as const, severity: "INFO" as const, label: "Ação para hoje", reason: "Existe uma ação agendada para hoje" }], highestAlertSeverity: "CRITICAL" as const },
    { kind: "OPPORTUNITY" as const, customer: { id: "11", name: "Outro cliente" }, company: { id: "3", name: "Empresa" }, operationId: null, receivableId: "123", score: 120, suggestedPriority: "HIGH" as const, cadence: null, alerts: [{ ...alert, type: "HIGH_VALUE_WITHOUT_ACTIVE_COLLECTION" as const, severity: "INFO" as const, label: "Oportunidade relevante", reason: "Título de alto valor sem cobrança ativa" }], highestAlertSeverity: "INFO" as const },
  ],
  page: 1, pageSize: 20, total: 2, totalPages: 1,
};

describe("collection exceptions dashboard schema", () => {
  it("valida integralmente summary, empresas, OPERATION e OPPORTUNITY", () => expect(collectionExceptionsDashboardSchema.parse(collectionExceptionsFixture)).toEqual(collectionExceptionsFixture));
  it("aceita cadence presente e null, múltiplos alerts e IDs opcionais", () => { const parsed = collectionExceptionsDashboardSchema.parse(collectionExceptionsFixture); expect(parsed.items[0].alerts).toHaveLength(2); expect(parsed.items[1].cadence).toBeNull(); expect(parsed.items[0].receivableId).toBeNull(); });
  it.each(["summary", "byCompany", "items", "page", "pageSize", "total", "totalPages"])("rejeita %s ausente", (field) => { const payload: Record<string, unknown> = { ...collectionExceptionsFixture }; delete payload[field]; expect(() => collectionExceptionsDashboardSchema.parse(payload)).toThrow(); });
  it("rejeita resposta e enums inválidos", () => {
    expect(() => collectionExceptionsDashboardSchema.parse({ ...collectionExceptionsFixture, extra: true })).toThrow();
    expect(() => collectionExceptionsDashboardSchema.parse({ ...collectionExceptionsFixture, items: [{ ...collectionExceptionsFixture.items[0], highestAlertSeverity: "NONE" }] })).toThrow();
  });
});
