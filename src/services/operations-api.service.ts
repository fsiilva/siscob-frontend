import { createOperationRequestSchema, operationDetailsResponseSchema, operationListParamsSchema, operationListResponseSchema, operationResponseSchema, operationTimelineResponseSchema } from "@/schemas/operation.schemas";
import type { CreateOperationRequest, OperationCommand, OperationCommandPayload, OperationListParams } from "@/types/operations-api";

import { api } from "./api";

export async function getOperations(params: OperationListParams) {
  const validatedParams = operationListParamsSchema.parse(params);
  const { data } = await api.get("/operations", { params: compact(validatedParams) });
  return operationListResponseSchema.parse(data);
}

export async function getOperation(id: string) {
  const { data } = await api.get(`/operations/${id}`);
  return operationResponseSchema.parse(data);
}

export async function getOperationTimeline(id: string) {
  const { data } = await api.get(`/operations/${id}/timeline`);
  return operationTimelineResponseSchema.parse(data);
}

export async function getOperationDetails(id: string) {
  const { data } = await api.get(`/operations/${id}/details`);
  return operationDetailsResponseSchema.parse(data);
}

export async function createOperation(request: CreateOperationRequest) {
  const payload = createOperationRequestSchema.parse(request);
  const { data } = await api.post("/operations", compact(payload));
  return operationResponseSchema.parse(data);
}

export async function executeOperationCommand(id: string, command: OperationCommand, payload: OperationCommandPayload) {
  const path = command === "changePriority" ? "priority" : command;
  const method = command === "changePriority" ? "patch" : "post";
  const { data } = await api.request({ method, url: `/operations/${id}/${path}`, data: compact(payload) });
  return operationResponseSchema.parse(data);
}

function compact<T extends object>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""));
}
