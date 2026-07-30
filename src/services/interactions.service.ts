import type { CreateInteractionRequest, InteractionResponse } from "@/types/interactions";

import { api } from "./api";

export async function createInteraction(customerId: number, payload: CreateInteractionRequest) {
  const { data } = await api.post<InteractionResponse>(`/customers/${customerId}/interactions`, payload);
  return data;
}
