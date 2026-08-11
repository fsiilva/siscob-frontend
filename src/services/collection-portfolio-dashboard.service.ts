import { collectionPortfolioDashboardSchema } from "@/schemas/collection-portfolio-dashboard.schema";
import type { CollectionPortfolioDashboard, CollectionPortfolioFilters } from "@/types/collection-portfolio-dashboard";

import { api } from "./api";

export async function getCollectionPortfolioDashboard(filters: CollectionPortfolioFilters = {}): Promise<CollectionPortfolioDashboard> {
  const params = filters.companyId ? { companyId: filters.companyId } : undefined;
  const { data } = await api.get("/dashboard/collection-portfolio", { params });
  return collectionPortfolioDashboardSchema.parse(data);
}
