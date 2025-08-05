import { z } from "zod";

const adminUserSchema = z.object({
  name: z.string(),
  uuid: z.string().optional(),
  email: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
  groupId: z.coerce.number({ message: "Select a role" }).optional(),
});

type AdminUserSchema = z.infer<typeof adminUserSchema>;

export type { AdminUserSchema };
export { adminUserSchema };
