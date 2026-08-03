import { describe, expect, it } from "vitest";
import type { OperationTimelineItem } from "@/types/operations-api";
import { presentOperationTimelineItem } from "./operation-timeline-presenter";

describe("Operation timeline presenter", () => {
  it("apresenta ícone, usuário, data e hora", () => {
    const event: OperationTimelineItem = { id: "event-1", createdAt: "2026-08-01T12:30:00.000Z", type: "OperationCompleted", actor: { id: "user-1", name: "João" }, title: "Operação concluída", description: "Acordo realizado", metadata: {} };
    expect(presentOperationTimelineItem(event)).toMatchObject({ icon: "completed", user: "João" });
    expect(presentOperationTimelineItem(event).date).toBeTruthy();
    expect(presentOperationTimelineItem(event).time).toBeTruthy();
  });

  it("apresenta Sistema quando não há ator", () => {
    const event = { id: "event-1", createdAt: "2026-08-01T12:30:00.000Z", type: "OperationCreated", actor: null, title: "Operação criada", description: "Criada", metadata: {} } as OperationTimelineItem;
    expect(presentOperationTimelineItem(event).user).toBe("Sistema");
  });
});
