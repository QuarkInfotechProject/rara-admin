import { z } from "zod";

const managerSchema = z.object({
  id: z.number().optional(),
  firstname: z.string(),
  lastname: z.string(),
  description: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
});

type ManagerSchema = z.infer<typeof managerSchema>;

export type { ManagerSchema };
export { managerSchema };
