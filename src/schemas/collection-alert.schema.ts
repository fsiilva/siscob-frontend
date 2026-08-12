import { z } from "zod";

export const collectionAlertTypeSchema = z.enum(["CRITICAL_WITHOUT_FOLLOW_UP", "OVERDUE_FOLLOW_UP", "DUE_TODAY", "HIGH_VALUE_WITHOUT_ACTIVE_COLLECTION", "PAYMENT_PROMISE_DUE_TODAY", "OVERDUE_PAYMENT_PROMISE", "BROKEN_PAYMENT_PROMISE"]);
export const collectionAlertItemSeveritySchema = z.enum(["INFO", "WARNING", "CRITICAL"]);
export const collectionAlertSeveritySchema = z.enum(["NONE", "INFO", "WARNING", "CRITICAL"]);

export const collectionAlertSchema = z.object({
  type: collectionAlertTypeSchema,
  severity: collectionAlertItemSeveritySchema,
  label: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export const collectionAlertsSchema = z.array(collectionAlertSchema);
