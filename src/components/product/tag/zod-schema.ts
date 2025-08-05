import { z } from "zod";

const tagSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  slug: z
    .string()
    .transform((v) => v.toLowerCase())
    .refine(
      (v) => /^[a-zA-Z0-9-]+$/.test(v),
      "Please enter a valid URL slug containing only letters, numbers, and hyphens."
    ),
  description: z.string(),
  type: z.string(),
  display_order: z.coerce.number({ message: "Enter a valid number" }),
  latitude: z.string(),
  longitude: z.string(),
  zoom_level: z.coerce.number({ message: "Enter a valid number" }).min(0).max(22),
  files: z.object({
    tagProfile: z.coerce.number({ message: "Select a featured image" }),
  }),
});

type TagSchema = z.infer<typeof tagSchema>;

export { tagSchema };
export type { TagSchema };
