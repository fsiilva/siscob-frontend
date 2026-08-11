import { collectionExceptionsDashboardSchema } from "@/schemas/collection-exceptions-dashboard.schema";
import type { CollectionExceptionsDashboard, CollectionExceptionsFilters } from "@/types/collection-exceptions-dashboard";

import { api } from "./api";

export async function getCollectionExceptionsDashboard(filters: CollectionExceptionsFilters): Promise<CollectionExceptionsDashboard> {
  const { data } = await api.get("/dashboard/collection-exceptions", { params: filters });
  return collectionExceptionsDashboardSchema.parse(data);
}
