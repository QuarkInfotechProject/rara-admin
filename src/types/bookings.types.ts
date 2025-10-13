export interface Booking {
  id: number;
  fullname: string;
  product_name: string;
  product_type: string;
  type: "custom" | "inquiry";
  status: string;
  from_date: string;
  to_date: string | null;
  has_responded: 0 | 1;
  user: null | string;
  additional_products: Array<{
    id: number;
    name: string;
  }>;
}

export interface BookingPaginationResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Booking[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface BookingDetail {
  booking_info: {
    id: number;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  product: {
    name: string;
    short_code: string;
    type: string;
  };
  booking_details: {
    from_date: string;
    to_date: string;
    adult: number;
    children: number;
    infant: number;
    ref_no: null | string;
    ceo: null | string;
    group_name: null | string;
    room_required: null | string;
  };
  customer_info: {
    fullname: string;
    mobile_number: string;
    email: string;
    country: string;
  };
  agent: null | string;
  additional_products: Array<{
    name: string;
    description: string;
    id: number;
  }>;
  additional_info: {
    note: string;
    additional_note: string;
  };
  user: {
    name: string;
    email: string;
  } | null;
}
