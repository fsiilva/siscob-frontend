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

export type OperationTimelineEventType =
  | "OperationCreated" | "OperationAssigned" | "OperationReleased"
  | "OperationTransferred" | "OperationStarted" | "OperationWaiting"
  | "OperationBlocked" | "OperationResumed" | "OperationCompleted"
  | "OperationCancelled" | "OperationReopened" | "OperationPriorityChanged"
  | "PaymentPromiseCreated" | "PaymentPromiseFulfilled" | "PaymentPromiseBroken" | "PaymentPromiseCancelled"
  | "OperationEvent";

export interface OperationTimelineItem {
  id: string;
  createdAt: string;
  type: OperationTimelineEventType;
  actor: { id: string; name: string } | null;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
}

export interface OperationTimelineResponse { items: OperationTimelineItem[] }

export interface OperationDetailsResponse {
  cadence: import("./collection-cadence").CollectionCadence;
  operation: OperationResponse & {
    assignedOperator: { id: string; name: string } | null;
    completedReason: string | null;
    cancelledReason: string | null;
  };
  timeline: OperationTimelineItem[];
  nextActions: Array<{
    id: string; status: import("./next-actions-api").NextActionApiStatus; type: import("./next-actions-api").NextActionApiType; title: string;
    description: string; dueAt: string; createdAt: string;
  }>;
  interactions: Array<{
    id: string; channel: string; outcome: string; notes: string; createdAt: string;
  }>;
  paymentPromises: import("./payment-promises").PaymentPromise[];
}

export type OperationCommand = "assign" | "release" | "transfer" | "start" | "wait" | "block" | "resume" | "complete" | "cancel" | "reopen" | "changePriority";
export type OperationCommandPayload = Record<string, string | number | undefined> & { expectedVersion: number };
