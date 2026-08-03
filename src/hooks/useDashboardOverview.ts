"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/services/dashboard-overview.service";

export const dashboardOverviewKey = ["dashboard", "overview"] as const;

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardOverviewKey,
    queryFn: getDashboardOverview,
    retry: 1,
  });
}
