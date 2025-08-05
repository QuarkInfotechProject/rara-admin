export interface BookingInsights {
  top_products: {
    product_name: string;
    total: number;
  }[];
  top_agents: {
    id: number;
    firstname: string;
    total_bookings: number;
    completed_bookings: number;
  }[];
  monthly_trends: { year: 2024; month: string; month_number: number; total: number; label: string }[];
}

export interface TopCountry {
  country: string;
  total: number;
}

export interface CTAStats {
  total: {
    all_ctas: number;
    unique_contacts: number;
  };
  status_counts: {
    new: string;
    processing: string;
    contacted: string;
    completed: string;
    onhold: string;
    cancelled: string;
  };
  type_counts: {
    contact: string;
    volunteer: string;
    partner: string;
    host: string;
  };
}
export interface ProductRatingStats {
  summary: {
    total_reviews: number;
    pending_approvals: number;
    pending_replies: number;
    reply_completion_rate: number;
    approval_completion_rate: number;
  };
  average_ratings: {
    cleanliness: number;
    hospitality: number;
    value_for_money: number;
    communication: number;
    overall: number;
  };
  recent_reviews: {
    id: number;
    product: {
      id: number;
      name: string;
    };
    average_rating: number;
    public_review: string;
    private_review: string;
    has_reply: boolean;
    is_approved: number;
    created_at: string;
  }[];
}

export interface BookingStatusSummary {
  total: number;
  today: number;
  weekly: number;
  monthly: number;
  status: string;
}

export interface RatingStats {
  summary: {
    total_reviews: number;
    pending_approvals: string;
    pending_replies: string;
    reply_completion_rate: number;
    approval_completion_rate: number;
  };
  average_ratings: {
    cleanliness: string;
    hospitality: string;
    value_for_money: string;
    communication: string;
    overall: string;
  };
  recent_reviews: {
    id: number;
    product: {
      id: number;
      name: string;
    };
    average_rating: string;
    public_review: string;
    private_review: string;
    has_reply: boolean;
    is_approved: number;
    created_at: string;
  }[];
}
