export interface AdminUser {
  id: number;
  uuid: string;
  fullName: string;
  email: string;
  status: number;
  groupId: number;
}

export interface Group {
  id: number;
  name: string;
  createdAt: string;
}

export interface User {
  id: number;
  full_name: string;
  country: string;
  email: string;
  phone_no: string | null;
  status: number;
}
