import { managementDashboardSchema } from "@/schemas/management-dashboard.schema";
import type { ManagementDashboard } from "@/types/management-dashboard";

import { api } from "./api";

export async function getManagementDashboard(): Promise<ManagementDashboard> {
  const { data } = await api.get("/dashboard/management");
  return managementDashboardSchema.parse(data);
}
