export interface Amenity {
  id: number;
  name: string;
  icon: string;
  description: string;
  category: string;
}

export interface Manager {
  id: number;
  firstname: string;
  lastname: string;
  description: string;
  email: string;
  phone_number: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  latitude: string;
  longitude: string;
  zoom_level: number;
  display_order: number;
  files: {
    tagProfile: number;
  };
}

export interface Product {
  id: number;
  name: string;
  short_code: string;
  original_price_usd: string | null;
  discounted_price_usd: string | null;
  display_order: string;
  status: string;
  display_homepage: string;
  cornerstone: string;
}
