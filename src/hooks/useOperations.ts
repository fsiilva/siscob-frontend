"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { createOperation, executeOperationCommand, getOperation, getOperations } from "@/services/operations-api.service";
import { getCustomerTimeline } from "@/services/timeline.service";
import type { CreateOperationRequest, OperationCommand, OperationCommandPayload, OperationListParams, OperationResponse } from "@/types/operations-api";

export const operationQueryKeys = {
  all: ["operations"] as const,
  lists: () => ["operations", "list"] as const,
  list: (params: OperationListParams) => ["operations", "list", params] as const,
  detail: (id: string) => ["operations", "detail", id] as const,
  timeline: (id: string) => ["operations", "detail", id, "timeline"] as const,
};

export function useOperations(params: OperationListParams) {
  return useQuery({ queryKey: operationQueryKeys.list(params), queryFn: () => getOperations(params), retry: 1 });
}

export function useOperation(id: string | null) {
  return useQuery({
    queryKey: operationQueryKeys.detail(id ?? ""), queryFn: () => getOperation(id as string), enabled: Boolean(id), retry: 1,
  });
}

export function useOperationTimeline(operation: OperationResponse | undefined) {
  return useInfiniteQuery({
    queryKey: operationQueryKeys.timeline(operation?.id ?? ""),
    queryFn: ({ pageParam }) => getCustomerTimeline(operation?.customerId ?? "", {
      limit: 20,
      ...(pageParam ? { cursor: pageParam } : {}),
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.hasMore ? (page.nextCursor ?? undefined) : undefined,
    enabled: Boolean(operation),
    retry: 1,
  });
}

export async function refreshOperationQueries(queryClient: QueryClient, operation: OperationResponse) {
  queryClient.setQueryData(operationQueryKeys.detail(operation.id), operation);
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: operationQueryKeys.lists() }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.timeline(operation.id) }),
  ]);
}

export async function refreshOperationAfterConflict(queryClient: QueryClient, operationId: string) {
  await Promise.all([
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.detail(operationId) }),
    queryClient.invalidateQueries({ queryKey: operationQueryKeys.lists() }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.timeline(operationId) }),
  ]);
}

export function useOperationCommand(operationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ command, payload }: { command: OperationCommand; payload: OperationCommandPayload }) => executeOperationCommand(operationId, command, payload),
    onSuccess: (operation) => refreshOperationQueries(queryClient, operation),
    onError: (error: Error & { status?: number }) => error.status === 409
      ? refreshOperationAfterConflict(queryClient, operationId)
      : undefined,
    retry: false,
  });
}

export async function refreshAfterOperationCreation(queryClient: QueryClient, operation: OperationResponse) {
  queryClient.setQueryData(operationQueryKeys.detail(operation.id), operation);
  await queryClient.invalidateQueries({ queryKey: operationQueryKeys.lists() });
}

export function useCreateOperation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateOperationRequest) => createOperation(request),
    onSuccess: (operation) => refreshAfterOperationCreation(queryClient, operation),
    retry: false,
  });
}
