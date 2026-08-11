import { operatorsResponseSchema } from "@/schemas/operators.schema";
import type { OperatorFilters } from "@/types/operators";

import { api } from "./api";

export async function getOperators(filters: OperatorFilters) {
  const search = filters.search.trim();
  const { data } = await api.get("/operators", { params: search ? { search } : undefined });
  return operatorsResponseSchema.parse(data);
}
