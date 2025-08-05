import { z } from "zod";

const promotionSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  link: z.string().url(),
  placement_place: z.string(),
  is_active: z.coerce.number({ message: "Please select a status" }),
  files: z.object({
    promotionImageDesktop: z.coerce.number({ message: "Please select a file" }),
    promotionImageMobile: z.coerce.number({ message: "Please select a file" }),
  }),
});

type PromotionSchema = z.infer<typeof promotionSchema>;

export { promotionSchema };
export type { PromotionSchema };
