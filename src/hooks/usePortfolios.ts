"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPortfolio, getPortfolios, updatePortfolio, updatePortfolioStatus } from "@/services/portfolios-api.service";
import type { CreatePortfolioRequest, PortfolioListParams, UpdatePortfolioRequest } from "@/types/portfolios-api";

export const portfolioKeys = { all: ["portfolios"] as const, list: (params: PortfolioListParams) => ["portfolios", params] as const };

export function usePortfolios(companyId: string) {
  return useQuery({
    queryKey: portfolioKeys.list({ company: companyId, active: true }),
    queryFn: () => getPortfolios({ company: companyId, active: true }),
    enabled: Boolean(companyId),
    retry: 1,
  });
}

export function usePortfolioAdminList(params: PortfolioListParams) {
  return useQuery({ queryKey: portfolioKeys.list(params), queryFn: () => getPortfolios(params), retry: 1 });
}
function useInvalidatePortfolios() { const client = useQueryClient(); return () => client.invalidateQueries({ queryKey: portfolioKeys.all }); }
export function useCreatePortfolio() { const invalidate = useInvalidatePortfolios(); return useMutation({ mutationFn: (body: CreatePortfolioRequest) => createPortfolio(body), onSuccess: invalidate }); }
export function useUpdatePortfolio() { const invalidate = useInvalidatePortfolios(); return useMutation({ mutationFn: ({ id, body }: { id: string; body: UpdatePortfolioRequest }) => updatePortfolio(id, body), onSuccess: invalidate }); }
export function useUpdatePortfolioStatus() { const invalidate = useInvalidatePortfolios(); return useMutation({ mutationFn: ({ id, active }: { id: string; active: boolean }) => updatePortfolioStatus(id, active), onSuccess: invalidate }); }
