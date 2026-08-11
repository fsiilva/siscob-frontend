import type { OperationPriority, OperationStatus } from "./operations-api";
import type { NextActionApiStatus, NextActionApiType } from "./next-actions-api";

export type WorkPlanKind = "OPERATION" | "OPPORTUNITY";

export interface WorkPlanFilters {
  kind?: WorkPlanKind;
  companyId?: string;
  customerId?: string;
  priority?: OperationPriority;
  status?: OperationStatus;
  assignedOperatorId?: string;
  overdueOnly?: boolean;
  page: number;
  pageSize: number;
}

export interface WorkPlanItem {
  kind: WorkPlanKind;
  customer: { id: string; name: string };
  company: { id: string; name: string | null };
  receivable: { id: string; dueDate: string; balance: number; daysOverdue: number } | null;
  operation: {
    id: string;
    status: OperationStatus;
    priority: OperationPriority;
    assignedOperator: { id: string; name: string } | null;
  } | null;
  nextAction: { id: string; type: NextActionApiType; status: NextActionApiStatus; dueAt: string } | null;
  score: number;
  suggestedPriority: OperationPriority;
  reasons: string[];
}

export interface WorkPlanResponse {
  items: WorkPlanItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
