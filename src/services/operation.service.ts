import { getReceivables } from "@/services/receivables.service";
import type { OperationQueueItem, OperationQueuePriority } from "@/types/operation";
import type { Receivable, ReceivablesQuery } from "@/types/receivables";

const operationQueueQuery = {
  page: 1,
  pageSize: 20,
  status: "OPEN",
} satisfies ReceivablesQuery;

export function calculateOperationPriority(delayDays: number): OperationQueuePriority {
  if (delayDays >= 60) return "HIGH";
  if (delayDays >= 30) return "MEDIUM";
  return "LOW";
}

export function mapReceivableToOperationQueueItem(receivable: Receivable): OperationQueueItem {
  return {
    id: receivable.id,
    customerId: receivable.customerId,
    company: receivable.company.name,
    customer: receivable.customer.name,
    openAmount: receivable.balance,
    greatestDelayDays: receivable.daysOverdue,
    priority: calculateOperationPriority(receivable.daysOverdue),
    lastContact: null,
  };
}

export async function getOperationQueue(): Promise<OperationQueueItem[]> {
  const response = await getReceivables(operationQueueQuery);
  return response.data.map(mapReceivableToOperationQueueItem);
}
