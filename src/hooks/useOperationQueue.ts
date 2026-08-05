"use client";

import { useQuery } from "@tanstack/react-query";

import { getWorkQueue } from "@/services/work-queue.service";
import type { WorkQueueFilters } from "@/types/work-queue";

export const workQueueKeys = {
  all: ["operations", "work-queue"] as const,
  list: (filters: WorkQueueFilters) => ["operations", "work-queue", filters] as const,
};

export function useOperationQueue(filters: WorkQueueFilters) {
  return useQuery({
    queryKey: workQueueKeys.list(filters),
    queryFn: () => getWorkQueue(filters),
    retry: 1,
  });
}
