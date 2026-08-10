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

export const operationTimelineEventTypeSchema = z.enum([
  "OperationCreated", "OperationAssigned", "OperationReleased", "OperationTransferred",
  "OperationStarted", "OperationWaiting", "OperationBlocked", "OperationResumed",
  "OperationCompleted", "OperationCancelled", "OperationReopened", "OperationPriorityChanged",
]);

export const operationTimelineResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    createdAt: z.string(),
    type: operationTimelineEventTypeSchema,
    actor: z.object({ id: z.string(), name: z.string() }).nullable(),
    title: z.string(),
    description: z.string(),
    metadata: z.record(z.string(), z.unknown()),
  })),
});

const operationDetailsNextActionSchema = z.object({
  id: z.string(), status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]),
  type: z.enum(["CALL", "WHATSAPP", "EMAIL", "VERIFY_PAYMENT", "SEND_DOCUMENT", "VISIT", "CLOSE_CASE", "SYSTEM"]), title: z.string(),
  description: z.string(), dueAt: z.string(), createdAt: z.string(),
});

const operationDetailsInteractionSchema = z.object({
  id: z.string(), channel: z.string(), outcome: z.string(), notes: z.string(), createdAt: z.string(),
});

export const operationDetailsResponseSchema = z.object({
  operation: operationResponseSchema.extend({
    assignedOperator: z.object({ id: z.string(), name: z.string() }).nullable(),
    completedReason: z.string().nullable(),
    cancelledReason: z.string().nullable(),
  }),
  timeline: operationTimelineResponseSchema.shape.items,
  nextActions: z.array(operationDetailsNextActionSchema),
  interactions: z.array(operationDetailsInteractionSchema),
});
