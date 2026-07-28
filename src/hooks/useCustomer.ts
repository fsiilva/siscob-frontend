"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "@/services/customers.service";

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomerById(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: 1,
  });
}
