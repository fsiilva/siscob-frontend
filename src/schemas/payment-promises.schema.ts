import { z } from "zod";

export const paymentPromiseStatusSchema = z.enum(["PENDING", "FULFILLED", "BROKEN", "CANCELLED"]);
export const paymentPromiseDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Data inválida");

export const paymentPromiseSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string(),
  receivableId: z.string().nullable(),
  operationId: z.string().uuid(),
  interactionId: z.string().uuid().nullable(),
  promisedAmount: z.number().finite().positive(),
  promisedDate: paymentPromiseDateSchema,
  status: paymentPromiseStatusSchema,
  notes: z.string().nullable(),
  createdByUserId: z.string().uuid(),
  version: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const createPaymentPromiseRequestSchema = z.object({
  receivableId: z.string().trim().min(1).max(64).optional(),
  promisedAmount: z.number().finite().positive().multipleOf(0.01),
  promisedDate: paymentPromiseDateSchema,
  notes: z.string().trim().max(1000).optional(),
}).strict();

export const transitionPaymentPromiseRequestSchema = z.object({
  expectedVersion: z.number().int().nonnegative(),
}).strict();

export const paymentPromisesResponseSchema = z.object({ items: z.array(paymentPromiseSchema) }).strict();
