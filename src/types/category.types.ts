
export interface Category {
  id: number;
  category_name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  meta_title: string;
  meta_description: string;
  keywords: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedCategoryData {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CategoryApiResponse {
  code: number;
  message: string;
  data: PaginatedCategoryData;
}
