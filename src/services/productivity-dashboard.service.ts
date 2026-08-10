import { productivityDashboardSchema } from "@/schemas/productivity-dashboard.schema";
import type { ProductivityDashboard, ProductivityFilters } from "@/types/productivity-dashboard";

import { api } from "./api";

export async function getProductivityDashboard(filters: ProductivityFilters): Promise<ProductivityDashboard> {
  const params = { from: filters.from, to: filters.to, ...(filters.operatorId ? { operatorId: filters.operatorId } : {}) };
  const { data } = await api.get("/dashboard/productivity", { params });
  return productivityDashboardSchema.parse(data);
}
