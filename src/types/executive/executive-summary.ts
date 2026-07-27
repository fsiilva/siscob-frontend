import type { CollectionSummary } from "./collection-summary";
import type { ExecutiveAlerts } from "./executive-alerts";
import type { OverdueSummary } from "./overdue-summary";
import type { PortfolioAging } from "./portfolio-aging";
import type { PortfolioKpis } from "./portfolio-kpis";

export interface ExecutiveSummary {
  portfolioKpis: PortfolioKpis;
  portfolioAging: PortfolioAging;
  overdueSummary: OverdueSummary;
  collectionSummary: CollectionSummary;
  alerts: ExecutiveAlerts;
}
