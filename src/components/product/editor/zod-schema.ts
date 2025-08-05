import { array, z } from "zod";
import { keywords, metaDescription, metaTitle } from "@/components/seo-editor";

const nullableStringValue = z
  .string()
  .nullable()
  .optional()
  .transform((v) => v ?? "");
const nullableStringArray = z
  .array(z.coerce.number({ message: "Select a valid value" }))
  .nullable()
  .optional()
  .transform((v) => v ?? []);
const nullableFilesArray = z
  .array(z.coerce.number({ message: "Please select a file" }))
  .nullable()
  .optional();
const singleFile = z.coerce.number({
  message: "Please select a file",
});

const latitude = z.coerce.number({ message: "Enter a valid number" }).min(-90).max(90);
const longitude = z.coerce.number({ message: "Enter a valid number" }).min(-180).max(180);

const pricingSchema = z.array(
  z.object({
    number_of_people: z.coerce.number({ message: "Enter a valid number" }).min(1),
    original_price_usd: z.coerce.number({ message: "Enter a valid number" }).min(0),
    discounted_price_usd: z.coerce.number({ message: "Enter a valid number" }).min(0),
  })
);

const baseSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  slug: z
    .string()
    .transform((v) => v.toLowerCase())
    .refine(
      (v) => /^[a-zA-Z0-9-]+$/.test(v),
      "Please enter a valid URL slug containing only letters, numbers, and hyphens."
    ),
  type: z.string(),
  short_code: z
    .string()
    .transform((v) => v.toLowerCase())
    .refine(
      (v) => /^[a-zA-Z0-9-]+$/.test(v),
      "Please enter a valid shortcode containing only letters, numbers, and hyphens."
    ),
  tagline: nullableStringValue,
  short_description: nullableStringValue,
  description: nullableStringValue,
  prices: pricingSchema,
  display_order: nullableStringValue,
  youtube_link: z
    .string()
    .url()
    .nullable()
    .optional()
    .transform((v) => v ?? ""),
  latitude: latitude
    .nullable()
    .optional()
    .transform((v) => v ?? 0),
  longitude: longitude
    .nullable()
    .optional()
    .transform((v) => v ?? 0),
  location: nullableStringValue,
  status: z.string(),
  how_to_get: nullableStringValue,
  cornerstone: z.coerce.number({ message: "Select a valid value" }),
  is_occupied: z.coerce.number({ message: "Select a valid value" }),
  impact: nullableStringValue,
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      order: z.coerce.number({ message: "Enter a valid number" }).transform((v) => v ?? 0),
    })
  ),
  tags: z.array(z.coerce.number()),
  meta: z.object({ metaTitle, keywords, metaDescription }),
  included: z.array(z.coerce.number({ message: "Select a valid value" })),
  related_blogs: z.array(z.coerce.number({ message: "Select a blog" })),
  display_homepage: z.coerce.number({ message: "Select a valid value" }),
});

const filesBaseSchema = z.object({
  featuredImage: singleFile,
  featuredImages: nullableFilesArray,
  galleryImages: nullableFilesArray,
  locationCover: singleFile,
  howToGet: singleFile,
});

const overviewSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const highlightsSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlightFiles: z.object({ highlightImage: singleFile }).nullable().optional(),
  order: z.coerce.number().transform((v) => v ?? 0),
});

const hostsSchema = z.object({
  hostFiles: z.object({ profileImage: singleFile }).nullable().optional(),
  fullname: z.string(),
  description: z.string(),
});

const itinerarySchema = z.object({
  time_window: z.string(),
  activity: z.string(),
  order: z.coerce.number().transform((v) => v ?? 0),
});

const dossierSchema = z.object({
  content: z.string(),
  pdf_file: z
    .union([
      z.instanceof(File, {
        message: "Please select a valid PDF file",
      }),
      z.string().nullable(),
      z.number().nullable(),
      z.null(),
    ])
    .optional()
    .nullable(),
});

const homestaySchema = baseSchema.extend({
  manager_id: z.number().nullable(),
  region: nullableStringValue,
  max_occupant: z.coerce.number({ message: "Enter a valid number" }).min(0),
  hosts: z.array(hostsSchema),
  highlights: z.array(highlightsSchema),
  amenity: z.array(z.number()),
  nearby_homestay: nullableStringArray,
  files: filesBaseSchema.extend({
    hostCover: singleFile,
  }),
});

const experienceSchema = baseSchema.extend({
  overview: z.array(overviewSchema),
  itinerary: z.array(itinerarySchema),
  dossiers: z.array(dossierSchema),
  what_to_bring: z.array(z.number()),
  related_homestay: nullableStringArray,
  related_experience: nullableStringArray,
  files: filesBaseSchema,
});

const circuitSchema = baseSchema.extend({
  latitude: latitude.transform((v) => v ?? 0),
  longitude: longitude.transform((v) => v ?? 0),
  location: z.string(),
  overview: z.array(overviewSchema),
  itinerary: z.array(itinerarySchema),
  dossiers: z.array(dossierSchema),
  excluded: z.array(z.number()),
  what_to_bring: z.array(z.number()),
  related_circuit: nullableStringArray,
  files: filesBaseSchema,
});

const packageSchema = baseSchema.extend({
  latitude: latitude.transform((v) => v ?? 0),
  longitude: longitude.transform((v) => v ?? 0),
  location: z.string(),
  night: z.coerce.number(),
  highlights: z.array(highlightsSchema),
  itinerary: z.array(itinerarySchema),
  dossiers: z.array(dossierSchema),
  excluded: z.array(z.number()),
  what_to_bring: z.array(z.number()),
  related_package: nullableStringArray,
  files: filesBaseSchema,
});

type Homestay = z.infer<typeof homestaySchema>;
type Experience = z.infer<typeof experienceSchema>;
type Circuit = z.infer<typeof circuitSchema>;
type Package = z.infer<typeof packageSchema>;

export { baseSchema, homestaySchema, experienceSchema, circuitSchema, packageSchema };

export type { Homestay, Experience, Circuit, Package };
