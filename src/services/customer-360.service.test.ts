import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { getCustomer360 } from "./customer-360.service";

export const customer360Response = {
  customer: { id: 123, name: "Cliente Teste", document: null, phone: null, email: "cliente@example.com" },
  financial: { totalOpen: 1500.5, totalOverdue: 500, receivablesCount: 1, overdueCount: 1, oldestDueDate: "2026-07-01" },
  receivables: [{ id: 10, company: "Empresa A", dueDate: "2026-07-01", amount: 2000, balance: 1500.5, daysOverdue: 40, status: "OPEN" }],
  operations: [{ id: "op-1", status: "IN_PROGRESS", priority: "HIGH", objective: "Negociar débito", company: "Empresa A", portfolio: "Carteira Norte", updatedAt: "2026-08-10T12:00:00.000Z" }],
  nextActions: [{ id: "action-1", interactionId: "interaction-1", customerId: "123", receivableId: "10", assignedTo: "user-1", type: "CALL", status: "PENDING", title: "Ligar", description: "Retornar contato", dueAt: "2026-08-11T12:00:00.000Z", completedAt: null, cancelledAt: null, createdAt: "2026-08-10T12:00:00.000Z", updatedAt: "2026-08-10T12:00:00.000Z" }],
  interactions: [{ id: "interaction-1", customerId: "123", receivableId: "10", userId: "user-1", channel: "phone", outcome: "promise_to_pay", notes: "Prometeu pagar", createdAt: "2026-08-10T12:00:00.000Z", updatedAt: "2026-08-10T12:00:00.000Z" }],
  timeline: [{ id: "event-1", customerId: "123", interactionId: "interaction-1", nextActionId: null, actorUserId: "user-1", type: "INTERACTION_CREATED", title: "Atendimento registrado", description: "Prometeu pagar", metadata: { channel: "phone", outcome: "promise_to_pay" }, occurredAt: "2026-08-10T12:00:00.000Z", createdAt: "2026-08-10T12:00:00.000Z" }],
};

const mock = new MockAdapter(api);
afterEach(() => mock.reset());

describe("customer 360 service", () => {
  it("consome exclusivamente GET /customers/:id/360 e valida a resposta", async () => {
    mock.onGet("/customers/123/360").reply(200, customer360Response);
    await expect(getCustomer360(123)).resolves.toEqual(customer360Response);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe("/customers/123/360");
  });

  it("rejeita resposta inválida", async () => {
    mock.onGet("/customers/123/360").reply(200, { ...customer360Response, financial: { ...customer360Response.financial, totalOpen: -1 } });
    await expect(getCustomer360(123)).rejects.toThrow();
  });
});
