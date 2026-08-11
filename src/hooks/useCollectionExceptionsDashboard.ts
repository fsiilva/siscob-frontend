"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getCollectionExceptionsDashboard } from "@/services/collection-exceptions-dashboard.service";
import type { CollectionExceptionsFilters } from "@/types/collection-exceptions-dashboard";

export const collectionExceptionsQueryKeys = {
  all: sharedQueryKeys.collectionExceptionsDashboard,
  filtered: (filters: CollectionExceptionsFilters) => [...sharedQueryKeys.collectionExceptionsDashboard, filters] as const,
};

export function useCollectionExceptionsDashboard(filters: CollectionExceptionsFilters) {
  return useQuery({ queryKey: collectionExceptionsQueryKeys.filtered(filters), queryFn: () => getCollectionExceptionsDashboard(filters), retry: 1 });
}
