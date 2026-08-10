import { z } from "zod";

import { operationPrioritySchema, operationStatusSchema } from "./operation.schemas";

const count = z.number().int().nonnegative();
const money = z.number().nonnegative();
const nextActionType = z.enum(["CALL", "WHATSAPP", "EMAIL", "VERIFY_PAYMENT", "SEND_DOCUMENT", "VISIT", "CLOSE_CASE", "SYSTEM"]);
const nextActionStatus = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]);
const interactionChannel = z.enum(["phone", "whatsapp", "email", "visit", "system"]);
const interactionOutcome = z.enum(["contact_made", "no_answer", "promise_to_pay", "refused", "wrong_contact", "follow_up", "completed"]);
const timelineType = z.enum(["INTERACTION_CREATED", "NEXT_ACTION_CREATED", "NEXT_ACTION_COMPLETED", "NEXT_ACTION_CANCELLED", "NEXT_ACTION_RESCHEDULED", "SYSTEM"]);

export const customer360Schema = z.object({
  customer: z.object({ id: count, name: z.string().min(1), document: z.string().nullable(), phone: z.string().nullable(), email: z.string().nullable() }),
  financial: z.object({ totalOpen: money, totalOverdue: money, receivablesCount: count, overdueCount: count, oldestDueDate: z.string().nullable() }),
  receivables: z.array(z.object({ id: count, company: z.object({ id: count, name: z.string().nullable() }), dueDate: z.string(), amount: money, balance: money, daysOverdue: count, status: z.string().min(1) })),
  operations: z.array(z.object({
    id: z.string(), status: operationStatusSchema, priority: operationPrioritySchema, objective: z.string(),
    company: z.string().optional(), portfolio: z.string().optional(), companyId: z.string().optional(), portfolioId: z.string().optional(), updatedAt: z.string(),
  })),
  nextActions: z.array(z.object({
    id: z.string(), interactionId: z.string(), customerId: z.string(), receivableId: z.string().nullable(), assignedTo: z.string(),
    type: nextActionType, status: nextActionStatus, title: z.string(), description: z.string(), dueAt: z.string(), completedAt: z.string().nullable(), cancelledAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(),
  })),
  interactions: z.array(z.object({ id: z.string(), customerId: z.string(), receivableId: z.string().nullable(), userId: z.string(), channel: interactionChannel, outcome: interactionOutcome, notes: z.string(), createdAt: z.string(), updatedAt: z.string() })),
  timeline: z.array(z.object({ id: z.string(), customerId: z.string(), interactionId: z.string().nullable(), nextActionId: z.string().nullable(), actorUserId: z.string().nullable(), type: timelineType, title: z.string(), description: z.string(), metadata: z.record(z.string(), z.unknown()).nullable(), occurredAt: z.string(), createdAt: z.string() })),
});
