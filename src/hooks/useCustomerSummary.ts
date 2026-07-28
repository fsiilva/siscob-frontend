"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerSummary } from "@/services/customers.service";

export function useCustomerSummary(id: number) {
  return useQuery({
    queryKey: ["customers", id, "summary"],
    queryFn: () => getCustomerSummary(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: 1,
  });
}
