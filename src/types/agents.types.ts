export interface Agent {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  homestay_margin: string;
  experience_margin: string;
  package_margin: string;
  pan_no: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  contract_start_date: string;
  contract_end_date: string;
  bank_name: string;
  bank_account_number: string;
  bank_ifsc_code: string;
  notes: string;
  is_active: number;
}

export interface AgentSelectResponse {
  id: number;
  name: string;
}

export interface PaginatedAgentResponse {
  id: number;
  firstname: string;
  lastname: string;
  is_active: number;
  email: string;
  phone: string;
  company: string;
  address: string;
  country: string;
}
