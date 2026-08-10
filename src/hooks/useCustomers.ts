"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCustomers } from "@/services/customers.service";
import { sharedQueryKeys } from "@/lib/query-keys";
import type { CustomersQuery } from "@/types/customers";

export const customersQueryKey = sharedQueryKeys.customerSearch;

export function useCustomers(query: CustomersQuery, enabled = true) {
  return useQuery({
    queryKey: customersQueryKey(query),
    queryFn: () => getCustomers(query),
    enabled,
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
