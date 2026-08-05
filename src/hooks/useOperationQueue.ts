"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getOperationQueue } from "@/services/operation.service";

export function useOperationQueue() {
  return useQuery({
    queryKey: sharedQueryKeys.operationQueue,
    queryFn: getOperationQueue,
    retry: 1,
  });
}
