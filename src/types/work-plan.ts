import type { OperationPriority, OperationStatus } from "./operations-api";
import type { NextActionApiStatus, NextActionApiType } from "./next-actions-api";
import type { CollectionCadence } from "./collection-cadence";
import type { CollectionAlert, CollectionAlertSeverity } from "./collection-alert";

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

interface WorkPlanItemBase {
  customer: { id: string; name: string };
  company: { id: string; name: string | null };
  nextAction: { id: string; type: NextActionApiType; status: NextActionApiStatus; dueAt: string } | null;
  score: number;
  suggestedPriority: OperationPriority;
  reasons: string[];
  alerts: CollectionAlert[];
  highestAlertSeverity: CollectionAlertSeverity;
}

type WorkPlanReceivable = { id: string; dueDate: string; balance: number; daysOverdue: number };
type WorkPlanOperation = { id: string; status: OperationStatus; priority: OperationPriority; assignedOperator: { id: string; name: string } | null };

export type WorkPlanItem = WorkPlanItemBase & (
  | { kind: "OPERATION"; receivable: WorkPlanReceivable | null; operation: WorkPlanOperation; cadence: CollectionCadence }
  | { kind: "OPPORTUNITY"; receivable: WorkPlanReceivable; operation: null; cadence: null }
);

export interface WorkPlanResponse {
  items: WorkPlanItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
