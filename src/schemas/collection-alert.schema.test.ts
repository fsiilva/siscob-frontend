import { describe, expect, it } from "vitest";

import { collectionAlertSchema, collectionAlertsSchema, collectionAlertSeveritySchema } from "./collection-alert.schema";

const alerts = [
  { type: "CRITICAL_WITHOUT_FOLLOW_UP" as const, severity: "CRITICAL" as const, label: "Crítico sem acompanhamento", reason: "Cobrança prioritária sem próxima ação definida" },
  { type: "OVERDUE_FOLLOW_UP" as const, severity: "WARNING" as const, label: "Retorno vencido", reason: "Existe uma ação vencida" },
];

describe("collection alert schema", () => {
  it("aceita lista vazia, um alerta e múltiplos alertas preservando a ordem", () => {
    expect(collectionAlertsSchema.parse([])).toEqual([]);
    expect(collectionAlertsSchema.parse([alerts[0]])).toEqual([alerts[0]]);
    expect(collectionAlertsSchema.parse(alerts)).toEqual(alerts);
  });
  it.each(["CRITICAL_WITHOUT_FOLLOW_UP", "OVERDUE_FOLLOW_UP", "DUE_TODAY", "HIGH_VALUE_WITHOUT_ACTIVE_COLLECTION", "PAYMENT_PROMISE_DUE_TODAY", "OVERDUE_PAYMENT_PROMISE", "BROKEN_PAYMENT_PROMISE"] as const)("aceita type %s", (type) => expect(collectionAlertSchema.parse({ ...alerts[0], type }).type).toBe(type));
  it.each(["NONE", "INFO", "WARNING", "CRITICAL"] as const)("aceita highestAlertSeverity %s", (severity) => expect(collectionAlertSeveritySchema.parse(severity)).toBe(severity));
  it("rejeita type e severity inválidos sem afrouxar o objeto", () => {
    expect(() => collectionAlertSchema.parse({ ...alerts[0], type: "UNKNOWN" })).toThrow();
    expect(() => collectionAlertSchema.parse({ ...alerts[0], severity: "NONE" })).toThrow();
    expect(() => collectionAlertSchema.parse({ ...alerts[0], extra: true })).toThrow();
  });
});
