import { z } from "zod";

const faqSchema = z.object({
  id: z.number().optional(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  order: z.coerce.number({ message: "Enter a valid number" }),
});

type FAQSchema = z.infer<typeof faqSchema>;

export type { FAQSchema };
export { faqSchema };
