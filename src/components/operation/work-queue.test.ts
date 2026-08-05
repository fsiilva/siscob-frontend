import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { WorkQueueItem } from "@/types/work-queue";
import { filterWorkQueueGroup } from "./work-queue.presenter";

const source = readFileSync(fileURLToPath(new URL("./work-queue.tsx", import.meta.url)), "utf8");
const item = (dueAt: string, status: "PENDING" | "OVERDUE" = "PENDING") => ({ nextAction: { dueAt, status } }) as WorkQueueItem;
describe("intelligent work queue UI", () => {
  it("derives Today and Overdue groups from API items", () => {
    const now = new Date(2026, 7, 5, 12);
    const items = [item(new Date(2026, 7, 5, 15).toISOString()), item(new Date(2026, 7, 4).toISOString()), item(new Date(2026, 7, 7).toISOString(), "OVERDUE")];
    expect(filterWorkQueueGroup(items, "today", now)).toHaveLength(1);
    expect(filterWorkQueueGroup(items, "overdue", now)).toHaveLength(2);
    expect(filterWorkQueueGroup(items, "all", now)).toBe(items);
  });
  it("contains cards, score, reasons, highlight and existing actions", () => {
    for (const text of ["COBRE AGORA", "Score", "Motivos da prioridade", "Abrir Operation", "Registrar cobrança", "Atualizar dados"]) expect(source).toContain(text);
  });
  it("submits the Operation context through the existing Interaction Drawer", () => {
    expect(source).toContain("operationId: interactionItem.operation.id");
    expect(source).toContain("operationContext={{");
    expect(source).toContain("registrada com sucesso");
    expect(source).not.toContain("createTimeline");
    expect(source).not.toContain("createNextAction");
  });
  it("contains filters, pagination and all async states", () => {
    for (const text of ["query.isLoading", "query.isError", "query.refetch()", "Tentar novamente", "Nenhuma cobrança pendente para os filtros selecionados.", "Pagination", "user?.role === \"ADMIN\""]) expect(source).toContain(text);
  });
});
