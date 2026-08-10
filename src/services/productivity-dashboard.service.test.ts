import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { getProductivityDashboard } from "./productivity-dashboard.service";

export const productivityResponse = {
  period: { from: "2026-08-01", to: "2026-08-10" },
  summary: { interactions: 10, contactMade: 6, noAnswer: 4, promisesToPay: 3, completedNextActions: 5, overdueNextActions: 2, completedOperations: 1 },
  operators: [{ id: "operator-1", name: "Ana", interactions: 10, contactMade: 6, noAnswer: 4, promisesToPay: 3, completedNextActions: 5, completedOperations: 1 }],
};

const mock = new MockAdapter(api);
afterEach(() => mock.reset());

describe("productivity dashboard service", () => {
  it("consome e valida o endpoint com todos os filtros", async () => {
    const params = { from: "2026-08-01", to: "2026-08-10", operatorId: "operator-1" };
    mock.onGet("/dashboard/productivity", { params }).reply(200, productivityResponse);
    await expect(getProductivityDashboard(params)).resolves.toEqual(productivityResponse);
  });

  it("não envia operatorId ausente", async () => {
    const params = { from: "2026-08-10", to: "2026-08-10" };
    mock.onGet("/dashboard/productivity", { params }).reply(200, productivityResponse);
    await getProductivityDashboard(params);
    expect(mock.history.get[0].params).toEqual(params);
  });

  it("rejeita resposta inválida sem remover a validação Zod", async () => {
    mock.onGet("/dashboard/productivity").reply(200, { ...productivityResponse, summary: { ...productivityResponse.summary, interactions: -1 } });
    await expect(getProductivityDashboard({ from: "2026-08-10", to: "2026-08-10" })).rejects.toThrow();
  });
});
