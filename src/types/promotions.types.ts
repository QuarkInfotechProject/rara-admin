export interface PromotionDetail {
  name: string;
  description: string;
  link: string;
  placement_place: string;
  is_active: number;
  promotionImageDesktop: number;
  promotionImageMobile: number;
}

export interface ListPromotion {
  id: number;
  name: string;
  is_active: number;
  placement_place: string;
}
