import type { ExecutiveSummary } from "@/types/executive";

import { api } from "./api";

export async function getExecutiveSummary(): Promise<ExecutiveSummary> {
  const { data } = await api.get<ExecutiveSummary>(
    "/analytics/executive/summary",
  );

  return data;
}
