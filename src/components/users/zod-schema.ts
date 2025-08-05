import { z } from "zod";

const userSchema = z.object({
  full_name: z.string(),
  country: z.string(),
  email: z.string(),
  phone_no: z.string().nullable().optional(),
  status: z.coerce.number({ message: "Select a status" }),
});

type UserSchema = z.infer<typeof userSchema>;

export type { UserSchema };
export { userSchema };
