import { describe, expect, it } from "vitest";

import { productivityDashboardSchema } from "./productivity-dashboard.schema";

const valid = {
  period: { from: "2026-08-01", to: "2026-08-10" },
  summary: { interactions: 0, contactMade: 0, noAnswer: 0, promisesToPay: 0, completedNextActions: 0, overdueNextActions: 0, completedOperations: 0 },
  operators: [{ id: "operator-1", name: "Ana", interactions: 0, contactMade: 0, noAnswer: 0, promisesToPay: 0, completedNextActions: 0, completedOperations: 0 }],
};

describe("productivity dashboard schema", () => {
  it("aceita o contrato completo com contadores zerados", () => expect(productivityDashboardSchema.parse(valid)).toEqual(valid));
  it("rejeita campos ausentes", () => expect(() => productivityDashboardSchema.parse({ ...valid, period: {} })).toThrow());
  it("rejeita contadores negativos ou fracionários", () => {
    expect(() => productivityDashboardSchema.parse({ ...valid, summary: { ...valid.summary, interactions: -1 } })).toThrow();
    expect(() => productivityDashboardSchema.parse({ ...valid, summary: { ...valid.summary, contactMade: 1.5 } })).toThrow();
  });
});
