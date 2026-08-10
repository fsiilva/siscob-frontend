import type { InteractionResponse } from "./interactions";
import type { NextActionApiResponse } from "./next-actions-api";
import type { OperationPriority, OperationStatus } from "./operations-api";
import type { TimelineApiEvent } from "./timeline-api";

export interface Customer360Receivable {
  id: number;
  company: { id: number; name: string | null };
  dueDate: string;
  amount: number;
  balance: number;
  daysOverdue: number;
  status: string;
}

export interface Customer360Operation {
  id: string;
  status: OperationStatus;
  priority: OperationPriority;
  objective: string;
  company?: string;
  portfolio?: string;
  companyId?: string;
  portfolioId?: string;
  updatedAt: string;
}

export interface Customer360 {
  customer: { id: number; name: string; document: string | null; phone: string | null; email: string | null };
  financial: { totalOpen: number; totalOverdue: number; receivablesCount: number; overdueCount: number; oldestDueDate: string | null };
  receivables: Customer360Receivable[];
  operations: Customer360Operation[];
  nextActions: NextActionApiResponse[];
  interactions: InteractionResponse[];
  timeline: TimelineApiEvent[];
}
