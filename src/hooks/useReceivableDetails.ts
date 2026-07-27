"use client";

import { useQuery } from "@tanstack/react-query";

import { getReceivableById } from "@/services/receivables.service";

export function useReceivableDetails(id: number | null) {
  return useQuery({
    queryKey: ["receivable", id],
    queryFn: () => getReceivableById(id as number),
    enabled: id !== null,
    refetchOnMount: "always",
    retry: 1,
  });
}
