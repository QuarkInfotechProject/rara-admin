import { z } from "zod";

const teamEditorSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  position: z.string(),
  bio: z.string(),
  linkedIn_link: z.string().url(),
  order: z.coerce.number({ message: "Enter a valid value" }),
  is_active: z.coerce.number({ message: "Enter a valid value" }),
  files: z.object({
    ourTeamProfilePic: z.coerce.number({ message: "Select a file" }),
  }),
});

type TeamEditorSchema = z.infer<typeof teamEditorSchema>;

export type { TeamEditorSchema };
export { teamEditorSchema };
