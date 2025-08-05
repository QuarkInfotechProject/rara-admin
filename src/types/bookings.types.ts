export interface Booking {
  id: number;
  agent_name: string;
  product_name: string;
  product_type: string;
  type: "booking" | "inquiry";
  has_responded: 0;
  status: string;
  from_date: string;
  to_date: string;
  user: null | string;
  note: null | string;
  additional_note: null | string;
  additional_products: Array<{
    id: number;
    name: string;
  }>;
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
