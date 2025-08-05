import { z } from "zod";

const ctaSchema = z.object({
  id: z.number().optional(),
  fullname: z.string(),
  email: z.string(),
  phone_number: z.string(),
  description: z.string(),
  type: z.string(),
});

type CTASchema = z.infer<typeof ctaSchema>;

export type { CTASchema };
export { ctaSchema };
