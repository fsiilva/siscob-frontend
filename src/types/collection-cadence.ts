export type CollectionCadenceStatus = "NO_FOLLOW_UP" | "OVERDUE_FOLLOW_UP" | "DUE_TODAY" | "SCHEDULED" | "WAITING" | "COMPLETED";
export type CollectionCadenceAttention = "OK" | "WARNING" | "CRITICAL";

export interface CollectionCadence {
  status: CollectionCadenceStatus;
  label: string;
  attention: CollectionCadenceAttention;
  reasons: string[];
}
