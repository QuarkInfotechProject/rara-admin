import { z } from "zod";
import { keywords, metaDescription, metaTitle } from "../seo-editor";

const pageEditorSchema = z.object({
  type: z.string().optional(),
  title: z.string(),
  header: z.string(),
  content1: z.string().optional().nullable(),
  content2: z.string().optional().nullable(),
  content3: z.string().optional().nullable(),
  is_active: z.coerce.number({ message: "Select a valid value" }),
  meta: z.object({
    metaTitle: metaTitle.nullable(),
    keywords: keywords,
    metaDescription: metaDescription.nullable(),
  }),
  files: z.object({
    featuredImage: z.number().optional(),
  }),
});

type PageEditorSchema = z.infer<typeof pageEditorSchema>;

export type { PageEditorSchema };
export { pageEditorSchema };
