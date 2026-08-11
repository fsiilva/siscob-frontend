import { describe, expect, it } from "vitest";

import { collectionPortfolioDashboardSchema } from "./collection-portfolio-dashboard.schema";

export const collectionPortfolioFixture = {
  summary: { totalOpen: 1000, totalOverdue: 600, customersWithOpenDebt: 2, customersWithOverdueDebt: 1, openReceivables: 3, overdueReceivables: 2, overdueWithActiveOperation: 1, overdueWithoutActiveOperation: 1, amountWithActiveOperation: 300, amountWithoutActiveOperation: 300 },
  aging: [
    { range: "NOT_DUE", label: "A vencer", receivables: 1, customers: 1, balance: 400 },
    { range: "1_30", label: "1 a 30 dias", receivables: 1, customers: 1, balance: 100 },
    { range: "31_60", label: "31 a 60 dias", receivables: 0, customers: 0, balance: 0 },
    { range: "61_90", label: "61 a 90 dias", receivables: 0, customers: 0, balance: 0 },
    { range: "91_180", label: "91 a 180 dias", receivables: 0, customers: 0, balance: 0 },
    { range: "181_360", label: "181 a 360 dias", receivables: 0, customers: 0, balance: 0 },
    { range: "OVER_360", label: "Acima de 360 dias", receivables: 1, customers: 1, balance: 500 },
  ],
  customers: [{ customerId: 1, customerName: "Cliente", totalOpen: 1000, totalOverdue: 600, receivablesCount: 3, overdueCount: 2, maxDaysOverdue: 400, activeOperations: 1, hasCollectionOpportunity: true }],
} as const;

describe("collection portfolio dashboard schema", () => {
  it("valida integralmente o contrato e todas as faixas", () => expect(collectionPortfolioDashboardSchema.parse(collectionPortfolioFixture).aging).toHaveLength(7));
  it("aceita exatamente os ranges retornados pela API", () => {
    expect(collectionPortfolioDashboardSchema.parse(collectionPortfolioFixture).aging.map(({ range }) => range)).toEqual([
      "NOT_DUE", "1_30", "31_60", "61_90", "91_180", "181_360", "OVER_360",
    ]);
  });
  it("rejeita o range legado DAYS_1_30", () => {
    const aging = collectionPortfolioFixture.aging.map((item, index) => index === 1 ? { ...item, range: "DAYS_1_30" } : item);
    expect(() => collectionPortfolioDashboardSchema.parse({ ...collectionPortfolioFixture, aging })).toThrow();
  });
  it.each([
    { ...collectionPortfolioFixture, summary: { ...collectionPortfolioFixture.summary, totalOpen: -1 } },
    { ...collectionPortfolioFixture, customers: [{ ...collectionPortfolioFixture.customers[0], activeOperations: 1.2 }] },
    { ...collectionPortfolioFixture, extra: true },
  ])("rejeita resposta inválida", (payload) => expect(() => collectionPortfolioDashboardSchema.parse(payload)).toThrow());
});
