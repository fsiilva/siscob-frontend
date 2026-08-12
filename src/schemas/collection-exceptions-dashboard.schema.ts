import { z } from "zod";

import { collectionAlertItemSeveritySchema, collectionAlertsSchema } from "./collection-alert.schema";
import { collectionCadenceSchema } from "./collection-cadence.schema";
import { operationPrioritySchema } from "./operation.schemas";

const count = z.number().int().nonnegative();
const id = z.string().min(1);
const company = z.object({ id, name: z.string().nullable() }).strict();

export const collectionExceptionsDashboardSchema = z.object({
  summary: z.object({
    totalExceptions: count,
    critical: count,
    warning: count,
    informational: count,
    criticalWithoutFollowUp: count,
    overdueFollowUp: count,
    dueToday: count,
    paymentPromiseDueToday: count,
    overduePaymentPromise: count,
    brokenPaymentPromise: count,
    highValueWithoutActiveCollection: count,
  }).strict(),
  byCompany: z.array(z.object({ company, total: count, critical: count, warning: count, informational: count }).strict()),
  items: z.array(z.object({
    kind: z.enum(["OPERATION", "OPPORTUNITY"]),
    customer: z.object({ id, name: z.string().min(1) }).strict(),
    company,
    operationId: id.nullable(),
    receivableId: id.nullable(),
    score: z.number().finite().nonnegative(),
    suggestedPriority: operationPrioritySchema,
    cadence: collectionCadenceSchema.nullable(),
    alerts: collectionAlertsSchema,
    highestAlertSeverity: collectionAlertItemSeveritySchema,
  }).strict()),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: count,
  totalPages: count,
}).strict();
