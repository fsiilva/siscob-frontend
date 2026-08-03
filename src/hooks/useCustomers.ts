"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCustomers } from "@/services/customers.service";

export function useCustomers(search: string, enabled = true) {
  return useQuery({
    queryKey: ["sisloc", "customers", { search }],
    queryFn: () => getCustomers(search),
    enabled,
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
