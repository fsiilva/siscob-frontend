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
  workPlan: sharedQueryKeys.workPlan,
  operationDetails: sharedQueryKeys.operationDetails,
  operationTimeline: sharedQueryKeys.operationTimeline,
  dashboardOverview: sharedQueryKeys.dashboardOverview,
  managementDashboard: sharedQueryKeys.managementDashboard,
  customer360: sharedQueryKeys.customer360,
};

export async function invalidateInteractionQueries(queryClient: QueryClient, customerId: number, operationId?: string) {
  const invalidations = [
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customerInteractions(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customerNextActions(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.userNextActions }),
    queryClient.invalidateQueries({ queryKey: interactionQueryKeys.operationQueue }),
    queryClient.invalidateQueries({ queryKey: interactionQueryKeys.workPlan }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.dashboardOverview }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.managementDashboard }),
    queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.customer360(customerId) }),
  ];
  if (operationId) {
    invalidations.push(
      queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.operationDetails(operationId) }),
      queryClient.invalidateQueries({ exact: true, queryKey: interactionQueryKeys.operationTimeline(operationId) }),
    );
  }
  await Promise.all(invalidations);
}

export function useCreateInteraction(customerId: number, operationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInteractionRequest) => createInteraction(customerId, payload),
    onSuccess: () => invalidateInteractionQueries(queryClient, customerId, operationId),
    retry: false,
  });
}
