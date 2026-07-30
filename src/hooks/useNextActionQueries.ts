"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { ApiRequestError } from "@/services/api";
import {
  cancelNextAction,
  completeNextAction,
  getCustomerNextActions,
  getMyNextActions,
  rescheduleNextAction,
} from "@/services/next-actions.service";
import type { CancelNextActionRequest, RescheduleNextActionRequest } from "@/types/next-actions-api";

export const nextActionQueryKeys = {
  mine: ["me", "next-actions"] as const,
  customer: (customerId: number) => ["customers", customerId, "next-actions"] as const,
  customerDetails: (customerId: number) => ["customers", customerId] as const,
  operationQueue: ["operation", "queue"] as const,
  customerTimeline: (customerId: number) => ["customers", customerId, "timeline"] as const,
};

export function useMyNextActions() {
  return useQuery({
    queryKey: nextActionQueryKeys.mine,
    queryFn: getMyNextActions,
    retry: 1,
  });
}

export function useCustomerNextActions(customerId: number) {
  return useQuery({
    queryKey: nextActionQueryKeys.customer(customerId),
    queryFn: () => getCustomerNextActions(customerId),
    enabled: Number.isInteger(customerId) && customerId > 0,
    retry: 1,
  });
}

export async function invalidateNextActionQueries(queryClient: QueryClient, customerId: number) {
  await Promise.all([
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.mine }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.customer(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.customerDetails(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.operationQueue }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.customerTimeline(customerId) }),
  ]);
}

export async function refreshNextActionsOnConflict(error: Error, queryClient: QueryClient, customerId: number) {
  if (error instanceof ApiRequestError && error.status === 409) {
    await invalidateNextActionQueries(queryClient, customerId);
  }
}

export function useNextActionMutations(customerId: number) {
  const queryClient = useQueryClient();
  const invalidate = () => invalidateNextActionQueries(queryClient, customerId);
  const handleError = (error: Error) => refreshNextActionsOnConflict(error, queryClient, customerId);

  const completeMutation = useMutation({
    mutationFn: completeNextAction,
    onSuccess: invalidate,
    onError: handleError,
  });
  const cancelMutation = useMutation({
    mutationFn: ({ id, request }: { id: string; request: CancelNextActionRequest }) => cancelNextAction(id, request),
    onSuccess: invalidate,
    onError: handleError,
  });
  const rescheduleMutation = useMutation({
    mutationFn: ({ id, request }: { id: string; request: RescheduleNextActionRequest }) => rescheduleNextAction(id, request),
    onSuccess: invalidate,
    onError: handleError,
  });

  return { completeMutation, cancelMutation, rescheduleMutation };
}
