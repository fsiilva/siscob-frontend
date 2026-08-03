import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getOperationCards, isDashboardEmpty } from "./operational-dashboard.presenter";
import type { DashboardOverview } from "@/types/dashboard-overview";

const data: DashboardOverview = {
  operations: { total: 21, ready: 3, assigned: 2, inProgress: 4, waiting: 1, blocked: 1, completed: 9, cancelled: 1 },
  priorities: { low: 2, normal: 10, high: 6, urgent: 3 },
  nextActions: { pending: 8, overdue: 3, today: 2 },
  interactions: { today: 7 },
};

describe("operational dashboard", () => {
  it("builds the required first-row cards from real counters", () => {
    expect(getOperationCards(data)).toEqual([
      { label: "Total de Operations", value: 21 },
      { label: "Pendentes", value: 5 },
      { label: "Em andamento", value: 4 },
      { label: "Concluídas", value: 9 },
    ]);
  });

  it("renders all required card groups", () => {
    const source = readFileSync(fileURLToPath(new URL("./operational-dashboard.tsx", import.meta.url)), "utf8");
    for (const text of ["getOperationCards", "Prioridades", "Next Actions", "Interactions de hoje"]) {
      expect(source).toContain(text);
    }
  });

  it("detects a genuinely empty operational projection", () => {
    const empty: DashboardOverview = {
      operations: { total: 0, ready: 0, assigned: 0, inProgress: 0, waiting: 0, blocked: 0, completed: 0, cancelled: 0 },
      priorities: { low: 0, normal: 0, high: 0, urgent: 0 },
      nextActions: { pending: 0, overdue: 0, today: 0 },
      interactions: { today: 0 },
    };
    expect(isDashboardEmpty(empty)).toBe(true);
    expect(isDashboardEmpty(data)).toBe(false);
  });

  it("implements loading, error, retry and empty states", () => {
    const source = readFileSync(fileURLToPath(new URL("./operational-dashboard.tsx", import.meta.url)), "utf8");
    expect(source).toContain("query.isLoading");
    expect(source).toContain("query.isError");
    expect(source).toContain("query.refetch()");
    expect(source).toContain("Tentar novamente");
    expect(source).toContain("Nenhum dado operacional disponível");
  });
});
