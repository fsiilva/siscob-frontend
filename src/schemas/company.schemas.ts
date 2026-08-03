import { z } from "zod";

export const companyResponseSchema = z.object({
  id: z.string().min(1),
  code: z.string().nullable(),
  name: z.string().min(1),
  active: z.boolean(),
});

export const companyListResponseSchema = z.object({
  data: z.array(companyResponseSchema),
});
