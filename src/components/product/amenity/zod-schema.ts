import { z } from "zod";

const amenitySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  icon: z.string(),
  description: z.string(),
  category: z.string(),
});

type AmenitySchema = z.infer<typeof amenitySchema>;

export type { AmenitySchema };
export { amenitySchema };
