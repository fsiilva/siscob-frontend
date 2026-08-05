import { z } from "zod";

const count = z.number().int().nonnegative();
const groupedCount = z.object({ value: z.string().min(1), count });
const entityCount = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  operations: count,
});

export const managementDashboardSchema = z.object({
  operations: z.object({
    total: count,
    byStatus: z.array(groupedCount),
    byPriority: z.array(groupedCount),
  }),
  operators: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    assigned: count,
    inProgress: count,
    completedToday: count,
    overdueNextActions: count,
  })),
  companies: z.array(entityCount),
  portfolios: z.array(entityCount),
});
