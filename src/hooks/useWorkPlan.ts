"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getWorkPlan } from "@/services/work-plan.service";
import type { WorkPlanFilters } from "@/types/work-plan";

export const workPlanQueryKeys = {
  all: sharedQueryKeys.workPlan,
  filtered: (filters: WorkPlanFilters) => [...sharedQueryKeys.workPlan, filters] as const,
};

export function useWorkPlan(filters: WorkPlanFilters) {
  return useQuery({ queryKey: workPlanQueryKeys.filtered(filters), queryFn: () => getWorkPlan(filters), retry: 1 });
}
