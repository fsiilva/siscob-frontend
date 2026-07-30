"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { createInteraction } from "@/services/interactions.service";
import type { CreateInteractionRequest } from "@/types/interactions";

export const interactionQueryKeys = {
  customerInteractions: (customerId: number) => ["customers", customerId, "interactions"] as const,
  customerNextActions: (customerId: number) => ["customers", customerId, "next-actions"] as const,
  userNextActions: ["me", "next-actions"] as const,
  customer: (customerId: number) => ["customers", customerId] as const,
  customerSummary: (customerId: number) => ["customers", customerId, "summary"] as const,
  operationQueue: ["operation", "queue"] as const,
  customerTimeline: (customerId: number) => ["customers", customerId, "timeline"] as const,
};

export async function invalidateInteractionQueries(queryClient: QueryClient, customerId: number) {
  await Promise.all([
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customerInteractions(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customerNextActions(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.userNextActions }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customer(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customerSummary(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.operationQueue }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customerTimeline(customerId) }),
  ]);
}

export function useCreateInteraction(customerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInteractionRequest) => createInteraction(customerId, payload),
    onSuccess: () => invalidateInteractionQueries(queryClient, customerId),
    retry: false,
  });
}
