import { format } from "date-fns";
import { z } from "zod";

const bookingEditorSchema = z.object({
  id: z.optional(z.number()),
  product_id: z.coerce.number({
    message: "Please select a product",
  }),
  from_date: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? format(v, "yyyy-MM-dd") : undefined)),
  to_date: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? format(v, "yyyy-MM-dd") : undefined)),
  adult: z.coerce.number({ message: "Please enter a valid value" }).min(0),
  children: z.coerce.number({ message: "Please enter a valid value" }).min(0),
  infant: z.coerce
    .number({ message: "Please enter a valid value" })
    .min(0)
    .optional(),
  type: z.enum(["custom", "inquiry"]),
  status: z.string(),
  fullname: z.string(),
  mobile_number: z.string(),
  email: z.string().email(),
  country: z.string(),
  group_size: z.string().optional(),
  preferred_date: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? format(v, "yyyy-MM-dd") : undefined)),
  duration: z.coerce.number().optional(),
  budget_range: z.string().optional(),
  accommodation_preference: z.string().optional(),
  transportation_preference: z.string().optional(),
  preference_activities: z
    .array(
      z.union([z.number(), z.object({ id: z.number(), name: z.string() })])
    )
    .transform((v1) => v1.map((v2) => (typeof v2 === "object" ? v2.id : v2)))
    .optional(),
  special_message: z.string().nullable().optional(),
  special_requirement: z.string().nullable().optional(),
  desired_destination: z.string().optional(),
});

const bookingFilterSchema = z.object({
  fullname: z.string().optional(),
  product_name: z.string().optional(),
  email: z.string().email().optional(),
  status: z.string().optional(),
  from_date: z
    .string()
    .optional()
    .transform((v) => (v ? format(v, "yyyy-MM-dd") : undefined)),
  to_date: z
    .string()
    .optional()
    .transform((v) => (v ? format(v, "yyyy-MM-dd") : undefined)),
  agent: z.string().optional(),
});

const bookingQuickFilterSchema = z.object({
  product_type: z.string(),
});

type BookingEditorSchema = z.infer<typeof bookingEditorSchema>;
type BookingFilterSchema = z.infer<typeof bookingFilterSchema>;
type BookingQuickFilterSchema = z.infer<typeof bookingQuickFilterSchema>;

export { bookingEditorSchema, bookingFilterSchema, bookingQuickFilterSchema };
export type {
  BookingEditorSchema,
  BookingFilterSchema,
  BookingQuickFilterSchema,
};
