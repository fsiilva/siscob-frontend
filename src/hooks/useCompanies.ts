"use client";

import { useQuery } from "@tanstack/react-query";

import { getCompanies } from "@/services/companies.service";
import type { CompanyListParams } from "@/types/companies-api";

export const companyKeys = {
  all: ["companies"] as const,
  list: (params: CompanyListParams) => ["companies", params] as const,
};

export function useCompanies(params: CompanyListParams = {}) {
  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => getCompanies(params),
    retry: 1,
  });
}
