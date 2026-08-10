import { z } from "zod";

const count = z.number().int().nonnegative();
const metrics = {
  interactions: count,
  contactMade: count,
  noAnswer: count,
  promisesToPay: count,
  completedNextActions: count,
  completedOperations: count,
};

export const productivityDashboardSchema = z.object({
  period: z.object({ from: z.string().min(1), to: z.string().min(1) }),
  summary: z.object({ ...metrics, overdueNextActions: count }),
  operators: z.array(z.object({ id: z.string().min(1), name: z.string().min(1), ...metrics })),
});
