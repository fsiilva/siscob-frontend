import { z } from "zod";

export const collectionCadenceStatusSchema = z.enum(["NO_FOLLOW_UP", "OVERDUE_FOLLOW_UP", "DUE_TODAY", "SCHEDULED", "WAITING", "COMPLETED"]);
export const collectionCadenceAttentionSchema = z.enum(["OK", "WARNING", "CRITICAL"]);

export const collectionCadenceSchema = z.object({
  status: collectionCadenceStatusSchema,
  label: z.string().min(1),
  attention: collectionCadenceAttentionSchema,
  reasons: z.array(z.string()),
}).strict();
