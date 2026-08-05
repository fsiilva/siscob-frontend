import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { api } from "./api";
import { getManagementDashboard } from "./management-dashboard.service";

const response = {
  operations: {
    total: 4,
    byStatus: [{ value: "IN_PROGRESS", count: 4 }],
    byPriority: [{ value: "HIGH", count: 4 }],
  },
  operators: [{ id: "user-1", name: "Ana", assigned: 4, inProgress: 4, completedToday: 0, overdueNextActions: 1 }],
  companies: [{ id: "1", name: "Fortaleza", operations: 4 }],
  portfolios: [{ id: "portfolio-1", name: "Norte", operations: 4 }],
};
const mock = new MockAdapter(api);

afterEach(() => mock.reset());

describe("management dashboard service", () => {
  it("loads and validates the management endpoint", async () => {
    mock.onGet("/dashboard/management").reply(200, response);
    await expect(getManagementDashboard()).resolves.toEqual(response);
  });

  it("rejects invalid counters", async () => {
    mock.onGet("/dashboard/management").reply(200, {
      ...response,
      operations: { ...response.operations, total: -1 },
    });
    await expect(getManagementDashboard()).rejects.toThrow();
  });
});
