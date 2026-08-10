import { collectionOpportunitiesResponseSchema } from "@/schemas/collection-opportunities.schema";

import { api } from "./api";

export async function getCollectionOpportunities(customerId: number) {
  const { data } = await api.get(`/customers/${customerId}/collection-opportunities`);
  return collectionOpportunitiesResponseSchema.parse(data);
}
