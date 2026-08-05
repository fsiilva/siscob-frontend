"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { createInteraction } from "@/services/interactions.service";
import type { CreateInteractionRequest } from "@/types/interactions";

export const interactionQueryKeys = {
  customerInteractions: sharedQueryKeys.customerInteractions,
  customerNextActions: sharedQueryKeys.customerNextActions,
  userNextActions: sharedQueryKeys.userNextActions,
  customer: sharedQueryKeys.customer,
  customerSummary: sharedQueryKeys.customerSummary,
  operationQueue: sharedQueryKeys.operationQueue,
  customerTimeline: sharedQueryKeys.customerTimeline,
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
