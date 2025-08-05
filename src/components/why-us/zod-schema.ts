import { z } from "zod";

const whyUsSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  link: z.string().url(),
  order: z.coerce.number({ message: "Enter a valid number" }),
  is_active: z.coerce.number({ message: "Enter a valid number" }),
  files: z.object({
    whyUsImage: z.coerce.number({ message: "Select a file" }),
  }),
});

type WhyUsSchema = z.infer<typeof whyUsSchema>;

export type { WhyUsSchema };
export { whyUsSchema };
