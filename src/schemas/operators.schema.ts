import { z } from "zod";

export const operatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
}).strict();

export const operatorsResponseSchema = z.object({
  items: z.array(operatorSchema),
}).strict();
