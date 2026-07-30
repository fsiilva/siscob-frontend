import type {
  CancelNextActionRequest,
  NextActionApiResponse,
  NextActionListResponse,
  RescheduleNextActionRequest,
} from "@/types/next-actions-api";

import { api } from "./api";

const listParams = { page: 1, pageSize: 100 };

export async function getMyNextActions() {
  const { data } = await api.get<NextActionListResponse>("/me/next-actions", { params: listParams });
  return data;
}

export async function getCustomerNextActions(customerId: number) {
  const { data } = await api.get<NextActionListResponse>(`/customers/${customerId}/next-actions`, { params: listParams });
  return data;
}

export async function completeNextAction(id: string) {
  const { data } = await api.patch<NextActionApiResponse>(`/next-actions/${id}/complete`);
  return data;
}

export async function cancelNextAction(id: string, request: CancelNextActionRequest) {
  const { data } = await api.patch<NextActionApiResponse>(`/next-actions/${id}/cancel`, request);
  return data;
}

export async function rescheduleNextAction(id: string, request: RescheduleNextActionRequest) {
  const { data } = await api.patch<NextActionApiResponse>(`/next-actions/${id}/reschedule`, request);
  return data;
}
