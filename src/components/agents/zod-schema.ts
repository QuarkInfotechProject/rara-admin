import { format } from "date-fns";
import { z } from "zod";

const agentEditorSchema = z.object({
  id: z.number().optional(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  website: z.string().url(),
  homestay_margin: z.coerce.number({ message: "Enter a valid number" }).transform((v) => String(v)),
  experience_margin: z.coerce.number({ message: "Enter a valid number" }).transform((v) => String(v)),
  package_margin: z.coerce.number({ message: "Enter a valid number" }).transform((v) => String(v)),
  pan_no: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postal_code: z.string(),
  contract_start_date: z.string({ message: "Enter a valid date" }).transform((v) => format(v, "yyyy-MM-dd")),
  contract_end_date: z.string({ message: "Enter a valid date" }).transform((v) => format(v, "yyyy-MM-dd")),
  bank_name: z.string(),
  bank_account_number: z.string(),
  bank_ifsc_code: z.string(),
  notes: z.string(),
  is_active: z.number(),
});

type AgentEditorSchema = z.infer<typeof agentEditorSchema>;

export { agentEditorSchema };
export type { AgentEditorSchema };
