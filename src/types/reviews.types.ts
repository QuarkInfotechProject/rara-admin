export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  overall_rating: string;
  public_review: string;
  approved: boolean;
  full_name: string;
  product: {
    id: number;
    name: string;
  };
}

export type ReviewDetail = {
  id: number;
  product_id: number;
  user_id: number;
  cleanliness: string;
  hospitality: string;
  value_for_money: string;
  communication: string;
  overall_rating: string;
  public_review: string;
  private_review: string;
  reply_to_public_review: null | string;
  created_at: string;
  updated_at: string;
  approved: boolean;
  full_name: string;
  product: {
    id: number;
    name: string;
  };
};
