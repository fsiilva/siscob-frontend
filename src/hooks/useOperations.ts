"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { createOperation, executeOperationCommand, getOperation, getOperationDetails, getOperations, getOperationTimeline } from "@/services/operations-api.service";
import type { CreateOperationRequest, OperationCommand, OperationCommandPayload, OperationListParams, OperationResponse } from "@/types/operations-api";

export const operationQueryKeys = {
  all: ["operations"] as const,
  lists: () => ["operations", "list"] as const,
  list: (params: OperationListParams) => ["operations", "list", params] as const,
  detail: (id: string) => ["operations", "detail", id] as const,
  details: (id: string) => ["operations", id, "details"] as const,
  timeline: (id: string) => ["operations", id, "timeline"] as const,
};

export function useOperations(params: OperationListParams) {
  return useQuery({ queryKey: operationQueryKeys.list(params), queryFn: () => getOperations(params), retry: 1 });
}

export function useOperation(id: string | null) {
  return useQuery({
    queryKey: operationQueryKeys.detail(id ?? ""), queryFn: () => getOperation(id as string), enabled: Boolean(id), retry: 1,
  });
}

export function useOperationDetails(id: string | null) {
  return useQuery({
    queryKey: operationQueryKeys.details(id ?? ""),
    queryFn: () => getOperationDetails(id as string),
    enabled: Boolean(id),
    retry: 1,
  });
}

export function useOperationTimeline(operationId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: operationQueryKeys.timeline(operationId ?? ""),
    queryFn: () => getOperationTimeline(operationId as string),
    enabled: Boolean(operationId) && enabled,
    retry: 1,
  });
}

export async function refreshOperationQueries(queryClient: QueryClient, operation: OperationResponse) {
  queryClient.setQueryData(operationQueryKeys.detail(operation.id), operation);
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: operationQueryKeys.lists() }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.details(operation.id) }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.timeline(operation.id) }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  ]);
}

export async function refreshOperationAfterConflict(queryClient: QueryClient, operationId: string) {
  await Promise.all([
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.detail(operationId) }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.details(operationId) }),
    queryClient.invalidateQueries({ queryKey: operationQueryKeys.lists() }),
    queryClient.invalidateQueries({ exact: true, queryKey: operationQueryKeys.timeline(operationId) }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
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
