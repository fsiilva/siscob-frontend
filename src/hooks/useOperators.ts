"use client";

import { useQuery } from "@tanstack/react-query";

import { getOperators } from "@/services/operators.service";
import type { OperatorFilters } from "@/types/operators";

export const operatorQueryKeys = {
  all: ["operators"] as const,
  list: (filters: OperatorFilters) => ["operators", filters] as const,
};

export function useOperators(search = "", enabled = true) {
  const filters = { search };
  return useQuery({
    queryKey: operatorQueryKeys.list(filters),
    queryFn: () => getOperators(filters),
    enabled,
    retry: 1,
  });
}
