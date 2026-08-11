import { z } from "zod";

import { operationPrioritySchema, operationStatusSchema } from "./operation.schemas";

const id = z.string().min(1);
const namedEntity = z.object({ id, name: z.string().min(1) }).strict();
const company = z.object({ id, name: z.string().nullable() }).strict();
const receivable = z.object({ id, dueDate: z.string().min(1), balance: z.number().finite().nonnegative(), daysOverdue: z.number().int() }).strict();
const operation = z.object({
  id,
  status: operationStatusSchema,
  priority: operationPrioritySchema,
  assignedOperator: namedEntity.nullable(),
}).strict();
const nextAction = z.object({
  id,
  type: z.enum(["CALL", "WHATSAPP", "EMAIL", "VERIFY_PAYMENT", "SEND_DOCUMENT", "VISIT", "CLOSE_CASE", "SYSTEM"]),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]),
  dueAt: z.string().min(1),
}).strict();
const common = {
  customer: namedEntity,
  company,
  nextAction: nextAction.nullable(),
  score: z.number().finite().nonnegative(),
  suggestedPriority: operationPrioritySchema,
  reasons: z.array(z.string()),
};

export const workPlanItemSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("OPERATION"), ...common, receivable: receivable.nullable(), operation }).strict(),
  z.object({ kind: z.literal("OPPORTUNITY"), ...common, receivable, operation: z.null() }).strict(),
]);

export const workPlanResponseSchema = z.object({
  items: z.array(workPlanItemSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
}).strict();
