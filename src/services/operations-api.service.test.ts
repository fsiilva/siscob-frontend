import MockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { createOperation, executeOperationCommand, getOperation, getOperationDetails, getOperations, getOperationTimeline } from "./operations-api.service";

const operation = {
  id: "op-1", companyId: "company-1", portfolioId: "portfolio-1", customerId: "customer-1",
  receivableId: null, assignedOperatorId: null, objective: "Cobrar parcela", status: "READY", priority: "NORMAL",
  waitingReason: null, reviewAt: null, blockedReason: null, completionResult: null, cancellationReason: null,
  statusChangedAt: "2026-07-30T12:00:00.000Z", startedAt: null, completedAt: null, cancelledAt: null,
  version: 3, createdAt: "2026-07-30T12:00:00.000Z", updatedAt: "2026-07-30T12:00:00.000Z",
};

describe("operations-api.service", () => {
  const mock = new MockAdapter(api);
  beforeEach(() => mock.reset());

  it("lista com filtros, ordenação e paginação validados", async () => {
    const params = { page: 2, pageSize: 25, status: "READY" as const, priority: "HIGH" as const, companyId: "company-1", sortBy: "updatedAt" as const, sortOrder: "desc" as const };
    const response = { items: [operation], page: 2, pageSize: 25, total: 26, totalPages: 2 };
    mock.onGet("/operations", { params }).reply(200, response);
    await expect(getOperations(params)).resolves.toEqual(response);
  });

  it("busca o detalhe pelo endpoint real", async () => {
    mock.onGet("/operations/op-1").reply(200, operation);
    await expect(getOperation("op-1")).resolves.toEqual(operation);
  });

  it("busca e valida a timeline específica da Operation", async () => {
    const response = { items: [{ id: "event-1", createdAt: "2026-08-01T12:00:00.000Z", type: "OperationCreated", actor: { id: "user-1", name: "João" }, title: "Operação criada", description: "Operação registrada", metadata: { operationId: "op-1" } }] };
    mock.onGet("/operations/op-1/timeline").reply(200, response);
    await expect(getOperationTimeline("op-1")).resolves.toEqual(response);
  });

  it("busca a composição completa da Operation", async () => {
    const response = { operation: { ...operation, assignedOperator: null, completedReason: null, cancelledReason: null }, timeline: [], nextActions: [], interactions: [] };
    mock.onGet("/operations/op-1/details").reply(200, response);
    await expect(getOperationDetails("op-1")).resolves.toEqual(response);
  });

  it("aceita o contrato de details usado em produção com OperationEvent", async () => {
    const response = {
      operation: { ...operation, assignedOperator: null, completedReason: null, cancelledReason: null },
      timeline: [
        { id: "event-created", createdAt: "2026-08-01T12:00:00.000Z", type: "OperationCreated", actor: null, title: "Operação criada", description: "Operação registrada", metadata: { operationId: "op-1" } },
        { id: "event-cancelled", createdAt: "2026-08-01T13:00:00.000Z", type: "OperationCancelled", actor: null, title: "Operação cancelada", description: "Cancelamento registrado", metadata: { operationId: "op-1" } },
        { id: "event-interaction", createdAt: "2026-08-01T14:00:00.000Z", type: "OperationEvent", actor: null, title: "Operação atualizada", description: "Cobrança registrada", metadata: { channel: "phone", outcome: "promise_to_pay", operationId: "op-1" } },
        { id: "event-next-action", createdAt: "2026-08-01T15:00:00.000Z", type: "OperationEvent", actor: null, title: "Operação atualizada", description: "Próxima ação atualizada", metadata: { type: "VERIFY_PAYMENT", status: "COMPLETED", dueAt: "2026-08-05T12:00:00.000Z", operationId: "op-1" } },
      ],
      nextActions: [{ id: "action-1", status: "COMPLETED", type: "VERIFY_PAYMENT", title: "Verificar pagamento", description: "Confirmar compensação", dueAt: "2026-08-05T12:00:00.000Z", createdAt: "2026-08-01T15:00:00.000Z" }],
      interactions: [
        { id: "interaction-1", channel: "phone", outcome: "no_answer", notes: "Primeira tentativa", createdAt: "2026-08-01T13:30:00.000Z" },
        { id: "interaction-2", channel: "phone", outcome: "promise_to_pay", notes: "Cliente prometeu pagar", createdAt: "2026-08-01T14:00:00.000Z" },
      ],
    };
    mock.onGet("/operations/op-1/details").reply(200, response);
    await expect(getOperationDetails("op-1")).resolves.toEqual(response);
  });

  it("cria pela API real com payload explícito e receivable opcional", async () => {
    const payload = { companyId: "1", portfolioId: "north", customerId: "123", objective: "Homologar cobrança", priority: "NORMAL" as const };
    mock.onPost("/operations", payload).reply(201, { ...operation, companyId: "1", portfolioId: "north", customerId: "123", objective: payload.objective });
    await expect(createOperation(payload)).resolves.toMatchObject({ objective: payload.objective });
    expect(JSON.parse(mock.history.post[0].data as string)).toEqual(payload);
  });

  it.each(["assign", "release", "transfer", "start", "wait", "block", "resume", "complete", "cancel", "reopen"] as const)(
    "envia %s com expectedVersion por POST", async (command) => {
      mock.onPost(`/operations/op-1/${command}`).reply(200, operation);
      await executeOperationCommand("op-1", command, { expectedVersion: 3, reason: "Motivo" });
      expect(JSON.parse(mock.history.post[0].data as string)).toMatchObject({ expectedVersion: 3 });
    },
  );

  it("altera prioridade pelo PATCH /priority", async () => {
    mock.onPatch("/operations/op-1/priority").reply(200, { ...operation, priority: "URGENT", version: 4 });
    await executeOperationCommand("op-1", "changePriority", { expectedVersion: 3, priority: "URGENT", reason: "Urgência" });
    expect(JSON.parse(mock.history.patch[0].data as string)).toEqual({ expectedVersion: 3, priority: "URGENT", reason: "Urgência" });
  });
});
