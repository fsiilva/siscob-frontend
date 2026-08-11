import { z } from "zod";

import { operationPrioritySchema } from "./operation.schemas";

export const collectionOpportunitySchema = z.object({
  receivableId: z.number().int().positive(),
  company: z.object({ id: z.number().int().positive(), name: z.string().nullable() }),
  dueDate: z.string().min(1),
  amount: z.number().nonnegative(),
  balance: z.number().nonnegative(),
  daysOverdue: z.number().int(),
  status: z.enum(["OPEN", "PAID", "CANCELED"]),
  hasActiveOperation: z.boolean(),
  activeOperationId: z.string().min(1).nullable(),
  score: z.number().finite().nonnegative(),
  suggestedPriority: operationPrioritySchema,
  reasons: z.array(z.string().min(1)),
});

export const collectionOpportunitiesResponseSchema = z.object({
  customerId: z.number().int().positive(),
  items: z.array(collectionOpportunitySchema),
});
