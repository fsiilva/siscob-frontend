import { describe, expect, it } from "vitest";

import { workPlanQueryKeys } from "./useWorkPlan";

describe("work plan hook", () => {
  it("inclui filtros e paginação na query key centralizada", () => {
    const filters = { page: 3, pageSize: 20, overdueOnly: true };
    expect(workPlanQueryKeys.all).toEqual(["operations", "work-plan"]);
    expect(workPlanQueryKeys.filtered(filters)).toEqual(["operations", "work-plan", filters]);
  });
});
