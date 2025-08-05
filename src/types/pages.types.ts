export interface Page {
  type: string;
  title: string;
  header: string;
  slug: string;
  is_active: number;
  content1: string;
  content2: string;
  content3: string;
  meta: { metaTitle: string; keywords: string[]; metaDescription: string };
  files: { featuredImage: number };
}
