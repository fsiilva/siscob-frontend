import { describe, expect, it } from "vitest";

import type { NextActionApiResponse } from "@/types/next-actions-api";

import { getNextActionPriority, isActiveNextAction, nextActionStatusLabels, nextActionTypeLabels } from "./next-action-presenter";

function action(overrides: Partial<NextActionApiResponse> = {}): NextActionApiResponse {
  return {
    id: "action-1", interactionId: "interaction-1", customerId: "123", receivableId: null,
    assignedTo: "user-1", type: "CALL", status: "PENDING", title: "Ligar", description: "Retorno",
    dueAt: "2026-08-05T14:00:00.000Z", completedAt: null, cancelledAt: null,
    createdAt: "2026-07-30T12:00:00.000Z", updatedAt: "2026-07-30T12:00:00.000Z", ...overrides,
  };
}

describe("apresentação de Next Actions", () => {
  it("mapeia explicitamente enums da API", () => {
    expect(nextActionTypeLabels.VERIFY_PAYMENT).toBe("Conferir pagamento");
    expect(nextActionTypeLabels.SEND_DOCUMENT).toBe("Enviar documento");
    expect(nextActionStatusLabels.IN_PROGRESS).toBe("Em andamento");
    expect(nextActionStatusLabels.OVERDUE).toBe("Atrasada");
  });

  it("prioriza ações ativas no Customer 360", () => {
    expect(["PENDING", "IN_PROGRESS", "OVERDUE"].every((status) => isActiveNextAction(status as NextActionApiResponse["status"]))).toBe(true);
    expect(isActiveNextAction("COMPLETED")).toBe(false);
    expect(isActiveNextAction("CANCELLED")).toBe(false);
  });

  it("deriva prioridade visual sem inventar campo no contrato", () => {
    expect(getNextActionPriority(action({ status: "OVERDUE" }))).toBe("high");
    expect(getNextActionPriority(action({ type: "VERIFY_PAYMENT" }))).toBe("high");
    expect(getNextActionPriority(action({ type: "CLOSE_CASE" }))).toBe("low");
    expect(getNextActionPriority(action({ type: "CALL" }))).toBe("medium");
  });
});
