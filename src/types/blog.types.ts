export interface BlogPost {
  id: number;
  title: string;
  type: "blog";
  short_description: string;
  description: string;
  status: "draft" | "published";
  read_time: string;
  slug: string;
  blog_category_id: number;
  admin_user_id: number;
  created_at: string;
  meta: { metaTitle: string; keywords: string[]; metaDescription: string };
  files: { featuredImage: string };
}

export interface BlogMediaCoverage {
  id: number;
  title: string;
  type: "mediaCoverage";
  short_description: string;
  mediaName: string;
  status: "draft" | "published";
  slug: string;
  publish_date: string;
  created_at: string;
  files: { featuredImage: string };
}

export interface BlogReport {
  id: number;
  title: string;
  type: "report";
  short_description: string;
  description: string;
  status: "draft" | "published";
  slug: string;
  publish_date: string;
  created_at: string;
  files: { report: string };
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  meta: { metaTitle: string; keywords: string[]; metaDescription: string };
}

export interface ProductCategoryAPIResponse {
  id: number;
  category_name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  meta: { metaTitle: string; keywords: string[]; metaDescription: string };

  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  category_name: string;
  slug: string;
  status: "active" | "inactive";
  description: string;
  meta: { metaTitle: string; keywords: string[]; metaDescription: string };
}

export interface PaginatedBlogResponse {
  id: number;
  status: string;
  type: string;
  display_order: string;
  display_homepage: string;
  title: string;
  slug: string;
  category_name: string;
  admin_user_name: string;
  created_at: string;
}

export interface PaginatedBlogCategoryResponse {
  id: number;
  name: string;
  slug: string;
}

export interface ListBlogCategories {
  id: number;
  name: string;
}

export interface ListAuthors {
  id: number;
  name: string;
}

export interface ListProducts {
  id: number;
  name: string;
}
