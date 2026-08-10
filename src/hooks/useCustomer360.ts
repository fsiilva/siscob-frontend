"use client";

import { useQuery } from "@tanstack/react-query";

import { sharedQueryKeys } from "@/lib/query-keys";
import { getCustomer360 } from "@/services/customer-360.service";

export const customer360QueryKey = sharedQueryKeys.customer360;

export function useCustomer360(customerId: number) {
  return useQuery({
    queryKey: customer360QueryKey(customerId),
    queryFn: () => getCustomer360(customerId),
    enabled: Number.isInteger(customerId) && customerId > 0,
    retry: 1,
  });
}
