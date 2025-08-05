import { z } from "zod";
import { keywords, metaDescription, metaTitle } from "../seo-editor";

const zodSlug = z
  .string()
  .transform((v) => v.toLowerCase())
  .refine(
    (v) => /^[a-zA-Z0-9-]+$/.test(v),
    "Please enter a valid URL slug containing only letters, numbers, and hyphens."
  );

const baseSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2).max(100),
  type: z.enum(["blog", "mediaCoverage", "report"]),
  short_description: z.string(),
  status: z.enum(["draft", "published"]),
  publish_date: z.string(),
  files: z
    .object({
      featuredImage: z.number().optional(),
      report: z.number().optional(),
      mediaImage: z.number().optional(),
    })
    .optional(),
  display_order: z.coerce.number({ message: "Please enter a valid number" }).min(0),
  display_homepage: z.coerce.number({ message: "Please select a valid value" }),
  related_product: z.array(z.number()).optional(),
});

const blogPostSchema = baseSchema.extend({
  type: z.literal("blog"),
  description: z.string(),
  read_time: z.string().default(""),
  blog_category_id: z.coerce.number({ message: "Please select a category" }),
  admin_user_id: z.coerce.number({ message: "Please select a author" }),
  slug: zodSlug,
  meta: z.object({
    metaTitle,
    keywords,
    metaDescription,
  }),
});

const blogMediaCoverageSchema = baseSchema.extend({
  type: z.literal("mediaCoverage"),
  slug: z.string(),
  media_name: z.string(),
});

const blogReportSchema = baseSchema.extend({
  type: z.literal("report"),
  description: z.string(),
  slug: zodSlug,
});

const blogCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  slug: zodSlug,
  description: z.string(),
  meta: z.object({
    metaTitle,
    keywords,
    metaDescription,
  }),
});

type BlogPost = z.infer<typeof blogPostSchema>;
type BlogMediaCoverage = z.infer<typeof blogMediaCoverageSchema>;
type BlogReport = z.infer<typeof blogReportSchema>;
type FormData = BlogPost | BlogMediaCoverage | BlogReport;
type BlogCategory = z.infer<typeof blogCategorySchema>;

export {
  blogPostSchema,
  blogMediaCoverageSchema,
  blogReportSchema,
  blogCategorySchema,
  type BlogPost,
  type BlogMediaCoverage,
  type BlogReport,
  type FormData,
  type BlogCategory,
};
