export interface ProductivityFilters {
  from: string;
  to: string;
  operatorId?: string;
}

export interface ProductivityMetrics {
  interactions: number;
  contactMade: number;
  noAnswer: number;
  promisesToPay: number;
  completedNextActions: number;
  completedOperations: number;
}

export interface ProductivityDashboard {
  period: { from: string; to: string };
  summary: ProductivityMetrics & { overdueNextActions: number };
  operators: Array<ProductivityMetrics & { id: string; name: string }>;
}
