import type { OperationPriority, OperationStatus } from "./operations-api";

export type WorkQueueNextActionStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "OVERDUE";
export interface WorkQueueFilters {
  page: number; pageSize: number; status?: OperationStatus; priority?: OperationPriority;
  company?: string; portfolio?: string; assignedOperatorId?: string; customer?: string;
  nextActionStatus?: WorkQueueNextActionStatus; overdueOnly?: boolean;
}
export interface WorkQueueItem {
  operation: {
    id: string; customerId: string; receivableId: string | null; companyId: string; portfolioId: string;
    companyName?: string; portfolioName?: string; objective: string; status: OperationStatus; priority: OperationPriority;
    assignedOperator: { id: string; name: string } | null; updatedAt: string; version: number;
  };
  customer: { id: string; name: string } | null;
  receivable: { id: string; outstandingAmount: number; dueDate: string; daysOverdue: number } | null;
  nextAction: { id: string; type: string; status: WorkQueueNextActionStatus; dueAt: string; description: string } | null;
  priorityScore: number;
  priorityReasons: string[];
}
export interface WorkQueueResponse { items: WorkQueueItem[]; page: number; pageSize: number; total: number; totalPages: number }
