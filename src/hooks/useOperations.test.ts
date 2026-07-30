import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import type { OperationResponse } from "@/types/operations-api";

import { operationQueryKeys, refreshOperationAfterConflict, refreshOperationQueries } from "./useOperations";

const operation = { id: "op-1", customerId: "customer-1", version: 2 } as OperationResponse;
const listParams = { page: 1, pageSize: 20, sortBy: "updatedAt" as const, sortOrder: "desc" as const };

describe("Operation query orchestration", () => {
  it("mantém query keys estáveis e específicas", () => {
    expect(operationQueryKeys.list(listParams)).toEqual(["operations", "list", listParams]);
    expect(operationQueryKeys.detail("op-1")).toEqual(["operations", "detail", "op-1"]);
    expect(operationQueryKeys.timeline("op-1")).toEqual(["operations", "detail", "op-1", "timeline"]);
  });

  it("atualiza detalhe e invalida lista e timeline após sucesso", async () => {
    const client = new QueryClient();
    client.setQueryData(operationQueryKeys.list(listParams), { items: [] });
    client.setQueryData(operationQueryKeys.timeline("op-1"), { pages: [] });
    await refreshOperationQueries(client, operation);
    expect(client.getQueryData(operationQueryKeys.detail("op-1"))).toBe(operation);
    expect(client.getQueryState(operationQueryKeys.list(listParams))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.timeline("op-1"))?.isInvalidated).toBe(true);
  });

  it("refaz detalhe, lista e timeline em conflito sem repetir comando", async () => {
    const client = new QueryClient();
    client.setQueryData(operationQueryKeys.detail("op-1"), operation);
    client.setQueryData(operationQueryKeys.list(listParams), { items: [] });
    client.setQueryData(operationQueryKeys.timeline("op-1"), { pages: [] });
    await refreshOperationAfterConflict(client, "op-1");
    expect(client.getQueryState(operationQueryKeys.detail("op-1"))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.list(listParams))?.isInvalidated).toBe(true);
    expect(client.getQueryState(operationQueryKeys.timeline("op-1"))?.isInvalidated).toBe(true);
  });
});
