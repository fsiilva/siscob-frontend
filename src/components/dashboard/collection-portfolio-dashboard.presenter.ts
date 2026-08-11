import type { CollectionPortfolioDashboard } from "@/types/collection-portfolio-dashboard";

export const collectionPortfolioCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const collectionPortfolioNumber = new Intl.NumberFormat("pt-BR");
export const collectionPortfolioPercentage = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function coveragePercentage(covered: number, total: number) {
  return total > 0 ? (covered / total) * 100 : 0;
}

export function isCollectionPortfolioEmpty(data: CollectionPortfolioDashboard) {
  return data.summary.openReceivables === 0;
}
