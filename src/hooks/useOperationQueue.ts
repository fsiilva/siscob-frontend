"use client";

import { useQuery } from "@tanstack/react-query";

import { getOperationQueue } from "@/services/operation.service";

export function useOperationQueue() {
  return useQuery({
    queryKey: ["operation", "queue"],
    queryFn: getOperationQueue,
    retry: 1,
  });
}
