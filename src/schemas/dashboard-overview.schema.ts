import { z } from "zod";

const count = z.number().int().nonnegative();

export const dashboardOverviewSchema = z.object({
  operations: z.object({
    total: count,
    ready: count,
    assigned: count,
    inProgress: count,
    waiting: count,
    blocked: count,
    completed: count,
    cancelled: count,
  }),
  priorities: z.object({
    low: count,
    normal: count,
    high: count,
    urgent: count,
  }),
  nextActions: z.object({ pending: count, overdue: count, today: count }),
  interactions: z.object({ today: count }),
});
