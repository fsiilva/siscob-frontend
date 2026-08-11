import { describe, expect, it } from "vitest";

import { workPlanResponseSchema } from "./work-plan.schema";

export const workPlanFixture = {
  items: [
    {
      kind: "OPERATION" as const,
      customer: { id: "10", name: "Cliente" }, company: { id: "2", name: "Empresa" },
      receivable: null,
      operation: { id: "op-1", status: "IN_PROGRESS" as const, priority: "HIGH" as const, assignedOperator: null },
      nextAction: null, score: 180, suggestedPriority: "URGENT" as const,
      reasons: ["Recebível com mais de 90 dias de atraso", "Cliente possui alta exposição vencida"],
      cadence: { status: "OVERDUE_FOLLOW_UP" as const, label: "Acompanhamento vencido", attention: "CRITICAL" as const, reasons: ["Próxima ação vencida há 3 dias"] },
      alerts: [
        { type: "CRITICAL_WITHOUT_FOLLOW_UP" as const, severity: "CRITICAL" as const, label: "Crítico sem acompanhamento", reason: "Cobrança prioritária sem próxima ação definida" },
        { type: "OVERDUE_FOLLOW_UP" as const, severity: "WARNING" as const, label: "Retorno vencido", reason: "Existe uma ação de acompanhamento vencida" },
      ],
      highestAlertSeverity: "CRITICAL" as const,
    },
    {
      kind: "OPPORTUNITY" as const,
      customer: { id: "11", name: "Outro cliente" }, company: { id: "3", name: null },
      receivable: { id: "123", dueDate: "2026-08-01T00:00:00.000Z", balance: 1000, daysOverdue: 10 },
      operation: null,
      nextAction: null, score: 0, suggestedPriority: "LOW" as const, reasons: [], cadence: null,
      alerts: [{ type: "HIGH_VALUE_WITHOUT_ACTIVE_COLLECTION" as const, severity: "INFO" as const, label: "Alto valor sem cobrança ativa", reason: "Título de alto valor disponível para cobrança" }],
      highestAlertSeverity: "INFO" as const,
    },
  ],
  page: 1, pageSize: 20, total: 2, totalPages: 1,
};

describe("work plan schema", () => {
  it("valida integralmente OPERATION, OPPORTUNITY, score > 100 e campos nulos", () => expect(workPlanResponseSchema.parse(workPlanFixture)).toEqual(workPlanFixture));
  it.each(["LOW", "NORMAL", "HIGH", "URGENT"] as const)("aceita suggestedPriority %s", (suggestedPriority) => expect(workPlanResponseSchema.parse({ ...workPlanFixture, items: [{ ...workPlanFixture.items[1], suggestedPriority }] }).items[0].suggestedPriority).toBe(suggestedPriority));
  it("rejeita score negativo e infinito", () => {
    for (const score of [-1, Number.POSITIVE_INFINITY]) expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, items: [{ ...workPlanFixture.items[1], score }] })).toThrow();
  });
  it("exige Operation para kind OPERATION e recebível para OPPORTUNITY", () => {
    expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, items: [{ ...workPlanFixture.items[0], operation: null }] })).toThrow();
    expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, items: [{ ...workPlanFixture.items[1], receivable: null }] })).toThrow();
  });
  it("exige cadence em OPERATION e null em OPPORTUNITY", () => {
    expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, items: [{ ...workPlanFixture.items[0], cadence: null }] })).toThrow();
    expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, items: [{ ...workPlanFixture.items[1], cadence: workPlanFixture.items[0].cadence }] })).toThrow();
  });
  it.each(["alerts", "highestAlertSeverity"])("exige %s em OPERATION e OPPORTUNITY", (field) => {
    for (const sourceItem of workPlanFixture.items) {
      const item: Record<string, unknown> = { ...sourceItem };
      delete item[field];
      expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, items: [item] })).toThrow();
    }
  });
  it("rejeita campos desconhecidos no contrato estrito", () => expect(() => workPlanResponseSchema.parse({ ...workPlanFixture, unexpected: true })).toThrow());
});
