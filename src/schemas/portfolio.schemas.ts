import { z } from "zod";

export const portfolioResponseSchema = z.object({
  id: z.string().uuid(), code: z.string().min(1), name: z.string().min(1), companyId: z.string().min(1), active: z.boolean(), createdAt: z.string(), updatedAt: z.string(),
});
export const portfolioListResponseSchema = z.array(portfolioResponseSchema);
