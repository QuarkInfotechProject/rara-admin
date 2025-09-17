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
  .transform((v) => v ?? [])
  .default([]);
const nullableFilesArray = z
  .array(z.coerce.number({ message: "Please select a file" }))
  .nullable()
  .optional();
const singleFile = z.coerce.number({
  message: "Please select a file",
});

const latitude = z.coerce
  .number({ message: "Enter a valid number" })
  .min(-90)
  .max(90);
const longitude = z.coerce
  .number({ message: "Enter a valid number" })
  .min(-180)
  .max(180);

const pricingSchema = z.array(
  z.object({
    number_of_people: z.coerce
      .number({ message: "Enter a valid number" })
      .min(1),
    original_price_usd: z.coerce
      .number({ message: "Enter a valid number" })
      .min(0),
    discounted_price_usd: z.coerce
      .number({ message: "Enter a valid number" })
      .min(0),
  })
);

// Add departure schema
const departureSchema = z
  .array(
    z.object({
      departure_from: z.string({ message: "Please select a departure date" }),
      departure_to: z.string({ message: "Please select a return date" }),
      departure_per_price: z.string().transform((v) => (v === "" ? "0" : v)),
    })
  )
  .default([]);

// Updated overview schema to match the component structure
const overviewObjectSchema = z
  .object({
    duration: z.string().optional().default(""),
    overview_location: z.string().optional().default(""),
    trip_grade: z.string().optional().default(""),
    max_altitude: z.string().optional().default(""),
    group_size: z.number().optional().default(0),
    activities: z.string().optional().default(""),
    best_time: z.string().optional().default(""),
    starts: z.string().optional().default(""),
  })
  .optional()
  .default({});


const highlightsSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlightFiles: z
    .object({ highlightImage: singleFile })
    .nullable()
    .optional(),
  order: z.coerce.number().transform((v) => v ?? 0),
});

const hostsSchema = z.object({
  hostFiles: z.object({ profileImage: singleFile }).nullable().optional(),
  fullname: z.string(),
  description: z.string(),
});

// Updated itinerary schema with additional fields
const itinerarySchema = z.object({
  time_window: z.string(),
  activity: z.string(),
  duration: z.string().optional().default(""),
  location: z.string().optional().default(""),
  max_altitude: z.string().optional().default(""),
  activities: z.string().optional().default(""),
  accommodation: z.string().optional().default(""),
  meal: z.string().optional().default(""),
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
  type: z.enum(["trek", "tour", "activities", "safari"], {
    message: "Please select a valid category",
  }),
  category_details: nullableStringValue,
  // type: z.string(),
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
  impact: nullableStringValue,
  prices: pricingSchema,
  departures: departureSchema,
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
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      order: z.coerce
        .number({ message: "Enter a valid number" })
        .transform((v) => v ?? 0),
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
  faqImages: nullableFilesArray,
  altitudeChart: singleFile,
  locationCover: singleFile,
});

// Create unified product schema that includes all possible fields
const productSchema = baseSchema.extend({
  // Manager ID (from homestay)
  //  manager_id: z.number().nullable().optional(),

  // Region and max_occupant (from homestay)
  region: nullableStringValue,
  max_occupant: z.coerce
    .number({ message: "Enter a valid number" })
    .min(0)
    .optional(),

  // Night field (from package)
  night: z.coerce.number().optional(),

  // Arrays for different content types
  hosts: z.array(hostsSchema).optional().default([]),
  highlights: z.array(highlightsSchema).optional().default([]),

  // Updated overview field to use object schema instead of array
  overview: overviewObjectSchema,

  // Updated itinerary with enhanced fields
  itinerary: z.array(itinerarySchema).optional().default([]),
  dossiers: z.array(dossierSchema).optional().default([]),

  // Additional field arrays
  amenity: z.array(z.number()).optional().default([]),
  excluded: z.array(z.number()).optional().default([]),
  what_to_bring: z.array(z.number()).optional().default([]),

  // Related items
  nearby_homestay: nullableStringArray,
  related_homestay: nullableStringArray,
  related_experience: nullableStringArray,
  related_circuit: nullableStringArray,
  related_package: nullableStringArray,

  // Files - extend base files with additional file types
  files: filesBaseSchema
    .extend({
      hostCover: singleFile.optional(),
    })
    .optional(),
});

// Legacy schemas - updated to use new overview format and enhanced itinerary
const homestaySchema = baseSchema.extend({
  // manager_id: z.number().nullable(),
  region: nullableStringValue,
  max_occupant: z.coerce.number({ message: "Enter a valid number" }).min(0),
  hosts: z.array(hostsSchema),
  highlights: z.array(highlightsSchema),
  overview: overviewObjectSchema, // Updated to use object schema
  amenity: z.array(z.number()),
  nearby_homestay: nullableStringArray,
  files: filesBaseSchema.extend({
    hostCover: singleFile,
  }),
});

const experienceSchema = baseSchema.extend({
  overview: overviewObjectSchema, // Updated to use object schema
  itinerary: z.array(itinerarySchema), // Updated with enhanced fields
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
  overview: overviewObjectSchema, // Updated to use object schema
  itinerary: z.array(itinerarySchema), // Updated with enhanced fields
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
  overview: overviewObjectSchema, // Updated to use object schema
  itinerary: z.array(itinerarySchema), // Updated with enhanced fields
  dossiers: z.array(dossierSchema),
  excluded: z.array(z.number()),
  what_to_bring: z.array(z.number()),
  related_package: nullableStringArray,
  files: filesBaseSchema,
});

// Type definitions
type Product = z.infer<typeof productSchema>;
type Homestay = z.infer<typeof homestaySchema>;
type Experience = z.infer<typeof experienceSchema>;
type Circuit = z.infer<typeof circuitSchema>;
type Package = z.infer<typeof packageSchema>;

// Overview type for the new object structure
type OverviewObject = z.infer<typeof overviewObjectSchema>;

// Updated Itinerary type with new fields
type Itinerary = z.infer<typeof itinerarySchema>;

// Export the schemas
export {
  baseSchema,
  productSchema,
  homestaySchema,
  experienceSchema,
  circuitSchema,
  packageSchema,
  departureSchema,
  overviewObjectSchema,
  itinerarySchema,
};

// Export the types
export type {
  Product,
  Homestay,
  Experience,
  Circuit,
  Package,
  OverviewObject,
  Itinerary,
};

// Export the Departure type
export type Departure = z.infer<typeof departureSchema>[0];
