export type OperationQueuePriority = "HIGH" | "MEDIUM" | "LOW";

export interface OperationQueueItem {
  id: number;
  customerId: number;
  companyName: string;
  customerName: string;
  outstandingAmount: number;
  daysOverdue: number;
  priorityScore: number;
  priority: OperationQueuePriority;
}
