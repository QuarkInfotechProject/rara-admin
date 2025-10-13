export interface CarRental {
  id: number;
  user_name: string;
  email: string;
  contact: string;
  status: string;
  type: string;
  pickup_time: string;
  pickup_address: string;
  destination_address: string;
  max_people: number;
  message: string;
}

export interface CarRentalPaginationResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: CarRental[];
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
