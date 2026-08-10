import type { OperationPriority } from "./operations-api";

export interface CollectionOpportunity {
  receivableId: number;
  company: { id: number; name: string | null };
  dueDate: string;
  amount: number;
  balance: number;
  daysOverdue: number;
  status: "OPEN" | "PAID" | "CANCELED";
  hasActiveOperation: boolean;
  activeOperationId: string | null;
  suggestedPriority: OperationPriority;
  reasons: string[];
}

export interface CollectionOpportunitiesResponse {
  customerId: number;
  items: CollectionOpportunity[];
}
