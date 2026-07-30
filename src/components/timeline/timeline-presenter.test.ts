import { describe, expect, it } from "vitest";

import type { TimelineApiEvent, TimelineApiEventType } from "@/types/timeline-api";

import { presentTimelineEvent } from "./timeline-presenter";

function event(type: TimelineApiEventType, metadata: Record<string, unknown> | null = null): TimelineApiEvent {
  return {
    id: `event-${type}`, customerId: "123", interactionId: "interaction-1", nextActionId: "action-1",
    actorUserId: "user-1", type, title: "Título", description: "Descrição", metadata,
    occurredAt: "2026-07-30T12:00:00.000Z", createdAt: "2026-07-30T12:00:00.000Z",
  };
}

describe("Timeline presenter", () => {
  it("apresenta interação com canal, resultado, observação e ator", () => {
    const result = presentTimelineEvent(event("INTERACTION_CREATED", { channel: "phone", outcome: "promise_to_pay" }));
    expect(result.icon).toBe("interaction");
    expect(result.details).toEqual(expect.arrayContaining([
      { label: "Canal", value: "Ligação" },
      { label: "Resultado", value: "Promessa de pagamento" },
      { label: "Observação", value: "Descrição" },
      { label: "Ator", value: "user-1" },
    ]));
  });

  it.each([
    ["NEXT_ACTION_CREATED", "created"],
    ["NEXT_ACTION_COMPLETED", "completed"],
    ["NEXT_ACTION_CANCELLED", "cancelled"],
    ["NEXT_ACTION_RESCHEDULED", "rescheduled"],
    ["SYSTEM", "system"],
  ] as const)("mapeia %s", (type, icon) => {
    expect(presentTimelineEvent(event(type)).icon).toBe(icon);
  });

  it("apresenta criação, conclusão, cancelamento e reagendamento", () => {
    expect(presentTimelineEvent(event("NEXT_ACTION_CREATED", { type: "CALL", dueAt: "2026-08-01T12:00:00.000Z", assignedTo: "user-2" })).details).toEqual(expect.arrayContaining([
      { label: "Tipo", value: "Ligação" }, { label: "Responsável", value: "user-2" },
    ]));
    expect(presentTimelineEvent(event("NEXT_ACTION_COMPLETED", { completedAt: "2026-08-01T12:00:00.000Z" })).details.some((item) => item.label === "Conclusão")).toBe(true);
    expect(presentTimelineEvent(event("NEXT_ACTION_CANCELLED", { reason: "Duplicada" })).details).toEqual(expect.arrayContaining([{ label: "Motivo", value: "Duplicada" }]));
    expect(presentTimelineEvent(event("NEXT_ACTION_RESCHEDULED", { previousDueAt: "2026-08-01T12:00:00.000Z", newDueAt: "2026-08-02T12:00:00.000Z", previousDescription: "Antes", newDescription: "Depois" })).details).toEqual(expect.arrayContaining([
      { label: "Descrição anterior", value: "Antes" }, { label: "Nova descrição", value: "Depois" },
    ]));
  });

  it("ignora metadata ausente, array ou com tipos inválidos", () => {
    expect(() => presentTimelineEvent(event("INTERACTION_CREATED", null))).not.toThrow();
    const invalid = event("NEXT_ACTION_CANCELLED", { reason: { unsafe: true }, cancelledAt: 123 });
    expect(presentTimelineEvent(invalid).details.some((item) => item.label === "Motivo")).toBe(false);
  });
});
