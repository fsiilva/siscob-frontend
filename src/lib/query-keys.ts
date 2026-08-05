export const sharedQueryKeys = {
  customer: (customerId: number) => ["customers", customerId] as const,
  customerInteractions: (customerId: number) => ["customers", customerId, "interactions"] as const,
  customerNextActions: (customerId: number) => ["customers", customerId, "next-actions"] as const,
  customerSummary: (customerId: number) => ["customers", customerId, "summary"] as const,
  customerTimeline: (customerId: number) => ["customers", customerId, "timeline"] as const,
  operationQueue: ["operation", "queue"] as const,
  userNextActions: ["me", "next-actions"] as const,
};
