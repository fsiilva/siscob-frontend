"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { ApiRequestError } from "@/services/api";
import { sharedQueryKeys } from "@/lib/query-keys";
import {
  cancelNextAction,
  completeNextAction,
  getCustomerNextActions,
  getMyNextActions,
  rescheduleNextAction,
} from "@/services/next-actions.service";
import type { CancelNextActionRequest, RescheduleNextActionRequest } from "@/types/next-actions-api";

export const nextActionQueryKeys = {
  mine: sharedQueryKeys.userNextActions,
  customer: sharedQueryKeys.customerNextActions,
  customerDetails: sharedQueryKeys.customer,
  operationQueue: sharedQueryKeys.operationQueue,
  customerTimeline: sharedQueryKeys.customerTimeline,
  operationDetails: sharedQueryKeys.operationDetails,
  operationTimeline: sharedQueryKeys.operationTimeline,
  dashboardOverview: sharedQueryKeys.dashboardOverview,
  managementDashboard: sharedQueryKeys.managementDashboard,
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

export async function invalidateNextActionQueries(queryClient: QueryClient, customerId: number, operationId?: string) {
  const invalidations = [
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.mine }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.customer(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.customerDetails(customerId) }),
    queryClient.invalidateQueries({ queryKey: nextActionQueryKeys.operationQueue }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.customerTimeline(customerId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.dashboardOverview }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.managementDashboard }),
  ];
  if (operationId) invalidations.push(
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.operationDetails(operationId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: nextActionQueryKeys.operationTimeline(operationId) }),
  );
  await Promise.all(invalidations);
}

export async function refreshNextActionsOnConflict(error: Error, queryClient: QueryClient, customerId: number, operationId?: string) {
  if (error instanceof ApiRequestError && error.status === 409) {
    await invalidateNextActionQueries(queryClient, customerId, operationId);
  }
}

export function useNextActionMutations(customerId: number, operationId?: string) {
  const queryClient = useQueryClient();
  const invalidate = () => invalidateNextActionQueries(queryClient, customerId, operationId);
  const handleError = (error: Error) => refreshNextActionsOnConflict(error, queryClient, customerId, operationId);

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
