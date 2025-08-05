import { z } from "zod";

const emaiLSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  subject: z.string().min(10, {
    message: "Subject must be at least 10 characters.",
  }),
  name: z.string(),
  message: z.string(),
  description: z.string(),
});

type EmailSchema = z.infer<typeof emaiLSchema>;

export type { EmailSchema };
export { emaiLSchema };
