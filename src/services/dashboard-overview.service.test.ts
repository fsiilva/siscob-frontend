import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";
import { api } from "./api";
import { getDashboardOverview } from "./dashboard-overview.service";

const response = {
  operations: { total: 7, ready: 1, assigned: 1, inProgress: 1, waiting: 1, blocked: 1, completed: 1, cancelled: 1 },
  priorities: { low: 1, normal: 3, high: 2, urgent: 1 },
  nextActions: { pending: 3, overdue: 2, today: 1 },
  interactions: { today: 4 },
};
const mock = new MockAdapter(api);

afterEach(() => mock.reset());

describe("dashboard overview service", () => {
  it("loads and validates the exact endpoint contract", async () => {
    mock.onGet("/dashboard/overview").reply(200, response);
    await expect(getDashboardOverview()).resolves.toEqual(response);
  });

  it("rejects invalid or negative counters", async () => {
    mock.onGet("/dashboard/overview").reply(200, { ...response, interactions: { today: -1 } });
    await expect(getDashboardOverview()).rejects.toThrow();
  });
});
