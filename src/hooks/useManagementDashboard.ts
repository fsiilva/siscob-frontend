"use client";

import { useQuery } from "@tanstack/react-query";

import { getManagementDashboard } from "@/services/management-dashboard.service";

export const managementDashboardQueryKey = ["dashboard", "management"] as const;

export function useManagementDashboard(enabled = true) {
  return useQuery({
    queryKey: managementDashboardQueryKey,
    queryFn: getManagementDashboard,
    enabled,
    retry: 1,
  });
}
