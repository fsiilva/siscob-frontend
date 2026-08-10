"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getWorkQueue } from "@/services/work-queue.service";
import type { WorkQueueFilters } from "@/types/work-queue";

export const workQueueKeys = {
  all: sharedQueryKeys.operationQueue,
  list: (filters: WorkQueueFilters) => [...sharedQueryKeys.operationQueue, filters] as const,
};

export function useOperationQueue(filters: WorkQueueFilters) {
  return useQuery({
    queryKey: workQueueKeys.list(filters),
    queryFn: () => getWorkQueue(filters),
    retry: 1,
  });
}
