import { describe, expect, it } from "vitest";

import type { ProductivityDashboard } from "@/types/productivity-dashboard";
import { getDefaultProductivityFilters, getProductivityEfficiency, getProductivityPeriod, isProductivityDashboardEmpty, sortProductivityOperators } from "./productivity-dashboard.presenter";

const data: ProductivityDashboard = {
  period: { from: "2026-08-01", to: "2026-08-10" },
  summary: { interactions: 10, contactMade: 4, noAnswer: 6, promisesToPay: 1, completedNextActions: 3, overdueNextActions: 2, completedOperations: 1 },
  operators: [
    { id: "2", name: "Bia", interactions: 2, contactMade: 1, noAnswer: 1, promisesToPay: 0, completedNextActions: 1, completedOperations: 0 },
    { id: "1", name: "Ana", interactions: 8, contactMade: 3, noAnswer: 5, promisesToPay: 1, completedNextActions: 2, completedOperations: 1 },
  ],
};

describe("productivity dashboard presenter", () => {
  const now = new Date(2026, 7, 10, 12);

  it("usa hoje como período padrão", () => expect(getDefaultProductivityFilters(now)).toEqual({ from: "2026-08-10", to: "2026-08-10" }));

  it.each([
    ["today", "2026-08-10"], ["7days", "2026-08-04"], ["30days", "2026-07-12"],
  ] as const)("calcula o atalho %s", (shortcut, from) => expect(getProductivityPeriod(shortcut, now)).toEqual({ from, to: "2026-08-10" }));

  it("deriva somente as duas taxas permitidas", () => expect(getProductivityEfficiency(data)).toEqual({ contactRate: 40, promiseRate: 25 }));

  it("trata divisão por zero", () => expect(getProductivityEfficiency({ ...data, summary: { ...data.summary, interactions: 0, contactMade: 0, promisesToPay: 0 } })).toEqual({ contactRate: 0, promiseRate: 0 }));

  it("ordena operadores por interações sem alterar a resposta", () => {
    expect(sortProductivityOperators(data).map((operator) => operator.name)).toEqual(["Ana", "Bia"]);
    expect(data.operators[0].name).toBe("Bia");
  });

  it("detecta período sem atividade", () => {
    expect(isProductivityDashboardEmpty(data)).toBe(false);
    expect(isProductivityDashboardEmpty({ ...data, summary: { interactions: 0, contactMade: 0, noAnswer: 0, promisesToPay: 0, completedNextActions: 0, overdueNextActions: 0, completedOperations: 0 } })).toBe(true);
  });
});
