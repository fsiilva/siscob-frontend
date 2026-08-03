export type OperationStatus = "READY" | "ASSIGNED" | "IN_PROGRESS" | "WAITING" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type OperationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type OperationSortField = "createdAt" | "updatedAt" | "priority" | "status";
export type OperationSortOrder = "asc" | "desc";

export interface CreateOperationRequest {
  companyId: string;
  portfolioId: string;
  customerId: string;
  receivableId?: string;
  objective: string;
  priority: OperationPriority;
}

export interface OperationResponse {
  id: string;
  companyId: string;
  portfolioId: string;
  customerId: string;
  receivableId: string | null;
  assignedOperatorId: string | null;
  objective: string;
  status: OperationStatus;
  priority: OperationPriority;
  waitingReason: string | null;
  reviewAt: string | null;
  blockedReason: string | null;
  completionResult: string | null;
  cancellationReason: string | null;
  statusChangedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperationListResponse {
  items: OperationResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OperationListParams {
  page: number;
  pageSize: number;
  status?: OperationStatus;
  priority?: OperationPriority;
  companyId?: string;
  portfolioId?: string;
  assignedOperatorId?: string;
  customerId?: string;
  receivableId?: string;
  sortBy: OperationSortField;
  sortOrder: OperationSortOrder;
}

export type OperationCommand = "assign" | "release" | "transfer" | "start" | "wait" | "block" | "resume" | "complete" | "cancel" | "reopen" | "changePriority";
export type OperationCommandPayload = Record<string, string | number | undefined> & { expectedVersion: number };
