import { describe, expect, it } from "vitest";

import type { OperationResponse } from "@/types/operations-api";
import type { TimelineApiEvent } from "@/types/timeline-api";

import { getAvailableOperationActions, isOperationTimelineEvent } from "./operation-presenter";

const baseOperation: OperationResponse = {
  id: "op-1", companyId: "c", portfolioId: "p", customerId: "customer", receivableId: null,
  assignedOperatorId: "user-1", objective: "Cobrança", status: "ASSIGNED", priority: "NORMAL",
  waitingReason: null, reviewAt: null, blockedReason: null, completionResult: null, cancellationReason: null,
  statusChangedAt: "2026-07-30T12:00:00Z", startedAt: null, completedAt: null, cancelledAt: null,
  version: 1, createdAt: "2026-07-30T12:00:00Z", updatedAt: "2026-07-30T12:00:00Z",
};

describe("operation presenter", () => {
  it("permite ao operador apenas comandos compatíveis sobre sua Operation", () => {
    expect(getAvailableOperationActions(baseOperation, { id: "user-1", role: "USER" })).toEqual(["release", "start"]);
    expect(getAvailableOperationActions(baseOperation, { id: "other", role: "USER" })).toEqual([]);
  });

  it("oferece ao admin comandos gerenciais compatíveis com o status", () => {
    expect(getAvailableOperationActions(baseOperation, { id: "admin", role: "ADMIN" })).toEqual(["release", "transfer", "start", "cancel", "changePriority"]);
    expect(getAvailableOperationActions({ ...baseOperation, status: "COMPLETED" }, { id: "admin", role: "ADMIN" })).toEqual(["reopen"]);
  });

  it("relaciona a timeline somente por metadata.operationId válida", () => {
    const event: TimelineApiEvent = { id: "e", customerId: "customer", interactionId: null, nextActionId: null, actorUserId: null, type: "SYSTEM", title: "Operation", description: "Atualizada", metadata: null, occurredAt: "2026-07-30T12:00:00Z", createdAt: "2026-07-30T12:00:00Z" };
    expect(isOperationTimelineEvent({ ...event, metadata: { operationId: "op-1" } }, "op-1")).toBe(true);
    expect(isOperationTimelineEvent({ ...event, metadata: { operationId: 1 } }, "op-1")).toBe(false);
    expect(isOperationTimelineEvent(event, "op-1")).toBe(false);
  });
});
