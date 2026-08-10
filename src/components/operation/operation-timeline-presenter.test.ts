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

  it("classifica OperationEvent de Interaction pela metadata", () => {
    const event: OperationTimelineItem = { id: "interaction-event", createdAt: "2026-08-01T12:30:00.000Z", type: "OperationEvent", actor: null, title: "Operação atualizada", description: "Cobrança registrada", metadata: { channel: "phone", outcome: "promise_to_pay", operationId: "op-1" } };
    expect(presentOperationTimelineItem(event)).toMatchObject({ icon: "interaction", relation: "Interaction", title: event.title, description: event.description });
  });

  it("classifica OperationEvent de Next Action pela metadata", () => {
    const event: OperationTimelineItem = { id: "next-action-event", createdAt: "2026-08-01T12:30:00.000Z", type: "OperationEvent", actor: null, title: "Operação atualizada", description: "Próxima ação atualizada", metadata: { type: "VERIFY_PAYMENT", status: "PENDING", dueAt: "2026-08-05T12:00:00.000Z", operationId: "op-1" } };
    expect(presentOperationTimelineItem(event)).toMatchObject({ icon: "nextAction", relation: "Next Action", title: event.title, description: event.description });
  });

  it("preserva title e description em OperationEvent com metadata desconhecida", () => {
    const event: OperationTimelineItem = { id: "generic-event", createdAt: "2026-08-01T12:30:00.000Z", type: "OperationEvent", actor: null, title: "Título da API", description: "Descrição da API", metadata: { operationId: "op-1" } };
    expect(presentOperationTimelineItem(event)).toMatchObject({ icon: "status", relation: null, title: "Título da API", description: "Descrição da API" });
  });
});
