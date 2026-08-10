import { describe, expect, it } from "vitest";

import { collectionOpportunitiesResponseSchema } from "./collection-opportunities.schema";

export const collectionOpportunitiesResponse = {
  customerId: 10,
  items: [{
    receivableId: 123,
    company: { id: 1, name: "Empresa" },
    dueDate: "2026-08-01T00:00:00.000Z",
    amount: 1000,
    balance: 900,
    daysOverdue: 9,
    status: "OPEN" as const,
    hasActiveOperation: false,
    activeOperationId: null,
    suggestedPriority: "NORMAL" as const,
    reasons: ["Título vencido há 9 dias", "Sem Operation ativa"],
  }],
};

describe("collection opportunities schema", () => {
  it("valida integralmente o contrato", () => expect(collectionOpportunitiesResponseSchema.parse(collectionOpportunitiesResponse)).toEqual(collectionOpportunitiesResponse));
  it("aceita company.name nulo para fallback amigável", () => expect(collectionOpportunitiesResponseSchema.parse({ ...collectionOpportunitiesResponse, items: [{ ...collectionOpportunitiesResponse.items[0], company: { id: 1, name: null } }] }).items[0].company.name).toBeNull());
  it.each(["suggestedPriority", "reasons", "balance", "daysOverdue"])("rejeita %s ausente", (field) => {
    const item: Record<string, unknown> = { ...collectionOpportunitiesResponse.items[0] };
    delete item[field];
    expect(() => collectionOpportunitiesResponseSchema.parse({ ...collectionOpportunitiesResponse, items: [item] })).toThrow();
  });
  it("rejeita prioridade recalculada ou desconhecida", () => expect(() => collectionOpportunitiesResponseSchema.parse({ ...collectionOpportunitiesResponse, items: [{ ...collectionOpportunitiesResponse.items[0], suggestedPriority: "CRITICAL" }] })).toThrow());
});
