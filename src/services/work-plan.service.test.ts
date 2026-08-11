import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";

import { workPlanFixture } from "@/schemas/work-plan.schema.test";
import type { WorkPlanFilters } from "@/types/work-plan";
import { api } from "./api";
import { getWorkPlan } from "./work-plan.service";

const mock = new MockAdapter(api);
afterEach(() => mock.reset());

describe("work plan service", () => {
  it("faz uma chamada com somente os filtros suportados", async () => {
    const filters: WorkPlanFilters = { kind: "OPERATION", companyId: "2", customerId: "10", priority: "HIGH", status: "IN_PROGRESS", assignedOperatorId: "user-1", overdueOnly: true, page: 2, pageSize: 20 };
    mock.onGet("/operations/work-plan", { params: filters }).reply(200, workPlanFixture);
    await expect(getWorkPlan(filters)).resolves.toEqual(workPlanFixture);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].params).toEqual(filters);
  });
  it("rejeita resposta inválida", async () => { mock.onGet("/operations/work-plan").reply(200, { items: [] }); await expect(getWorkPlan({ page: 1, pageSize: 20 })).rejects.toThrow(); });
});
