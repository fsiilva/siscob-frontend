import { dashboardOverviewSchema } from "@/schemas/dashboard-overview.schema";
import type { DashboardOverview } from "@/types/dashboard-overview";
import { api } from "./api";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await api.get("/dashboard/overview");
  return dashboardOverviewSchema.parse(data);
}
