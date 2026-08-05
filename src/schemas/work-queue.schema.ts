import { z } from "zod";

const count = z.number().int().nonnegative();
export const workQueueSchema = z.object({
  items: z.array(z.object({
    operation: z.object({
      id: z.string(), customerId: z.string(), receivableId: z.string().nullable(), companyId: z.string(), portfolioId: z.string(),
      companyName: z.string().optional(), portfolioName: z.string().optional(), objective: z.string(),
      status: z.enum(["READY", "ASSIGNED", "IN_PROGRESS", "WAITING", "BLOCKED"]),
      priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
      assignedOperator: z.object({ id: z.string(), name: z.string() }).nullable(), updatedAt: z.string(), version: count,
    }),
    customer: z.object({ id: z.string(), name: z.string() }).nullable(),
    receivable: z.object({ id: z.string(), outstandingAmount: count, dueDate: z.string(), daysOverdue: count }).nullable(),
    nextAction: z.object({ id: z.string(), type: z.string(), status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]), dueAt: z.string(), description: z.string() }).nullable(),
    priorityScore: count,
    priorityReasons: z.array(z.string()),
  })),
  page: count.min(1), pageSize: count.min(1).max(100), total: count, totalPages: count,
});
