import { getReceivables } from "@/services/receivables.service";
import type { OperationQueueItem, OperationQueuePriority } from "@/types/operation";
import type { Receivable, ReceivablesQuery } from "@/types/receivables";

const operationQueueQuery = {
  page: 1,
  pageSize: 20,
  status: "OPEN",
} satisfies ReceivablesQuery;

export function calculateDelayScore(daysOverdue: number) {
  if (daysOverdue >= 90) return 50;
  if (daysOverdue >= 60) return 40;
  if (daysOverdue >= 30) return 25;
  if (daysOverdue > 0) return 10;
  return 0;
}

export function calculateBalanceScore(balance: number) {
  if (balance >= 50_000) return 30;
  if (balance >= 10_000) return 20;
  if (balance >= 1_000) return 10;
  return 5;
}

export function classifyOperationPriority(score: number): OperationQueuePriority {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function calculateOperationPriority(daysOverdue: number, balance: number) {
  const priorityScore = calculateDelayScore(daysOverdue) + calculateBalanceScore(balance);

  return {
    priorityScore,
    priority: classifyOperationPriority(priorityScore),
  };
}

export function mapReceivableToOperationQueueItem(receivable: Receivable): OperationQueueItem {
  const priorityData = calculateOperationPriority(receivable.daysOverdue, receivable.balance);

  return {
    id: receivable.id,
    customerId: receivable.customerId,
    companyName: receivable.company.name,
    customerName: receivable.customer.name,
    outstandingAmount: receivable.balance,
    daysOverdue: receivable.daysOverdue,
    ...priorityData,
  };
}

export function sortOperationQueueItems(items: OperationQueueItem[]) {
  return [...items].sort((left, right) =>
    right.priorityScore - left.priorityScore ||
    right.daysOverdue - left.daysOverdue ||
    right.outstandingAmount - left.outstandingAmount ||
    left.customerName.localeCompare(right.customerName, "pt-BR", { sensitivity: "base" }),
  );
}

export async function getOperationQueue(): Promise<OperationQueueItem[]> {
  const response = await getReceivables(operationQueueQuery);
  return sortOperationQueueItems(response.data.map(mapReceivableToOperationQueueItem));
}
