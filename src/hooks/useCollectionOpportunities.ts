"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getCollectionOpportunities } from "@/services/collection-opportunities.service";

export const collectionOpportunitiesQueryKey = sharedQueryKeys.collectionOpportunities;

export function useCollectionOpportunities(customerId: number) {
  return useQuery({
    queryKey: collectionOpportunitiesQueryKey(customerId),
    queryFn: () => getCollectionOpportunities(customerId),
    enabled: Number.isInteger(customerId) && customerId > 0,
    retry: 1,
  });
}
