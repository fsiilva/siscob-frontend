"use client";

import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { operationQueryKeys } from "@/hooks/useOperations";
import { sharedQueryKeys } from "@/lib/query-keys";
import { createPaymentPromise, transitionPaymentPromise } from "@/services/payment-promises.service";
import type { CreatePaymentPromiseRequest, PaymentPromiseCommand } from "@/types/payment-promises";

export async function refreshPaymentPromiseQueries(queryClient: QueryClient, operationId: string) {
  await Promise.all([
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.details(operationId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.timeline(operationId) }),
    queryClient.invalidateQueries({ queryKey: sharedQueryKeys.workPlan }),
    queryClient.invalidateQueries({ queryKey: sharedQueryKeys.operationQueue }),
    queryClient.invalidateQueries({ queryKey: sharedQueryKeys.collectionExceptionsDashboard }),
    queryClient.invalidateQueries({ exact: true, queryKey: sharedQueryKeys.managementDashboard }),
    queryClient.invalidateQueries({ exact: true, queryKey: sharedQueryKeys.dashboardOverview }),
  ]);
}

export function useCreatePaymentPromise(operationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreatePaymentPromiseRequest) => createPaymentPromise(operationId, request),
    onSuccess: () => refreshPaymentPromiseQueries(queryClient, operationId),
    onError: (error: Error & { status?: number }) => error.status === 409 ? refreshPaymentPromiseQueries(queryClient, operationId) : undefined,
    retry: false,
  });
}

export function useTransitionPaymentPromise(operationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, command, expectedVersion }: { id: string; command: PaymentPromiseCommand; expectedVersion: number }) => transitionPaymentPromise(id, command, expectedVersion),
    onSuccess: () => refreshPaymentPromiseQueries(queryClient, operationId),
    onError: (error: Error & { status?: number }) => error.status === 409 ? refreshPaymentPromiseQueries(queryClient, operationId) : undefined,
    retry: false,
  });
}
