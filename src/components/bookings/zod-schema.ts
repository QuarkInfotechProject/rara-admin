import { format } from "date-fns";
import { z } from "zod";

const bookingEditorSchema = z.object({
  id: z.optional(z.number()),
  product_id: z.coerce.number({
    message: "Please select a product",
  }),
  agent_id: z.coerce.number().nullable().optional(),
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
  infant: z.coerce.number({ message: "Please enter a valid value" }).min(0),
  type: z.enum(["booking", "inquiry"]),
  status: z.string(),
  fullname: z.string(),
  mobile_number: z.string(),
  email: z.string().email(),
  country: z.string(),
  additional_products: z
    .array(z.union([z.number(), z.object({ label: z.string(), value: z.number() })]))
    .transform((v1) => v1.map((v2) => (typeof v2 === "object" ? v2.value : v2)))
    .optional(),
  note: z.string().nullable().optional(),
  additional_note: z.string().nullable().optional(),
  ceo: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? ""),
  group_name: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? ""),
  room_required: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? ""),
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
export type { BookingEditorSchema, BookingFilterSchema, BookingQuickFilterSchema };
