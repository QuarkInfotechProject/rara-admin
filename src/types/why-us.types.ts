export interface WhyUs {
  title: string;
  description: string;
  link: string;
  order: number;
  is_active: number;
  whyUsImage: {
    id: number;
    baseImageUrl: string;
  };
}

export interface ListWhyUs {
  id: number;
  title: string;
  order: number;
}
