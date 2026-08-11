export interface CollectionPortfolioFilters {
  companyId?: string;
}

export interface CollectionPortfolioSummary {
  totalOpen: number;
  totalOverdue: number;
  customersWithOpenDebt: number;
  customersWithOverdueDebt: number;
  openReceivables: number;
  overdueReceivables: number;
  overdueWithActiveOperation: number;
  overdueWithoutActiveOperation: number;
  amountWithActiveOperation: number;
  amountWithoutActiveOperation: number;
}

export interface CollectionPortfolioAgingItem {
  range: "NOT_DUE" | "1_30" | "31_60" | "61_90" | "91_180" | "181_360" | "OVER_360";
  label: string;
  receivables: number;
  customers: number;
  balance: number;
}

export interface CollectionPortfolioCustomer {
  customerId: number;
  customerName: string;
  totalOpen: number;
  totalOverdue: number;
  receivablesCount: number;
  overdueCount: number;
  maxDaysOverdue: number;
  activeOperations: number;
  hasCollectionOpportunity: boolean;
}

export interface CollectionPortfolioDashboard {
  summary: CollectionPortfolioSummary;
  aging: CollectionPortfolioAgingItem[];
  customers: CollectionPortfolioCustomer[];
}
