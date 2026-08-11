"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getCollectionPortfolioDashboard } from "@/services/collection-portfolio-dashboard.service";
import type { CollectionPortfolioFilters } from "@/types/collection-portfolio-dashboard";

export const collectionPortfolioDashboardQueryKeys = {
  all: sharedQueryKeys.collectionPortfolioDashboard,
  filtered: (filters: CollectionPortfolioFilters) => [...sharedQueryKeys.collectionPortfolioDashboard, filters] as const,
};

export function useCollectionPortfolioDashboard(filters: CollectionPortfolioFilters, enabled = true) {
  return useQuery({
    queryKey: collectionPortfolioDashboardQueryKeys.filtered(filters),
    queryFn: () => getCollectionPortfolioDashboard(filters),
    enabled,
    retry: 1,
  });
}
