import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import type { OperationResponse } from "@/types/operations-api";

import { operationQueryKeys, refreshAfterOperationCreation, refreshOperationAfterConflict, refreshOperationQueries } from "./useOperations";

const operation = { id: "op-1", customerId: "customer-1", version: 2 } as OperationResponse;
const listParams = { page: 1, pageSize: 20, sortBy: "updatedAt" as const, sortOrder: "desc" as const };

describe("Operation query orchestration", () => {
  it("mantém query keys estáveis e específicas", () => {
    expect(operationQueryKeys.list(listParams)).toEqual(["operations", "list", listParams]);
    expect(operationQueryKeys.detail("op-1")).toEqual(["operations", "detail", "op-1"]);
    expect(operationQueryKeys.details("op-1")).toEqual(["operations", "op-1", "details"]);
    expect(operationQueryKeys.timeline("op-1")).toEqual(["operations", "op-1", "timeline"]);
  });

  it("atualiza detalhe e invalida lista e timeline após sucesso", async () => {
    const client = new QueryClient();
    client.setQueryData(operationQueryKeys.list(listParams), { items: [] });
    client.setQueryData(operationQueryKeys.timeline("op-1"), { pages: [] });
    client.setQueryData(operationQueryKeys.details("op-1"), operation);
    client.setQueryData(["dashboard", "overview"], {});
    await refreshOperationQueries(client, operation);
    expect(client.getQueryData(operationQueryKeys.detail("op-1"))).toBe(operation);
    expect(client.getQueryState(operationQueryKeys.list(listParams))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.timeline("op-1"))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.details("op-1"))?.isInvalidated).toBe(true);
    expect(client.getQueryState(["dashboard", "overview"])?.isInvalidated).toBe(true);
  });

  it("invalida Customer 360 após comando de uma Operation com cliente numérico", async () => {
    const client = new QueryClient();
    const numericCustomerOperation = { ...operation, customerId: "123" };
    client.setQueryData(["customers", 123, "360"], {});
    await refreshOperationQueries(client, numericCustomerOperation);
    expect(client.getQueryState(["customers", 123, "360"])?.isInvalidated).toBe(true);
  });

  it("refaz detalhe, lista e timeline em conflito sem repetir comando", async () => {
    const client = new QueryClient();
    client.setQueryData(operationQueryKeys.detail("op-1"), operation);
    client.setQueryData(operationQueryKeys.list(listParams), { items: [] });
    client.setQueryData(operationQueryKeys.timeline("op-1"), { pages: [] });
    client.setQueryData(operationQueryKeys.details("op-1"), operation);
    await refreshOperationAfterConflict(client, "op-1");
    expect(client.getQueryState(operationQueryKeys.detail("op-1"))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.list(listParams))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.timeline("op-1"))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.details("op-1"))?.isInvalidated).toBe(true);
  });

  it("insere o detalhe criado e invalida somente listas", async () => {
    const client = new QueryClient();
    client.setQueryData(operationQueryKeys.list(listParams), { items: [] });
    await refreshAfterOperationCreation(client, operation);
    expect(client.getQueryData(operationQueryKeys.detail("op-1"))).toBe(operation);
    expect(client.getQueryState(operationQueryKeys.list(listParams))?.isInvalidated).toBe(true);
  });
});
