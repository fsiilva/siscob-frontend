import { z } from "zod";

export const operationStatusSchema = z.enum(["READY", "ASSIGNED", "IN_PROGRESS", "WAITING", "BLOCKED", "COMPLETED", "CANCELLED"]);
export const operationPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]);

export const createOperationRequestSchema = z.object({
  companyId: z.string().trim().min(1).max(64),
  portfolioId: z.string().trim().min(1).max(64),
  customerId: z.string().trim().min(1).max(64),
  receivableId: z.string().trim().min(1).max(64).optional(),
  objective: z.string().trim().min(1).max(1000),
  priority: operationPrioritySchema,
});

export const operationResponseSchema = z.object({
  id: z.string(), companyId: z.string(), portfolioId: z.string(), customerId: z.string(),
  receivableId: z.string().nullable(), assignedOperatorId: z.string().nullable(), objective: z.string(),
  status: operationStatusSchema, priority: operationPrioritySchema,
  waitingReason: z.string().nullable(), reviewAt: z.string().nullable(), blockedReason: z.string().nullable(),
  completionResult: z.string().nullable(), cancellationReason: z.string().nullable(),
  statusChangedAt: z.string(), startedAt: z.string().nullable(), completedAt: z.string().nullable(), cancelledAt: z.string().nullable(),
  version: z.number().int().nonnegative(), createdAt: z.string(), updatedAt: z.string(),
});

export const operationListResponseSchema = z.object({
  items: z.array(operationResponseSchema), page: z.number().int().positive(), pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(), totalPages: z.number().int().nonnegative(),
});

export const operationListParamsSchema = z.object({
  page: z.number().int().positive(), pageSize: z.number().int().min(1).max(100), status: operationStatusSchema.optional(),
  priority: operationPrioritySchema.optional(), companyId: z.string().trim().optional(), portfolioId: z.string().trim().optional(),
  assignedOperatorId: z.string().uuid().optional(), customerId: z.string().trim().optional(), receivableId: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "priority", "status"]), sortOrder: z.enum(["asc", "desc"]),
});
