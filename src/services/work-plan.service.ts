import { workPlanResponseSchema } from "@/schemas/work-plan.schema";
import type { WorkPlanFilters, WorkPlanResponse } from "@/types/work-plan";

import { api } from "./api";

export async function getWorkPlan(filters: WorkPlanFilters): Promise<WorkPlanResponse> {
  const { data } = await api.get("/operations/work-plan", { params: filters });
  return workPlanResponseSchema.parse(data);
}
