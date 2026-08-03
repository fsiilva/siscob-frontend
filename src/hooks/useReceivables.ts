"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getReceivables } from "@/services/receivables.service";
import type { ReceivablesQuery } from "@/types/receivables";

export function useReceivables(query: ReceivablesQuery, enabled = true) {
  return useQuery({
    queryKey: ["receivables", query],
    queryFn: () => getReceivables(query),
    enabled,
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
