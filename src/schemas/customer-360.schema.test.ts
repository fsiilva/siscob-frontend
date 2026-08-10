import { describe, expect, it } from "vitest";

import { customer360Schema } from "./customer-360.schema";

const customer360Response = {
  customer: { id: 123, name: "Cliente", document: null, phone: null, email: null },
  financial: { totalOpen: 100, totalOverdue: 50, receivablesCount: 1, overdueCount: 1, oldestDueDate: null },
  receivables: [{ id: 1, company: "Empresa", dueDate: "2026-08-01", amount: 100, balance: 50, daysOverdue: 9, status: "OPEN" }],
  operations: [], nextActions: [], interactions: [], timeline: [],
};

describe("customer 360 schema", () => {
  it("aceita o payload agregado completo e campos opcionais nulos", () => expect(customer360Schema.parse(customer360Response)).toEqual(customer360Response));
  it("preserva balance como campo obrigatório do contrato", () => {
    const withoutBalance: Record<string, unknown> = { ...customer360Response.receivables[0] };
    delete withoutBalance.balance;
    expect(() => customer360Schema.parse({ ...customer360Response, receivables: [withoutBalance] })).toThrow();
  });
  it("aceita todas as coleções vazias", () => {
    const empty = { ...customer360Response, receivables: [], operations: [], nextActions: [], interactions: [], timeline: [] };
    expect(customer360Schema.parse(empty)).toEqual(empty);
  });
});
