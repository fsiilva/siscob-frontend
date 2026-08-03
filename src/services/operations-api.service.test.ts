import MockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { createOperation, executeOperationCommand, getOperation, getOperations } from "./operations-api.service";

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
