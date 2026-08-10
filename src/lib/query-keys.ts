export const sharedQueryKeys = {
  customer: (customerId: number) => ["customers", customerId] as const,
  customerInteractions: (customerId: number) => ["customers", customerId, "interactions"] as const,
  customerNextActions: (customerId: number) => ["customers", customerId, "next-actions"] as const,
  customerSummary: (customerId: number) => ["customers", customerId, "summary"] as const,
  customerTimeline: (customerId: number) => ["customers", customerId, "timeline"] as const,
  operationQueue: ["operations", "work-queue"] as const,
  operationDetails: (operationId: string) => ["operations", operationId, "details"] as const,
  operationTimeline: (operationId: string) => ["operations", operationId, "timeline"] as const,
  userNextActions: ["me", "next-actions"] as const,
  dashboardOverview: ["dashboard", "overview"] as const,
  managementDashboard: ["dashboard", "management"] as const,
  productivityDashboard: ["dashboard", "productivity"] as const,
};
