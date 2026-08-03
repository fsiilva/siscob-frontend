import { portfolioListResponseSchema, portfolioResponseSchema } from "@/schemas/portfolio.schemas";
import type { CreatePortfolioRequest, PortfolioListParams, UpdatePortfolioRequest } from "@/types/portfolios-api";
import { api } from "./api";

export async function getPortfolios(params: PortfolioListParams = {}) {
  const { data } = await api.get("/portfolios", { params });
  return portfolioListResponseSchema.parse(data);
}

export async function getPortfolio(id: string) {
  const { data } = await api.get(`/portfolios/${id}`);
  return portfolioResponseSchema.parse(data);
}

export async function createPortfolio(body: CreatePortfolioRequest) { const { data } = await api.post("/portfolios", body); return portfolioResponseSchema.parse(data); }
export async function updatePortfolio(id: string, body: UpdatePortfolioRequest) { const { data } = await api.patch(`/portfolios/${id}`, body); return portfolioResponseSchema.parse(data); }
export async function updatePortfolioStatus(id: string, active: boolean) { const { data } = await api.patch(`/portfolios/${id}/status`, { active }); return portfolioResponseSchema.parse(data); }
