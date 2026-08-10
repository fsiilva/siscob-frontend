"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getProductivityDashboard } from "@/services/productivity-dashboard.service";
import type { ProductivityFilters } from "@/types/productivity-dashboard";

export const productivityDashboardQueryKeys = {
  all: sharedQueryKeys.productivityDashboard,
  filtered: (filters: ProductivityFilters) => [...sharedQueryKeys.productivityDashboard, filters] as const,
};

export function useProductivityDashboard(filters: ProductivityFilters) {
  return useQuery({
    queryKey: productivityDashboardQueryKeys.filtered(filters),
    queryFn: () => getProductivityDashboard(filters),
    retry: 1,
  });
}
