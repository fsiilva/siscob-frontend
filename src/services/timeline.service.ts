import type { TimelineApiParams, TimelineApiResponse } from "@/types/timeline-api";

import { api } from "./api";

export async function getCustomerTimeline(customerId: number | string, params: TimelineApiParams = {}) {
  const { data } = await api.get<TimelineApiResponse>(`/customers/${customerId}/timeline`, {
    params: {
      limit: params.limit ?? 20,
      ...(params.cursor ? { cursor: params.cursor } : {}),
      ...(params.type ? { type: params.type } : {}),
    },
  });
  return data;
}
