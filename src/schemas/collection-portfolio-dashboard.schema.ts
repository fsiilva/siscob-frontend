import { z } from "zod";

const amount = z.number().finite().nonnegative();
const count = z.number().int().nonnegative();

export const collectionPortfolioDashboardSchema = z.object({
  summary: z.object({
    totalOpen: amount,
    totalOverdue: amount,
    customersWithOpenDebt: count,
    customersWithOverdueDebt: count,
    openReceivables: count,
    overdueReceivables: count,
    overdueWithActiveOperation: count,
    overdueWithoutActiveOperation: count,
    amountWithActiveOperation: amount,
    amountWithoutActiveOperation: amount,
  }).strict(),
  aging: z.array(z.object({
    range: z.enum(["NOT_DUE", "DAYS_1_30", "DAYS_31_60", "DAYS_61_90", "DAYS_91_180", "DAYS_181_360", "OVER_360"]),
    label: z.string().min(1),
    receivables: count,
    customers: count,
    balance: amount,
  }).strict()),
  customers: z.array(z.object({
    customerId: z.number().int().positive(),
    customerName: z.string().min(1),
    totalOpen: amount,
    totalOverdue: amount,
    receivablesCount: count,
    overdueCount: count,
    maxDaysOverdue: count,
    activeOperations: count,
    hasCollectionOpportunity: z.boolean(),
  }).strict()),
}).strict();
