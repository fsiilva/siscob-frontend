import { describe, expect, it } from "vitest";

import { collectionCadenceSchema } from "./collection-cadence.schema";

export const cadenceFixture = {
  status: "OVERDUE_FOLLOW_UP" as const,
  label: "Acompanhamento vencido",
  attention: "CRITICAL" as const,
  reasons: ["Próxima ação vencida há 3 dias", "Cliente ainda não retornou"],
};

describe("collection cadence schema", () => {
  it("valida estritamente o contrato compartilhado", () => expect(collectionCadenceSchema.parse(cadenceFixture)).toEqual(cadenceFixture));
  it.each(["NO_FOLLOW_UP", "OVERDUE_FOLLOW_UP", "DUE_TODAY", "SCHEDULED", "WAITING", "COMPLETED"] as const)("aceita status %s", (status) => expect(collectionCadenceSchema.parse({ ...cadenceFixture, status }).status).toBe(status));
  it.each(["OK", "WARNING", "CRITICAL"] as const)("aceita attention %s", (attention) => expect(collectionCadenceSchema.parse({ ...cadenceFixture, attention }).attention).toBe(attention));
  it("aceita reasons vazias e preserva múltiplas reasons", () => {
    expect(collectionCadenceSchema.parse({ ...cadenceFixture, reasons: [] }).reasons).toEqual([]);
    expect(collectionCadenceSchema.parse(cadenceFixture).reasons).toEqual(cadenceFixture.reasons);
  });
  it("rejeita status, attention, reasons e campos extras inválidos", () => {
    expect(() => collectionCadenceSchema.parse({ ...cadenceFixture, status: "LATE" })).toThrow();
    expect(() => collectionCadenceSchema.parse({ ...cadenceFixture, attention: "URGENT" })).toThrow();
    expect(() => collectionCadenceSchema.parse({ ...cadenceFixture, reasons: [1] })).toThrow();
    expect(() => collectionCadenceSchema.parse({ ...cadenceFixture, extra: true })).toThrow();
  });
});
