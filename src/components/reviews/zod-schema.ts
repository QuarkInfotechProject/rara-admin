import { z } from "zod";

const formSchema = z.object({
  id: z.coerce.number(),
  product_id: z.coerce.number(),
  user_id: z.coerce.number(),
  cleanliness: z.string(),
  hospitality: z.string(),
  value_for_money: z.string(),
  communication: z.string(),
  overall_rating: z.string(),
  public_review: z.string(),
  private_review: z.string(),
  reply_to_public_review: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  approved: z.coerce.number(),
  product: z.object({
    id: z.coerce.number(),
    name: z.string(),
  }),
  user: z.object({
    id: z.coerce.number(),
    full_name: z.string(),
  }),
});

type FormData = z.infer<typeof formSchema>;

export { formSchema };
export type { FormData };
