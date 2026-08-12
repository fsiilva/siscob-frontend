export type CollectionAlertType = "CRITICAL_WITHOUT_FOLLOW_UP" | "OVERDUE_FOLLOW_UP" | "DUE_TODAY" | "HIGH_VALUE_WITHOUT_ACTIVE_COLLECTION" | "PAYMENT_PROMISE_DUE_TODAY" | "OVERDUE_PAYMENT_PROMISE" | "BROKEN_PAYMENT_PROMISE";
export type CollectionAlertItemSeverity = "INFO" | "WARNING" | "CRITICAL";
export type CollectionAlertSeverity = "NONE" | CollectionAlertItemSeverity;

export interface CollectionAlert {
  type: CollectionAlertType;
  severity: CollectionAlertItemSeverity;
  label: string;
  reason: string;
}
