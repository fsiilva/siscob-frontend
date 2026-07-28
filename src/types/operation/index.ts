export type OperationQueuePriority = "HIGH" | "MEDIUM" | "LOW";

export interface OperationQueueItem {
  id: number;
  customerId: number;
  company: string;
  customer: string;
  openAmount: number;
  greatestDelayDays: number;
  priority: OperationQueuePriority;
  lastContact: string | null;
}
