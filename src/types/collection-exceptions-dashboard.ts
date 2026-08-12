import type { CollectionAlert, CollectionAlertItemSeverity, CollectionAlertType } from "./collection-alert";
import type { CollectionCadence } from "./collection-cadence";
import type { OperationPriority } from "./operations-api";

export interface CollectionExceptionsFilters {
  companyId?: string;
  customerId?: string;
  severity?: CollectionAlertItemSeverity;
  alertType?: CollectionAlertType;
  page: number;
  pageSize: number;
}

export interface CollectionExceptionsSummary {
  totalExceptions: number;
  critical: number;
  warning: number;
  informational: number;
  criticalWithoutFollowUp: number;
  overdueFollowUp: number;
  dueToday: number;
  paymentPromiseDueToday: number;
  overduePaymentPromise: number;
  brokenPaymentPromise: number;
  highValueWithoutActiveCollection: number;
}

export interface CollectionExceptionsCompany {
  company: { id: string; name: string | null };
  total: number;
  critical: number;
  warning: number;
  informational: number;
}

export interface CollectionExceptionItem {
  kind: "OPERATION" | "OPPORTUNITY";
  customer: { id: string; name: string };
  company: { id: string; name: string | null };
  operationId: string | null;
  receivableId: string | null;
  score: number;
  suggestedPriority: OperationPriority;
  cadence: CollectionCadence | null;
  alerts: CollectionAlert[];
  highestAlertSeverity: CollectionAlertItemSeverity;
}

export interface CollectionExceptionsDashboard {
  summary: CollectionExceptionsSummary;
  byCompany: CollectionExceptionsCompany[];
  items: CollectionExceptionItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
